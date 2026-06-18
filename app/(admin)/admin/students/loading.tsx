import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminStudentsLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-7 w-36 mb-2" />
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex gap-8">
          {['Student', 'Nationality', 'University', 'Stage', 'Joined'].map((h) => (
            <Skeleton key={h} className="h-4 w-20" />
          ))}
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-5 py-3.5">
              <div className="flex items-center gap-3 w-44">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
