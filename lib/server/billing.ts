import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { PLANS, type BillingPeriod } from '@/lib/constants'

export const getSubscriptionData = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, is_trial_active, trial_ends_at')
    .eq('id', user.id)
    .single()

  const { data: credits } = await supabase
    .from('credits')
    .select('balance')
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

  return { profile, credits, subscription, analysisCount: analysisCount ?? 0 }
})

export const getInvoiceHistory = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { data: invoices } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return { invoices: invoices ?? [] }
})

type PaidPlanId = 'pro' | 'business'

function getServerSecret(name: string): string {
  // Cloudflare/Workers: these are injected as runtime env vars.
  // Using process.env is the most compatible across build targets here.
  return (typeof process !== 'undefined' && process.env?.[name]) ? String(process.env[name]) : ''
}

function getAppUrl(): string {
  return import.meta.env.VITE_APP_URL || ''
}

function getCreditsForPlan(planId: PaidPlanId): number {
  if (planId === 'pro') return 100
  return 500
}

function getPlanPrice(planId: PaidPlanId, period: BillingPeriod): number {
  const plan = PLANS.find((p) => p.id === planId)
  if (!plan) throw new Error('INVALID_PLAN')
  return period === 'annual' ? plan.annualPrice * 12 : plan.monthlyPrice
}

function stripePriceId(planId: PaidPlanId, period: BillingPeriod): string {
  if (planId === 'pro' && period === 'monthly') return getServerSecret('STRIPE_PRICE_PRO_MONTHLY')
  if (planId === 'pro' && period === 'annual') return getServerSecret('STRIPE_PRICE_PRO_ANNUAL')
  if (planId === 'business' && period === 'monthly') return getServerSecret('STRIPE_PRICE_BUSINESS_MONTHLY')
  if (planId === 'business' && period === 'annual') return getServerSecret('STRIPE_PRICE_BUSINESS_ANNUAL')
  return ''
}

async function applyPaidPlan(params: {
  userId: string
  planId: PaidPlanId
  period: BillingPeriod
  provider: 'stripe' | 'flutterwave'
  providerSubscriptionId?: string | null
  currentPeriodEnd?: Date | null
}) {
  const credits = getCreditsForPlan(params.planId)
  const service = createServiceClient()

  const { data: existingCredits } = await service
    .from('credits')
    .select('balance')
    .eq('user_id', params.userId)
    .single()

  const prevBalance = existingCredits?.balance ?? 0
  const delta = credits - prevBalance

  await Promise.all([
    service.from('profiles').update({ plan: params.planId }).eq('id', params.userId),
    service.from('credits').upsert({ user_id: params.userId, balance: credits }),
    service.from('subscriptions').upsert({
      user_id: params.userId,
      // legacy column name kept in DB; now stores the provider subscription id
      ls_subscription_id: params.providerSubscriptionId ?? null,
      plan: params.planId,
      status: 'active',
      billing_period: params.period,
      current_period_end: params.currentPeriodEnd?.toISOString() ?? null,
    }),
    delta !== 0
      ? service.from('credit_transactions').insert({
          user_id: params.userId,
          amount: delta,
          reason: `${params.provider}:${params.planId}:${params.period}`,
        })
      : Promise.resolve(),
  ])
}

export const startStripeCheckout = createServerFn({ method: 'POST' })
  .inputValidator((d: { planId: PaidPlanId; period: BillingPeriod }) => d)
  .handler(async ({ data }) => {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('UNAUTHORIZED')

    const stripeKey = getServerSecret('STRIPE_SECRET_KEY')
    const appUrl = getAppUrl()
    const priceId = stripePriceId(data.planId, data.period)
    if (!stripeKey || !appUrl || !priceId) throw new Error('BILLING_NOT_CONFIGURED')

    const successUrl = `${appUrl}/_app/settings/billing?stripe_session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${appUrl}/_app/settings/billing`

    const body = new URLSearchParams()
    body.set('mode', 'subscription')
    body.set('success_url', successUrl)
    body.set('cancel_url', cancelUrl)
    body.set('client_reference_id', user.id)
    body.set('metadata[user_id]', user.id)
    body.set('metadata[plan_id]', data.planId)
    body.set('metadata[period]', data.period)
    body.set('line_items[0][price]', priceId)
    body.set('line_items[0][quantity]', '1')

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    const json = await resp.json() as { url?: string; error?: { message?: string } }
    if (!resp.ok || !json.url) {
      throw new Error(json?.error?.message || 'STRIPE_ERROR')
    }

    return { url: json.url }
  })

