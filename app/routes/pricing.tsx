import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckCircle, X, Star, HelpCircle, ChevronDown, Brain, ArrowRight } from 'lucide-react'
import { PLANS, getPlanPrice, getAnnualSavings } from '@/lib/constants'
import type { BillingPeriod } from '@/lib/constants'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

// ============================================================
// FAQ DATA
// ============================================================
const FAQ_ITEMS = [
  {
    q: 'How does the 7-day free trial work?',
    a: 'When you sign up for any paid plan, you immediately get full Pro access for 7 days at no charge. We call this a "reverse trial" — you get the full product first, then decide. No credit card required to start.',
  },
  {
    q: 'What happens when my trial ends?',
    a: "If you don't upgrade before your trial ends, your account automatically downgrades to the Starter plan — 3 analyses and 6 credits per month. No surprise charges. Your existing analysis reports remain accessible.",
  },
  {
    q: 'What counts as one analysis?',
    a: 'One analysis is a single run of the full 12-agent pipeline against one startup idea. A Quick Scan costs 1 credit; a Full Intelligence Report costs 2 credits. Your monthly credit allowance resets at the start of each billing period.',
  },
  {
    q: 'Which AI models do agents use?',
    a: 'Starter plan agents use Google Gemini 2.5 Flash (fast and efficient). All paid plans use Anthropic Claude Sonnet on agents 1–11, with Claude Sonnet also powering the final Synthesis agent for all tiers.',
  },
  {
    q: 'Can I use real market data, or is it all AI-generated?',
    a: 'Pro and above plans include real-time web research via Serper.dev and Firecrawl — meaning our Market, Competitor, and Social Sentiment agents pull live data from the web, not just LLM training data.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. If you are not satisfied within the first 14 days of a paid subscription, contact us for a full refund. No questions asked.',
  },
  {
    q: 'Can I change my plan at any time?',
    a: 'Absolutely. You can upgrade, downgrade, or cancel at any time directly from your billing settings. Upgrades take effect immediately; downgrades take effect at the end of your billing cycle.',
  },
  {
    q: 'Is there a discount for accelerators or educational institutions?',
    a: 'Yes — we offer custom pricing for accelerator cohorts, university programs, and non-profits building for emerging markets. Reach out at team@valisearch.app with details about your program.',
  },
]

// ============================================================
// FEATURE COMPARISON TABLE
// ============================================================
type FeatureRow = {
  label: string
  starter: string | boolean
  pro: string | boolean
  business: string | boolean
  enterprise: string | boolean
}

const FEATURE_TABLE: FeatureRow[] = [
  { label: 'Analyses per month', starter: '3', pro: '50', business: '250', enterprise: 'Unlimited' },
  { label: 'AI credits', starter: '6', pro: '100', business: '500', enterprise: 'Unlimited' },
  { label: 'AI model quality', starter: 'Gemini 2.5 Flash', pro: 'Claude Sonnet', business: 'Claude Sonnet', enterprise: 'Claude Sonnet' },
  { label: 'Core 12-agent analysis', starter: true, pro: true, business: true, enterprise: true },
  { label: 'Validation score & verdict', starter: true, pro: true, business: true, enterprise: true },
  { label: 'Real-time web research', starter: false, pro: true, business: true, enterprise: true },
  { label: 'AI Co-founder chat', starter: false, pro: true, business: true, enterprise: true },
  { label: 'PDF export', starter: false, pro: true, business: true, enterprise: true },
  { label: 'DOCX export', starter: false, pro: true, business: true, enterprise: true },
  { label: 'Flow builder', starter: false, pro: true, business: true, enterprise: true },
  { label: 'Team workspace', starter: false, pro: false, business: '5 members', enterprise: 'Unlimited' },
  { label: 'API access', starter: false, pro: false, business: true, enterprise: true },
  { label: 'White-label reports', starter: false, pro: false, business: true, enterprise: true },
  { label: 'Custom AI agents', starter: false, pro: false, business: false, enterprise: true },
  { label: 'SSO / SAML', starter: false, pro: false, business: false, enterprise: true },
  { label: 'SLA & uptime guarantee', starter: false, pro: false, business: false, enterprise: true },
]

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) return <CheckCircle className="mx-auto h-5 w-5 text-[#16A34A]" />
  if (value === false) return <X className="mx-auto h-4 w-4 text-gray-200" />
  return <span className="text-sm text-[#52565E]">{value}</span>
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#E5E7EB] py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <span className="font-semibold text-[#0C0D0E]">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[#52565E] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="mt-3 text-sm text-[#52565E] leading-relaxed">{a}</p>
      )}
    </div>
  )
}

