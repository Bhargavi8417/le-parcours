'use client'

import { useTransition } from 'react'
import { useLocale } from 'next-intl'
import { setLocale } from '@/lib/actions/locale-action'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    const next = locale === 'en' ? 'fr' : 'en'
    startTransition(() => setLocale(next))
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        disabled={isPending}
        className={cn(
          'flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors',
          isPending ? 'opacity-50 cursor-wait' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
        )}
        title={locale === 'en' ? 'Passer en français' : 'Switch to English'}
      >
        <span>{locale === 'en' ? '🇫🇷' : '🇬🇧'}</span>
        <span>{locale === 'en' ? 'FR' : 'EN'}</span>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-0.5 bg-slate-100 rounded-xl p-0.5">
      {(['en', 'fr'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => {
            if (lang !== locale) startTransition(() => setLocale(lang))
          }}
          disabled={isPending}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            locale === lang
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <span>{lang === 'en' ? '🇬🇧' : '🇫🇷'}</span>
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
