import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminBookingsLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-7 w-36 mb-2" />
      <Skeleton className="h-4 w-64 mb-6" />
      <div className="flex gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-56" />
                <Skeleton className="h-3 w-36" />
              </div>
              <div className="space-y-2 shrink-0">
                <Skeleton className="h-9 w-36 rounded-xl" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
