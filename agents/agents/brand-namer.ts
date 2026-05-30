import { callModel, selectModel, safeParseJSON } from '../tools/openrouter'
import { traceAgentCall as trace } from '../tools/langsmith'
import { searchWeb } from '../tools/jina'
import type { AgentInput, BrandOutput } from '../types/analysis'

export async function runBrandNamerAgent(input: AgentInput): Promise<BrandOutput> {
  return trace('BrandNamer', async () => {
    try {
      // 1. Fetch external data (tool calls)
      const searchData = await searchWeb(input.idea + ' brand naming strategy')
      const data = `SEARCH:\n${searchData}`

      // 2. Build model call
      const response = await callModel({
        model: selectModel(input.userPlan),
        system: `Brand strategist and naming expert. IMPORTANT: Generate 5 REAL, distinct name options. Each needs: domain suggestion, 6-word tagline, naming technique (portmanteau/metaphor/acronym/etc). Return ONLY valid JSON matching this schema:
${JSON.stringify(getFallbackBrandNamer(), null, 2)}
No markdown. No explanation. JSON only.`,
        user: `STARTUP IDEA: ${input.idea}\n\nRESEARCH DATA:\n${data}`,
        enableCache: true,
      })

      // 3. Safe parse with typed fallback
      return safeParseJSON<BrandOutput>(response, getFallbackBrandNamer())
    } catch (err) {
      console.error('BrandNamer failed:', err)
      return getFallbackBrandNamer()
    }
  })
}

export function getFallbackBrandNamer(): BrandOutput {
  return {
    name_options: [
      { name: 'GenericName1', domain: 'genericname1.com', tagline: 'A generic tagline', technique: 'metaphor', is_recommended: true },
      { name: 'GenericName2', domain: 'genericname2.com', tagline: 'A generic tagline', technique: 'portmanteau', is_recommended: false },
      { name: 'GenericName3', domain: 'genericname3.com', tagline: 'A generic tagline', technique: 'acronym', is_recommended: false },
      { name: 'GenericName4', domain: 'genericname4.com', tagline: 'A generic tagline', technique: 'descriptive', is_recommended: false },
      { name: 'GenericName5', domain: 'genericname5.com', tagline: 'A generic tagline', technique: 'neologism', is_recommended: false }
    ],
    brand_voice: 'Professional',
    positioning_statement: 'Generic positioning',
    color_palette: ['#000000', '#ffffff']
  }
}
