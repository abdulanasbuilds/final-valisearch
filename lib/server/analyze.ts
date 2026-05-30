import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { tasks } from '@trigger.dev/sdk/v3'
import { sanitizeIdea } from '@/lib/utils'
import { checkRateLimit } from '@/lib/rate-limit'
import type { AnalysisType } from '@/agents/types/analysis'

export const submitAnalysis = createServerFn({ method: 'POST' })
  .inputValidator((d: { idea: string; analysisType: AnalysisType }) => d)
  .handler(async ({ data: payload }) => {
  const supabase = createServerSupabaseClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  // 2. Sanitize + validate
  const idea = sanitizeIdea(payload.idea)
  if (idea.length < 10) throw new Error('IDEA_TOO_SHORT')

  // 3. Fetch profile + credits in parallel
  const [{ data: profile }, { data: credits }] = await Promise.all([
    supabase.from('profiles').select('plan').eq('id', user.id).single(),
    supabase.from('credits').select('balance').eq('user_id', user.id).single(),
  ])

  // 4. Rate limit check
  const { allowed } = await checkRateLimit(user.id, profile?.plan ?? 'starter')
  if (!allowed) throw new Error('RATE_LIMIT_EXCEEDED')

  // 5. Credit check
  const cost = payload.analysisType === 'full' ? 2 : 1
  if ((credits?.balance ?? 0) < cost) throw new Error('INSUFFICIENT_CREDITS')

  // 6. Create idea record
  const { data: ideaRecord, error: ideaError } = await supabase
    .from('ideas')
    .insert({ user_id: user.id, idea_text: idea, word_count: idea.split(' ').length })
    .select()
    .single()
  if (ideaError || !ideaRecord) throw new Error('IDEA_INSERT_FAILED')

  // 7. Create pending analysis
  const { data: analysisRecord, error: analysisError } = await supabase
    .from('analysis')
    .insert({
      user_id: user.id,
      idea_id: ideaRecord.id,
      status: 'pending',
      analysis_type: payload.analysisType,
    })
    .select()
    .single()
  if (analysisError || !analysisRecord) throw new Error('ANALYSIS_INSERT_FAILED')

  // 8. Fire Trigger.dev (non-blocking)
  const job = await tasks.trigger('analyze-startup-idea', {
    analysisId: analysisRecord.id,
    ideaId: ideaRecord.id,
    userId: user.id,
    idea,
    userPlan: profile?.plan ?? 'starter',
    analysisType: payload.analysisType,
  })

  // 9. Save job ID
  await supabase
    .from('analysis')
    .update({ trigger_job_id: job.id })
    .eq('id', analysisRecord.id)

  return {
    analysisId: analysisRecord.id,
    jobId: job.id,
    status: 'pending' as const,
  }
})
