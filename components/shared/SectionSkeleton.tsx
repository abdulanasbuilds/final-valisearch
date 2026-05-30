export function SectionSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-1/3 rounded-md bg-gray-200" />
        <div className="h-4 w-1/2 rounded-md bg-gray-200" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-200" />
        ))}
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="h-5 w-5 shrink-0 rounded bg-gray-200" />
            <div className="h-5 flex-1 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
