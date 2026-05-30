import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { CopyButton } from '@/components/shared/CopyButton'
import { MessageSquarePlus, Share, CalendarDays, Zap } from 'lucide-react'
import type { ContentOutput } from '@/agents/types/analysis'

interface ContentSectionProps {
  data: ContentOutput | null
  isLoading?: boolean
}

export function ContentSection({ data, isLoading }: ContentSectionProps) {
  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  const getTriggerColor = (trigger: string) => {
    switch (trigger.toLowerCase()) {
      case 'curiosity': return 'bg-purple-100 text-purple-700'
      case 'fear': return 'bg-red-100 text-red-700'
      case 'desire': return 'bg-green-100 text-green-700'
      case 'status': return 'bg-blue-100 text-blue-700'
      case 'pain': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      {/* Hook Bank */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-bold text-[#0C0D0E]">
            <Zap className="h-6 w-6 text-amber-500" />
            Viral Hook Bank
          </h3>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#52565E]">
            {data.hooks?.length || 0} hooks generated
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {data.hooks?.map((hook, i) => (
            <div key={i} className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 p-5 transition-colors hover:border-[#1B4FFF]/30 hover:bg-blue-50/10">
              <div>
                <span className={`mb-3 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTriggerColor(hook.trigger_type)}`}>
                  {hook.trigger_type}
                </span>
                <p className="text-base font-medium text-[#0C0D0E] leading-relaxed">"{hook.text}"</p>
              </div>
              <div className="mt-4 flex justify-end">
                <CopyButton text={hook.text} label="Copy hook" className="h-8 min-h-[32px] px-3 py-1 text-xs bg-white border border-[#E5E7EB] shadow-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Posting System */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
            <CalendarDays className="h-5 w-5 text-[#1B4FFF]" />
            Weekly Posting System
          </h3>
          <div className="space-y-3">
            {data.weekly_posting_system?.map((post, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-100 text-xs font-bold text-[#1B4FFF]">
                  D{i + 1}
                </div>
                <p className="text-sm font-medium text-[#52565E] pt-0.5">{post}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Shareability Audit */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
              <Share className="h-5 w-5 text-green-500" />
              Shareability Audit
            </h3>
            <ul className="space-y-3">
              {data.shareability_audit?.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#52565E]">
                  <span className="font-bold text-green-600 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Formats */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#0C0D0E]">Top Content Formats</h3>
            <div className="flex flex-wrap gap-2">
              {data.content_formats?.map((format, i) => (
                <span key={i} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-[#0C0D0E]">
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* First Week Content */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-900">
          <MessageSquarePlus className="h-5 w-5 text-[#1B4FFF]" />
          First Week Content Drafts
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {data.first_week_content?.map((content, i) => (
            <div key={i} className="flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm">
              <p className="whitespace-pre-wrap text-sm text-[#0C0D0E] leading-relaxed">{content}</p>
              <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                <CopyButton text={content} label="Copy post" className="bg-gray-50 border border-[#E5E7EB] h-8 text-xs py-1 px-3 hover:bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
