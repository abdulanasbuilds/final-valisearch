import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { tryCreateClient } from '@/lib/supabase/client'
import { track } from '@/lib/analytics'
import { z } from 'zod'

export const Route = createFileRoute('/register')({
  component: RegisterScreen,
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pendingIdea, setPendingIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = tryCreateClient()

  useEffect(() => {
    const idea = localStorage.getItem('valisearch_pending_idea')
    if (idea) setPendingIdea(idea)
  }, [])

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-4 bg-white p-8 shadow-sm rounded-xl border border-gray-100 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Setup required</h2>
          <p className="text-sm text-gray-600">
            This app is deployed, but Supabase is not configured yet.
            Add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in Cloudflare, then redeploy.
          </p>
          <Link
            to="/"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    )
  }
  const sb = supabase

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    
    const result = registerSchema.safeParse({ email, password, confirmPassword })
    if (!result.success) {
      setErrorMsg(result.error.errors[0]?.message || 'Invalid input')
      return
    }

    setLoading(true)
    const { error } = await sb.auth.signUp({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    track('auth_signup')
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-sm rounded-xl border border-gray-100 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Check your email</h2>
          <p className="text-gray-600">We sent a verification link to {email}.</p>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-4 w-full justify-center rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
          >
            {loading ? 'Resending...' : 'Resend link'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-sm rounded-xl border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </h2>
          {pendingIdea && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
              <span className="font-semibold">You're validating:</span> {pendingIdea.length > 60 ? pendingIdea.slice(0, 60) + '...' : pendingIdea}
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {errorMsg && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {errorMsg}
            </div>
          )}
          <div className="space-y-4 rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 min-h-[44px]"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
