import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExternalLink, TrendingUp, Target, Coins, TrendingDown } from 'lucide-react'
import type { MarketOutput } from '@/agents/types/analysis'

interface MarketSectionProps {
  data: MarketOutput | null
  isLoading?: boolean
}

export function MarketSection({ data, isLoading }: MarketSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  const marketCards = [
    { key: 'tam', label: 'Total Addressable Market (TAM)', data: data.tam, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { key: 'sam', label: 'Serviceable Addressable Market (SAM)', data: data.sam, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { key: 'som', label: 'Serviceable Obtainable Market (SOM)', data: data.som, icon: Coins, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  ]

  return (
    <div className="space-y-8">
      {/* Market Sizes */}
      <div className="grid gap-4 sm:grid-cols-3">
        {marketCards.map((card) => {
          const Icon = card.icon
          const conf = card.data?.confidence ?? 0
          return (
            <div key={card.key} className={`flex flex-col rounded-2xl border ${card.border} bg-white p-5 shadow-sm`}>
              <div className="mb-3 flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-[#52565E]">
                  {conf}% confidence
                </div>
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</h3>
              <p className="mt-1 text-2xl font-black text-[#0C0D0E]">{card.data?.value ?? 'Unknown'}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#52565E] flex-1">
                {card.data?.assumption}
              </p>
              {card.data?.source_url && (
                <a
                  href={card.data.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#1B4FFF] hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View source
                </a>
              )}
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Demand Trends */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0C0D0E]">Demand Trends</h3>
            <CopyButton text={data.demand_trends?.join('\n') || ''} label="Copy" className="h-8 min-h-[32px] px-2 py-1 text-xs" />
          </div>
          <ul className="space-y-4">
            {data.demand_trends?.map((trend, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B4FFF]/10 text-xs font-bold text-[#1B4FFF]">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed text-[#52565E]">{trend}</p>
              </li>
            )) || <p className="text-sm text-[#52565E]">No trends identified.</p>}
          </ul>
        </div>

        {/* Underserved Gaps */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0C0D0E]">Underserved Gaps</h3>
            <CopyButton text={data.underserved_gaps?.join('\n') || ''} label="Copy" className="h-8 min-h-[32px] px-2 py-1 text-xs" />
          </div>
          <div className="space-y-3">
            {data.underserved_gaps?.map((gap, i) => (
              <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/30 p-3">
                <p className="text-sm font-medium text-[#0C0D0E]">{gap}</p>
              </div>
            )) || <p className="text-sm text-[#52565E]">No gaps identified.</p>}
          </div>
        </div>
      </div>

      {/* Follow the Money */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-[#0C0D0E]">Follow the Money</h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.follow_the_money?.map((item, i) => (
            <li key={i} className="flex gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
              <p className="text-sm text-[#52565E]">{item}</p>
            </li>
          )) || <p className="text-sm text-[#52565E]">No financial flows identified.</p>}
        </ul>
      </div>
    </div>
  )
}
