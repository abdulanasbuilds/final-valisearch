import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { Target, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react'
import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { getScoreColor, getVerdictColor } from '@/lib/utils'
import type { FullAnalysisOutput } from '@/agents/types/analysis'

interface OverviewSectionProps {
  data: FullAnalysisOutput | null
  isLoading?: boolean
}

export function OverviewSection({ data, isLoading }: OverviewSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data || !data.synthesis) return <SectionEmpty />

  const { synthesis, market, competitor, validator } = data
  const score = synthesis.overall_score ?? validator?.overall_score ?? 0
  const verdict = synthesis.verdict ?? validator?.verdict ?? 'STOP'

  // Collect top opportunities
  const opportunities = [
    ...(competitor?.gap_analysis ?? []),
    ...(market?.underserved_gaps ?? []),
  ].slice(0, 3)

  // Top risks
  const biggestRisk = synthesis.biggest_risk || 'No critical risks identified.'

  // Prepare chart data
  const chartData = [
    { name: 'Score', value: score, fill: score >= 70 ? '#16A34A' : score >= 40 ? '#D97706' : '#DC2626' }
  ]

  return (
    <div className="space-y-6">
      {/* Top 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Main Score Gauge Card */}
        <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="relative h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={10} data={chartData} startAngle={180} endAngle={-180}>
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-[#0C0D0E]">Overall Viability Score</h3>
          <p className="text-xs text-[#52565E]">Based on 12-dimension analysis</p>
        </div>

        {/* Verdict Card */}
        <div className="flex flex-col justify-center rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
            <Target className="h-5 w-5 text-gray-500" />
          </div>
          <h3 className="text-sm font-medium text-[#52565E]">Final Verdict</h3>
          <p className="mt-1 flex">
            <span className={`inline-flex rounded-md px-2 py-1 text-sm font-bold ${getVerdictColor(verdict)}`}>
              {verdict}
            </span>
          </p>
        </div>

        {/* Market Size Card */}
        <div className="flex flex-col justify-center rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <TrendingUp className="h-5 w-5 text-[#1B4FFF]" />
          </div>
          <h3 className="text-sm font-medium text-[#52565E]">Est. Addressable Market</h3>
          <p className="mt-1 text-2xl font-bold text-[#0C0D0E]">
            {market?.tam?.value ?? 'Unknown'}
          </p>
        </div>
      </div>

      {/* Two Column Layout for Summaries */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exec Summary */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-[#0C0D0E]">Executive Summary</h3>
          <div className="space-y-4">
            {synthesis.executive_summary?.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-[#52565E]">
                {paragraph}
              </p>
            )) || <p className="text-sm text-[#52565E]">Summary not available.</p>}
          </div>
        </div>

        {/* Ops and Risks */}
        <div className="flex flex-col gap-6">
          {/* Opportunities */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm flex-1">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Biggest Opportunities
            </h3>
            <ul className="space-y-3">
              {opportunities.length > 0 ? (
                opportunities.map((opp, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#52565E]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-600">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{opp}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-[#52565E]">No clear opportunities found.</li>
              )}
            </ul>
          </div>

          {/* Biggest Risk */}
          <div className="rounded-2xl border-2 border-red-100 bg-red-50/50 p-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
              <AlertTriangle className="h-4 w-4" />
              Critical Risk Factor
            </h3>
            <p className="text-sm leading-relaxed text-red-900/80">
              {biggestRisk}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sparkles(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}
