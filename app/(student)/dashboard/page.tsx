import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, BOOKING_STATUS_COLORS } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

const STAGE_ORDER = ['application', 'campus_france', 'visa', 'arrival', 'settlement'] as const
const STAGE_ICONS: Record<string, string> = {
  application: '🎓', campus_france: '📋', visa: '📄', arrival: '🛬', settlement: '🏡',
}

export default async function DashboardPage() {
  const [t, ts] = await Promise.all([
    getTranslations('dashboard'),
    getTranslations('stages'),
  ])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: journey }, { data: bookings }, { data: docTemplates }, { data: studentDocs }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user!.id).single(),
      supabase.from('journey_progress').select('*').eq('student_id', user!.id).single(),
      supabase.from('bookings').select('*, service:services(title, stage)').eq('student_id', user!.id)
        .order('created_at', { ascending: false }).limit(4),
      supabase.from('document_templates').select('id, stage'),
      supabase.from('student_documents').select('template_id, is_completed').eq('student_id', user!.id),
    ])

  const completedDocs = studentDocs?.filter((d) => d.is_completed).length ?? 0
  const totalDocs = docTemplates?.length ?? 0
  const docPct = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0
  const currentStageIndex = journey
    ? STAGE_ORDER.indexOf(journey.current_stage as typeof STAGE_ORDER[number])
    : 0

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {t('title')}, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-slate-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('statStage'), value: ts(journey?.current_stage ?? 'application'), icon: '◎' },
          { label: t('statDocuments'), value: `${completedDocs}/${totalDocs}`, icon: '☑' },
          { label: t('statBookings'), value: String(bookings?.length ?? 0), icon: '⊡' },
          { label: t('statProgress'), value: `${docPct}%`, icon: '◕' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-xl mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Journey tracker mini */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">{t('journeyTitle')}</h2>
            <Link href="/journey" className="text-sm text-blue-600 hover:underline">{t('viewDetails', { defaultValue: 'View details →' })}</Link>
          </div>
          <div className="space-y-3">
            {STAGE_ORDER.map((stage, i) => {
              const status = (journey?.[`${stage}_status` as keyof typeof journey] as string) ?? 'not_started'
              const isCurrent = i === currentStageIndex
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0
                    ${status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-400'}`}>
                    {status === 'completed' ? '✓' : STAGE_ICONS[stage]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                      {ts(stage)}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize
                    ${status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-slate-100 text-slate-400'}`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Document progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">{t('docTitle')}</h2>
            <Link href="/documents" className="text-sm text-blue-600 hover:underline">{t('viewDetails', { defaultValue: 'View checklist →' })}</Link>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">{completedDocs} of {totalDocs} completed</span>
              <span className="font-semibold text-slate-900">{docPct}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${docPct}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            {STAGE_ORDER.map((stage) => {
              const stageDocs = docTemplates?.filter((d) => d.stage === stage) ?? []
              const stageDone = studentDocs?.filter(
                (sd) => sd.is_completed && stageDocs.some((d) => d.id === sd.template_id)
              ).length ?? 0
              return (
                <div key={stage} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-medium text-slate-600 mb-1">{ts(stage)}</p>
                  <p className="text-sm font-semibold text-slate-900">{stageDone}/{stageDocs.length}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">{t('bookingsTitle')}</h2>
            <Link href="/bookings" className="text-sm text-blue-600 hover:underline">{t('viewDetails', { defaultValue: 'View all →' })}</Link>
          </div>
          {!bookings?.length ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">{t('noBookings')}</p>
              <Link href="/services" className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:underline">
                {t('browseServices')}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{b.service?.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(b.scheduled_at ?? b.created_at)}</p>
                  </div>
                  <Badge className={BOOKING_STATUS_COLORS[b.status] + ' shrink-0'}>{b.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { href: '/services', label: t('actionBookService'), icon: '✦', desc: t('actionBookDesc') },
          { href: '/documents', label: t('actionDocs'), icon: '☑', desc: t('actionDocsDesc') },
          { href: '/accommodations', label: t('actionHousing'), icon: '⌂', desc: t('actionHousingDesc') },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group">
            <div className="text-2xl mb-2">{a.icon}</div>
            <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{a.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
