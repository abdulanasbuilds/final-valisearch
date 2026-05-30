export async function getHNSignals(topic: string): Promise<string> {
  try {
    const res = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=comment`)
    if (!res.ok) return ''
    const data = await res.json()
    
    const hits = data.hits?.map((h: any) => `[HN] ${h.story_title}\n${h.comment_text?.slice(0, 300)}`) ?? []
    return hits.join('\n\n')
  } catch (err) {
    return ''
  }
}
