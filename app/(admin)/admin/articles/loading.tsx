import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminArticlesLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-7 w-36 mb-2" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex gap-8">
          {['Title', 'Stage', 'Published', 'Updated'].map((h) => (
            <Skeleton key={h} className="h-4 w-20" />
          ))}
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="flex items-center gap-8 shrink-0">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-10 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-10 rounded-lg" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
