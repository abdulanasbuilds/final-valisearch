import { Lightbulb } from 'lucide-react'

export function EmptyWorkspace() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-gray-50/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
        <Lightbulb className="h-8 w-8 text-[#1B4FFF]" />
      </div>
      <h3 className="text-lg font-semibold text-[#0C0D0E]">
        No analyses yet
      </h3>
      <p className="mt-1 max-w-sm text-sm text-[#52565E]">
        Submit your first startup idea above and get an investor-grade
        intelligence report in under 60 seconds.
      </p>
    </div>
  )
}
