import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall as trace } from '../tools/langsmith'
import { getRedditSignals } from '../tools/reddit'
import { getHNSignals } from '../tools/hackernews'
import { googleSearch } from '../tools/serper'
import type { AgentInput, ProblemOutput } from '../types/analysis'

export async function runProblemPrioritizerAgent(input: AgentInput): Promise<ProblemOutput> {
  return trace('ProblemPrioritizer', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const [redditData, hnData, searchData] = await Promise.all([
        getRedditSignals(input.idea),
        getHNSignals(input.idea),
        googleSearch(input.idea + ' problems users complain frustrated')
      ])
      const data = `REDDIT:\n${redditData}\n\nHACKER NEWS:\n${hnData}\n\nSEARCH:\n${searchData}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `User research specialist mining real complaints. IMPORTANT: Extract real quotes from Reddit/HN data. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackProblemPrioritizer(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<ProblemOutput>(response, getFallbackProblemPrioritizer())
    } catch (err) {
      console.error('ProblemPrioritizer failed:', err)
      return getFallbackProblemPrioritizer()
    }
  })
}

export function getFallbackProblemPrioritizer(): ProblemOutput {
  return {
    demand_strength: 5,
    problems: ['Problem 1', 'Problem 2', 'Problem 3'],
    top_insight: 'Moderate demand exists.',
    real_quotes: []
  }
}
