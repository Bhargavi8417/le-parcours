import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
            <Skeleton className="h-8 w-12 mb-1" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Journey tracker */}
          <SkeletonCard>
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="flex gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-1 space-y-1.5">
                  <Skeleton className="h-8 rounded-full" />
                  <Skeleton className="h-3 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Recent bookings */}
          <SkeletonCard>
            <Skeleton className="h-5 w-36 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        <div className="space-y-6">
          {/* Document progress */}
          <SkeletonCard>
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-3 w-full rounded-full mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3.5 w-12" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  )
}
