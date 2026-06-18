'use client'

import { useTransition, useState } from 'react'
import { submitAccommodationInquiry } from '@/lib/actions/student-actions'
import Spinner from '@/components/ui/Spinner'

interface Props {
  accommodationId: string
  studentName?: string
  studentEmail?: string
}

export default function AccommodationInquiryForm({ accommodationId, studentName, studentEmail }: Props) {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    startTransition(async () => {
      await submitAccommodationInquiry(form)
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
        <p className="text-emerald-700 font-medium text-sm">Inquiry sent! We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="accommodation_id" value={accommodationId} />
      <div className="grid grid-cols-2 gap-3">
        <input
          name="name"
          type="text"
          required
          defaultValue={studentName ?? ''}
          placeholder="Your name"
          className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="email"
          type="email"
          required
          defaultValue={studentEmail ?? ''}
          placeholder="Your email"
          className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <textarea
        name="message"
        rows={3}
        placeholder="Any questions about this accommodation?"
        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
      >
        {isPending ? <><Spinner className="w-4 h-4" /> Sending…</> : 'Express interest'}
      </button>
    </form>
  )
}
