export async function getRedditSignals(topic: string): Promise<string> {
  type RedditPost = {
    score?: number
    subreddit?: string
    title?: string
    selftext?: string
  }

  type RedditChild = {
    data?: RedditPost
  }

  type RedditResponse = {
    data?: {
      children?: RedditChild[]
    }
  }

  try {
    const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(topic + ' problem pain')}`)
    if (!res.ok) return ''
    const data = await res.json() as RedditResponse
    
    const posts = data.data?.children
      ?.map((child) => child.data)
      ?.filter((post): post is RedditPost => Boolean(post && (post.score ?? 0) > 5))
      ?.map((post) => `[r/${post.subreddit}] ${post.title}\n${post.selftext?.slice(0, 200)}`) ?? []
      
    return posts.join('\n\n')
  } catch (err) {
    return ''
  }
}
