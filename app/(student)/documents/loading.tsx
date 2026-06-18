import { Skeleton } from '@/components/ui/Skeleton'

export default function DocumentsLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Skeleton className="h-7 w-40 mb-2" />
      <Skeleton className="h-4 w-80 mb-8" />

      {Array.from({ length: 3 }).map((_, s) => (
        <div key={s} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full mb-4" />
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-5 w-5 rounded shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-xl shrink-0 ml-3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
