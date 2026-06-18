import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminDashboardLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-7 w-40 mb-2" />
      <Skeleton className="h-4 w-64 mb-10" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
            <Skeleton className="h-1 w-9 mb-3" />
            <Skeleton className="h-9 w-12 mb-1" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="bg-white rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-5 w-20 rounded-full" />
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
