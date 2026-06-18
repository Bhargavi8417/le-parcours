import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, STAGE_COLORS } from '@/lib/utils'
import type { Service } from '@/types'

const STAGE_ORDER = ['pre_arrival', 'post_arrival', 'settlement', 'miscellaneous'] as const
const STAGE_ICONS: Record<string, string> = {
  pre_arrival: '✈️', post_arrival: '🛬', settlement: '🏡', miscellaneous: '⭐',
}

export default async function ServicesPage() {
  const [t, ts, locale] = await Promise.all([
    getTranslations('services'),
    getTranslations('stages'),
    getLocale(),
  ])

  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const grouped = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = services?.filter((s: Service) => s.stage === stage) ?? []
    return acc
  }, {} as Record<string, Service[]>)

  const stageDesc: Record<string, string> = {
    pre_arrival:   t('preArrivalDesc'),
    post_arrival:  t('postArrivalDesc'),
    settlement:    t('settlementDesc'),
    miscellaneous: t('miscDesc'),
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-500 mt-1">{t('subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {STAGE_ORDER.map((stage) => (
          <a key={stage} href={`#${stage}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 bg-white hover:border-blue-300 hover:text-blue-700 transition-colors text-slate-600">
            <span>{STAGE_ICONS[stage]}</span>
            {ts(stage)}
          </a>
        ))}
      </div>

      <div className="space-y-12">
        {STAGE_ORDER.map((stage) => (
          <section key={stage} id={stage}>
            <div className="flex items-center gap-3 mb-5">
              <div className="text-2xl">{STAGE_ICONS[stage]}</div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{ts(stage)}</h2>
                <p className="text-sm text-slate-500">{stageDesc[stage]}</p>
              </div>
            </div>

            {grouped[stage].length === 0 ? (
              <p className="text-slate-400 text-sm py-4">{t('noServices')}</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {grouped[stage].map((service) => {
                  const title = locale === 'fr' ? service.title_fr : service.title
                  const description = locale === 'fr' ? service.description_fr : service.description

                  return (
                    <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-slate-900">{title}</h3>
                        <span className="text-base font-bold text-slate-900 shrink-0">{formatPrice(service.price)}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed flex-1">{description}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STAGE_COLORS[stage]}`}>
                            {ts(stage)}
                          </span>
                          {service.duration_minutes && (
                            <span className="text-xs text-slate-400">
                              {service.duration_minutes < 60
                                ? `${service.duration_minutes} ${t('min')}`
                                : `${Math.round(service.duration_minutes / 60)} ${t('hr')}`}
                            </span>
                          )}
                        </div>
                        <Link href={`/bookings/new?service=${service.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                          {t('bookLink')}
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
