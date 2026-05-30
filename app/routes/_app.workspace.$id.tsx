import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { ArrowLeft, Download, RotateCcw, Loader2 } from 'lucide-react'
import { getAnalysisById } from '@/lib/server/workspace'
import { getVerdictColor, getScoreColor, getScoreBg } from '@/lib/utils'

import { OverviewSection } from '@/components/analysis/sections/OverviewSection'
import { ValidationSection } from '@/components/analysis/sections/ValidationSection'
import { MarketSection } from '@/components/analysis/sections/MarketSection'
import { ProblemSection } from '@/components/analysis/sections/ProblemSection'
import { OfferSection } from '@/components/analysis/sections/OfferSection'
import { CompetitorSection } from '@/components/analysis/sections/CompetitorSection'
import { GrowthSection } from '@/components/analysis/sections/GrowthSection'
import { DistributionSection } from '@/components/analysis/sections/DistributionSection'
import { ContentSection } from '@/components/analysis/sections/ContentSection'
import { BrandSection } from '@/components/analysis/sections/BrandSection'
import { ScaleSection } from '@/components/analysis/sections/ScaleSection'
import { ProductSection } from '@/components/analysis/sections/ProductSection'
import { SynthesisSection } from '@/components/analysis/sections/SynthesisSection'
import { ChatSection } from '@/components/analysis/ChatSection'
import { SectionSidebar, MobileTabStrip } from '@/components/analysis/SectionSidebar'

export const Route = createFileRoute('/_app/workspace/$id')({
  validateSearch: (search: Record<string, unknown>): { from?: string | undefined } => ({
    from: typeof search.from === 'string' ? search.from : undefined,
  }),
  loader: async ({ params }) => {
    return getAnalysisById({ data: { analysisId: params.id } })
  },
  component: DashboardPage,
})

const NAV_GROUPS = [
  {
    label: 'Intelligence',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'validation', label: 'Validation Score' },
      { id: 'market', label: 'Market Intelligence' },
      { id: 'problem', label: 'Problem Landscape' },
      { id: 'offer', label: 'Offer Builder' },
      { id: 'competitor', label: 'Competitive Intel' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { id: 'growth', label: 'Growth Playbook' },
      { id: 'distribution', label: 'Distribution' },
      { id: 'content', label: 'Content Engine' },
    ],
  },
  {
    label: 'Brand & Scale',
    items: [
      { id: 'brand', label: 'Brand Identity' },
      { id: 'scale', label: 'Scale Roadmap' },
      { id: 'product', label: 'Product Blueprint' },
    ],
  },
  {
    label: 'Synthesis',
    items: [{ id: 'synthesis', label: 'Executive Summary' }],
  },
]

function DashboardPage() {
  const analysis = Route.useLoaderData()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  const title = analysis.ideas?.idea_text || 'Untitled idea'
  const truncatedTitle = title.length > 50 ? title.substring(0, 50) + '...' : title
  const verdict = analysis.verdict
  const resultJson = analysis.result_json || {}
  const isLoading = analysis.status === 'pending' || analysis.status === 'processing'

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection data={resultJson} isLoading={isLoading} />
      case 'validation':
        return <ValidationSection data={resultJson.validator} isLoading={isLoading} />
      case 'market':
        return <MarketSection data={resultJson.market} isLoading={isLoading} />
      case 'problem':
        return <ProblemSection data={resultJson.problem} isLoading={isLoading} />
      case 'offer':
        return <OfferSection data={resultJson.offer} isLoading={isLoading} />
      case 'competitor':
        return <CompetitorSection data={resultJson.competitor} isLoading={isLoading} />
      case 'growth':
        return <GrowthSection data={resultJson.growth} isLoading={isLoading} />
      case 'distribution':
        return <DistributionSection data={resultJson.distribution} isLoading={isLoading} />
      case 'content':
        return <ContentSection data={resultJson.content} isLoading={isLoading} />
      case 'brand':
        return <BrandSection data={resultJson.brand} isLoading={isLoading} />
      case 'scale':
        return <ScaleSection data={resultJson.scale} isLoading={isLoading} />
      case 'product':
        return <ProductSection data={resultJson.product} isLoading={isLoading} analysisId={analysis.id} />
      case 'synthesis':
        return <SynthesisSection data={resultJson.synthesis} isLoading={isLoading} />
      default:
        return <OverviewSection data={resultJson} isLoading={isLoading} />
    }
  }

  const handleExportPDF = async () => {
    setExporting('pdf')
    try {
      const { default: html2canvas } = await import('html2canvas')
      const el = reportRef.current
      if (!el) return
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')
      const printWindow = window.open('', '_blank')
      if (!printWindow) return
      printWindow.document.write(`
        <html><head><title>ValiSearch Report</title>
        <style>body { margin: 0; padding: 20px; font-family: Inter, sans-serif; } img { width: 100%; }</style>
        </head><body><img src="${imgData}" onload="window.print()" /></body></html>
      `)
      printWindow.document.close()
    } finally {
      setExporting(null)
    }
  }

  const handleExportDOCX = async () => {
    setExporting('docx')
    try {
      const content = reportRef.current?.innerText ?? 'No content'
      const blob = new Blob([content], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `valisearch-report-${analysis.id?.slice(0, 8)}.doc`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col bg-white">
      {/* Top Bar (Sticky) */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 sm:px-6">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/workspace"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[#52565E] transition-colors hover:text-[#0C0D0E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <h1 className="truncate text-sm font-semibold text-[#0C0D0E]">
            {truncatedTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {verdict && (
            <span
              className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getVerdictColor(
                verdict
              )}`}
            >
              {verdict}
            </span>
          )}

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                const menu = document.getElementById('export-menu')
                if (menu) menu.classList.toggle('hidden')
              }}
              disabled={!!exporting}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export'}</span>
            </button>
            <div id="export-menu" className="hidden absolute right-0 top-full mt-1 z-20 w-40 rounded-xl border border-[#E5E7EB] bg-white py-2 shadow-lg">
              <button
                onClick={() => { document.getElementById('export-menu')?.classList.add('hidden'); handleExportPDF() }}
                className="flex min-h-[44px] w-full items-center gap-3 px-4 text-sm text-[#52565E] transition-colors hover:bg-gray-50"
              >
                Export as PDF
              </button>
              <button
                onClick={() => { document.getElementById('export-menu')?.classList.add('hidden'); handleExportDOCX() }}
                className="flex min-h-[44px] w-full items-center gap-3 px-4 text-sm text-[#52565E] transition-colors hover:bg-gray-50"
              >
                Export as DOCX
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate({ to: '/workspace/new' })}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#1B4FFF] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6]"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Re-analyze</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <SectionSidebar groups={NAV_GROUPS} activeSection={activeSection} onSectionChange={setActiveSection} />

        <main className="flex flex-1 flex-col overflow-hidden">
          <MobileTabStrip items={NAV_GROUPS.flatMap((g) => g.items)} activeSection={activeSection} onSectionChange={setActiveSection} />

          <div ref={reportRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F9FAFB]">
            <div className="mx-auto max-w-5xl">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>

      {/* AI Co-founder Chat */}
      {resultJson.synthesis && (
        <ChatSection analysisId={analysis.id} />
      )}
    </div>
  )
}
