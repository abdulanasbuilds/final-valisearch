import { createFileRoute, getRouteApi, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles, Zap, Loader2, ArrowLeft, Clock } from 'lucide-react'
import { tryCreateClient } from '@/lib/supabase/client'
import { submitAnalysis } from '@/lib/server/analyze'
import { AgentStatusCard, AGENT_META } from '@/components/analysis/AgentStatusCard'
import type { AgentStatus } from '@/components/analysis/AgentStatusCard'
import type { AnalysisType } from '@/agents/types/analysis'

// All 12 agent keys in orchestrator order
const AGENT_KEYS = [
  'validator',
  'market',
  'competitor',
  'problem',
  'product',
  'offer',
  'growth',
  'distribution',
  'content',
  'brand',
  'scale',
  'synthesis',
] as const

type SearchParams = {
  analysisId?: string | undefined
  idea?: string | undefined
  from?: string | undefined
}

export const Route = createFileRoute('/_app/workspace/new')({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    analysisId: typeof search.analysisId === 'string' ? search.analysisId : undefined,
    idea: typeof search.idea === 'string' ? search.idea : undefined,
    from: typeof search.from === 'string' ? search.from : undefined,
  }),
  component: NewAnalysisPage,
})

const workspaceRouteApi = getRouteApi('/_app/workspace')

