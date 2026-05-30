import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

  return {
    analyses: analyses ?? [],
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
