import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { setCookie } from '@tanstack/start-server-core'
import type { CookieSerializeOptions } from 'cookie-es'

export function createServerSupabaseClient() {
  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          // TanStack Start server cookie access
          return Object.entries(
            parseCookieHeader(
              typeof globalThis !== 'undefined'
                ? ((globalThis as Record<string, unknown>).__requestHeaders as Record<string, string> | undefined)?.cookie ?? ''
                : ''
            )
          ).map(([name, value]) => ({ name, value }))
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(name, value, options as CookieSerializeOptions)
          })
        },
      },
    }
  )
}

function parseCookieHeader(header: string): Record<string, string> {
  return Object.fromEntries(
    header.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=')
      return [k?.trim() ?? '', v.join('=')]
    })
  )
}
