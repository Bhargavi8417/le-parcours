'use client'

import { useTransition } from 'react'
import { cancelBooking } from '@/lib/actions/student-actions'

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!confirm('Cancel this booking?')) return
        startTransition(() => cancelBooking(bookingId))
      }}
      disabled={isPending}
      className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors disabled:opacity-50"
    >
      {isPending ? 'Cancelling…' : 'Cancel'}
    </button>
  )
}
