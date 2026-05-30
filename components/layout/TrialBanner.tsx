import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Sparkles, X, ArrowRight } from 'lucide-react'

interface TrialBannerProps {
  trialEndsAt: string
}

export function TrialBanner({ trialEndsAt }: TrialBannerProps) {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)
  const [daysLeft, setDaysLeft] = useState(0)

  useEffect(() => {
    const diff = new Date(trialEndsAt).getTime() - new Date().getTime()
    setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))))
  }, [trialEndsAt])

  if (dismissed || daysLeft <= 0) return null

  return (
    <div className="bg-gradient-to-r from-[#1B4FFF] to-blue-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>
            <strong className="font-bold">{daysLeft} {daysLeft === 1 ? 'day' : 'days'}</strong> left in your Pro trial
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/settings/billing' })}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-white/20 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/30"
          >
            Upgrade
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="inline-flex min-h-[36px] items-center justify-center rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
