import { createAdminClient } from '@/lib/supabase/server'
import { formatDate, INQUIRY_STATUS_COLORS } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { updateInquiryStatus } from '@/lib/actions/admin-actions'

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const supabase = await createAdminClient()

  let query = supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  const { data: inquiries } = await query
  const active = params.status ?? 'all'
  const tabs = ['all', 'new', 'read', 'replied']

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Inquiries</h1>
        <p className="text-slate-500 mt-1">Messages from students and visitors.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <a
            key={tab}
            href={`/admin/inquiries${tab === 'all' ? '' : `?status=${tab}`}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              active === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </a>
        ))}
      </div>

      {!inquiries?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-2xl mb-2">✉</p>
          <p className="text-slate-500 text-sm">No inquiries found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq: any) => (
            <details key={inq.id} className="bg-white rounded-2xl border border-slate-200 group">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-semibold text-slate-900">{inq.name}</p>
                    <Badge className={INQUIRY_STATUS_COLORS[inq.status]}>{inq.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{inq.subject}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{inq.email} · {formatDate(inq.created_at)}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400 shrink-0 ml-3 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">{inq.message}</p>

                {inq.admin_notes && (
                  <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                    <p className="text-xs font-medium text-blue-600 mb-0.5">Previous admin note</p>
                    <p className="text-sm text-blue-800">{inq.admin_notes}</p>
                  </div>
                )}

                <form action={updateInquiryStatus} className="space-y-3">
                  <input type="hidden" name="inquiry_id" value={inq.id} />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Update status</label>
                      <select
                        name="status"
                        defaultValue={inq.status}
                        className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Admin note (optional)</label>
                      <input
                        name="admin_notes"
                        type="text"
                        defaultValue={inq.admin_notes ?? ''}
                        placeholder="Internal note…"
                        className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Save changes
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
