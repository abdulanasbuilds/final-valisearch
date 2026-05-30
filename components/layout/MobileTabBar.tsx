import { Link, useMatchRoute } from '@tanstack/react-router'
import { Home, Plus, Settings, CreditCard } from 'lucide-react'

const tabs = [
  { to: '/workspace', label: 'Home', icon: Home },
  { to: '/workspace/new', label: 'New', icon: Plus },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/settings/billing', label: 'Billing', icon: CreditCard },
] as const

export function MobileTabBar() {
  const matchRoute = useMatchRoute()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-[#E5E7EB] bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      {tabs.map((tab) => {
        const isActive = matchRoute({ to: tab.to, fuzzy: tab.to === '/workspace' })
        const Icon = tab.icon

        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              isActive ? 'text-[#1B4FFF]' : 'text-[#52565E]'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