// ============================================================
// PRICING PAGE
// ============================================================
function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  return (
    <div className="min-h-screen bg-white text-[#0C0D0E]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4FFF]">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-[#0C0D0E]">ValiSearch</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block text-sm font-semibold text-[#52565E] hover:text-[#0C0D0E]">Sign in</Link>
            <Link to="/register" className="inline-flex min-h-[44px] items-center rounded-lg bg-[#1B4FFF] px-4 text-sm font-semibold text-white hover:bg-[#1640D6] transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1B4FFF] mb-3">Pricing</p>
          <h1 className="text-4xl font-black text-[#0C0D0E] sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-[#52565E]">Start free. Upgrade when you're ready. Cancel any time.</p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1 shadow-sm">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${billingPeriod === 'monthly' ? 'bg-[#1B4FFF] text-white shadow' : 'text-[#52565E] hover:text-[#0C0D0E]'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${billingPeriod === 'annual' ? 'bg-[#1B4FFF] text-white shadow' : 'text-[#52565E] hover:text-[#0C0D0E]'}`}
            >
              Annual
              <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${billingPeriod === 'annual' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== PLAN CARDS ==================== */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => {
              const price = getPlanPrice(plan, billingPeriod)
              const savings = getAnnualSavings(plan.id)
              const isHighlighted = plan.badge === 'Most Popular'
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl p-6 transition-shadow ${
                    isHighlighted
                      ? 'border-2 border-[#1B4FFF] bg-white shadow-2xl shadow-blue-500/15'
                      : 'border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B4FFF] px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                        <Star className="h-3 w-3 fill-white" /> {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6 pt-2">
                    <h3 className="text-xl font-black text-[#0C0D0E]">{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black text-[#0C0D0E]">${price}</span>
                      {price > 0 && <span className="mb-1.5 text-base text-[#52565E]">/mo</span>}
                    </div>
                    {price > 0 && billingPeriod === 'annual' && savings > 0 && (
                      <p className="mt-1 text-xs font-medium text-green-600">
                        You save ${savings}/yr vs monthly
                      </p>
                    )}
                    {price > 0 && (
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        {billingPeriod === 'annual' ? 'Billed annually' : 'Billed monthly'}
                        {' · '}
                        <span className="font-semibold text-amber-600">7-day free trial</span>
                      </p>
                    )}
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                        <span className="text-sm text-[#52565E]">{feature}</span>
                      </li>
                    ))}
                    {plan.locked.length > 0 && (
                      <>
                        <li className="pt-2 border-t border-[#E5E7EB]" />
                        {plan.locked.slice(0, 2).map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 opacity-40">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                            <span className="text-sm text-[#52565E]">{feature}</span>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>

                  <Link
                    to="/register"
                    className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      isHighlighted
                        ? 'bg-[#1B4FFF] text-white hover:bg-[#1640D6] shadow-lg shadow-blue-500/30'
                        : 'border border-[#E5E7EB] text-[#0C0D0E] hover:bg-gray-50'
                    }`}
                  >
                    {price === 0 ? 'Get started free' : 'Start free trial'}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==================== TRIAL EXPLAINER ==================== */}
      <section className="border-y border-[#E5E7EB] bg-blue-50/50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1B4FFF] mb-3">How the trial works</p>
          <h2 className="text-2xl font-black text-[#0C0D0E] sm:text-3xl mb-10">Try Pro free — no credit card required</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '1', title: 'Sign up', desc: 'Create your account in 30 seconds. No credit card needed.' },
              { step: '2', title: '7-day Pro access', desc: 'Instantly get full Pro access. Run up to 50 analyses and try all features.' },
              { step: '3', title: 'Decide', desc: 'Upgrade to keep Pro, or stay on the free Starter plan — no pressure.' },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-blue-100 bg-white p-6 text-left shadow-sm">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#1B4FFF] text-sm font-black text-white">
                  {s.step}
                </div>
                <h3 className="font-bold text-[#0C0D0E] mb-1">{s.title}</h3>
                <p className="text-sm text-[#52565E] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURE TABLE ==================== */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-[#0C0D0E]">Full plan comparison</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-[#52565E] w-1/3">Feature</th>
                  {PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      className={`px-4 py-4 text-center font-black text-sm ${plan.badge ? 'text-[#1B4FFF]' : 'text-[#0C0D0E]'}`}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {FEATURE_TABLE.map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-[#0C0D0E]">{row.label}</td>
                    <td className="px-4 py-3.5 text-center"><FeatureValue value={row.starter} /></td>
                    <td className="px-4 py-3.5 text-center bg-blue-50/30"><FeatureValue value={row.pro} /></td>
                    <td className="px-4 py-3.5 text-center"><FeatureValue value={row.business} /></td>
                    <td className="px-4 py-3.5 text-center"><FeatureValue value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="bg-gray-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 mb-4">
              <HelpCircle className="h-6 w-6 text-[#1B4FFF]" />
            </div>
            <h2 className="text-3xl font-black text-[#0C0D0E]">Frequently asked questions</h2>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 shadow-sm">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BOTTOM CTA ==================== */}
      <section className="bg-[#1B4FFF] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Start validating for free today.
          </h2>
          <p className="mt-4 text-base text-blue-200">No credit card. No commitments. Just clarity.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-[#1B4FFF] hover:bg-blue-50 transition-colors"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1B4FFF]">
              <Brain className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-base font-black tracking-tight text-[#0C0D0E]">ValiSearch</span>
          </Link>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {['/terms', '/privacy', '/about', '/blog'].map((to) => (
              <Link key={to} to={to} className="text-sm text-[#52565E] hover:text-[#0C0D0E] capitalize">
                {to.replace('/', '')}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[#9CA3AF]">Built in Ghana by Abdul Anas</p>
        </div>
      </footer>
    </div>
  )
}
