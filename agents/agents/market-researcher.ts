import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall as trace } from '../tools/langsmith'
import { googleSearch, searchNews } from '../tools/serper'
import { getMarketSentiment, getSectorPerformance } from '../tools/financial'
import type { AgentInput, MarketOutput } from '../types/analysis'

export async function runMarketResearcherAgent(input: AgentInput): Promise<MarketOutput> {
  return trace('MarketResearcher', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const [searchData, newsData, sentiment, sector] = await Promise.all([
        googleSearch(input.idea + ' market size TAM 2024 2025'),
        searchNews(input.idea + ' industry trends investment'),
        getMarketSentiment(input.idea),
        getSectorPerformance()
      ])
      const data = `SEARCH:\n${searchData}\n\nNEWS:\n${newsData}\n\nSENTIMENT:\n${sentiment}\n\nSECTOR:\n${sector}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Market intelligence analyst finding real market data. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackMarketResearcher(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<MarketOutput>(response, getFallbackMarketResearcher())
    } catch (err) {
      console.error('MarketResearcher failed:', err)
      return getFallbackMarketResearcher()
    }
  })
}

export function getFallbackMarketResearcher(): MarketOutput {
  return {
    tam: { value: 'Unknown', assumption: 'Insufficient data', confidence: 0, source_url: '' },
    sam: { value: 'Unknown', assumption: 'Insufficient data', confidence: 0, source_url: '' },
    som: { value: 'Unknown', assumption: 'Insufficient data', confidence: 0, source_url: '' },
    demand_trends: ['Generic trend 1', 'Generic trend 2', 'Generic trend 3'],
    underserved_gaps: ['Gap 1', 'Gap 2'],
    follow_the_money: ['Generic segment']
  }
}
