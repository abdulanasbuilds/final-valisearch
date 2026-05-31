import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import {
  TrendingUp, Target, Code2, DollarSign, Users, Rocket,
  Scale, Briefcase, ShieldAlert, Zap, MessageSquare, FileText,
  ChevronRight, CheckCircle, ArrowRight, BarChart2, Brain,
  Star, Menu, X,
} from 'lucide-react'
import { tryCreateClient } from '@/lib/supabase/client'
import { AGENTS_META } from '@/lib/constants'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Target, Code2, DollarSign, Users, Rocket,
  Scale, Briefcase, ShieldAlert, Zap, MessageSquare, FileText,
}

// ============================================================
// AUTH GATE MODAL
// ============================================================
function AuthGateModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#0C0D0E]">Create a free account</h2>
            <p className="mt-1 text-sm text-[#52565E]">Validate your idea in under 60 seconds</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate({ to: '/register' })}
            className="w-full min-h-[44px] rounded-lg bg-[#1B4FFF] font-semibold text-white transition-colors hover:bg-[#1640D6]"
          >
            Get started free
          </button>
          <button
            onClick={() => navigate({ to: '/login' })}
            className="w-full min-h-[44px] rounded-lg border border-[#E5E7EB] font-semibold text-[#0C0D0E] transition-colors hover:bg-gray-50"
          >
            Sign in
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-[#9CA3AF]">
          No credit card required · 3 free analyses
        </p>
      </div>
    </div>
  )
}

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage() {
  const navigate = useNavigate()
  const [idea, setIdea] = useState('')
  const [isAuth, setIsAuth] = useState(false)
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [pendingType, setPendingType] = useState<'quick' | 'full' | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const MAX = 2000

  useEffect(() => {
    const supabase = tryCreateClient()
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session)
    })
  }, [])

  const handleAnalyze = (type: 'quick' | 'full') => {
    if (!isAuth) {
      if (idea.trim()) localStorage.setItem('valisearch_pending_idea', idea)
      setPendingType(type)
      setShowAuthGate(true)
      return
    }
    localStorage.setItem('valisearch_pending_idea', idea)
    navigate({ to: '/workspace/new' })
  }

  const PRICING_PLANS = [
    { name: 'Starter', price: 0, annualPrice: 0, desc: 'For first-time validators', analyses: 3, credits: 6, highlight: false, features: ['3 analyses/month', '6 AI credits', 'Core 12-agent analysis', 'Validation score + verdict'] },
    { name: 'Pro', price: 29, annualPrice: 23, desc: 'For serious founders', analyses: 50, credits: 100, highlight: true, features: ['50 analyses/month', '100 AI credits', 'Real-time web research', 'AI Co-founder chat', 'PDF & DOCX export', 'Priority support'] },
    { name: 'Business', price: 79, annualPrice: 63, desc: 'For teams building together', analyses: 250, credits: 500, highlight: false, features: ['250 analyses/month', '500 AI credits', 'Everything in Pro', 'Team workspace (5 members)', 'API access', 'White-label reports'] },
    { name: 'Enterprise', price: 199, annualPrice: 159, desc: 'For accelerators & VCs', analyses: -1, credits: -1, highlight: false, features: ['Unlimited analyses', 'Unlimited credits', 'Everything in Business', 'Custom AI agents', 'SSO / SAML', 'Dedicated support'] },
  ]

  return (
    <div className="min-h-screen bg-white font-sans text-[#0C0D0E]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4FFF]">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-[#0C0D0E]">ValiSearch</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 sm:flex">
            <Link to="/pricing" className="text-sm font-medium text-[#52565E] hover:text-[#0C0D0E] transition-colors">Pricing</Link>
            {isAuth ? (
              <Link to="/workspace" className="min-h-[44px] inline-flex items-center rounded-lg bg-[#1B4FFF] px-4 text-sm font-semibold text-white hover:bg-[#1640D6] transition-colors">
                Go to workspace
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="min-h-[44px] inline-flex items-center px-4 text-sm font-semibold text-[#52565E] hover:text-[#0C0D0E] transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="min-h-[44px] inline-flex items-center rounded-lg bg-[#1B4FFF] px-4 text-sm font-semibold text-white hover:bg-[#1640D6] transition-colors">
                  Get started free
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="sm:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-[#E5E7EB] bg-white px-4 py-4 space-y-3 sm:hidden">
            <Link to="/pricing" className="block py-2 text-sm font-medium text-[#52565E]">Pricing</Link>
            <Link to="/login" className="block py-2 text-sm font-medium text-[#52565E]">Sign in</Link>
            <Link to="/register" className="block min-h-[44px] w-full rounded-lg bg-[#1B4FFF] text-center text-sm font-semibold text-white leading-[44px]">
              Get started free
            </Link>
          </div>
        )}
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-28">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#1B4FFF]">
            AI Startup Intelligence
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-[#0C0D0E] sm:text-5xl lg:text-6xl">
            Validate your startup idea <br className="hidden sm:block" />
            <span className="text-[#1B4FFF]">before you waste a year</span> building it.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#52565E]">
            12 specialized AI agents analyze your idea across market size, competition, technical feasibility, unit economics, and more — in under 60 seconds.
          </p>

          {/* Idea input */}
          <div className="mx-auto mt-10 max-w-2xl text-left">
            <div className="relative rounded-2xl border-2 border-[#E5E7EB] bg-white shadow-lg focus-within:border-[#1B4FFF] transition-colors">
              <textarea
                ref={textareaRef}
                id="hero-idea-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value.slice(0, MAX))}
                placeholder="Example: A mobile app that connects local farmers in West Africa to urban buyers, handles inventory management, and processes mobile money payments directly..."
                className="w-full resize-none rounded-2xl bg-transparent px-5 pt-5 pb-12 text-base text-[#0C0D0E] placeholder:text-[#9CA3AF] focus:outline-none"
                style={{ minHeight: '140px' }}
                rows={4}
              />
              <div className="absolute bottom-4 right-4 text-xs text-[#9CA3AF] tabular-nums">
                {idea.length} / {MAX}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                id="quick-analysis-btn"
                onClick={() => handleAnalyze('quick')}
                disabled={!idea.trim()}
                className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#1B4FFF] px-6 text-base font-bold text-[#1B4FFF] transition-all hover:bg-blue-50 disabled:opacity-40"
              >
                Quick Scan
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold">1 credit</span>
              </button>
              <button
                id="full-analysis-btn"
                onClick={() => handleAnalyze('full')}
                disabled={!idea.trim()}
                className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1B4FFF] px-6 text-base font-bold text-white transition-all hover:bg-[#1640D6] shadow-lg shadow-blue-500/30 disabled:opacity-40"
              >
                Full Intelligence Report
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">2 credits</span>
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-[#9CA3AF]">No credit card required · 3 free analyses on signup</p>
          </div>
        </div>
      </section>

      {/* ==================== TRUST BAR ==================== */}
      <section className="border-y border-[#E5E7EB] bg-gray-50 py-5">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm font-medium text-[#52565E]">
            Used by founders in <span className="font-bold text-[#0C0D0E]">40+ countries</span> across Africa, Asia, and Latin America
          </p>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1B4FFF] mb-3">How it works</p>
            <h2 className="text-3xl font-black text-[#0C0D0E] sm:text-4xl">From idea to intelligence in 3 steps</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '01',
                icon: <FileText className="h-6 w-6 text-[#1B4FFF]" />,
                title: 'Enter your idea',
                desc: 'Describe your startup in plain English — no templates or jargon required. The more detail, the better the analysis.',
              },
              {
                step: '02',
                icon: <Brain className="h-6 w-6 text-[#1B4FFF]" />,
                title: '12 AI agents analyze',
                desc: 'Our specialized agents run in parallel — scraping the web, sizing markets, modeling finances, and stress-testing assumptions.',
              },
              {
                step: '03',
                icon: <BarChart2 className="h-6 w-6 text-[#1B4FFF]" />,
                title: 'Get your intelligence report',
                desc: 'Receive a comprehensive dashboard covering every dimension of your idea — from validation score to a full growth playbook.',
              },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
                <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1B4FFF] text-xs font-black text-white shadow-md">
                  {s.step}
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0C0D0E] mb-2">{s.title}</h3>
                <p className="text-sm text-[#52565E] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AGENT GRID ==================== */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1B4FFF] mb-3">The intelligence engine</p>
            <h2 className="text-3xl font-black text-[#0C0D0E] sm:text-4xl">12 specialist agents, working in parallel</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#52565E]">
              Each agent is an expert in its domain — pulling live data, running models, and delivering structured insights.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS_META.map((agent, i) => {
              const Icon = ICON_MAP[agent.icon] || Zap
              return (
                <div
                  key={agent.id}
                  className="group flex items-start gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1B4FFF] group-hover:bg-[#1B4FFF] group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0C0D0E] text-sm">{agent.name}</p>
                    <p className="text-xs text-[#52565E] mt-0.5 leading-relaxed">{agent.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==================== DASHBOARD MOCKUP ==================== */}
      <section className="py-20 sm:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1B4FFF] mb-3">Your intelligence dashboard</p>
            <h2 className="text-3xl font-black text-[#0C0D0E] sm:text-4xl">Everything you need to decide — in one view</h2>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] bg-gray-100 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="mx-3 flex-1 rounded-md bg-white border border-[#E5E7EB] px-3 py-1 text-xs text-[#9CA3AF]">
                valisearch.app/workspace/analysis-id
              </div>
            </div>

            {/* Mock top bar */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-xs text-[#52565E]">
                  <ChevronRight className="h-4 w-4 rotate-180" /> Back
                </button>
                <span className="hidden sm:block text-sm font-semibold text-[#0C0D0E]">
                  FarmerConnect — Mobile money marketplace for West African farmers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">GO</span>
                <span className="hidden sm:block rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-[#52565E]">Export</span>
              </div>
            </div>

            {/* Mock content */}
            <div className="flex bg-white" style={{ height: '420px' }}>
              {/* Mock sidebar */}
              <div className="hidden w-52 shrink-0 border-r border-[#E5E7EB] bg-gray-50/50 p-4 sm:block">
                {[
                  ['INTELLIGENCE', ['Overview', 'Validation', 'Market', 'Competition']],
                  ['GROWTH', ['Growth Playbook', 'Distribution']],
                  ['SYNTHESIS', ['Executive Summary']],
                ].map(([group, items]) => (
                  <div key={group as string} className="mb-4">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">{group as string}</p>
                    {(items as string[]).map((item, idx) => (
                      <div
                        key={item}
                        className={`rounded-lg px-3 py-2 text-xs font-medium ${
                          idx === 0 ? 'bg-[#1B4FFF]/5 text-[#1B4FFF]' : 'text-[#52565E]'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Mock main area */}
              <div className="flex-1 overflow-hidden p-6">
                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                  {[
                    { label: 'Overall Score', value: '76', suffix: '/100', color: 'text-[#1B4FFF]' },
                    { label: 'Market Size', value: '$2.4B', suffix: 'TAM', color: 'text-green-600' },
                    { label: 'Verdict', value: 'GO', suffix: '', color: 'text-green-600' },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-[#E5E7EB] p-4">
                      <p className="text-xs text-[#52565E] mb-1">{m.label}</p>
                      <p className={`text-2xl font-black ${m.color}`}>
                        {m.value}<span className="text-sm font-medium text-[#9CA3AF] ml-1">{m.suffix}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-[#E5E7EB] p-4 mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">Agent Score Breakdown</p>
                  <div className="space-y-2">
                    {[
                      { name: 'Market Opportunity', score: 82 },
                      { name: 'Customer Validation', score: 74 },
                      { name: 'Technical Feasibility', score: 68 },
                      { name: 'Financial Viability', score: 71 },
                    ].map((a) => (
                      <div key={a.name} className="flex items-center gap-3">
                        <span className="w-36 shrink-0 text-xs text-[#52565E]">{a.name}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-[#1B4FFF]" style={{ width: `${a.score}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#0C0D0E] w-6 text-right">{a.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] p-4 bg-blue-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1B4FFF] mb-2">Executive Summary</p>
                  <p className="text-xs text-[#52565E] leading-relaxed line-clamp-3">
                    FarmerConnect addresses a validated $2.4B addressable market in West African agricultural trade. The mobile money integration is the critical differentiator — 78% of target users already use mobile money but lack a dedicated marketplace. Recommend proceeding with a focused MVP targeting Ghana and Nigeria first.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1B4FFF] mb-3">Pricing</p>
            <h2 className="text-3xl font-black text-[#0C0D0E] sm:text-4xl">Simple, founder-friendly pricing</h2>
            <p className="mt-3 text-base text-[#52565E]">Start free. No credit card required.</p>

            {/* Billing toggle */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#E5E7EB] bg-white p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${billingPeriod === 'monthly' ? 'bg-[#1B4FFF] text-white' : 'text-[#52565E] hover:text-[#0C0D0E]'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${billingPeriod === 'annual' ? 'bg-[#1B4FFF] text-white' : 'text-[#52565E] hover:text-[#0C0D0E]'}`}
              >
                Annual <span className="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-700">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_PLANS.map((plan) => {
              const price = billingPeriod === 'annual' ? plan.annualPrice : plan.price
              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl p-6 ${
                    plan.highlight
                      ? 'border-2 border-[#1B4FFF] bg-white shadow-xl shadow-blue-500/10'
                      : 'border border-[#E5E7EB] bg-white shadow-sm'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B4FFF] px-3 py-1 text-xs font-bold text-white shadow-md">
                        <Star className="h-3 w-3 fill-white" /> Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-4 pt-2">
                    <h3 className="text-lg font-black text-[#0C0D0E]">{plan.name}</h3>
                    <p className="text-xs text-[#52565E] mt-0.5">{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-[#0C0D0E]">${price}</span>
                      {price > 0 && <span className="mb-1 text-sm text-[#52565E]">/mo</span>}
                    </div>
                    {price > 0 && (
                      <p className="text-xs text-[#52565E] mt-1">
                        {billingPeriod === 'annual' ? 'Billed annually' : 'Billed monthly'}
                        {' · '}
                        <span className="font-medium text-amber-700">7-day free trial</span>
                      </p>
                    )}
                  </div>
                  <ul className="mb-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#52565E]">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={price === 0 ? '/register' : '/register'}
                    className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                      plan.highlight
                        ? 'bg-[#1B4FFF] text-white hover:bg-[#1640D6]'
                        : 'border border-[#E5E7EB] text-[#0C0D0E] hover:bg-gray-50'
                    }`}
                  >
                    {price === 0 ? 'Get started free' : `Start free trial`}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1B4FFF] mb-3">Founder stories</p>
            <h2 className="text-3xl font-black text-[#0C0D0E] sm:text-4xl">Founders who validated before building</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                quote: "I had a fintech idea I'd been thinking about for 8 months. ValiSearch told me in 60 seconds that my target segment already had 3 dominant players and my margin assumptions were off by 40%. Saved me a year of wasted effort.",
                name: 'Kwame A.',
                role: 'Founder, Lagos',
                initial: 'K',
              },
              {
                quote: "The competitor intelligence section uncovered a startup in Singapore doing exactly what I planned — but the gap analysis showed they're ignoring Southeast Asia's rural segment. That gap became my entire go-to-market.",
                name: 'Priya S.',
                role: 'Solo Founder, Singapore',
                initial: 'P',
              },
              {
                quote: "As an accelerator manager, I run every cohort application through ValiSearch before our team reviews. It saves us 6+ hours per batch and surfaces blind spots in ideas that look polished on the surface.",
                name: 'Carlos M.',
                role: 'Accelerator Director, Mexico City',
                initial: 'C',
              },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#52565E] leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B4FFF] text-sm font-bold text-white">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0C0D0E]">{t.name}</p>
                    <p className="text-xs text-[#52565E]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BOTTOM CTA ==================== */}
      <section className="bg-[#1B4FFF] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Your next idea deserves better than a gut feeling.
          </h2>
          <p className="mt-4 text-base text-blue-200">Start with 3 free analyses — no credit card required.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-[#1B4FFF] hover:bg-blue-50 transition-colors"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-xl border border-white/30 px-8 text-base font-bold text-white hover:bg-white/10 transition-colors"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-[#E5E7EB] bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1B4FFF]">
                <Brain className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-base font-black tracking-tight text-[#0C0D0E]">ValiSearch</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { to: '/pricing', label: 'Pricing' },
                { to: '/about', label: 'About' },
                { to: '/blog', label: 'Blog' },
                { to: '/terms', label: 'Terms' },
                { to: '/privacy', label: 'Privacy' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-[#52565E] hover:text-[#0C0D0E] transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-8 border-t border-[#E5E7EB] pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-xs text-[#9CA3AF]">Built in Ghana by Abdul Anas</p>
            <p className="text-xs text-[#9CA3AF]">© {new Date().getFullYear()} ValiSearch. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth gate modal */}
      {showAuthGate && <AuthGateModal onClose={() => setShowAuthGate(false)} />}
    </div>
  )
}
