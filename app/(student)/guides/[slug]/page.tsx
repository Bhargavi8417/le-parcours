import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { formatDate, STAGE_LABELS, STAGE_COLORS } from '@/lib/utils'
import ArticleRenderer from '@/components/student/ArticleRenderer'
import type { Article } from '@/types'

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [t, locale] = await Promise.all([getTranslations('guides'), getLocale()])

  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) notFound()

  const article = data as Article
  const title   = locale === 'fr' && article.title_fr   ? article.title_fr   : article.title
  const content = locale === 'fr' && article.content_fr ? article.content_fr : article.content
  const readMin = estimateReadTime(content)

  // Related articles (same stage, excluding current)
  const { data: related } = await supabase
    .from('articles')
    .select('slug, title, title_fr, stage')
    .eq('is_published', true)
    .eq('stage', article.stage ?? '')
    .neq('id', article.id)
    .limit(3)

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8"
        >
          {t('backToGuides')}
        </Link>

        {/* Cover image */}
        {article.cover_image_url && (
          <div className="rounded-2xl overflow-hidden mb-8 h-56 sm:h-72">
            <img src={article.cover_image_url} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {article.stage && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STAGE_COLORS[article.stage]}`}>
              {STAGE_LABELS[article.stage]}
            </span>
          )}
          {article.category && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              {article.category}
            </span>
          )}
          <span className="text-xs text-slate-400">
            {t('readTime', { min: readMin })}
          </span>
          <span className="text-xs text-slate-400">
            {formatDate(article.updated_at)}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-8">{title}</h1>

        {/* Article body */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <ArticleRenderer content={content} />
        </div>

        {/* Related articles */}
        {related && related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Related guides</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r: any) => {
                const relTitle = locale === 'fr' && r.title_fr ? r.title_fr : r.title
                return (
                  <Link
                    key={r.slug}
                    href={`/guides/${r.slug}`}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    {r.stage && (
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[r.stage]}`}>
                        {STAGE_LABELS[r.stage]}
                      </span>
                    )}
                    <p className="text-sm font-medium text-slate-900 mt-2 leading-snug">{relTitle}</p>
                    <p className="text-xs text-blue-600 mt-2">{t('readMore')}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
