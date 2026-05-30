export async function getRedditSignals(topic: string): Promise<string> {
  try {
    const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(topic + ' problem pain')}`)
    if (!res.ok) return ''
    const data = await res.json()
    
    const posts = data.data?.children
      ?.map((c: any) => c.data)
      ?.filter((p: any) => p.score > 5)
      ?.map((p: any) => `[r/${p.subreddit}] ${p.title}\n${p.selftext?.slice(0, 200)}`) ?? []
      
    return posts.join('\n\n')
  } catch (err) {
    return ''
  }
}
