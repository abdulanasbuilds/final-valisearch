import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const getProfile = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
})

export const updateProfileFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { full_name: string }) => d)
  .handler(async ({ data: payload }) => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: payload.full_name })
    .eq('id', user.id)

  if (error) throw new Error('PROFILE_UPDATE_FAILED')
  return { ok: true }
})

export const updatePasswordFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data: payload }) => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { error } = await supabase.auth.updateUser({ password: payload.password })
  if (error) throw new Error('PASSWORD_UPDATE_FAILED')
  return { ok: true }
})

export const updateEmailFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data: payload }) => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { error } = await supabase.auth.updateUser({ email: payload.email })
  if (error) throw new Error('EMAIL_UPDATE_FAILED')
  return { ok: true }
})

export const deleteAccountFn = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { error } = await supabase.rpc('delete_account')
  if (error) throw new Error('ACCOUNT_DELETION_FAILED')

  await supabase.auth.signOut()
  return { ok: true }
})

export const saveNotificationPrefsFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { trial_expiry: boolean; weekly_summary: boolean; feature_announcements: boolean; upgrade_reminders: boolean }) => d)
  .handler(async ({ data: payload }) => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { error } = await supabase
    .from('profiles')
    .update({ notification_prefs: payload })
    .eq('id', user.id)

  if (error) throw new Error('NOTIF_SAVE_FAILED')
  return { ok: true }
})
