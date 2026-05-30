import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { ShieldCheck, Check, Star } from 'lucide-react'
import type { OfferOutput } from '@/agents/types/analysis'

interface OfferSectionProps {
  data: OfferOutput | null
  isLoading?: boolean
}

export function OfferSection({ data, isLoading }: OfferSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  return (
    <div className="space-y-6">
      {/* Mini Landing Page Preview */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        {/* Hero Section */}
        <div className="border-b border-[#E5E7EB] bg-gray-50/50 px-6 py-12 text-center sm:px-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-black text-[#0C0D0E] sm:text-4xl leading-tight tracking-tight">
              {data.headline || 'Your Headline Here'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#52565E]">
              {data.subheadline || 'Subheadline missing.'}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-12">
          {/* ICP & Value Prop Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Value Prop */}
            <div className="rounded-2xl bg-[#1B4FFF]/5 p-6 border border-[#1B4FFF]/10">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1B4FFF]">Core Value Proposition</h3>
              <p className="text-base font-medium text-[#0C0D0E] leading-relaxed">
                {data.value_proposition}
              </p>
            </div>
            {/* ICP */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Ideal Customer Profile (ICP)</h3>
              <p className="text-base font-medium text-[#0C0D0E] leading-relaxed">
                {data.icp}
              </p>
            </div>
          </div>

          {/* Offer Components */}
          <div>
            <h3 className="mb-6 text-center text-xl font-bold text-[#0C0D0E]">What's Included</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.offer_components?.map((comp, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                  <Check className="h-5 w-5 shrink-0 text-[#16A34A]" />
                  <span className="text-sm font-medium text-[#0C0D0E]">{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Tiers */}
          <div>
            <h3 className="mb-6 text-center text-xl font-bold text-[#0C0D0E]">Pricing Strategy</h3>
            <div className="grid gap-6 lg:grid-cols-3 items-end">
              {data.pricing_tiers?.map((tier, i) => {
                const isMiddle = i === 1
                return (
                  <div key={i} className={`flex flex-col rounded-2xl border ${isMiddle ? 'border-[#1B4FFF] shadow-md relative' : 'border-[#E5E7EB] shadow-sm'} bg-white p-6`}>
                    {isMiddle && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1B4FFF] px-3 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                        Recommended
                      </div>
                    )}
                    <h4 className="text-lg font-bold text-[#0C0D0E]">{tier.name}</h4>
                    <p className="mt-2 text-3xl font-black text-[#0C0D0E]">{tier.price}</p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#52565E]">
                          <Check className={`h-4 w-4 shrink-0 mt-0.5 ${isMiddle ? 'text-[#1B4FFF]' : 'text-gray-400'}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Guarantee & Edge */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-green-200 bg-green-50 p-6">
              <ShieldCheck className="h-8 w-8 shrink-0 text-green-600" />
              <div>
                <h4 className="font-bold text-green-900">Risk Reversal / Guarantee</h4>
                <p className="mt-1 text-sm font-medium text-green-800 leading-relaxed">{data.guarantee}</p>
              </div>
            </div>
            
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <h4 className="font-bold text-amber-900">Competitive Edge</h4>
              </div>
              <ul className="space-y-2">
                {data.competitive_edge?.map((edge, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="font-bold shrink-0">{i + 1}.</span>
                    <span>{edge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
