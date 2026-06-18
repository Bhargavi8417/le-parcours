import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { updateArticle } from '@/lib/actions/admin-actions'

const STAGES = [
  { value: '',               label: 'No specific stage' },
  { value: 'pre_arrival',    label: 'Pre-Arrival' },
  { value: 'post_arrival',   label: 'Post-Arrival' },
  { value: 'settlement',     label: 'Settlement' },
  { value: 'miscellaneous',  label: 'Miscellaneous' },
]

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data: article } = await supabase.from('articles').select('*').eq('id', id).single()
  if (!article) notFound()

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/articles" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
          ← Articles
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Article</h1>
        <a
          href={`/guides/${article.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Preview →
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <form action={updateArticle} className="space-y-5">
          <input type="hidden" name="id" value={article.id} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title (English) *</label>
              <input name="title" type="text" required defaultValue={article.title}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title (French)</label>
              <input name="title_fr" type="text" defaultValue={article.title_fr ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stage</label>
              <select name="stage" defaultValue={article.stage ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <input name="category" type="text" defaultValue={article.category ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover image URL</label>
            <input name="cover_image_url" type="url" defaultValue={article.cover_image_url ?? ''}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Content (English) * — Markdown supported
            </label>
            <textarea name="content" rows={14} required defaultValue={article.content}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Content (French) — Markdown supported
            </label>
            <textarea name="content_fr" rows={8} defaultValue={article.content_fr ?? ''}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="is_published"
                type="checkbox"
                value="true"
                defaultChecked={article.is_published}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Published</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Save changes
            </button>
            <Link href="/admin/articles"
              className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
