export async function scrapeUrl(url: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, formats: ['markdown'] }),
      signal: controller.signal,
    })
    
    if (!res.ok) throw new Error('Firecrawl API error')
    const data = await res.json()
    return data.data?.markdown?.slice(0, 5000) ?? ''
  } catch (err) {
    return ''
  } finally {
    clearTimeout(timeout)
  }
}

export async function scrapeCompetitorUrls(urls: string[]): Promise<string[]> {
  return Promise.all(urls.slice(0, 5).map(scrapeUrl))
}
