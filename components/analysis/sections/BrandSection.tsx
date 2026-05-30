import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { CopyButton } from '@/components/shared/CopyButton'
import { Star, MessageCircle, Palette, Copy } from 'lucide-react'
import { useState } from 'react'
import type { BrandOutput } from '@/agents/types/analysis'

interface BrandSectionProps {
  data: BrandOutput | null
  isLoading?: boolean
}

export function BrandSection({ data, isLoading }: BrandSectionProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  const copyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiedHex(hex)
      setTimeout(() => setCopiedHex(null), 2000)
    } catch (err) {
      console.error('Failed to copy color', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Name Options */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-[#0C0D0E]">Name Generation</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.name_options?.map((nameOpt, i) => (
            <div key={i} className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${nameOpt.is_recommended ? 'border-[#1B4FFF] shadow-md' : 'border-[#E5E7EB]'}`}>
              {nameOpt.is_recommended && (
                <div className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-[#1B4FFF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  <Star className="h-3 w-3 fill-white" /> Recommended
                </div>
              )}
              <div className="mb-2 flex items-center justify-between mt-1">
                <h4 className={`text-xl font-black ${nameOpt.is_recommended ? 'text-[#1B4FFF]' : 'text-[#0C0D0E]'}`}>{nameOpt.name}</h4>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">.{nameOpt.domain}</span>
              </div>
              <p className="text-sm font-medium text-[#0C0D0E]">{nameOpt.tagline}</p>
              <div className="mt-4 flex flex-1 items-end">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Tech: {nameOpt.technique}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Brand Voice */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
            <MessageCircle className="h-5 w-5 text-purple-500" />
            Brand Voice & Tone
          </h3>
          <p className="text-base font-medium text-[#0C0D0E] leading-relaxed">
            {data.brand_voice}
          </p>
        </div>

        {/* Positioning Statement */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0C0D0E]">Positioning Statement</h3>
            <CopyButton text={data.positioning_statement} label="Copy" className="h-8 min-h-[32px] px-2 py-1 text-xs" />
          </div>
          <p className="text-sm italic text-[#52565E] leading-relaxed border-l-4 border-gray-200 pl-4 py-1">
            "{data.positioning_statement}"
          </p>
        </div>
      </div>

      {/* Color Palette */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
          <Palette className="h-5 w-5 text-[#1B4FFF]" />
          Visual Identity Palette
        </h3>
        <div className="flex flex-wrap gap-4">
          {data.color_palette?.map((hex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => copyColor(hex)}
              className="group relative flex h-24 w-24 sm:h-32 sm:w-32 flex-col items-center justify-center rounded-2xl border border-gray-200 shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: hex }}
              title="Click to copy hex code"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                {copiedHex === hex ? (
                  <span className="rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">Copied!</span>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-white drop-shadow-md">
                    <Copy className="h-5 w-5" />
                    <span className="text-xs font-bold">{hex}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
