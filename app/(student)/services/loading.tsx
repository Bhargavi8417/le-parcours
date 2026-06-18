import { Skeleton } from '@/components/ui/Skeleton'

export default function ServicesLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-7 w-40 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      {/* Stage tabs */}
      <div className="flex gap-2 mb-10 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-32 shrink-0" />
        ))}
      </div>

      {/* Stage sections */}
      {Array.from({ length: 2 }).map((_, s) => (
        <div key={s} className="mb-12">
          <Skeleton className="h-6 w-36 rounded-full mb-6" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-3.5 w-full mb-1" />
                <Skeleton className="h-3.5 w-5/6 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
