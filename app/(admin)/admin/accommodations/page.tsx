import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { ACCOMMODATION_TYPE_LABELS } from '@/lib/utils'
import ToggleSwitch from '@/components/admin/ToggleSwitch'
import DeleteButton from '@/components/admin/DeleteButton'
import AccommodationImageManager from '@/components/admin/AccommodationImageManager'
import {
  createLocation,
  toggleLocationActive,
  deleteLocation,
  createAccommodation,
  toggleAccommodationAvailability,
  deleteAccommodation,
} from '@/lib/actions/admin-actions'
import type { Location, Accommodation, AccommodationImage } from '@/types'

type AccomWithImages = Omit<Accommodation, 'images'> & { accommodation_images: AccommodationImage[] }
type LocationWithAccoms = Omit<Location, 'accommodations'> & { accommodations: AccomWithImages[] }

export default async function AdminAccommodationsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createAdminClient()

  const { data: locationsRaw } = await supabase
    .from('locations')
    .select('*, accommodations(*, accommodation_images(*))')
    .order('sort_order')

  const locations = (locationsRaw ?? []) as LocationWithAccoms[]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Accommodations</h1>
        <p className="text-slate-500 mt-1">Manage locations, listings, and photos.</p>
      </div>

      {params.success && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          {params.success === 'location_created' ? 'Location added.' :
           params.success === 'accom_created' ? 'Accommodation added.' : 'Saved.'}
        </div>
      )}
      {params.error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {decodeURIComponent(params.error)}
        </div>
      )}

      {/* Add location */}
      <details className="bg-white rounded-2xl border border-slate-200 mb-6">
        <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer list-none font-medium text-slate-700 hover:text-blue-600 transition-colors">
          <span className="text-lg">+</span> Add new location
        </summary>
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          <form action={createLocation} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location name (English) *</label>
              <input name="name" type="text" required placeholder="e.g. Latin Quarter"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location name (French)</label>
              <input name="name_fr" type="text" placeholder="e.g. Quartier Latin"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description (EN)</label>
              <input name="description" type="text" placeholder="Short description…"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description (FR)</label>
              <input name="description_fr" type="text"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
              <input name="city" type="text" defaultValue="Paris"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Sort order</label>
              <input name="sort_order" type="number" defaultValue="0" min="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Add location
              </button>
            </div>
          </form>
        </div>
      </details>

      {/* Location sections */}
      {locations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-2xl mb-2">⌂</p>
          <p className="text-slate-500 text-sm">No locations yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {locations.map((loc) => (
            <section key={loc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Location header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-slate-900">{loc.name}</h2>
                    {loc.name_fr && loc.name_fr !== loc.name && (
                      <span className="text-xs text-slate-400">/ {loc.name_fr}</span>
                    )}
                    {!loc.is_active && (
                      <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{loc.city} · {loc.accommodations?.length ?? 0} listing{(loc.accommodations?.length ?? 0) !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">{loc.is_active ? 'Visible' : 'Hidden'}</span>
                    <ToggleSwitch
                      id={loc.id}
                      checked={loc.is_active}
                      onToggle={toggleLocationActive}
                      label="Toggle location visibility"
                    />
                  </div>
                  <DeleteButton
                    onDelete={deleteLocation.bind(null, loc.id)}
                    label="Delete location"
                    small
                  />
                </div>
              </div>

              <div className="p-5">
                {/* Add accommodation form */}
                <details className="border border-dashed border-slate-300 rounded-xl mb-5">
                  <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                    <span>+</span> Add accommodation to {loc.name}
                  </summary>
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                    <form action={createAccommodation} className="grid sm:grid-cols-2 gap-3">
                      <input type="hidden" name="location_id" value={loc.id} />
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Title (EN) *</label>
                        <input name="title" type="text" required
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Title (FR)</label>
                        <input name="title_fr" type="text"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Description (EN)</label>
                        <textarea name="description" rows={2}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Type *</label>
                        <select name="type" required
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                          {Object.entries(ACCOMMODATION_TYPE_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Price / month (€)</label>
                        <input name="price_per_month" type="number" min="0"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
                        <input name="address" type="text"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Available from</label>
                        <input name="available_from" type="date"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Amenities <span className="font-normal text-slate-400">(comma-separated)</span>
                        </label>
                        <input name="amenities" type="text" placeholder="WiFi, Laundry, Kitchen, Furnished"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input name="is_available" type="checkbox" value="true" defaultChecked
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-slate-700">Available now</span>
                        </label>
                        <button type="submit"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                          Add accommodation
                        </button>
                      </div>
                    </form>
                  </div>
                </details>

                {/* Accommodation cards */}
                {!loc.accommodations?.length ? (
                  <p className="text-sm text-slate-400 text-center py-4">No accommodations in this location yet.</p>
                ) : (
                  <div className="space-y-4">
                    {loc.accommodations.map((accom) => {
                      const images = [...(accom.accommodation_images ?? [])].sort(
                        (a, b) => a.sort_order - b.sort_order
                      )
                      return (
                        <div key={accom.id} className="border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <h3 className="font-semibold text-slate-900">{accom.title}</h3>
                                <span className="text-xs text-slate-500">
                                  {ACCOMMODATION_TYPE_LABELS[accom.type]}
                                </span>
                              </div>
                              {accom.address && (
                                <p className="text-xs text-slate-400">{accom.address}</p>
                              )}
                              {accom.price_per_month && (
                                <p className="text-sm font-medium text-slate-700 mt-0.5">
                                  €{accom.price_per_month}/mo
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-500">
                                  {accom.is_available ? 'Available' : 'Unavailable'}
                                </span>
                                <ToggleSwitch
                                  id={accom.id}
                                  checked={accom.is_available}
                                  onToggle={toggleAccommodationAvailability}
                                  label="Toggle availability"
                                />
                              </div>
                              <DeleteButton
                                onDelete={deleteAccommodation.bind(null, accom.id)}
                                label="Delete accommodation"
                                small
                              />
                            </div>
                          </div>

                          {accom.amenities && accom.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {accom.amenities.map((a) => (
                                <span key={a} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{a}</span>
                              ))}
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-medium text-slate-600 mb-2">
                              Photos ({images.length})
                            </p>
                            <AccommodationImageManager
                              accommodationId={accom.id}
                              images={images}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
