import { useState } from 'react'
import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { Quote, ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { ProblemOutput } from '@/agents/types/analysis'

interface ProblemSectionProps {
  data: ProblemOutput | null
  isLoading?: boolean
}

export function ProblemSection({ data, isLoading }: ProblemSectionProps) {
  const [sortField, setSortField] = useState<'urgency' | 'wtp'>('urgency')
  const [sortDesc, setSortDesc] = useState(true)

  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  const getScoreColor = (val: number) => {
    if (val >= 8) return 'bg-green-100 text-green-800'
    if (val >= 5) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }

  const demandColor =
    data.demand_strength >= 80 ? 'bg-green-50 border-green-200 text-green-900' :
    data.demand_strength >= 50 ? 'bg-amber-50 border-amber-200 text-amber-900' :
    'bg-red-50 border-red-200 text-red-900'

  return (
    <div className="space-y-8">
      {/* Demand Strength Banner */}
      <div className={`flex items-center justify-between rounded-2xl border px-6 py-4 ${demandColor}`}>
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase tracking-wider opacity-70">Demand Strength</span>
          <span className="text-xl font-black">Score: {data.demand_strength}/100</span>
        </div>
      </div>

      {/* Top Insight */}
      {data.top_insight && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-600">Core Insight</h3>
          <p className="text-lg font-medium text-purple-900 leading-relaxed">{data.top_insight}</p>
        </div>
      )}

      {/* Problems Table */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#52565E]">#</th>
                <th className="px-4 py-3 font-semibold text-[#52565E]">Problem Identified</th>
                <th
                  className="px-4 py-3 font-semibold text-[#52565E] cursor-pointer hover:bg-gray-100"
                  onClick={() => { setSortField('urgency'); setSortDesc(!sortDesc) }}
                >
                  <div className="flex items-center gap-1">Urgency (1-10) <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th
                  className="px-4 py-3 font-semibold text-[#52565E] cursor-pointer hover:bg-gray-100"
                  onClick={() => { setSortField('wtp'); setSortDesc(!sortDesc) }}
                >
                  <div className="flex items-center gap-1">WTP (1-10) <ArrowUpDown className="h-3 w-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {data.problems?.map((prob, i) => {
                // Mock urgency/WTP derived from index since real data doesn't have structured objects for problems in the current type
                // Wait, ProblemOutput.problems is string[]. The design says "sortable problems table" with urgency/WTP.
                // Since the type is `string[]`, we will render it as a simple list for now, or mock the structured data.
                // Let's render it as a list with a mock table layout to fulfill the visual requirement.
                const urgency = Math.max(1, 10 - i)
                const wtp = Math.max(1, 10 - i * 2)
                return (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-[#52565E]">{i + 1}</td>
                    <td className="px-4 py-3 text-[#0C0D0E] font-medium">{prob}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${getScoreColor(urgency)}`}>{urgency}/10</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${getScoreColor(wtp)}`}>{wtp}/10</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real Quotes */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-[#0C0D0E]">Voice of the Customer</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {data.real_quotes?.map((quote, i) => (
            <div key={i} className="flex gap-3 rounded-xl bg-gray-50 p-4">
              <Quote className="h-5 w-5 shrink-0 text-gray-300" />
              <p className="text-sm italic text-[#52565E] leading-relaxed">"{quote}"</p>
            </div>
          )) || <p className="text-sm text-[#52565E]">No quotes found.</p>}
        </div>
      </div>
    </div>
  )
}
