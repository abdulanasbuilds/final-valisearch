import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { AnalysisStatus, AnalysisType, Verdict } from '@/agents/types/analysis'

type WorkspaceAnalysisRow = {
  id: string
  overall_score: number | null
  verdict: Verdict | null
  analysis_type: AnalysisType
  created_at: string
  status: AnalysisStatus
  ideas: Array<{ idea_text: string }> | null
}

type WorkspaceAnalysis = Omit<WorkspaceAnalysisRow, 'ideas'> & {
  ideas: { idea_text: string } | null
}

export const getWorkspaceData = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const [{ data: analyses }, { data: credits }, { data: profile }] =
    await Promise.all([
      supabase
        .from('analysis')
        .select(`
          id, overall_score, verdict, analysis_type,
          created_at, status,
          ideas ( idea_text )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('profiles')
        .select('plan, full_name, is_trial_active, trial_ends_at')
        .eq('id', user.id)
        .single(),
    ])

  const normalizedAnalyses: WorkspaceAnalysis[] = ((analyses ?? []) as WorkspaceAnalysisRow[]).map((analysis) => ({
    ...analysis,
    ideas: analysis.ideas?.[0] ?? null,
  }))

  return {
    analyses: normalizedAnalyses,
    credits: credits?.balance ?? 0,
    profile,
  }
})

export const getAnalysisById = createServerFn({ method: 'GET' }).inputValidator((d: { analysisId: string }) => d).handler(async ({ data: payload }) => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { data, error } = await supabase
    .from('analysis')
    .select('*, ideas ( idea_text )')
    .eq('id', payload.analysisId)
    .eq('user_id', user.id)  // RLS enforced at query level too
    .single()

  if (error || !data) throw new Error('NOT_FOUND')
  return data
})

export const saveKanbanTasks = createServerFn({ method: 'POST' })
  .inputValidator((d: { analysisId: string; tasks: Array<{ id: string; title: string; column: string; position: number }> }) => d)
  .handler(async ({ data: payload }) => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { error } = await supabase
    .from('analysis')
    .update({ kanban_state: payload.tasks })
    .eq('id', payload.analysisId)
    .eq('user_id', user.id)

  if (error) throw new Error('KANBAN_SAVE_FAILED')
  return { ok: true }
})
