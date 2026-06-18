import { Skeleton } from '@/components/ui/Skeleton'

export default function BookingsLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      <div className="mb-2">
        <Skeleton className="h-4 w-20 mb-3" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-3.5 w-52" />
                </div>
                <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
