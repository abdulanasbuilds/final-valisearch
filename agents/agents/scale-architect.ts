import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall } from '../tools/langsmith'
import { getMarketSentiment } from '../tools/financial'
import type { AgentInput, ScaleOutput } from '../types/analysis'

export async function runScaleArchitectAgent(input: AgentInput): Promise<ScaleOutput> {
  return traceAgentCall('ScaleArchitect', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const sentimentData = await getMarketSentiment(input.idea + ' startup revenue growth')
      const data = `SENTIMENT:\n${sentimentData}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Revenue strategist building $10K MRR roadmap. IMPORTANT: Phase milestones must be specific and measurable. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackScaleArchitect(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<ScaleOutput>(response, getFallbackScaleArchitect())
    } catch (err) {
      console.error('ScaleArchitect failed:', err)
      return getFallbackScaleArchitect()
    }
  })
}

export function getFallbackScaleArchitect(): ScaleOutput {
  return {
    target_mrr: '$10,000',
    timeframe: '12 months',
    revenue_projections: { m3: '$1K', m6: '$5K', m12: '$10K' },
    phases: [
      { name: 'Phase 1', focus: 'Validation', metrics: '10 users' },
      { name: 'Phase 2', focus: 'Traction', metrics: '100 users' },
      { name: 'Phase 3', focus: 'Growth', metrics: '500 users' },
      { name: 'Phase 4', focus: 'Scale', metrics: '1000 users' }
    ],
    biggest_risk: 'Generic risk',
    unfair_advantage: 'Generic advantage'
  }
}
