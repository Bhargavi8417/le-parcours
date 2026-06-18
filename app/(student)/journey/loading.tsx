import { Skeleton } from '@/components/ui/Skeleton'

export default function JourneyLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <Skeleton className="h-7 w-40 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full mb-4" />
        <div className="flex justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-2.5 w-2.5 rounded-full" />
          ))}
        </div>
      </div>

      {/* Stage cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-3.5 w-64" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full shrink-0" />
            </div>
            <div className="space-y-1.5 pl-13">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-3.5 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
