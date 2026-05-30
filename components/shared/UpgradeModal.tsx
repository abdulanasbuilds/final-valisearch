import { useNavigate } from '@tanstack/react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Zap, ArrowRight } from 'lucide-react'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  credits: number
}

export function UpgradeModal({ open, onOpenChange, credits }: UpgradeModalProps) {
  const navigate = useNavigate()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Close button */}
          <Dialog.Close className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </Dialog.Close>

          {/* Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
            <Zap className="h-7 w-7 text-amber-600" />
          </div>

          <Dialog.Title className="text-center text-xl font-bold text-[#0C0D0E]">
            Upgrade your plan
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-center text-sm text-[#52565E]">
            You have <span className="font-semibold text-[#0C0D0E]">{credits} credits</span> remaining.
            Upgrade to Pro for 100 credits per month and access to premium AI models.
          </Dialog.Description>

          {/* Plan comparison */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#52565E]">Starter</p>
                <p className="text-xs text-[#52565E]">6 credits &middot; Basic models</p>
              </div>
              <span className="text-sm font-semibold text-[#52565E]">Free</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border-2 border-[#1B4FFF] bg-[#1B4FFF]/5 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#1B4FFF]">Pro</p>
                <p className="text-xs text-[#52565E]">100 credits &middot; Claude Sonnet</p>
              </div>
              <span className="text-sm font-bold text-[#1B4FFF]">$29/mo</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              id="upgrade-cta"
              type="button"
              onClick={() => {
                onOpenChange(false)
                navigate({ to: '/settings/billing' })
              }}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B4FFF] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6]"
            >
              Upgrade to Pro
              <ArrowRight className="h-4 w-4" />
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
              >
                Maybe later
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
