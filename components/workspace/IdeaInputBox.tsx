import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Sparkles, Zap, Loader2 } from 'lucide-react'
import { submitAnalysis } from '@/lib/server/analyze'
import type { AnalysisType } from '@/agents/types/analysis'

interface IdeaInputBoxProps {
  credits: number
  onUpgradeNeeded: () => void
}

export function IdeaInputBox({ credits, onUpgradeNeeded }: IdeaInputBoxProps) {
  const [idea, setIdea] = useState('')
  const [submitting, setSubmitting] = useState<AnalysisType | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charCount = idea.length
  const maxChars = 2000
  const canSubmit = idea.trim().length >= 10 && !submitting

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = 6 * 24 // ~6 rows
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }, [idea])

  async function handleSubmit(analysisType: AnalysisType) {
    setError('')

    const cost = analysisType === 'full' ? 2 : 1
    if (credits < cost) {
      onUpgradeNeeded()
      return
    }

    setSubmitting(analysisType)
    try {
      const result = await submitAnalysis({
        data: { idea: idea.trim(), analysisType },
      })
      navigate({
        to: '/workspace/new',
        search: { analysisId: result.analysisId, idea: idea.trim() },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      if (msg === 'INSUFFICIENT_CREDITS') {
        onUpgradeNeeded()
      } else if (msg === 'IDEA_TOO_SHORT') {
        setError('Your idea needs to be at least 10 characters long.')
      } else if (msg === 'RATE_LIMIT_EXCEEDED') {
        setError('You are submitting too quickly. Please wait a moment.')
      } else {
        setError('Failed to start analysis. Please try again.')
      }
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <label htmlFor="idea-input" className="block text-sm font-medium text-[#0C0D0E] mb-2">
        What's your next startup idea?
      </label>

      <textarea
        ref={textareaRef}
        id="idea-input"
        rows={3}
        maxLength={maxChars}
        placeholder="Describe your startup idea in detail — the problem, who it's for, and your proposed solution..."
        className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-gray-50/50 px-4 py-3 text-sm text-[#0C0D0E] placeholder-gray-400 transition-colors focus:border-[#1B4FFF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4FFF]/30"
        value={idea}
        onChange={(e) => setIdea(e.target.value.slice(0, maxChars))}
      />

      {/* Character counter */}
      <div className="mt-1.5 flex items-center justify-end">
        <span
          className={`text-xs tabular-nums ${
            charCount > maxChars * 0.9 ? 'text-red-500' : 'text-[#52565E]'
          }`}
        >
          {charCount} / {maxChars}
        </span>
      </div>

      {error && (
        <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[#52565E]">
          Quick: 1 credit &middot; Full: 2 credits
        </span>
        <div className="flex items-center gap-2">
          <button
            id="submit-quick"
            type="button"
            disabled={!canSubmit}
            onClick={() => handleSubmit('quick')}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#0C0D0E] transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting === 'quick' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Quick
          </button>
          <button
            id="submit-full"
            type="button"
            disabled={!canSubmit}
            onClick={() => handleSubmit('full')}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#1B4FFF] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting === 'full' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Full Report
          </button>
        </div>
      </div>
    </div>
  )
}
