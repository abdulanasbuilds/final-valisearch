import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall } from '../tools/langsmith'
import { googleSearch } from '../tools/serper'
import { getRedditSignals } from '../tools/reddit'
import type { AgentInput, ContentOutput } from '../types/analysis'

export async function runContentCreatorAgent(input: AgentInput): Promise<ContentOutput> {
  return traceAgentCall('ContentCreator', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const [searchData, redditData] = await Promise.all([
        googleSearch(input.idea + ' viral content examples'),
        getRedditSignals(input.idea + ' content marketing')
      ])
      const data = `SEARCH:\n${searchData}\n\nREDDIT:\n${redditData}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Viral content strategist. IMPORTANT: Hooks must be specific to the idea, not generic. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackContentCreator(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<ContentOutput>(response, getFallbackContentCreator())
    } catch (err) {
      console.error('ContentCreator failed:', err)
      return getFallbackContentCreator()
    }
  })
}

export function getFallbackContentCreator(): ContentOutput {
  return {
    hooks: [
      { text: 'Hook 1', trigger_type: 'curiosity' },
      { text: 'Hook 2', trigger_type: 'fear' },
      { text: 'Hook 3', trigger_type: 'desire' },
      { text: 'Hook 4', trigger_type: 'status' },
      { text: 'Hook 5', trigger_type: 'pain' }
    ],
    content_formats: ['Format 1', 'Format 2', 'Format 3'],
    shareability_audit: ['Audit 1'],
    weekly_posting_system: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    first_week_content: ['Post 1']
  }
}
