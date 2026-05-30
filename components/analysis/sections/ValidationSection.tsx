import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { getScoreColor, getScoreBg, getVerdictColor } from '@/lib/utils'
import type { ValidatorOutput } from '@/agents/types/analysis'

interface ValidationSectionProps {
  data: ValidatorOutput | null
  isLoading?: boolean
}

export function ValidationSection({ data, isLoading }: ValidationSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  const dimensions = [
    { key: 'market', label: 'Market Demand', score: data.dimensions?.market ?? 0 },
    { key: 'product', label: 'Product Feasibility', score: data.dimensions?.product ?? 0 },
    { key: 'competition', label: 'Competitive Landscape', score: data.dimensions?.competition ?? 0 },
    { key: 'growth', label: 'Growth Potential', score: data.dimensions?.growth ?? 0 },
    { key: 'monetization', label: 'Monetization', score: data.dimensions?.monetization ?? 0 },
    { key: 'execution', label: 'Execution Risk', score: data.dimensions?.execution ?? 0 },
  ]

  const getBarColor = (score: number) => {
    if (score >= 70) return 'bg-[#16A34A]'
    if (score >= 40) return 'bg-[#D97706]'
    return 'bg-[#DC2626]'
  }

  return (
    <div className="space-y-8">
      {/* Grade and Verdict Hero */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Grade */}
        <div className="flex shrink-0 flex-col items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm sm:w-48">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${getScoreBg(data.overall_score)}`}>
            <span className={`text-4xl font-black ${getScoreColor(data.overall_score)}`}>
              {data.grade || 'N/A'}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold text-[#0C0D0E]">Overall Grade</p>
          <p className="text-xs text-[#52565E]">Score: {data.overall_score}/100</p>
        </div>

        {/* Verdict Box */}
        <div className={`flex flex-1 flex-col justify-center rounded-3xl p-8 ${getVerdictColor(data.verdict).replace('text-', 'text-opacity-0 text-').replace('bg-', 'bg-opacity-20 bg-')}`}>
           <h3 className="text-sm font-bold tracking-wider uppercase opacity-70">Final Verdict</h3>
           <p className={`mt-2 text-3xl font-black`}>{data.verdict}</p>
           <p className="mt-4 text-sm font-medium opacity-90 leading-relaxed">
             Based on the validation metrics, this idea is {data.verdict === 'GO' ? 'highly viable' : data.verdict === 'GO WITH CONDITIONS' ? 'conditionally viable with adjustments' : data.verdict === 'PIVOT' ? 'requires a significant pivot to succeed' : 'not recommended for pursuit'}. Focus on the individual dimensions below to understand the strengths and weaknesses.
           </p>
        </div>
      </div>

      {/* Dimensions Bars */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-[#0C0D0E]">Validation Dimensions</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {dimensions.map((dim) => (
            <div key={dim.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#0C0D0E]">{dim.label}</span>
                <span className={`text-xs font-bold ${getScoreColor(dim.score)}`}>
                  {dim.score}/100
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getBarColor(dim.score)}`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
