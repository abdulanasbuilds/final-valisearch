import { FileWarning } from 'lucide-react'

export function SectionEmpty() {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-gray-50/50 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <FileWarning className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#0C0D0E]">
        No data available
      </h3>
      <p className="mt-1 max-w-sm text-sm text-[#52565E]">
        This section couldn't be generated for this analysis. This sometimes happens if the agent encountered an error or the idea was too brief.
      </p>
    </div>
  )
}
