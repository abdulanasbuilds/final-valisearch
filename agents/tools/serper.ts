export async function googleSearch(query: string, num = 10): Promise<string> {
  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num }),
    })
    
    if (!res.ok) throw new Error('Serper API error')
    const data = await res.json()
    return JSON.stringify(data.organic ?? [])
  } catch (err) {
    return ''
  }
}

export async function searchNews(query: string): Promise<string> {
  try {
    const res = await fetch('https://google.serper.dev/news', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    })
    
    if (!res.ok) throw new Error('Serper News API error')
    const data = await res.json()
    return JSON.stringify(data.news ?? [])
  } catch (err) {
    return ''
  }
}
