export async function readUrl(url: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
      },
      signal: controller.signal,
    })

    if (!res.ok) throw new Error('Jina API error')
    return await res.text()
  } catch (err) {
    return ''
  } finally {
    clearTimeout(timeout)
  }
}

export async function searchWeb(query: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
        'Accept': 'application/json',
        'X-Return-Format': 'markdown',
      },
      signal: controller.signal,
    })

    if (!res.ok) throw new Error('Jina API error')
    return await res.text()
  } catch (err) {
    return ''
  } finally {
    clearTimeout(timeout)
  }
}

export async function parallelSearch(queries: string[]): Promise<string[]> {
  return Promise.all(queries.map(q => searchWeb(q)))
}
