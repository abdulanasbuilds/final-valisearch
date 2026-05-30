import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-[#E5E7EB]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4FFF]">
              <span className="text-sm font-black text-white">V</span>
            </div>
            <span className="text-lg font-bold text-[#0C0D0E]">ValiSearch</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate({ to: '/login' })}
            className="mb-8 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[#52565E] transition-colors hover:text-[#0C0D0E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>

          {sent ? (
            <div className="rounded-2xl border border-[#E5E7EB] p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-[#0C0D0E] mb-2">Check your email</h1>
              <p className="text-sm text-[#52565E] leading-relaxed">
                We've sent a password reset link to <strong className="text-[#0C0D0E]">{email}</strong>
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E5E7EB] p-8">
              <h1 className="text-xl font-bold text-[#0C0D0E] mb-2">Forgot password?</h1>
              <p className="text-sm text-[#52565E] mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#0C0D0E]">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#0C0D0E] focus:border-[#1B4FFF] focus:outline-none focus:ring-1 focus:ring-[#1B4FFF]"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#1B4FFF] text-sm font-semibold text-white transition-colors hover:bg-[#1640D6] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
