import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { CopyButton } from '@/components/shared/CopyButton'
import { getVerdictColor } from '@/lib/utils'
import { Sparkles, AlertCircle, FileText } from 'lucide-react'
import type { SynthesisOutput } from '@/agents/types/analysis'

interface SynthesisSectionProps {
  data: SynthesisOutput | null
  isLoading?: boolean
}

export function SynthesisSection({ data, isLoading }: SynthesisSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  return (
    <div className="space-y-8">
      {/* Verdict Hero */}
      <div className={`flex flex-col items-center justify-center rounded-3xl p-10 text-center ${getVerdictColor(data.verdict).replace('text-', 'text-opacity-0 text-').replace('bg-', 'bg-opacity-20 bg-')}`}>
        <span className="mb-4 text-sm font-bold uppercase tracking-wider opacity-70">Executive Verdict</span>
        <h2 className="text-5xl font-black md:text-6xl">{data.verdict}</h2>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
          Overall Score: {data.overall_score}/100
        </div>
      </div>

      {data.used_fallback_data && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Partial Analysis Data</h4>
            <p className="text-sm text-amber-800 mt-1">
              Some agents failed to complete successfully or timed out. This report was synthesized using partial data and baseline assumptions. We recommend running a Re-analyze if you need complete accuracy.
            </p>
          </div>
        </div>
      )}

      {/* Executive Summary */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-bold text-[#0C0D0E]">
            <FileText className="h-6 w-6 text-[#1B4FFF]" />
            Executive Summary
          </h3>
          <CopyButton text={data.executive_summary?.join('\n\n') || ''} label="Copy Report" />
        </div>
        <div className="space-y-4">
          {data.executive_summary?.map((paragraph, i) => (
            <p key={i} className="text-base text-[#0C0D0E] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Wins */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#1B4FFF]">
            <Sparkles className="h-5 w-5" />
            Top 3 Quick Wins
          </h3>
          <div className="space-y-3">
            {data.quick_wins?.map((win, i) => (
              <div key={i} className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-[#0C0D0E]">{win}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown & Contradictions */}
        <div className="space-y-6">
          {data.critical_contradictions && data.critical_contradictions.length > 0 && (
            <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-800">
                <AlertCircle className="h-4 w-4" />
                Critical Contradictions
              </h3>
              <ul className="space-y-2">
                {data.critical_contradictions.map((contra, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-900/80">
                    <span className="font-bold shrink-0">•</span>
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#0C0D0E]">Score Breakdown</h3>
            <div className="space-y-4">
              {data.score_breakdown?.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium text-[#52565E] capitalize">{item.agent.replace('_', ' ')}</span>
                    <span className="font-bold text-[#0C0D0E]">{item.score}/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100">
                    <div 
                      className="h-full rounded-full bg-gray-400 transition-all duration-1000"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