function NewAnalysisPage() {
  const { analysisId: initialAnalysisId, idea: initialIdea } = Route.useSearch()
  const { profile } = Route.useRouteContext()
  const { credits } = workspaceRouteApi.useLoaderData()
  const navigate = useNavigate()

  // State
  const [analysisId, setAnalysisId] = useState<string | null>(initialAnalysisId ?? null)
  const [idea, setIdea] = useState(initialIdea ?? '')
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>(() =>
    Object.fromEntries(AGENT_KEYS.map((k) => [k, initialAnalysisId ? 'running' : 'pending']))
  )
  const [completedCount, setCompletedCount] = useState(0)
  const [activityLog, setActivityLog] = useState<string[]>([])
  const [submitting, setSubmitting] = useState<AnalysisType | null>(null)
  const [error, setError] = useState('')
  const activityRef = useRef<HTMLDivElement>(null)

  // Auto-scroll activity feed
  useEffect(() => {
    if (activityRef.current) {
      activityRef.current.scrollTop = activityRef.current.scrollHeight
    }
  }, [activityLog])

  // Mark an agent as complete or failed
  const handleAgentEvent = useCallback((agentName: string, status: 'complete' | 'failed') => {
    setAgentStatuses((prev) => ({ ...prev, [agentName]: status }))
    setCompletedCount((c) => c + 1)

    const displayName = AGENT_META[agentName]?.name ?? agentName
    const statusText = status === 'complete' ? 'completed' : 'failed (using baseline data)'
    setActivityLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} — ${displayName} ${statusText}`,
    ])

    // Mark next pending agent as running (visual stagger)
    if (status === 'complete') {
      setAgentStatuses((prev) => {
        const next = { ...prev }
        const pendingKey = AGENT_KEYS.find((k) => next[k] === 'pending')
        if (pendingKey) next[pendingKey] = 'running'
        return next
      })
    }
  }, [])

  // Realtime subscription
  useEffect(() => {
    if (!analysisId) return

    const supabase = tryCreateClient()
    if (!supabase) return
    const channel = supabase
      .channel(`analysis:${analysisId}`)
      .on('broadcast', { event: 'agent_complete' }, ({ payload }) => {
        const agentName = payload?.agentName as string
        const status = (payload?.status as 'complete' | 'failed') ?? 'complete'
        if (agentName) {
          handleAgentEvent(agentName, status)
        }
      })
      .on('broadcast', { event: 'analysis_complete' }, () => {
        // Mark all remaining as complete
        setAgentStatuses((prev) => {
          const next = { ...prev }
          for (const key of AGENT_KEYS) {
            if (next[key] !== 'complete' && next[key] !== 'failed') {
              next[key] = 'complete'
            }
          }
          return next
        })
        setCompletedCount(12)
        setActivityLog((prev) => [
          ...prev,
          `${new Date().toLocaleTimeString()} — Analysis complete! Preparing your report...`,
        ])

        // Navigate after a brief delay so user sees 100%
        setTimeout(() => {
          navigate({ to: '/workspace/$id', params: { id: analysisId! } })
        }, 1000)
      })
      .subscribe()

    // Kick off running animation for first few agents
    setAgentStatuses((prev) => {
      const next = { ...prev }
      // Start first 4 agents as "running" for visual feedback
      AGENT_KEYS.slice(0, 4).forEach((k) => {
        if (next[k] === 'pending') next[k] = 'running'
      })
      return next
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [analysisId, handleAgentEvent, navigate])

  // Submit handler for State A
  async function handleSubmit(analysisType: AnalysisType) {
    setError('')
    if (idea.trim().length < 10) {
      setError('Your idea needs to be at least 10 characters long.')
      return
    }

    const cost = analysisType === 'full' ? 2 : 1
    if (credits < cost) {
      setError('Insufficient credits. Please upgrade your plan.')
      return
    }

    setSubmitting(analysisType)
    try {
      const result = await submitAnalysis({
        data: { idea: idea.trim(), analysisType },
      })
      setAnalysisId(result.analysisId)
      setAgentStatuses(
        Object.fromEntries(AGENT_KEYS.map((k) => [k, 'pending']))
      )
      setCompletedCount(0)
      setActivityLog([
        `${new Date().toLocaleTimeString()} — Analysis started (${analysisType} mode)`,
      ])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      if (msg === 'IDEA_TOO_SHORT') {
        setError('Your idea needs to be at least 10 characters long.')
      } else if (msg === 'RATE_LIMIT_EXCEEDED') {
        setError('You are submitting too quickly. Please wait a moment.')
      } else if (msg === 'INSUFFICIENT_CREDITS') {
        setError('Insufficient credits. Please upgrade your plan.')
      } else if (msg === 'SETUP_REQUIRED') {
        setError('This app is deployed, but it is not fully configured yet. Please add the API keys in Cloudflare and try again.')
      } else {
        setError('Failed to start analysis. Please try again.')
      }
    } finally {
      setSubmitting(null)
    }
  }

  const progressPercent = Math.round((completedCount / 12) * 100)

  // ===== STATE A: No analysis running =====
  if (!analysisId) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <button
          type="button"
          onClick={() => navigate({ to: '/workspace' })}
          className="mb-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[#52565E] transition-colors hover:text-[#0C0D0E]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to workspace
        </button>

        <h1 className="text-2xl font-bold text-[#0C0D0E] mb-2">
          New analysis
        </h1>
        <p className="text-sm text-[#52565E] mb-6">
          Describe your startup idea in detail. Our 12 AI agents will validate
          it across every critical dimension.
        </p>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <label
            htmlFor="new-idea-input"
            className="block text-sm font-medium text-[#0C0D0E] mb-2"
          >
            Your startup idea
          </label>
          <textarea
            id="new-idea-input"
            rows={6}
            maxLength={2000}
            placeholder="Describe the problem you're solving, who it's for, and your proposed solution..."
            className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-gray-50/50 px-4 py-3 text-sm text-[#0C0D0E] placeholder-gray-400 transition-colors focus:border-[#1B4FFF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4FFF]/30"
            value={idea}
            onChange={(e) => setIdea(e.target.value.slice(0, 2000))}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-[#52565E]">
              {credits} credits available
            </span>
            <span
              className={`text-xs tabular-nums ${
                idea.length > 1800 ? 'text-red-500' : 'text-[#52565E]'
              }`}
            >
              {idea.length} / 2000
            </span>
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              id="new-submit-quick"
              type="button"
              disabled={idea.trim().length < 10 || !!submitting}
              onClick={() => handleSubmit('quick')}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#0C0D0E] transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting === 'quick' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Quick (1 credit)
            </button>
            <button
              id="new-submit-full"
              type="button"
              disabled={idea.trim().length < 10 || !!submitting}
              onClick={() => handleSubmit('full')}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#1B4FFF] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting === 'full' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Full Report (2 credits)
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== STATE B: Analysis in progress =====
  return (
    <div className="mx-auto max-w-4xl py-8">
      <button
        type="button"
        onClick={() => navigate({ to: '/workspace' })}
        className="mb-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[#52565E] transition-colors hover:text-[#0C0D0E]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to workspace
      </button>

      {/* Idea preview */}
      {(initialIdea || idea) && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
          <p className="text-sm font-medium text-[#0C0D0E] line-clamp-3">
            {initialIdea || idea}
          </p>
        </div>
      )}

      {/* Headline */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#0C0D0E]">
          Generating your intelligence report
        </h1>
        <p className="mt-1 text-sm text-[#52565E]">
          {completedCount} of 12 agents complete
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#1B4FFF] transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs text-[#52565E]">
          <span>{progressPercent}% complete</span>
          <span className="tabular-nums">{completedCount}/12</span>
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AGENT_KEYS.map((key) => (
          <AgentStatusCard
            key={key}
            agentKey={key}
            status={agentStatuses[key] ?? 'pending'}
          />
        ))}
      </div>

      {/* Activity feed */}
      {activityLog.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 text-sm font-medium text-[#0C0D0E]">
            Activity
          </h2>
          <div
            ref={activityRef}
            className="max-h-32 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-gray-50/50 p-4 space-y-1"
          >
            {activityLog.map((entry, i) => (
              <p key={i} className="text-xs text-[#52565E] font-mono">
                {entry}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Time estimate */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#52565E]">
        <Clock className="h-3.5 w-3.5" />
        <span>This typically takes 30-90 seconds</span>
      </div>
    </div>
  )
}
