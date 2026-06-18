import { Skeleton } from '@/components/ui/Skeleton'

export default function GuidesLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-7 w-40 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full shrink-0" />
        ))}
      </div>

      {/* Article grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <Skeleton className="h-40 rounded-none" />
            <div className="p-5">
              <Skeleton className="h-5 w-20 rounded-full mb-3" />
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-5 w-4/5 mb-3" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
