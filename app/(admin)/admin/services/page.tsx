import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { STAGE_LABELS, STAGE_COLORS } from '@/lib/utils'
import ToggleSwitch from '@/components/admin/ToggleSwitch'
import DeleteButton from '@/components/admin/DeleteButton'
import { toggleServiceActive, deleteService } from '@/lib/actions/admin-actions'

const STAGES = ['pre_arrival', 'post_arrival', 'settlement', 'miscellaneous'] as const

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createAdminClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('stage')
    .order('sort_order')

  const grouped = STAGES.map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    services: (services ?? []).filter((s: any) => s.stage === stage),
  }))

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="text-slate-500 mt-1">{services?.length ?? 0} total services.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors"
        >
          + New service
        </Link>
      </div>

      {params.success && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          {params.success === 'created' ? 'Service created.' : 'Service updated.'}
        </div>
      )}
      {params.error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {decodeURIComponent(params.error)}
        </div>
      )}

      <div className="space-y-8">
        {grouped.map(({ stage, label, services: stageServices }) => (
          <section key={stage}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STAGE_COLORS[stage]}`}>
                {label}
              </span>
              <span className="text-xs text-slate-400">{stageServices.length} service{stageServices.length !== 1 ? 's' : ''}</span>
            </div>
            {stageServices.length === 0 ? (
              <p className="text-sm text-slate-400 pl-1">No services in this stage yet.</p>
            ) : (
              <div className="space-y-3">
                {stageServices.map((s: any) => (
                  <div
                    key={s.id}
                    className={`bg-white rounded-2xl border p-5 transition-colors ${
                      s.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-slate-900">{s.title}</h3>
                          {!s.is_active && (
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Inactive</span>
                          )}
                        </div>
                        {s.title_fr && s.title_fr !== s.title && (
                          <p className="text-xs text-slate-400 mb-1">{s.title_fr}</p>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{s.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                          {s.price != null && <span>€{s.price}</span>}
                          {s.duration_minutes && <span>{s.duration_minutes} min</span>}
                          {s.category && <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{s.category}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500">{s.is_active ? 'Active' : 'Inactive'}</span>
                          <ToggleSwitch
                            id={s.id}
                            checked={s.is_active}
                            onToggle={toggleServiceActive}
                            label="Toggle service active"
                          />
                        </div>
                        <Link
                          href={`/admin/services/${s.id}`}
                          className="text-sm px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          onDelete={deleteService.bind(null, s.id)}
                          label="Delete service"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
