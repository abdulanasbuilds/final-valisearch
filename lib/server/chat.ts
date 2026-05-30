import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const sendChatMessage = createServerFn({ method: 'POST' }).inputValidator((d: {
  message: string
  analysisId: string
  sessionId: string
}) => d).handler(async ({ data: payload }) => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  // Load analysis context + message history in parallel
  const [{ data: analysis }, { data: history }] = await Promise.all([
    supabase
      .from('analysis')
      .select('result_json')
      .eq('id', payload.analysisId)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('ai_chat_messages')
      .select('role, content')
      .eq('session_id', payload.sessionId)
      .order('created_at', { ascending: true })
      .limit(20),
  ])

  const { callModel, MODELS } = await import('@/agents/tools/openrouter')

  const response = await callModel({
    model: MODELS.CLAUDE_SONNET,
    system: `You are an expert startup advisor with full access to this analysis:
${JSON.stringify((analysis?.result_json as any)?.synthesis ?? {}, null, 2)}

Be direct, specific, and actionable. Reference the analysis data.`,
    user: payload.message,
    maxTokens: 1000,
  })

  // Save both messages
  await supabase.from('ai_chat_messages').insert([
    { session_id: payload.sessionId, role: 'user', content: payload.message },
    { session_id: payload.sessionId, role: 'assistant', content: response },
  ])

  return { message: response }
})
