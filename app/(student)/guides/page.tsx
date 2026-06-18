import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { STAGE_LABELS, STAGE_COLORS } from '@/lib/utils'
import type { Article } from '@/types'

const STAGE_FILTERS = [
  { key: null,            label: 'All' },
  { key: 'pre_arrival',   label: 'Pre-Arrival' },
  { key: 'post_arrival',  label: 'Post-Arrival' },
  { key: 'settlement',    label: 'Settlement' },
  { key: 'miscellaneous', label: 'Miscellaneous' },
]

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>
}) {
  const [params, t, locale] = await Promise.all([
    searchParams,
    getTranslations('guides'),
    getLocale(),
  ])

  const supabase = await createClient()

  let query = supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (params.stage) {
    query = query.eq('stage', params.stage)
  }

  const { data: articles } = await query
  const allArticles = (articles ?? []) as Article[]

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* Stage filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {STAGE_FILTERS.map((f) => {
          const active = params.stage === f.key || (f.key === null && !params.stage)
          return (
            <Link
              key={String(f.key)}
              href={f.key ? `/guides?stage=${f.key}` : '/guides'}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                active
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {f.key ? STAGE_LABELS[f.key] : t('filterAll')}
            </Link>
          )
        })}
      </div>

      {allArticles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-4xl mb-3">📖</p>
          <p className="font-semibold text-slate-900">{t('noGuides')}</p>
          <p className="text-slate-500 text-sm mt-1">{t('noGuidesDesc')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allArticles.map((article) => {
            const title = locale === 'fr' && article.title_fr ? article.title_fr : article.title
            const content = locale === 'fr' && article.content_fr ? article.content_fr : article.content
            const readMin = estimateReadTime(content)

            return (
              <Link
                key={article.id}
                href={`/guides/${article.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all flex flex-col"
              >
                {/* Cover image or placeholder */}
                {article.cover_image_url ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={article.cover_image_url}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-4xl">
                    {article.stage === 'pre_arrival' ? '✈️' :
                     article.stage === 'post_arrival' ? '🛬' :
                     article.stage === 'settlement' ? '🏡' : '📖'}
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Stage + read time */}
                  <div className="flex items-center gap-2 mb-3">
                    {article.stage && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[article.stage]}`}>
                        {STAGE_LABELS[article.stage]}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {t('readTime', { min: readMin })}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                    {title}
                  </h3>

                  {article.category && (
                    <p className="text-xs text-slate-400 mb-3">{article.category}</p>
                  )}

                  <div className="mt-auto pt-3 border-t border-slate-100">
                    <span className="text-sm font-medium text-blue-600 group-hover:underline">
                      {t('readMore')}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
