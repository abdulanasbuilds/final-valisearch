import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall } from '../tools/langsmith'
import type { AgentInput, ProductOutput } from '../types/analysis'

export async function runProductManagerAgent(input: AgentInput): Promise<ProductOutput> {
  return traceAgentCall('ProductManager', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const data = ''

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Senior PM defining the leanest possible MVP. IMPORTANT: builder_prompt must be a complete prompt ready to paste into Lovable/Bolt to build the MVP. Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackProductManager(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<ProductOutput>(response, getFallbackProductManager())
    } catch (err) {
      console.error('ProductManager failed:', err)
      return getFallbackProductManager()
    }
  })
}

export function getFallbackProductManager(): ProductOutput {
  return {
    core_value_prop: 'Generic value prop',
    target_user: 'Generic user',
    mvp_features: ['Feature 1', 'Feature 2', 'Feature 3'],
    phase_2_features: ['Feature 4'],
    killer_feature: 'Feature 5',
    tech_stack: 'Generic tech stack',
    builder_prompt: 'Build a generic MVP app.',
    kanban_tasks: ['Task 1', 'Task 2']
  }
}
