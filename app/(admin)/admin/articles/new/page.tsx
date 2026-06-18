import Link from 'next/link'
import { createArticle } from '@/lib/actions/admin-actions'

const STAGES = [
  { value: '',               label: 'No specific stage' },
  { value: 'pre_arrival',    label: 'Pre-Arrival' },
  { value: 'post_arrival',   label: 'Post-Arrival' },
  { value: 'settlement',     label: 'Settlement' },
  { value: 'miscellaneous',  label: 'Miscellaneous' },
]

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/articles" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
          ← Articles
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Article</h1>

      {params.error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {decodeURIComponent(params.error)}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <form action={createArticle} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title (English) *</label>
              <input name="title" type="text" required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title (French)</label>
              <input name="title_fr" type="text" placeholder="Same as English if empty"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
            <input name="slug" type="text" placeholder="Auto-generated from title if empty"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-slate-400 mt-1">Used in the URL: /guides/your-slug</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stage</label>
              <select name="stage"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <input name="category" type="text" placeholder="e.g. Housing, Visa, Banking"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover image URL</label>
            <input name="cover_image_url" type="url" placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Content (English) * — Markdown supported
            </label>
            <textarea name="content" rows={12} required
              placeholder="## Introduction&#10;&#10;Write your guide here using Markdown..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Content (French) — Markdown supported
            </label>
            <textarea name="content_fr" rows={8}
              placeholder="Same as English if empty..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="is_published" type="checkbox" value="true"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Create article
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
