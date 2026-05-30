export function AnalysisCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 animate-pulse">
      {/* Score badge skeleton */}
      <div className="h-[50px] w-[50px] shrink-0 rounded-xl bg-gray-200" />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-5 w-14 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Right side skeleton */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-6 w-12 rounded-full bg-gray-200" />
        <div className="h-5 w-5 rounded bg-gray-200" />
      </div>
    </div>
  )
}
