'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FaqItem {
  q: string
  a: string
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-slate-200">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between gap-4 py-5 text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="font-medium text-slate-900">{faq.q}</span>
            <span className={cn('text-slate-400 transition-transform shrink-0', openIndex === i && 'rotate-180')}>▼</span>
          </button>
          {openIndex === i && (
            <p className="pb-5 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}
