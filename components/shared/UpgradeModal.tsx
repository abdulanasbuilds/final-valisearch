import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  trigger: 'no_credits' | 'feature_gate' | 'trial_ended'
  featureName?: string
}

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/mo',
    benefit: '50 analyses & advanced tools',
    variantId: import.meta.env.VITE_LS_VARIANT_PRO || '12345',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$79',
    period: '/mo',
    benefit: '250 analyses & team access',
    variantId: import.meta.env.VITE_LS_VARIANT_BUSINESS || '12346',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199',
    period: '/mo',
    benefit: 'Unlimited & custom agents',
    variantId: import.meta.env.VITE_LS_VARIANT_ENTERPRISE || '12347',
  },
]

export function UpgradeModal({ isOpen, onClose, trigger, featureName }: UpgradeModalProps) {
  const [userEmail, setUserEmail] = useState<string>('')
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setUserEmail(user.email || '')
      }
    }
    if (isOpen) loadUser()
  }, [isOpen])

  const getHeader = () => {
    switch (trigger) {
      case 'no_credits': return "You've used all your analyses"
      case 'feature_gate': return `Unlock ${featureName || 'advanced features'}`
      case 'trial_ended': return "Your trial has ended"
      default: return "Upgrade your plan"
    }
  }

  const getSubtext = () => {
    switch (trigger) {
      case 'no_credits': return "Upgrade to get 50 more analyses + real web research"
      case 'feature_gate': return "This feature is available on Pro and above"
      case 'trial_ended': return "Upgrade to keep full access to all features"
      default: return "Choose the plan that fits your needs"
    }
  }

  const handleCheckout = (variantId: string) => {
    const storeUrl = import.meta.env.VITE_LS_STORE_URL || 'https://store.valisearch.app'
    const url = new URL(`${storeUrl}/checkout/buy/${variantId}`)
    url.searchParams.set('checkout[email]', userEmail)
    url.searchParams.set('checkout[custom][user_id]', userId)
    window.location.href = url.toString()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-8 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="absolute right-4 top-4">
            <Dialog.Close asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mb-8 text-center">
            <Dialog.Title className="text-2xl font-black text-[#0C0D0E]">
              {getHeader()}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-base text-[#52565E]">
              {getSubtext()}
            </Dialog.Description>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div key={plan.id} className="flex flex-col rounded-xl border border-[#E5E7EB] p-5 shadow-sm transition-shadow hover:shadow-md">
                <h4 className="font-bold text-[#0C0D0E]">{plan.name}</h4>
                <div className="mt-2 mb-4">
                  <span className="text-2xl font-black text-[#0C0D0E]">{plan.price}</span>
                  <span className="text-sm text-[#52565E]">{plan.period}</span>
                </div>
                <div className="mb-6 flex-1 text-sm text-[#52565E] flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#16A34A] mt-0.5" />
                  <span>{plan.benefit}</span>
                </div>
                <button
                  onClick={() => handleCheckout(plan.variantId)}
                  className={`min-h-[44px] w-full rounded-lg px-4 font-semibold transition-colors ${
                    plan.id === 'pro' 
                      ? 'bg-[#1B4FFF] text-white hover:bg-[#1640D6]' 
                      : 'bg-gray-100 text-[#0C0D0E] hover:bg-gray-200'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center border-t border-[#E5E7EB] pt-6">
            <Dialog.Close asChild>
              <button className="text-sm font-semibold text-[#52565E] hover:text-[#0C0D0E]">
                Stay on free Starter plan →
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