export const finalizeStripeCheckout = createServerFn({ method: 'POST' })
  .inputValidator((d: { sessionId: string }) => d)
  .handler(async ({ data }) => {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('UNAUTHORIZED')

    const stripeKey = getServerSecret('STRIPE_SECRET_KEY')
    if (!stripeKey) throw new Error('BILLING_NOT_CONFIGURED')

    const url = new URL(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(data.sessionId)}`)
    url.searchParams.set('expand[]', 'subscription')
    const resp = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${stripeKey}` },
    })
    const session = await resp.json() as any
    if (!resp.ok) throw new Error(session?.error?.message || 'STRIPE_ERROR')

    const sessionUserId = session?.metadata?.user_id || session?.client_reference_id
    if (!sessionUserId || sessionUserId !== user.id) throw new Error('FORBIDDEN')

    if (session?.payment_status !== 'paid' && session?.status !== 'complete') {
      throw new Error('PAYMENT_NOT_COMPLETED')
    }

    const planId = session?.metadata?.plan_id as PaidPlanId | undefined
    const period = session?.metadata?.period as BillingPeriod | undefined
    if (!planId || (planId !== 'pro' && planId !== 'business')) throw new Error('INVALID_PLAN')
    if (!period || (period !== 'monthly' && period !== 'annual')) throw new Error('INVALID_PERIOD')

    const sub = session?.subscription
    const providerSubscriptionId =
      typeof sub === 'string' ? sub : (sub?.id as string | undefined)
    const currentPeriodEnd =
      typeof sub === 'object' && sub?.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null

    await applyPaidPlan({
      userId: user.id,
      planId,
      period,
      provider: 'stripe',
      providerSubscriptionId: providerSubscriptionId ?? null,
      currentPeriodEnd,
    })

    return { ok: true }
  })

export const startFlutterwaveCheckout = createServerFn({ method: 'POST' })
  .inputValidator((d: { planId: PaidPlanId; period: BillingPeriod }) => d)
  .handler(async ({ data }) => {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('UNAUTHORIZED')

    const flwKey = getServerSecret('FLUTTERWAVE_SECRET_KEY')
    const appUrl = getAppUrl()
    if (!flwKey || !appUrl) throw new Error('BILLING_NOT_CONFIGURED')

    const amount = getPlanPrice(data.planId, data.period)
    const currency = getServerSecret('FLUTTERWAVE_CURRENCY') || 'USD'
    const txRef = `vs_${Date.now()}_${user.id}`

    const resp = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${flwKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount,
        currency,
        redirect_url: `${appUrl}/_app/settings/billing`,
        customer: { email: user.email || '' },
        meta: { user_id: user.id, plan_id: data.planId, period: data.period },
        customizations: { title: 'ValiSearch' },
      }),
    })

    const json = await resp.json() as any
    const link = json?.data?.link as string | undefined
    if (!resp.ok || !link) {
      throw new Error(json?.message || 'FLUTTERWAVE_ERROR')
    }
    return { url: link }
  })

export const finalizeFlutterwaveCheckout = createServerFn({ method: 'POST' })
  .inputValidator((d: { transactionId: string }) => d)
  .handler(async ({ data }) => {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('UNAUTHORIZED')

    const flwKey = getServerSecret('FLUTTERWAVE_SECRET_KEY')
    if (!flwKey) throw new Error('BILLING_NOT_CONFIGURED')

    const resp = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(data.transactionId)}/verify`, {
      headers: { Authorization: `Bearer ${flwKey}` },
    })
    const json = await resp.json() as any
    if (!resp.ok) throw new Error(json?.message || 'FLUTTERWAVE_ERROR')

    const status = json?.data?.status
    if (status !== 'successful') throw new Error('PAYMENT_NOT_COMPLETED')

    const meta = json?.data?.meta || {}
    if (meta.user_id !== user.id) throw new Error('FORBIDDEN')

    const planId = meta.plan_id as PaidPlanId | undefined
    const period = meta.period as BillingPeriod | undefined
    if (!planId || (planId !== 'pro' && planId !== 'business')) throw new Error('INVALID_PLAN')
    if (!period || (period !== 'monthly' && period !== 'annual')) throw new Error('INVALID_PERIOD')

    const now = Date.now()
    const currentPeriodEnd = new Date(
      now + (period === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000
    )

    await applyPaidPlan({
      userId: user.id,
      planId,
      period,
      provider: 'flutterwave',
      providerSubscriptionId: String(json?.data?.id ?? data.transactionId),
      currentPeriodEnd,
    })

    return { ok: true }
  })
