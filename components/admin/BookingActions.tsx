'use client'

import { useState, useTransition } from 'react'
import { updateBookingStatus, saveBookingAdminNotes } from '@/lib/actions/admin-actions'
import { BOOKING_STATUS_COLORS } from '@/lib/utils'

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

interface Props {
  bookingId: string
  currentStatus: string
  currentNotes: string
}

export default function BookingActions({ bookingId, currentStatus, currentNotes }: Props) {
  const [showNotes, setShowNotes] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => updateBookingStatus(bookingId, e.target.value))
  }

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isPending}
        className="text-sm border border-slate-300 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setShowNotes(!showNotes)}
        className="text-xs text-blue-600 hover:underline"
      >
        {showNotes ? 'Close notes' : (currentNotes ? 'Edit note' : '+ Add note')}
      </button>
      {showNotes && (
        <form
          action={saveBookingAdminNotes}
          className="mt-1 w-64"
        >
          <input type="hidden" name="booking_id" value={bookingId} />
          <textarea
            name="admin_notes"
            defaultValue={currentNotes}
            rows={3}
            placeholder="Internal note for this booking…"
            className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            className="mt-1.5 w-full text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-xl font-medium transition-colors"
          >
            Save note
          </button>
        </form>
      )}
    </div>
  )
}
