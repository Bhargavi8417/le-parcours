import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { formatDate, BOOKING_STATUS_COLORS, INQUIRY_STATUS_COLORS } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

export default async function AdminDashboardPage() {
  const supabase = await createAdminClient()

  const [
    { count: totalStudents },
    { count: pendingBookings },
    { count: newInquiries },
    { count: availableAccom },
    { count: publishedArticles },
    { data: recentBookings },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('accommodations').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase
      .from('bookings')
      .select('id, status, created_at, student:profiles(full_name, email), service:services(title)')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('inquiries')
      .select('id, name, email, subject, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: 'Total Students',    value: totalStudents ?? 0,     href: '/admin/students',       bar: 'bg-blue-500' },
    { label: 'Pending Bookings',  value: pendingBookings ?? 0,   href: '/admin/bookings',       bar: 'bg-amber-500' },
    { label: 'New Inquiries',     value: newInquiries ?? 0,      href: '/admin/inquiries',      bar: 'bg-violet-500' },
    { label: 'Available Rooms',   value: availableAccom ?? 0,    href: '/admin/accommodations', bar: 'bg-emerald-500' },
    { label: 'Published Guides',  value: publishedArticles ?? 0, href: '/admin/articles',       bar: 'bg-rose-500' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1">Your relocation hub at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
            <div className={`w-9 h-1 ${s.bar} rounded-full mb-3`} />
            <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500 mt-0.5 group-hover:text-slate-700 transition-colors">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {!recentBookings?.length ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">No bookings yet</p>
            ) : (
              recentBookings.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {(b.student as any)?.full_name ?? (b.student as any)?.email ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{(b.service as any)?.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs text-slate-400">{formatDate(b.created_at)}</span>
                    <Badge className={BOOKING_STATUS_COLORS[b.status]}>{b.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {!recentInquiries?.length ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">No inquiries yet</p>
            ) : (
              recentInquiries.map((inq: any) => (
                <div key={inq.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{inq.name}</p>
                    <p className="text-xs text-slate-400 truncate">{inq.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs text-slate-400">{formatDate(inq.created_at)}</span>
                    <Badge className={INQUIRY_STATUS_COLORS[inq.status]}>{inq.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/articles/new',    label: 'Write new guide',        icon: '📝' },
          { href: '/admin/accommodations',  label: 'Manage accommodations',  icon: '⌂' },
          { href: '/admin/services',        label: 'Edit services',          icon: '✦' },
        ].map((a) => (
          <Link key={a.href} href={a.href}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 hover:shadow-md transition-shadow text-sm font-medium text-slate-700 hover:text-blue-600">
            <span className="text-xl">{a.icon}</span>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
