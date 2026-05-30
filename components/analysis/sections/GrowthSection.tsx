import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { CopyButton } from '@/components/shared/CopyButton'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Zap, Calendar, TrendingUp } from 'lucide-react'
import type { GrowthOutput } from '@/agents/types/analysis'

interface GrowthSectionProps {
  data: GrowthOutput | null
  isLoading?: boolean
}

export function GrowthSection({ data, isLoading }: GrowthSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  const budgetData = data.budget_split ? [
    { name: 'Organic / Inbound', value: data.budget_split.organic_percent, color: '#1B4FFF' },
    { name: 'Paid / Outbound', value: data.budget_split.paid_percent, color: '#16A34A' },
  ] : []

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ranked Channels */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0C0D0E]">Primary Acquisition Channels</h3>
            <CopyButton text={data.channels?.join('\n') || ''} label="Copy" className="h-8 min-h-[32px] px-2 py-1 text-xs" />
          </div>
          <div className="space-y-3">
            {data.channels?.map((channel, i) => (
              <div key={i} className={`flex items-center gap-4 rounded-xl p-4 ${i === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-[#E5E7EB]'}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold ${i === 0 ? 'bg-[#1B4FFF] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {i + 1}
                </div>
                <p className={`text-sm font-medium ${i === 0 ? 'text-blue-900' : 'text-[#0C0D0E]'}`}>
                  {channel}
                </p>
                {i === 0 && <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider"><Zap className="h-3 w-3" /> Top Priority</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Budget Split */}
        <div className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-bold text-[#0C0D0E]">Budget Allocation</h3>
          <div className="relative flex-1 min-h-[200px]">
            {budgetData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">No data</div>
            )}
            {budgetData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-[#0C0D0E]">{budgetData[0]?.value}%</span>
                <span className="text-xs font-medium text-gray-500">Organic</span>
              </div>
            )}
          </div>
          {data.budget_split?.rationale && (
            <p className="mt-4 text-center text-xs text-[#52565E]">{data.budget_split.rationale}</p>
          )}
        </div>
      </div>

      {/* 4-Week Calendar */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
          <Calendar className="h-5 w-5 text-[#1B4FFF]" />
          4-Week Execution Plan
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.four_week_calendar?.map((plan, i) => (
            <div key={i} className="relative rounded-xl border border-[#E5E7EB] bg-gray-50 p-4 pt-8">
              <div className="absolute -top-3 left-4 inline-flex items-center rounded-full bg-[#0C0D0E] px-3 py-1 text-xs font-bold text-white">
                Week {i + 1}
              </div>
              <p className="text-sm font-medium text-[#52565E]">{plan}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leverage Plays */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-900">
          <TrendingUp className="h-5 w-5 text-amber-600" />
          High-Leverage Growth Plays
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {data.leverage_plays?.map((play, i) => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-sm border border-amber-100">
              <p className="text-sm font-medium text-amber-900 leading-relaxed">{play}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
