import { createClient } from '@supabase/supabase-js'

export function createServiceClient() {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
