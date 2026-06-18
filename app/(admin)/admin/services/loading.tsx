import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminServicesLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-7 w-36 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      {Array.from({ length: 3 }).map((_, s) => (
        <div key={s} className="mb-8">
          <Skeleton className="h-6 w-32 rounded-full mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-5/6" />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Skeleton className="h-6 w-10 rounded-full" />
                  <Skeleton className="h-9 w-16 rounded-xl" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
