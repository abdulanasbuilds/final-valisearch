import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall } from '../tools/langsmith'
import { googleSearch, searchNews } from '../tools/serper'
import type { AgentInput, ValidatorOutput } from '../types/analysis'

export async function runIdeaValidatorAgent(input: AgentInput): Promise<ValidatorOutput> {
  return traceAgentCall('IdeaValidator', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const [searchData, newsData] = await Promise.all([
        googleSearch(input.idea + ' market opportunity problems'),
        searchNews(input.idea + ' startup industry')
      ])
      const data = `SEARCH:\n${searchData}\n\nNEWS:\n${newsData}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Senior startup advisor scoring the idea on 6 dimensions. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackIdeaValidator(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<ValidatorOutput>(response, getFallbackIdeaValidator())
    } catch (err) {
      console.error('IdeaValidator failed:', err)
      return getFallbackIdeaValidator()
    }
  })
}

export function getFallbackIdeaValidator(): ValidatorOutput {
  return {
    overall_score: 50,
    grade: 'C',
    verdict: 'PIVOT',
    dimensions: {
      market: 5,
      product: 5,
      competition: 5,
      growth: 5,
      monetization: 5,
      execution: 5
    }
  }
}
