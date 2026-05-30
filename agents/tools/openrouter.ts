import type { Plan } from '../types/analysis'

export const MODELS = {
  FLASH: 'google/gemini-2.5-flash-preview',
  CLAUDE_SONNET: 'anthropic/claude-sonnet-4-5',
  GEMINI_FREE: 'google/gemini-flash-1.5',
  FALLBACK_1: 'google/gemini-2.0-flash-exp:free',
  FALLBACK_2: 'meta-llama/llama-3.1-8b-instruct:free',
} as const

export function selectModel(userPlan: Plan, isSynthesis = false): string {
  if (isSynthesis) return MODELS.CLAUDE_SONNET
  if (process.env.NODE_ENV === 'development') return MODELS.GEMINI_FREE
  if (userPlan === 'starter') return MODELS.FLASH
  return MODELS.CLAUDE_SONNET
}

export async function callModel(params: {
  model: string
  system: string
  user: string
  enableCache?: boolean
  maxTokens?: number
}): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45000)

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model,
        messages: [
          { role: 'system', content: params.system },
          { role: 'user', content: params.user },
        ],
        max_tokens: params.maxTokens,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new Error(`OpenRouter API error: ${res.statusText}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? ''
  } finally {
    clearTimeout(timeout)
  }
}

export function safeParseJSON<T>(text: string, fallback: T): T {
  try {
    const cleanText = text
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/\s*```$/im, '')
      .trim()
    return JSON.parse(cleanText) as T
  } catch (err) {
    return fallback
  }
}
