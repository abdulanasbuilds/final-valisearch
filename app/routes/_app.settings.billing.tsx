import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { createServerClient } from '@/lib/supabase/server'
import { Check, ExternalLink, Zap, AlertTriangle } from 'lucide-react'
import type { Plan } from '@/agents/types/analysis'

export const getBillingData = createServerFn().handler(async () => {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: credits } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { count: analysisCount } = await supabase
    .from('analysis')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return { profile, credits, subscription, analysisCount: analysisCount || 0 }
})

export const Route = createFileRoute('/_app/settings/billing')({
  loader: () => getBillingData(),
  component: BillingPage,
})

const PLAN_LIMITS: Record<Plan, { analyses: number, credits: number }> = {
  starter: { analyses: 3, credits: 6 },
  pro: { analyses: 50, credits: 100 },
  business: { analyses: 250, credits: 500 },
  enterprise: { analyses: 9999, credits: 99999 },
}

function BillingPage() {
  const { profile, credits, subscription, analysisCount } = Route.useLoaderData()
  const plan = (profile?.plan as Plan) || 'starter'
  const isTrialActive = profile?.is_trial_active
  const limits = PLAN_LIMITS[plan]

  const handleUpgrade = (variantId: string) => {
    const storeUrl = import.meta.env.VITE_LS_STORE_URL || 'https://store.valisearch.app'
    const url = new URL(`${storeUrl}/checkout/buy/${variantId}`)
    url.searchParams.set('checkout[email]', profile?.email || '')
    url.searchParams.set('checkout[custom][user_id]', profile?.id || '')
    window.location.href = url.toString()
  }

  const handleManageBilling = () => {
    // In a real app, this would call an API to generate a customer portal URL from LemonSqueezy
    window.open('https://store.valisearch.app/billing', '_blank')
  }

  const getTrialDaysRemaining = () => {
    if (!isTrialActive || !profile?.trial_ends_at) return 0
    const diff = new Date(profile.trial_ends_at).getTime() - new Date().getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const trialDays = getTrialDaysRemaining()

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-black text-[#0C0D0E] mb-8">Billing & Usage</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0C0D0E]">Current Plan</h3>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
              plan === 'pro' ? 'bg-blue-100 text-[#1B4FFF]' :
              plan === 'business' ? 'bg-purple-100 text-purple-700' :
              plan === 'enterprise' ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {plan}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-black text-[#0C0D0E]">
              {plan === 'starter' ? 'Free' : 
               plan === 'pro' ? '$29' : 
               plan === 'business' ? '$79' : '$199'}
              <span className="text-sm font-medium text-[#52565E]">/mo</span>
            </p>
            {subscription?.current_period_end && (
              <p className="mt-1 text-xs text-[#52565E]">
                Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>

          {isTrialActive && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900">Pro Trial Active</p>
                <p className="text-sm font-medium text-amber-800">{trialDays} days remaining</p>
              </div>
            </div>
          )}

          <div className="space-y-3 border-t border-[#E5E7EB] pt-6">
            {plan === 'starter' ? (
              <button
                onClick={() => handleUpgrade(import.meta.env.VITE_LS_VARIANT_PRO || '1')}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#1B4FFF] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6]"
              >
                Upgrade to Pro
              </button>
            ) : isTrialActive ? (
              <button
                onClick={() => handleUpgrade(import.meta.env.VITE_LS_VARIANT_PRO || '1')}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-amber-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Upgrade before trial ends
              </button>
            ) : (
              <>
                <button
                  onClick={handleManageBilling}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-6 text-sm font-semibold text-[#0C0D0E] transition-colors hover:bg-gray-50"
                >
                  Manage billing <ExternalLink className="h-4 w-4" />
                </button>
                <button className="w-full text-center text-sm font-semibold text-red-600 hover:text-red-700 mt-2">
                  Cancel plan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Usage This Period */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#0C0D0E] mb-6">Usage This Period</h3>
          
          <div className="space-y-6">
            {/* Analyses */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0C0D0E]">Analyses run</span>
                <span className="text-sm font-bold text-[#52565E]">{analysisCount} / {limits.analyses}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    (analysisCount / limits.analyses) > 0.8 ? 'bg-red-500' : 'bg-[#1B4FFF]'
                  }`}
                  style={{ width: `${Math.min(100, (analysisCount / limits.analyses) * 100)}%` }}
                />
              </div>
            </div>

            {/* Credits */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0C0D0E] flex items-center gap-1">
                  <Zap className="h-4 w-4 text-amber-500" /> AI Credits
                </span>
                <span className="text-sm font-bold text-[#52565E]">{credits?.balance || 0} remaining</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div 
                  className="h-full rounded-full bg-amber-400 transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((credits?.balance || 0) / limits.credits) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#52565E]">Full analysis costs 2 credits. Quick scan costs 1 credit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Comparison Mini Table */}
      <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm overflow-hidden">
        <h3 className="text-lg font-bold text-[#0C0D0E] mb-6">Plan Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#52565E] rounded-tl-lg">Feature</th>
                <th className="px-4 py-3 font-semibold text-[#52565E]">Starter (Free)</th>
                <th className="px-4 py-3 font-bold text-[#1B4FFF] bg-blue-50/50">Pro ($29/mo)</th>
                <th className="px-4 py-3 font-semibold text-[#52565E] rounded-tr-lg">Business ($79/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              <tr>
                <td className="px-4 py-3 font-medium text-[#0C0D0E]">Analyses per month</td>
                <td className="px-4 py-3 text-[#52565E]">3</td>
                <td className="px-4 py-3 font-bold text-[#0C0D0E] bg-blue-50/20">50</td>
                <td className="px-4 py-3 text-[#52565E]">250</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#0C0D0E]">Real-time Web Research</td>
                <td className="px-4 py-3 text-gray-300">-</td>
                <td className="px-4 py-3 text-[#16A34A] bg-blue-50/20"><Check className="h-4 w-4" /></td>
                <td className="px-4 py-3 text-[#16A34A]"><Check className="h-4 w-4" /></td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#0C0D0E]">AI Co-founder Chat</td>
                <td className="px-4 py-3 text-gray-300">-</td>
                <td className="px-4 py-3 text-[#16A34A] bg-blue-50/20"><Check className="h-4 w-4" /></td>
                <td className="px-4 py-3 text-[#16A34A]"><Check className="h-4 w-4" /></td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#0C0D0E]">Team Workspace</td>
                <td className="px-4 py-3 text-gray-300">-</td>
                <td className="px-4 py-3 text-gray-300 bg-blue-50/20">-</td>
                <td className="px-4 py-3 text-[#16A34A]"><Check className="h-4 w-4" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
