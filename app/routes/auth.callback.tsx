import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      code: search.code as string | undefined,
    }
  },
  component: AuthCallback,
})

function AuthCallback() {
  const { code } = Route.useSearch()
  const navigate = useNavigate()
  const supabase = createClient()

  useEffect(() => {
    async function handleCode() {
      if (!code) {
        navigate({ to: '/login', search: { error: 'auth_failed' } })
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        navigate({ to: '/login', search: { error: 'auth_failed' } })
        return
      }

      const pendingIdea = localStorage.getItem('valisearch_pending_idea')
      if (pendingIdea) {
        navigate({ to: '/workspace', search: { from: 'auth' } })
      } else {
        navigate({ to: '/workspace' })
      }
    }

    handleCode()
  }, [code, navigate, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center text-gray-500">Authenticating...</div>
    </div>
  )
}
