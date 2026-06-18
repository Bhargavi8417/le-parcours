import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-slate-200 rounded-xl', className)} />
}

export function SkeletonText({ lines = 2, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200 p-5', className)}>
      {children ?? (
        <>
          <Skeleton className="h-5 w-1/2 mb-3" />
          <SkeletonText lines={3} />
        </>
      )}
    </div>
  )
}
