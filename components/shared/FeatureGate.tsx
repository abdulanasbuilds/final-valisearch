import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { UpgradeModal } from './UpgradeModal'
import { canAccessFeature } from '@/lib/feature-gates'
import type { FeatureKey } from '@/lib/feature-gates'
import type { Plan } from '@/agents/types/analysis'

interface FeatureGateProps {
  feature: FeatureKey
  userPlan: Plan
  isTrialActive?: boolean
  featureName?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({
  feature,
  userPlan,
  isTrialActive = false,
  featureName,
  children,
  fallback,
}: FeatureGateProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const isAllowed = canAccessFeature(feature, userPlan, isTrialActive)

  if (isAllowed) {
    return <>{children}</>
  }

  // If a custom fallback is provided, render it instead of the blur overlay
  if (fallback) {
    return (
      <>
        {fallback}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          trigger="feature_gate"
          featureName={featureName || feature}
        />
      </>
    )
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="blur-sm pointer-events-none opacity-60 select-none">
          {children}
        </div>
        
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/20 p-4">
          <div className="flex max-w-sm flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#1B4FFF]">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#0C0D0E]">
              Unlock {featureName || 'this feature'}
            </h3>
            <p className="mb-6 text-sm text-[#52565E]">
              This feature is available on Pro plans and above. Upgrade to get full access to advanced tools.
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#1B4FFF] px-4 font-semibold text-white transition-colors hover:bg-[#1640D6]"
            >
              Upgrade to unlock
            </button>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="feature_gate"
        featureName={featureName || feature}
      />
    </>
  )
}
