import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { formatDate, STAGE_COLORS, STAGE_LABELS } from '@/lib/utils'
import ToggleSwitch from '@/components/admin/ToggleSwitch'
import DeleteButton from '@/components/admin/DeleteButton'
import { toggleArticlePublished, deleteArticle } from '@/lib/actions/admin-actions'

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const params = await searchParams
  const supabase = await createAdminClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, title, title_fr, stage, category, is_published, created_at, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
          <p className="text-slate-500 mt-1">Knowledge base and relocation guides.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors"
        >
          + New article
        </Link>
      </div>

      {params.success && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          {params.success === 'created' ? 'Article created.' : 'Article updated.'}
        </div>
      )}

      {!articles?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-2xl mb-2">📖</p>
          <p className="text-slate-500 text-sm">No articles yet. Create your first guide!</p>
          <Link href="/admin/articles/new"
            className="mt-4 inline-flex text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors">
            Write first article →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Title</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Stage</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Published</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((a: any) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{a.title}</p>
                      {a.title_fr && a.title_fr !== a.title && (
                        <p className="text-xs text-slate-400">{a.title_fr}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {a.stage ? (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STAGE_COLORS[a.stage] ?? 'bg-slate-100 text-slate-600'}`}>
                          {STAGE_LABELS[a.stage] ?? a.stage}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <ToggleSwitch
                        id={a.id}
                        checked={a.is_published}
                        onToggle={toggleArticlePublished}
                        label="Toggle published"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(a.updated_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/articles/${a.id}`}
                          className="text-xs font-medium text-blue-600 hover:underline whitespace-nowrap"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          onDelete={deleteArticle.bind(null, a.id)}
                          label="Delete article"
                          small
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
