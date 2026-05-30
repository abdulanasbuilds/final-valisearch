export async function getMarketSentiment(topic: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${encodeURIComponent(topic)}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`, {
      signal: controller.signal,
    })
    if (!res.ok) throw new Error('Alpha Vantage error')
    const data = await res.json()
    return JSON.stringify(data.feed?.slice(0, 5) ?? [])
  } catch (err) {
    return ''
  } finally {
    clearTimeout(timeout)
  }
}

export async function getSectorPerformance(): Promise<string> {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=SECTOR&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`)
    if (!res.ok) throw new Error('Alpha Vantage error')
    const data = await res.json()
    return JSON.stringify(data)
  } catch (err) {
    return ''
  }
}
