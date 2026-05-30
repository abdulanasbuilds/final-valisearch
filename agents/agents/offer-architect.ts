import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall as trace } from '../tools/langsmith'
import type { AgentInput, OfferOutput } from '../types/analysis'

export async function runOfferArchitectAgent(input: AgentInput): Promise<OfferOutput> {
  return trace('OfferArchitect', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const data = ''

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Direct response copywriter building the offer. IMPORTANT: headline must be compelling and specific to the idea. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackOfferArchitect(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<OfferOutput>(response, getFallbackOfferArchitect())
    } catch (err) {
      console.error('OfferArchitect failed:', err)
      return getFallbackOfferArchitect()
    }
  })
}

export function getFallbackOfferArchitect(): OfferOutput {
  return {
    headline: 'Generic Headline',
    subheadline: 'Generic subheadline',
    icp: 'Generic ICP',
    value_proposition: 'Generic value proposition',
    offer_components: ['Component 1', 'Component 2'],
    pricing_tiers: [
      { name: 'Basic', price: '$9', features: ['Feature 1'] },
      { name: 'Pro', price: '$29', features: ['Feature 2'] }
    ],
    guarantee: 'Generic guarantee',
    competitive_edge: ['Edge 1']
  }
}
