export async function withRetryGraph<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let attempt = 0
  
  while (attempt < maxAttempts) {
    try {
      return await fn()
    } catch (error) {
      attempt++
      if (attempt >= maxAttempts) {
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
    }
  }
  
  throw new Error('Unreachable')
}

export async function parallelWithRetry<T>(
  fns: Array<() => Promise<T>>
): Promise<Array<T | null>> {
  const results = await Promise.allSettled(fns.map(fn => withRetryGraph(fn)))
  
  return results.map(r => {
    if (r.status === 'fulfilled') return r.value
    return null
  })
}
