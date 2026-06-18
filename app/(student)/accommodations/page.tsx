import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import AccommodationCarousel from '@/components/student/AccommodationCarousel'
import AccommodationInquiryForm from '@/components/student/AccommodationInquiryForm'
import { ACCOMMODATION_TYPE_LABELS } from '@/lib/utils'
import type { Location, Accommodation, AccommodationImage } from '@/types'

export default async function AccommodationsPage() {
  const [t, locale] = await Promise.all([getTranslations('accommodations'), getLocale()])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: locationsRaw }] = await Promise.all([
    supabase.from('profiles').select('full_name, email').eq('id', user!.id).single(),
    supabase
      .from('locations')
      .select(`*, accommodations (*, accommodation_images (*))`)
      .eq('is_active', true)
      .order('sort_order'),
  ])

  type AccomWithImages = Omit<Accommodation, 'images'> & { accommodation_images: AccommodationImage[] }
  type LocationWithAccoms = Omit<Location, 'accommodations'> & { accommodations: AccomWithImages[] }
  const locations = (locationsRaw ?? []) as LocationWithAccoms[]

  const totalAccom = locations.reduce((sum, l) => sum + (l.accommodations?.length ?? 0), 0)
  const availableAccom = locations.reduce(
    (sum, l) => sum + (l.accommodations?.filter((a) => a.is_available).length ?? 0), 0
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
          <p className="text-slate-500 mt-1">
            {totalAccom > 0
              ? t('listingsCount', { available: availableAccom, total: totalAccom, locations: locations.length })
              : t('browseDesc')}
          </p>
        </div>

        {locations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {locations.map((loc) => (
              <a
                key={loc.id}
                href={`#location-${loc.id}`}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 bg-white hover:border-blue-300 hover:text-blue-700 text-slate-600 transition-colors"
              >
                {locale === 'fr' && loc.name_fr ? loc.name_fr : loc.name}
              </a>
            ))}
          </div>
        )}

        {locations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-4xl mb-3">🏠</p>
            <p className="font-semibold text-slate-900">{t('noListings')}</p>
            <p className="text-slate-500 text-sm mt-1">{t('noListingsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-16">
            {locations.map((location) => (
              <section key={location.id} id={`location-${location.id}`}>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {locale === 'fr' && location.name_fr ? location.name_fr : location.name}
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">{location.city}</p>
                    {(locale === 'fr' ? location.description_fr : location.description) && (
                      <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                        {locale === 'fr' ? location.description_fr : location.description}
                      </p>
                    )}
                  </div>
                  {location.accommodations && (
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-bold text-slate-900">{location.accommodations.length}</p>
                      <p className="text-xs text-slate-400">
                        {location.accommodations.length !== 1 ? t('listingsPlural') : t('listings')}
                      </p>
                    </div>
                  )}
                </div>

                {!location.accommodations?.length ? (
                  <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                    <p className="text-slate-400 text-sm">{t('noListingsInArea')}</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {location.accommodations.map((accom) => {
                      const images = [...(accom.accommodation_images ?? [])].sort(
                        (a, b) => a.sort_order - b.sort_order
                      )
                      const title = locale === 'fr' && accom.title_fr ? accom.title_fr : accom.title
                      const description = locale === 'fr' && accom.description_fr ? accom.description_fr : accom.description

                      return (
                        <div key={accom.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                          <AccommodationCarousel images={images} title={title} />

                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900 text-sm leading-snug">{title}</h3>
                              <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                                accom.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                              }`}>
                                {accom.is_available ? t('available', { defaultValue: 'Available' }) : t('unavailable', { defaultValue: 'Unavailable' })}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mb-2">
                              {ACCOMMODATION_TYPE_LABELS[accom.type]}
                              {accom.address && ` · ${accom.address}`}
                            </p>

                            {description && (
                              <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{description}</p>
                            )}

                            {accom.amenities && accom.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {accom.amenities.slice(0, 4).map((a) => (
                                  <span key={a} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{a}</span>
                                ))}
                                {accom.amenities.length > 4 && (
                                  <span className="text-[11px] text-slate-400">+{accom.amenities.length - 4} more</span>
                                )}
                              </div>
                            )}

                            <div className="mt-auto pt-3 border-t border-slate-100">
                              {accom.price_per_month ? (
                                <p className="text-base font-bold text-slate-900 mb-3">
                                  €{accom.price_per_month.toLocaleString()}
                                  <span className="text-sm font-normal text-slate-400">{t('perMonth', { defaultValue: '/mo' })}</span>
                                </p>
                              ) : (
                                <p className="text-sm text-slate-400 mb-3">{t('priceOnRequest')}</p>
                              )}
                              {accom.is_available && (
                                <AccommodationInquiryForm
                                  accommodationId={accom.id}
                                  studentName={profile?.full_name ?? ''}
                                  studentEmail={profile?.email ?? ''}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
