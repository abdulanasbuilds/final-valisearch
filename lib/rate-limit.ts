import { Redis } from '@upstash/redis/cloudflare'

const PLAN_LIMITS: Record<string, { requestsPerMinute: number; analysesPerDay: number }> = {
  starter: { requestsPerMinute: 5, analysesPerDay: 3 },
  pro: { requestsPerMinute: 30, analysesPerDay: 50 },
  business: { requestsPerMinute: 60, analysesPerDay: 250 },
  enterprise: { requestsPerMinute: 120, analysesPerDay: 9999 },
}

const DEFAULT_LIMITS = { requestsPerMinute: 5, analysesPerDay: 3 }

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export async function checkRateLimit(userId: string, plan: string): Promise<{ allowed: boolean }> {
  try {
    const redis = getRedis()
    if (!redis) return { allowed: true }

    const limits = PLAN_LIMITS[plan] ?? DEFAULT_LIMITS
    const key = `ratelimit:${userId}`
    const now = Date.now()
    const windowMs = 60_000

    const previous = await redis.get<number[]>(key) ?? []
    const withinWindow = previous.filter((t) => now - t < windowMs)
    withinWindow.push(now)

    if (withinWindow.length > limits.requestsPerMinute) {
      return { allowed: false }
    }

    await redis.set(key, withinWindow, { ex: 60 })
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}

export async function checkDailyAnalysisLimit(userId: string, plan: string): Promise<{ allowed: boolean }> {
  try {
    const redis = getRedis()
    if (!redis) return { allowed: true }

    const limits = PLAN_LIMITS[plan] ?? DEFAULT_LIMITS
    const key = `analysis:daily:${userId}:${new Date().toISOString().slice(0, 10)}`

    const count = await redis.get<number>(key) ?? 0
    if (count >= limits.analysesPerDay) return { allowed: false }

    await redis.set(key, count + 1, { ex: 86400 })
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}
