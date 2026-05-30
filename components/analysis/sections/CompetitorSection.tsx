import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { ExternalLink, Swords, Target, Search, ArrowRight } from 'lucide-react'
import type { CompetitorOutput } from '@/agents/types/analysis'

interface CompetitorSectionProps {
  data: CompetitorOutput | null
  isLoading?: boolean
}

export function CompetitorSection({ data, isLoading }: CompetitorSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  return (
    <div className="space-y-8">
      {/* Competitors List */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-[#0C0D0E]">Competitive Landscape</h3>
        <div className="grid gap-4">
          {data.competitors?.map((comp, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:flex-row">
              <div className="flex w-full flex-col sm:w-1/3 border-b sm:border-b-0 sm:border-r border-[#E5E7EB] pb-4 sm:pb-0 sm:pr-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#0C0D0E]">{comp.name}</h4>
                  <a href={comp.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1B4FFF]">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="flex flex-1 grid-cols-2 gap-4 sm:grid">
                <div className="rounded-xl border border-green-100 bg-green-50/50 p-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-green-700">Core Strength</span>
                  <p className="mt-1 text-sm font-medium text-green-900">{comp.strength}</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700">Critical Weakness</span>
                  <p className="mt-1 text-sm font-medium text-red-900">{comp.weakness}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gap Analysis */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
            <Search className="h-5 w-5 text-[#1B4FFF]" />
            Market Gaps
          </h3>
          <ul className="space-y-3">
            {data.gap_analysis?.map((gap, i) => (
              <li key={i} className="flex gap-3">
                <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1B4FFF]" />
                <p className="text-sm leading-relaxed text-[#52565E]">{gap}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Positioning & GTM */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-700">
              <Swords className="h-4 w-4" />
              Positioning Recommendation
            </h3>
            <p className="text-base font-medium leading-relaxed text-purple-900">
              {data.positioning_recommendation}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
              <Target className="h-4 w-4" />
              Fastest GTM Path
            </h3>
            {data.fastest_gtm ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <span className="shrink-0 rounded bg-gray-200 px-2 py-1 text-xs font-bold text-gray-600">Audience</span>
                  <span className="text-sm font-medium text-[#0C0D0E]">{data.fastest_gtm.audience}</span>
                </div>
                <div className="flex justify-center"><ArrowRight className="h-4 w-4 rotate-90 text-gray-300" /></div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <span className="shrink-0 rounded bg-gray-200 px-2 py-1 text-xs font-bold text-gray-600">Channel</span>
                  <span className="text-sm font-medium text-[#0C0D0E]">{data.fastest_gtm.channel}</span>
                </div>
                <div className="flex justify-center"><ArrowRight className="h-4 w-4 rotate-90 text-gray-300" /></div>
                <div className="flex items-center gap-3 rounded-lg border-2 border-blue-100 bg-blue-50 p-3">
                  <span className="shrink-0 rounded bg-[#1B4FFF] px-2 py-1 text-xs font-bold text-white">Result</span>
                  <span className="text-sm font-bold text-blue-900">{data.fastest_gtm.result}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#52565E]">Not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
