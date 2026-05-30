import { task } from '@trigger.dev/sdk/v3'
import { runOrchestrator } from '../agents/orchestrator'
import { createServiceClient } from '../lib/supabase/service'
import type { Plan, AnalysisType } from '../agents/types/analysis'

export const analyzeStartupIdea = task({
  id: 'analyze-startup-idea',
  retry: { maxAttempts: 2 },
  run: async (payload: {
    analysisId: string
    ideaId: string
    userId: string
    idea: string
    userPlan: Plan
    analysisType: AnalysisType
  }) => {
    const supabase = createServiceClient()

    // Mark as processing
    await supabase
      .from('analysis')
      .update({ status: 'processing' })
      .eq('id', payload.analysisId)

    try {
      const result = await runOrchestrator(
        {
          idea: payload.idea,
          userPlan: payload.userPlan,
          analysisType: payload.analysisType,
        },
        async (agentName, status) => {
          // Update DB progress
          await supabase.from('analysis_progress').upsert({
            analysis_id: payload.analysisId,
            agent_name: agentName,
            status,
          })

          // Broadcast to Realtime channel
          await supabase
            .channel(`analysis:${payload.analysisId}`)
            .send({
              type: 'broadcast',
              event: 'agent_complete',
              payload: { agentName, status },
            })
        }
      )

      const creditsUsed = payload.analysisType === 'full' ? 2 : 1

      // Save result
      await supabase
        .from('analysis')
        .update({
          status: 'complete',
          overall_score: result.synthesis.overall_score,
          verdict: result.synthesis.verdict,
          result_json: result,
          credits_used: creditsUsed,
        })
        .eq('id', payload.analysisId)

      // Deduct credits via RPC (atomic)
      await supabase.rpc('deduct_credits', {
        p_user_id: payload.userId,
        p_amount: creditsUsed,
        p_reason: `analysis:${payload.analysisType}:${payload.analysisId}`,
      })

      // Broadcast completion
      await supabase
        .channel(`analysis:${payload.analysisId}`)
        .send({
          type: 'broadcast',
          event: 'analysis_complete',
          payload: { analysisId: payload.analysisId },
        })

      return result
    } catch (err) {
      await supabase
        .from('analysis')
        .update({ status: 'failed' })
        .eq('id', payload.analysisId)
      throw err
    }
  },
})
