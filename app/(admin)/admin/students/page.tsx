import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { formatDate, STAGE_LABELS } from '@/lib/utils'

export default async function AdminStudentsPage() {
  const supabase = await createAdminClient()

  const { data: students } = await supabase
    .from('profiles')
    .select('*, journey:journey_progress(current_stage)')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-500 mt-1">{students?.length ?? 0} registered student{(students?.length ?? 0) !== 1 ? 's' : ''}.</p>
      </div>

      {!students?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-2xl mb-2">👥</p>
          <p className="text-slate-500 text-sm">No students registered yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Student</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Nationality</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">University</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Current Stage</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s: any) => {
                  const journey = Array.isArray(s.journey) ? s.journey[0] : s.journey
                  const stage = journey?.current_stage
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
                            {(s.full_name ?? s.email ?? 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{s.full_name ?? '—'}</p>
                            <p className="text-xs text-slate-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{s.nationality ?? '—'}</td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-[180px] truncate">{s.university ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        {stage ? (
                          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                            {STAGE_LABELS[stage] ?? stage}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{formatDate(s.created_at)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/students/${s.id}`}
                          className="text-xs font-medium text-blue-600 hover:underline whitespace-nowrap"
                        >
                          Manage journey →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
