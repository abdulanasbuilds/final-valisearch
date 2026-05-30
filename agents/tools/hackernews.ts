export async function getHNSignals(topic: string): Promise<string> {
  type HackerNewsHit = {
    story_title?: string
    comment_text?: string
  }

  type HackerNewsResponse = {
    hits?: HackerNewsHit[]
  }

  try {
    const res = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=comment`)
    if (!res.ok) return ''
    const data = await res.json() as HackerNewsResponse
    
    const hits = data.hits?.map((hit) => `[HN] ${hit.story_title}\n${hit.comment_text?.slice(0, 300)}`) ?? []
    return hits.join('\n\n')
  } catch (err) {
    return ''
  }
}
