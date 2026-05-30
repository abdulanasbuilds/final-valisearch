import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall as trace } from '../tools/langsmith'
import { googleSearch, searchNews } from '../tools/serper'
import type { AgentInput, DistributionOutput } from '../types/analysis'

export async function runDistributionPlannerAgent(input: AgentInput): Promise<DistributionOutput> {
  return trace('DistributionPlanner', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const [searchData, newsData] = await Promise.all([
        googleSearch(input.idea + ' keywords SEO opportunity'),
        searchNews(input.idea + ' Product Hunt launch')
      ])
      const data = `SEARCH:\n${searchData}\n\nNEWS:\n${newsData}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Go-to-market strategist. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackDistributionPlanner(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<DistributionOutput>(response, getFallbackDistributionPlanner())
    } catch (err) {
      console.error('DistributionPlanner failed:', err)
      return getFallbackDistributionPlanner()
    }
  })
}

export function getFallbackDistributionPlanner(): DistributionOutput {
  return {
    launch_strategy: 'Basic launch strategy',
    channels: ['Channel 1', 'Channel 2', 'Channel 3'],
    partnership_opportunities: ['Partner 1'],
    viral_loops: ['Loop 1'],
    seo_opportunities: ['SEO 1'],
    product_hunt_readiness: false
  }
}
