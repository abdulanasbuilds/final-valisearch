import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { CopyButton } from '@/components/shared/CopyButton'
import { Rocket, Share2, Search, Link2, Handshake } from 'lucide-react'
import type { DistributionOutput } from '@/agents/types/analysis'

interface DistributionSectionProps {
  data: DistributionOutput | null
  isLoading?: boolean
}

export function DistributionSection({ data, isLoading }: DistributionSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  return (
    <div className="space-y-8">
      {/* Launch Strategy Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm sm:p-10">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-bold uppercase tracking-wider text-[#1B4FFF]">
            <Rocket className="h-4 w-4" />
            Core Launch Strategy
          </div>
          <p className="text-xl font-bold text-[#0C0D0E] sm:text-2xl leading-relaxed">
            {data.launch_strategy}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Partnership Opportunities */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
            <Handshake className="h-5 w-5 text-purple-500" />
            Partnership Opportunities
          </h3>
          <div className="space-y-4">
            {data.partnership_opportunities?.map((opp, i) => (
              <div key={i} className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                <p className="text-sm font-medium text-[#0C0D0E] leading-relaxed">{opp}</p>
                <div className="mt-3 flex justify-end">
                  <CopyButton text={opp} label="Copy outreach" className="bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 h-8 text-xs py-1 px-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Viral Loops */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
              <Share2 className="h-5 w-5 text-amber-500" />
              Viral Loops & Network Effects
            </h3>
            <ul className="space-y-3">
              {data.viral_loops?.map((loop, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#52565E]">
                  <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <span>{loop}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ProductHunt Readiness */}
          <div className={`flex items-center justify-between rounded-2xl border p-6 ${data.product_hunt_readiness ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex flex-col gap-1">
              <span className={`text-sm font-bold uppercase tracking-wider ${data.product_hunt_readiness ? 'text-green-700' : 'text-amber-700'}`}>ProductHunt Readiness</span>
              <span className="text-base font-medium text-[#0C0D0E]">
                {data.product_hunt_readiness ? 'Ready for launch' : 'Needs more validation'}
              </span>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${data.product_hunt_readiness ? 'bg-green-200 text-green-700' : 'bg-amber-200 text-amber-700'}`}>
              <Rocket className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* SEO Opportunities */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#E5E7EB] bg-gray-50/50 p-6 flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-bold text-[#0C0D0E]">SEO & Search Intent</h3>
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.seo_opportunities?.map((opp, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-[#0C0D0E]">{opp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
