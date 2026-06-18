import { createAdminClient } from '@/lib/supabase/server'
import { formatDate, formatDateTime, BOOKING_STATUS_COLORS } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import BookingActions from '@/components/admin/BookingActions'

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; success?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createAdminClient()

  let query = supabase
    .from('bookings')
    .select('*, student:profiles(id, full_name, email), service:services(title, stage, price)')
    .order('created_at', { ascending: false })

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  const { data: bookings } = await query

  const tabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled']
  const active = params.status ?? 'all'

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="text-slate-500 mt-1">Manage all student service bookings.</p>
      </div>

      {params.success && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          Updated successfully.
        </div>
      )}
      {params.error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {decodeURIComponent(params.error)}
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <a
            key={tab}
            href={`/admin/bookings${tab === 'all' ? '' : `?status=${tab}`}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
              active === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </a>
        ))}
      </div>

      {!bookings?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-2xl mb-2">⊡</p>
          <p className="text-slate-500 text-sm">No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b: any) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-slate-900">
                      {(b.student as any)?.full_name ?? (b.student as any)?.email ?? 'Unknown'}
                    </p>
                    <Badge className={BOOKING_STATUS_COLORS[b.status]}>{b.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-0.5">
                    <span className="font-medium">Service:</span> {(b.service as any)?.title}
                    {(b.service as any)?.price && (
                      <span className="text-slate-400"> · €{(b.service as any).price}</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">
                    Booked {formatDate(b.created_at)}
                    {b.scheduled_at && ` · Scheduled: ${formatDateTime(b.scheduled_at)}`}
                  </p>
                  {(b.student as any)?.email && (
                    <p className="text-xs text-slate-400 mt-0.5">{(b.student as any).email}</p>
                  )}
                  {b.flight_number && (
                    <p className="text-sm text-slate-600 mt-1.5">
                      <span className="font-medium">Flight:</span> {b.flight_number}
                      {b.pickup_location && ` · Pickup: ${b.pickup_location}`}
                    </p>
                  )}
                  {b.notes && (
                    <p className="text-sm text-slate-500 mt-1.5 italic">&ldquo;{b.notes}&rdquo;</p>
                  )}
                  {b.admin_notes && (
                    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                      <p className="text-xs font-medium text-blue-600 mb-0.5">Admin note</p>
                      <p className="text-sm text-blue-800">{b.admin_notes}</p>
                    </div>
                  )}
                </div>
                <BookingActions
                  bookingId={b.id}
                  currentStatus={b.status}
                  currentNotes={b.admin_notes ?? ''}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
