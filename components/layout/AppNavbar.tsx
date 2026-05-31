import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { tryCreateClient } from '@/lib/supabase/client'
import {
  Search, BarChart2, Settings, CreditCard, LogOut, ChevronDown, Menu, X, Sparkles,
} from 'lucide-react'

interface AppNavbarProps {
  profile: {
    plan?: string
    full_name?: string | null
    is_trial_active?: boolean
  } | null
}

export function AppNavbar({ profile }: AppNavbarProps) {
  const navigate = useNavigate()
  const supabase = tryCreateClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const plan = profile?.plan ?? 'starter'
  const isTrial = profile?.is_trial_active ?? false

  const handleSignOut = async () => {
    if (!supabase) {
      navigate({ to: '/login' })
      return
    }
    await supabase.auth.signOut()
    navigate({ to: '/login' })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link to="/workspace" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4FFF]">
              <span className="text-sm font-black text-white">V</span>
            </div>
            <span className="text-lg font-bold text-[#0C0D0E]">ValiSearch</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/workspace"
              className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50 hover:text-[#0C0D0E] [&.active]:text-[#1B4FFF]"
              activeProps={{ className: 'text-[#1B4FFF] bg-blue-50/50' }}
            >
              <BarChart2 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/workspace/new"
              className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50 hover:text-[#0C0D0E] [&.active]:text-[#1B4FFF]"
              activeProps={{ className: 'text-[#1B4FFF] bg-blue-50/50' }}
            >
              <Search className="h-4 w-4" />
              New Analysis
            </Link>
          </nav>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center gap-3">
          {isTrial && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              <Sparkles className="h-3 w-3" />
              Pro Trial
            </span>
          )}

          {/* Desktop Profile Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B4FFF] text-xs font-bold text-white">
                {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-xl border border-[#E5E7EB] bg-white py-2 shadow-lg">
                  <div className="border-b border-[#E5E7EB] px-4 pb-2">
                    <p className="truncate text-sm font-medium text-[#0C0D0E]">{profile?.full_name ?? 'User'}</p>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-[#52565E] capitalize">
                      {plan}
                    </span>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/settings"
                      className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-[#52565E] transition-colors hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      to="/settings/billing"
                      className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-[#52565E] transition-colors hover:bg-gray-50"
                    >
                      <CreditCard className="h-4 w-4" />
                      Billing
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex min-h-[44px] w-full items-center gap-3 px-4 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-2 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5 text-[#0C0D0E]" /> : <Menu className="h-5 w-5 text-[#0C0D0E]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-[#E5E7EB] bg-white md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link
              to="/workspace"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
            >
              <BarChart2 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/workspace/new"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
            >
              <Search className="h-4 w-4" />
              New Analysis
            </Link>
            <Link
              to="/settings"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              to="/settings/billing"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
            >
              <CreditCard className="h-4 w-4" />
              Billing
            </Link>
            <button
              onClick={() => { setMenuOpen(false); handleSignOut() }}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
