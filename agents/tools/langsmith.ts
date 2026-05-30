export async function traceAgentCall<T>(
  agentName: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  console.log(`[LangSmith] Starting agent: ${agentName}`)
  
  try {
    const result = await fn()
    const duration = Date.now() - startTime
    console.log(`[LangSmith] Finished agent: ${agentName} in ${duration}ms`)
    // TODO: plug in RunTree from langsmith SDK
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[LangSmith] Error in agent: ${agentName} after ${duration}ms`, error)
    throw error
  }
}
