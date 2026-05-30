import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { User, Lock, Bell, AlertTriangle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  // Profile State
  const [fullName, setFullName] = useState('')
  
  // Security State
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Notifications State
  const [notifs, setNotifs] = useState({
    trial_expiry: true,
    weekly_summary: true,
    feature_announcements: true,
    upgrade_reminders: true,
  })

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setUserEmail(user.email || null)
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile) {
          setFullName(profile.full_name || '')
          if (profile.notification_prefs) {
            setNotifs(profile.notification_prefs as any)
          }
        }
      }
    }
    loadData()
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setIsSaving(true)
    try {
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return alert('Passwords do not match')
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      alert('Password updated successfully')
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw error
      setEmailMsg('Confirmation sent to new email. Please check your inbox.')
      setNewEmail('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    setIsDeleting(true)
    try {
      const { error } = await supabase.rpc('delete_account')
      if (error) throw error
      await supabase.auth.signOut()
      navigate({ to: '/login' })
    } catch (err: any) {
      alert(err.message)
      setIsDeleting(false)
    }
  }

  const handleSaveNotifs = async () => {
    if (!userId) return
    setIsSaving(true)
    try {
      await supabase
        .from('profiles')
        .update({ notification_prefs: notifs })
        .eq('id', userId)
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-black text-[#0C0D0E] mb-8">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex min-h-[44px] items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#1B4FFF]'
                      : 'text-[#52565E] hover:bg-gray-100 hover:text-[#0C0D0E]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0E] mb-6">Profile Information</h3>
                <form onSubmit={handleSaveProfile} className="space-y-5 max-w-md">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#0C0D0E]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userEmail || ''}
                      disabled
                      className="w-full rounded-lg border border-[#E5E7EB] bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1.5 text-xs text-gray-400">To change your email, go to the Security tab.</p>
                  </div>
                  
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#0C0D0E]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#0C0D0E] focus:border-[#1B4FFF] focus:outline-none focus:ring-1 focus:ring-[#1B4FFF]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#1B4FFF] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6] disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save changes'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Password */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0E] mb-6">Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-md">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#0C0D0E]">New Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm focus:border-[#1B4FFF] focus:outline-none focus:ring-1 focus:ring-[#1B4FFF]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#0C0D0E]">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm focus:border-[#1B4FFF] focus:outline-none focus:ring-1 focus:ring-[#1B4FFF]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving || !password}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#1B4FFF] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6] disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
                  </button>
                </form>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0E] mb-6">Change Email</h3>
                <form onSubmit={handleUpdateEmail} className="space-y-5 max-w-md">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#0C0D0E]">New Email Address</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm focus:border-[#1B4FFF] focus:outline-none focus:ring-1 focus:ring-[#1B4FFF]"
                    />
                  </div>
                  {emailMsg && <p className="text-sm font-medium text-green-600">{emailMsg}</p>}
                  <button
                    type="submit"
                    disabled={isSaving || !newEmail}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-6 text-sm font-semibold text-[#0C0D0E] transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update email'}
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl border-2 border-red-100 bg-red-50/50 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-red-800 mb-2">
                  <AlertTriangle className="h-5 w-5" /> Danger Zone
                </h3>
                <p className="text-sm text-red-900/80 mb-6 max-w-xl">
                  Once you delete your account, there is no going back. All of your analyses, credits, and ideas will be permanently deleted.
                </p>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-red-800">
                      Type <span className="select-all bg-red-100 px-1 rounded">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== 'DELETE' || isDeleting}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete my account'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0E] mb-6">Email Preferences</h3>
                <div className="space-y-6 max-w-2xl mb-8">
                  <ToggleItem 
                    title="Trial Expiry Reminders" 
                    desc="Receive an email 3 days before your Pro trial expires."
                    checked={notifs.trial_expiry}
                    onChange={(v) => setNotifs(prev => ({ ...prev, trial_expiry: v }))}
                  />
                  <ToggleItem 
                    title="Weekly Usage Summary" 
                    desc="Get a breakdown of your analyses and credits used each week."
                    checked={notifs.weekly_summary}
                    onChange={(v) => setNotifs(prev => ({ ...prev, weekly_summary: v }))}
                  />
                  <ToggleItem 
                    title="New Feature Announcements" 
                    desc="Be the first to know about new AI agents and platform features."
                    checked={notifs.feature_announcements}
                    onChange={(v) => setNotifs(prev => ({ ...prev, feature_announcements: v }))}
                  />
                  <ToggleItem 
                    title="Upgrade Reminders" 
                    desc="In-app and email reminders when you are running low on credits."
                    checked={notifs.upgrade_reminders}
                    onChange={(v) => setNotifs(prev => ({ ...prev, upgrade_reminders: v }))}
                  />
                </div>
                <button
                  onClick={handleSaveNotifs}
                  disabled={isSaving}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#1B4FFF] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6] disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save preferences'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleItem({ title, desc, checked, onChange }: { title: string, desc: string, checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className="text-sm font-bold text-[#0C0D0E]">{title}</h4>
        <p className="text-sm text-[#52565E]">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B4FFF] focus:ring-offset-2 ${checked ? 'bg-[#1B4FFF]' : 'bg-gray-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
