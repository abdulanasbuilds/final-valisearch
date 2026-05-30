export async function getCompanyNews(company: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  
  try {
    const to = new Date().toISOString().split('T')[0]!
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!
    
    const res = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(company)}&from=${from}&to=${to}&token=${process.env.FINNHUB_API_KEY}`, {
      signal: controller.signal,
    })
    if (!res.ok) throw new Error('Finnhub error')
    const data = await res.json()
    return JSON.stringify(data.slice?.(0, 5) ?? [])
  } catch (err) {
    return ''
  } finally {
    clearTimeout(timeout)
  }
}
