import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createBooking } from '@/lib/actions/student-actions'
import { formatPrice, STAGE_LABELS } from '@/lib/utils'

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  if (!params.service) notFound()

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', params.service)
    .single()

  if (!service) notFound()

  const isAirportPickup = service.category === 'Airport Transfer'

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/services" className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1">
          ← Back to services
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Book a service</h1>
      <p className="text-slate-500 mb-8">Fill in the details below and we will confirm your booking.</p>

      {params.error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {decodeURIComponent(params.error)}
        </div>
      )}

      {/* Service summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
        <h2 className="font-semibold text-slate-900">{service.title}</h2>
        <p className="text-sm text-slate-600 mt-1">{service.description}</p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-sm font-bold text-slate-900">{formatPrice(service.price)}</span>
          {service.duration_minutes && (
            <span className="text-sm text-slate-500">
              · {service.duration_minutes < 60
                ? `${service.duration_minutes} min`
                : `${Math.round(service.duration_minutes / 60)} hr`}
            </span>
          )}
          <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            {STAGE_LABELS[service.stage]}
          </span>
        </div>
      </div>

      <form action={createBooking} className="space-y-5">
        <input type="hidden" name="service_id" value={service.id} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Preferred date & time <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            name="scheduled_at"
            type="datetime-local"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <p className="text-xs text-slate-400 mt-1">Leave blank if you are flexible — we will contact you to arrange a time.</p>
        </div>

        {isAirportPickup && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Flight number <span className="text-red-500">*</span>
              </label>
              <input
                name="flight_number"
                type="text"
                required
                placeholder="e.g. AF1234"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Pickup location <span className="text-red-500">*</span>
              </label>
              <select
                name="pickup_location"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              >
                <option value="">Select airport / terminal</option>
                <option value="CDG Terminal 1">Paris CDG — Terminal 1</option>
                <option value="CDG Terminal 2">Paris CDG — Terminal 2</option>
                <option value="CDG Terminal 2E">Paris CDG — Terminal 2E</option>
                <option value="Orly Terminal 1">Paris Orly — Terminal 1</option>
                <option value="Orly Terminal 2">Paris Orly — Terminal 2</option>
                <option value="Orly Terminal 3">Paris Orly — Terminal 3</option>
                <option value="Orly Terminal 4">Paris Orly — Terminal 4</option>
                <option value="Beauvais Airport">Beauvais Airport</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Additional notes <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="notes"
            rows={4}
            placeholder={isAirportPickup
              ? 'e.g. I have 2 large suitcases, arriving late at night…'
              : 'Any specific questions, requirements, or context you want to share…'}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href="/services"
            className="flex-1 text-center py-3 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Submit booking →
          </button>
        </div>
      </form>
    </div>
  )
}
