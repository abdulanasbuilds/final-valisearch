import { useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime, getScoreColor, getScoreBg, getVerdictColor } from '@/lib/utils'
import type { AnalysisType, Verdict, AnalysisStatus } from '@/agents/types/analysis'

export interface AnalysisListItem {
  id: string
  overall_score: number | null
  verdict: Verdict | null
  analysis_type: AnalysisType
  created_at: string
  status: AnalysisStatus
  ideas: { idea_text: string } | null
}

export function AnalysisCard({ analysis }: { analysis: AnalysisListItem }) {
  const navigate = useNavigate()
  const score = analysis.overall_score ?? 0
  const title = analysis.ideas?.idea_text ?? 'Untitled idea'
  const isProcessing = analysis.status === 'pending' || analysis.status === 'processing'

  return (
    <button
      id={`analysis-card-${analysis.id}`}
      type="button"
      onClick={() => navigate({ to: '/workspace/$id', params: { id: analysis.id } })}
      className="flex w-full items-center gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 text-left transition-colors hover:bg-gray-50 cursor-pointer min-h-[44px]"
    >
      {/* Score badge */}
      <div
        className={cn(
          'flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border text-lg font-bold',
          isProcessing
            ? 'border-blue-200 bg-blue-50 text-blue-600'
            : getScoreBg(score)
        )}
      >
        {isProcessing ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
        ) : (
          <span className={getScoreColor(score)}>{score}</span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#0C0D0E] line-clamp-2 text-sm leading-snug">
          {title}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-[#52565E]">
          <span>{formatRelativeTime(analysis.created_at)}</span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
              analysis.analysis_type === 'full'
                ? 'bg-[#1B4FFF]/10 text-[#1B4FFF]'
                : 'bg-gray-100 text-[#52565E]'
            )}
          >
            {analysis.analysis_type === 'full' ? 'Full' : 'Quick'}
          </span>
        </div>
      </div>

      {/* Verdict + chevron */}
      <div className="flex items-center gap-2 shrink-0">
        {analysis.verdict && !isProcessing && (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
              getVerdictColor(analysis.verdict)
            )}
          >
            {analysis.verdict}
          </span>
        )}
        {isProcessing && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            Analyzing...
          </span>
        )}
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </button>
  )
}
