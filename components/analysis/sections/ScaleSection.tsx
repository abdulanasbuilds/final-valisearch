import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { Target, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react'
import type { ScaleOutput } from '@/agents/types/analysis'

interface ScaleSectionProps {
  data: ScaleOutput | null
  isLoading?: boolean
}

export function ScaleSection({ data, isLoading }: ScaleSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  return (
    <div className="space-y-8">
      {/* Target Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B4FFF] flex items-center gap-2">
            <Target className="h-4 w-4" /> Scale Target
          </h2>
          <p className="mt-2 text-3xl font-black text-[#0C0D0E] sm:text-4xl">
            {data.target_mrr} MRR
          </p>
          <p className="mt-1 text-sm font-medium text-[#52565E]">Timeline: {data.timeframe}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Financial Projections */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Revenue Projections
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-sm font-medium text-[#52565E]">Month 3</span>
                <span className="text-lg font-bold text-[#0C0D0E]">{data.revenue_projections?.m3 || '$0'}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-sm font-medium text-[#52565E]">Month 6</span>
                <span className="text-lg font-bold text-[#0C0D0E]">{data.revenue_projections?.m6 || '$0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#52565E]">Month 12</span>
                <span className="text-xl font-black text-green-600">{data.revenue_projections?.m12 || '$0'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
              <AlertTriangle className="h-4 w-4" />
              Biggest Scale Risk
            </h3>
            <p className="text-sm font-medium text-red-900 leading-relaxed">
              {data.biggest_risk}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-green-100 bg-green-50 p-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-green-800">
              <ShieldCheck className="h-4 w-4" />
              Unfair Advantage
            </h3>
            <p className="text-sm font-medium text-green-900 leading-relaxed">
              {data.unfair_advantage}
            </p>
          </div>
        </div>

        {/* 4-Phase Vertical Timeline */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-8 text-xl font-bold text-[#0C0D0E]">Scale Roadmap</h3>
          
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-purple-200 before:to-green-200">
            {data.phases?.map((phase, i) => {
              const isEven = i % 2 === 0
              const colors = [
                'bg-blue-100 text-[#1B4FFF] border-blue-200',
                'bg-purple-100 text-purple-600 border-purple-200',
                'bg-amber-100 text-amber-600 border-amber-200',
                'bg-green-100 text-green-600 border-green-200',
              ]
              const theme = colors[i % 4]

              return (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${theme} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                  
                  {/* Card */}
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-shadow hover:shadow-md ${isEven ? '' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{phase.name}</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#0C0D0E] mb-2">{phase.focus}</h4>
                    <div className="rounded-lg bg-gray-50 p-3 mt-4 border border-gray-100">
                      <p className="text-sm font-medium text-[#1B4FFF]">Target: {phase.metrics}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
