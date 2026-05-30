import { callModel, safeParseJSON, MODELS } from '../tools/openrouter'
import { traceAgentCall as trace } from '../tools/langsmith'
import type { AgentInput, SynthesisOutput, FullAnalysisOutput } from '../types/analysis'

export async function runSynthesisAgent(
  input: AgentInput,
  agentOutputs: Partial<Omit<FullAnalysisOutput, 'synthesis' | 'metadata'>>
): Promise<SynthesisOutput> {
  return trace('Synthesis', async () => {
    try {
      const data = JSON.stringify(agentOutputs, null, 2)

      const response = await callModel({
        // CRITICAL: ALWAYS uses MODELS.CLAUDE_SONNET â€” no exceptions
        model: MODELS.CLAUDE_SONNET,
        system: `Senior venture investor reviewing all 11 reports. 
Be ruthlessly honest. If fatal flaws exist, name them.
Find contradictions between reports. Surface every one.
Your verdict must be one of: GO, GO WITH CONDITIONS, PIVOT, STOP
Executive summary: exactly 3 paragraphs, 150-200 words total.
Quick wins: only actions executable within 7 days.
Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackSynthesis(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nAGENT OUTPUTS:\n${data}`,
        enableCache: true,
        maxTokens: 8192
      })

      return safeParseJSON<SynthesisOutput>(response, getFallbackSynthesis())
    } catch (err) {
      console.error('Synthesis failed:', err)
      return getFallbackSynthesis()
    }
  })
}

export function getFallbackSynthesis(): SynthesisOutput {
  return {
    verdict: 'PIVOT',
    overall_score: 50,
    conditions: ['Generic condition'],
    score_breakdown: [],
    executive_summary: ['Summary paragraph 1', 'Summary paragraph 2', 'Summary paragraph 3'],
    quick_wins: ['Quick win 1'],
    biggest_risk: 'Generic risk',
    unfair_advantage: 'Generic advantage',
    critical_contradictions: [],
    used_fallback_data: true
  }
}
