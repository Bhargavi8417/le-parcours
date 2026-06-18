import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminAccommodationsLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-7 w-52 mb-2" />
      <Skeleton className="h-4 w-64 mb-6" />
      <Skeleton className="h-14 w-full rounded-2xl mb-6" />
      {Array.from({ length: 2 }).map((_, s) => (
        <div key={s} className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </div>
          <div className="p-5">
            <Skeleton className="h-12 w-full rounded-xl mb-5" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-8 w-20 rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-24 rounded-lg" />
                    ))}
                  </div>
                  <Skeleton className="h-8 w-32 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
