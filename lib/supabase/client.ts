import { createBrowserClient } from '@supabase/ssr'

export function hasSupabaseClientEnv(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export function tryCreateClient() {
  if (!hasSupabaseClientEnv()) return null
  try {
    return createBrowserClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  } catch {
    return null
  }
}

export function createClient() {
  const client = tryCreateClient()
  if (!client) throw new Error('SUPABASE_NOT_CONFIGURED')
  return client
}
