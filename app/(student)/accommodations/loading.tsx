import { Skeleton } from '@/components/ui/Skeleton'

export default function AccommodationsLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl">
        <Skeleton className="h-7 w-56 mb-2" />
        <Skeleton className="h-4 w-72 mb-8" />

        {/* Anchor nav */}
        <div className="flex gap-2 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>

        {/* Location sections */}
        {Array.from({ length: 2 }).map((_, s) => (
          <div key={s} className="mb-16">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Skeleton className="h-6 w-44 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <Skeleton className="h-48 rounded-none" />
                  <div className="p-5">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-3.5 w-1/2 mb-3" />
                    <Skeleton className="h-3.5 w-full mb-1" />
                    <Skeleton className="h-3.5 w-5/6 mb-4" />
                    <Skeleton className="h-5 w-24 mb-4" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
