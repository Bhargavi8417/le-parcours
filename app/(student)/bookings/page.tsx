import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, BOOKING_STATUS_COLORS, STAGE_COLORS } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import CancelBookingButton from '@/components/student/CancelBookingButton'

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const [params, t, ts] = await Promise.all([
    searchParams,
    getTranslations('bookings'),
    getTranslations('stages'),
  ])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, service:services(title, title_fr, stage, price, duration_minutes)')
    .eq('student_id', user!.id)
    .order('created_at', { ascending: false })

  const active = bookings?.filter((b: any) => !['completed', 'cancelled'].includes(b.status)) ?? []
  const past   = bookings?.filter((b: any) =>  ['completed', 'cancelled'].includes(b.status)) ?? []

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
          <p className="text-slate-500 mt-1">{t('subtitle')}</p>
        </div>
        <Link
          href="/services"
          className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors"
        >
          {t('bookService')}
        </Link>
      </div>

      {params.success && (
        <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
          {t('successMessage')}
        </div>
      )}

      {!bookings?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-4xl mb-3">⊡</p>
          <p className="font-semibold text-slate-900">{t('noBookings')}</p>
          <p className="text-slate-500 text-sm mt-1 mb-5">{t('noBookingsDesc')}</p>
          <Link href="/services" className="inline-flex text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors">
            {t('browseServices')}
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{t('active')}</h2>
              <div className="space-y-3">
                {active.map((b: any) => (
                  <BookingCard key={b.id} booking={b} showCancel tStages={ts} tBookings={t} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{t('history')}</h2>
              <div className="space-y-3">
                {past.map((b: any) => (
                  <BookingCard key={b.id} booking={b} showCancel={false} tStages={ts} tBookings={t} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking: b, showCancel, tStages, tBookings }: {
  booking: any
  showCancel: boolean
  tStages: any
  tBookings: any
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-slate-900">{b.service?.title}</h3>
            {b.service?.stage && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[b.service.stage]}`}>
                {tStages(b.service.stage)}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">{tBookings('booked')} {formatDateTime(b.created_at)}</p>
          {b.scheduled_at && (
            <p className="text-sm text-slate-600 mt-2">
              <span className="font-medium">{tBookings('scheduled')}:</span> {formatDateTime(b.scheduled_at)}
            </p>
          )}
          {b.flight_number && (
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-medium">{tBookings('flight')}:</span> {b.flight_number}
            </p>
          )}
          {b.pickup_location && (
            <p className="text-sm text-slate-600 mt-0.5">
              <span className="font-medium">{tBookings('pickup')}:</span> {b.pickup_location}
            </p>
          )}
          {b.notes && <p className="text-sm text-slate-500 mt-2 italic">&ldquo;{b.notes}&rdquo;</p>}
          {b.admin_notes && (
            <div className="mt-3 bg-blue-50 rounded-xl px-4 py-2.5 border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 mb-0.5">{tBookings('noteFromConsultant')}</p>
              <p className="text-sm text-blue-800">{b.admin_notes}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <Badge className={BOOKING_STATUS_COLORS[b.status]}>{b.status}</Badge>
          {showCancel && b.status === 'pending' && <CancelBookingButton bookingId={b.id} />}
        </div>
      </div>
    </div>
  )
}
