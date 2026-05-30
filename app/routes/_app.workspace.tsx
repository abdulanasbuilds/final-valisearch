import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Home,
  PlusCircle,
  Settings,
  CreditCard,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { getWorkspaceData } from '@/lib/server/workspace'
import { cn } from '@/lib/utils'
import { IdeaInputBox } from '@/components/workspace/IdeaInputBox'
import { AnalysisCard } from '@/components/workspace/AnalysisCard'
import { AnalysisCardSkeleton } from '@/components/workspace/AnalysisCardSkeleton'
import { EmptyWorkspace } from '@/components/workspace/EmptyWorkspace'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import type { AnalysisListItem } from '@/components/workspace/AnalysisCard'

export const Route = createFileRoute('/_app/workspace')({
  validateSearch: (search: Record<string, unknown>): { from?: string | undefined } => ({
    from: typeof search.from === 'string' ? search.from : undefined,
  }),
  loader: async () => {
    const data = await getWorkspaceData()
    return data
  },
  pendingComponent: WorkspaceLoading,
  component: WorkspacePage,
})

function WorkspaceLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
      <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <AnalysisCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

const NAV_ITEMS = [
  { to: '/workspace', label: 'Home', icon: Home },
  { to: '/workspace/new', label: 'New Analysis', icon: PlusCircle },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/settings/billing', label: 'Billing', icon: CreditCard },
] as const

const PLAN_COLORS: Record<string, string> = {
  trial: 'bg-amber-100 text-amber-800',
  pro: 'bg-blue-100 text-[#1B4FFF]',
  business: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-indigo-100 text-indigo-800',
  starter: 'bg-gray-100 text-[#52565E]',
}

function WorkspacePage() {
  const { analyses, credits, profile } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const { from } = Route.useSearch()
  const navigate = useNavigate()
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  // Auto-submit pending idea after auth callback
  useEffect(() => {
    if (from === 'auth') {
      const pendingIdea = localStorage.getItem('valisearch_pending_idea')
      if (pendingIdea) {
        localStorage.removeItem('valisearch_pending_idea')
        navigate({ to: '/workspace/new', search: { idea: pendingIdea } })
      }
    }
  }, [from])

  const plan = profile?.plan ?? 'starter'
  const isTrial = profile?.is_trial_active ?? false
  const fullName = profile?.full_name ?? user?.email ?? ''
  const email = user?.email ?? ''
  const initial = (fullName || email).charAt(0).toUpperCase()

  // Credit progress (max 100 for starter, 200 for pro, etc.)
  const maxCredits = plan === 'pro' ? 100 : plan === 'business' ? 400 : plan === 'enterprise' ? 1000 : 6
  const creditPercent = Math.min(100, (credits / maxCredits) * 100)

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* === Desktop Sidebar === */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#E5E7EB] pr-6">
        {/* User info */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B4FFF] text-sm font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#0C0D0E]">{email}</p>
              <span
                className={cn(
                  'mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
                  PLAN_COLORS[isTrial ? 'trial' : plan] ?? PLAN_COLORS.starter
                )}
              >
                {isTrial ? 'Trial' : plan}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50 hover:text-[#0C0D0E] [&.active]:bg-[#1B4FFF]/5 [&.active]:text-[#1B4FFF]"
                activeProps={{ className: 'active' }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Credits */}
        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-gray-50/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[#0C0D0E]">Credits</span>
            <span className="text-[#52565E] tabular-nums">{credits}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#1B4FFF] transition-all duration-500"
              style={{ width: `${creditPercent}%` }}
            />
          </div>
        </div>

        {/* Upgrade CTA */}
        {credits < 10 && plan === 'starter' && !isTrial && (
          <div className="mt-4 rounded-xl border border-[#1B4FFF]/20 bg-[#1B4FFF]/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1B4FFF]">
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </div>
            <p className="mt-1 text-xs text-[#52565E]">
              Get 100 credits per month and premium AI models.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: '/settings/billing' })}
              className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg bg-[#1B4FFF] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6]"
            >
              Upgrade
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex-1" />
      </aside>

      {/* === Main Content === */}
      <main className="flex-1 min-w-0 md:pl-8 pb-20 md:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0C0D0E]">Your analyses</h1>
            {analyses.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-[#52565E] tabular-nums">
                {analyses.length}
              </span>
            )}
          </div>
          <button
            id="new-analysis-btn"
            type="button"
            onClick={() => navigate({ to: '/workspace/new' })}
            className="hidden sm:inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#1B4FFF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6]"
          >
            <PlusCircle className="h-4 w-4" />
            New analysis
          </button>
        </div>

        {/* Idea input */}
        <div className="mb-6">
          <IdeaInputBox
            credits={credits}
            onUpgradeNeeded={() => setUpgradeOpen(true)}
          />
        </div>

        {/* Trial notice */}
        {isTrial && profile?.trial_ends_at && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Pro trial active</span> — Your
              trial ends on{' '}
              <span className="font-medium">
                {new Date(profile.trial_ends_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              . Upgrade to keep premium features.
            </p>
          </div>
        )}

        {/* Analysis list */}
        <div className="space-y-3">
          {analyses.length === 0 ? (
            <EmptyWorkspace />
          ) : (
            analyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))
          )}
        </div>

        {/* Load more (analyses capped at 20 from loader) */}
        {analyses.length >= 20 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#E5E7EB] px-5 py-2.5 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
            >
              Load more
            </button>
          </div>
        )}

        {/* Child route outlet */}
        <Outlet />
      </main>

      {/* Mobile tab bar */}
      <MobileTabBar />

      {/* Upgrade modal */}
      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger="no_credits"
      />
    </div>
  )
}
