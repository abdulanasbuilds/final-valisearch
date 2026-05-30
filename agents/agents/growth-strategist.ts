import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall as trace } from '../tools/langsmith'
import { searchWeb } from '../tools/jina'
import { googleSearch } from '../tools/serper'
import type { AgentInput, GrowthOutput } from '../types/analysis'

export async function runGrowthStrategistAgent(input: AgentInput): Promise<GrowthOutput> {
  return trace('GrowthStrategist', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const [jinaData, searchData] = await Promise.all([
        searchWeb(input.idea + ' growth strategy marketing tactics'),
        googleSearch(input.idea + ' how to get first 100 customers')
      ])
      const data = `JINA:\n${jinaData}\n\nSEARCH:\n${searchData}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Growth hacker with Africa/SE Asia/LatAm experience. IMPORTANT: First actions must be immediately executable. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackGrowthStrategist(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<GrowthOutput>(response, getFallbackGrowthStrategist())
    } catch (err) {
      console.error('GrowthStrategist failed:', err)
      return getFallbackGrowthStrategist()
    }
  })
}

export function getFallbackGrowthStrategist(): GrowthOutput {
  return {
    channels: ['Channel 1', 'Channel 2', 'Channel 3'],
    content_formats: ['Format 1'],
    four_week_calendar: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    budget_split: { organic_percent: 50, paid_percent: 50, rationale: 'Generic rationale' },
    leverage_plays: ['Play 1']
  }
}
