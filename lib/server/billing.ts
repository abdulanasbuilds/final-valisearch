import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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
