import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { TrialBanner } from '@/components/layout/TrialBanner'

const getAuthUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, full_name, is_trial_active, trial_ends_at')
    .eq('id', user.id)
    .single()

  return { user, profile }
})

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const data = await getAuthUser()
    if (!data) {
      throw redirect({ to: '/login' })
    }
    return { user: data.user, profile: data.profile }
  },
  component: AppLayout,
})

function AppLayout() {
  const { profile } = Route.useRouteContext()

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {profile?.is_trial_active && (
        <TrialBanner trialEndsAt={profile.trial_ends_at ?? ''} />
      )}
      <AppNavbar profile={profile} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
