import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { updateService } from '@/lib/actions/admin-actions'

const STAGES = [
  { value: 'pre_arrival',    label: 'Pre-Arrival' },
  { value: 'post_arrival',   label: 'Post-Arrival' },
  { value: 'settlement',     label: 'Settlement' },
  { value: 'miscellaneous',  label: 'Miscellaneous' },
]

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data: service } = await supabase.from('services').select('*').eq('id', id).single()
  if (!service) notFound()

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/services" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
          ← Services
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Service</h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <form action={updateService} className="space-y-5">
          <input type="hidden" name="id" value={service.id} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title (English) *</label>
              <input name="title" type="text" required defaultValue={service.title}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title (French)</label>
              <input name="title_fr" type="text" defaultValue={service.title_fr ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (English) *</label>
            <textarea name="description" rows={3} required defaultValue={service.description}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (French)</label>
            <textarea name="description_fr" rows={3} defaultValue={service.description_fr ?? ''}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stage *</label>
              <select name="stage" required defaultValue={service.stage}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <input name="category" type="text" defaultValue={service.category ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (€)</label>
              <input name="price" type="number" min="0" step="0.01"
                defaultValue={service.price ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (minutes)</label>
              <input name="duration_minutes" type="number" min="1"
                defaultValue={service.duration_minutes ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Sort order</label>
              <input name="sort_order" type="number" min="0"
                defaultValue={service.sort_order}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Save changes
            </button>
            <Link href="/admin/services"
              className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
