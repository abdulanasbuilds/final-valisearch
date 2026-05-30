import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall } from '../tools/langsmith'
import { googleSearch } from '../tools/serper'
import { scrapeCompetitorUrls } from '../tools/firecrawl'
import { searchWeb } from '../tools/jina'
import type { AgentInput, CompetitorOutput } from '../types/analysis'

export async function runCompetitorIntelAgent(input: AgentInput): Promise<CompetitorOutput> {
  return traceAgentCall('CompetitorIntel', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const searchData = await googleSearch(input.idea + ' competitors alternatives top companies')
      const jinaData = await searchWeb(input.idea + ' vs comparison')
      const scrapeData = await scrapeCompetitorUrls([]) // In reality, URLs would be parsed from searchData first
      const data = `SEARCH:\n${searchData}\n\nJINA:\n${jinaData}\n\nSCRAPE:\n${scrapeData.join('\n')}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Competitive intelligence analyst. IMPORTANT: Find REAL named companies, not placeholders. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackCompetitorIntel(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<CompetitorOutput>(response, getFallbackCompetitorIntel())
    } catch (err) {
      console.error('CompetitorIntel failed:', err)
      return getFallbackCompetitorIntel()
    }
  })
}

export function getFallbackCompetitorIntel(): CompetitorOutput {
  return {
    competitors: [
      { name: 'Generic Competitor A', url: '', strength: 'Established', weakness: 'Slow' },
      { name: 'Generic Competitor B', url: '', strength: 'Cheap', weakness: 'Low quality' }
    ],
    gap_analysis: ['Generic gap'],
    positioning_recommendation: 'Generic positioning',
    fastest_gtm: { audience: 'Everyone', channel: 'Ads', result: 'Traffic' }
  }
}
