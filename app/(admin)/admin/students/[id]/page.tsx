import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { formatDate, STAGE_LABELS } from '@/lib/utils'
import { updateJourneyProgress } from '@/lib/actions/admin-actions'

const STAGES = [
  { key: 'application',    label: 'Application',   icon: '📋' },
  { key: 'campus_france',  label: 'Campus France', icon: '🏫' },
  { key: 'visa',           label: 'Visa',          icon: '🛂' },
  { key: 'arrival',        label: 'Arrival',       icon: '✈️' },
  { key: 'settlement',     label: 'Settlement',    icon: '🏠' },
] as const

const STATUS_OPTIONS = ['not_started', 'in_progress', 'completed'] as const

export default async function AdminStudentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createAdminClient()

  const [{ data: student }, { data: journey }, { data: bookings }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('journey_progress').select('*').eq('student_id', id).single(),
    supabase
      .from('bookings')
      .select('id, status, created_at, service:services(title)')
      .eq('student_id', id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  if (!student) notFound()

  const stageNotes = (journey?.stage_notes ?? {}) as Record<string, string>

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/students" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
          ← Students
        </Link>
      </div>

      {sp.success && (
        <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          Journey progress updated successfully.
        </div>
      )}

      {/* Student profile card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
            {(student.full_name ?? student.email ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{student.full_name ?? '—'}</h1>
            <p className="text-sm text-slate-500">{student.email}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Nationality</p>
            <p className="text-slate-700 font-medium">{student.nationality ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">University</p>
            <p className="text-slate-700 font-medium">{student.university ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Joined</p>
            <p className="text-slate-700 font-medium">{formatDate(student.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Journey editor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-5">Edit Journey Progress</h2>
        <form action={updateJourneyProgress} className="space-y-5">
          <input type="hidden" name="student_id" value={id} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current active stage</label>
            <select
              name="current_stage"
              defaultValue={journey?.current_stage ?? 'application'}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {STAGES.map((s) => {
              const statusKey = `${s.key}_status` as keyof typeof journey
              const currentStatus = journey?.[statusKey] ?? 'not_started'
              return (
                <div key={s.key} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{s.icon}</span>
                    <h3 className="font-medium text-slate-900">{s.label}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Status</label>
                      <select
                        name={`${s.key}_status`}
                        defaultValue={currentStatus as string}
                        className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Admin note (shown to student)</label>
                      <input
                        name={`note_${s.key}`}
                        type="text"
                        defaultValue={stageNotes[s.key] ?? ''}
                        placeholder="Optional note…"
                        className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Save journey progress
          </button>
        </form>
      </div>

      {/* Recent bookings */}
      {bookings && bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Bookings</h2>
          <div className="space-y-2">
            {bookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <p className="text-slate-700">{(b.service as any)?.title ?? 'Unknown service'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{formatDate(b.created_at)}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    b.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
