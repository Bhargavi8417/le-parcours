'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function LandingNav() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('landing')
  const ta = useTranslations('auth')

  return (
    <nav className="fixed top-0 inset-x-0 bg-white/90 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🇫🇷</span>
          <span className="font-semibold text-slate-900">Le Parcours</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#services" className="hover:text-slate-900 transition-colors">{t('navServices')}</a>
          <a href="#journey" className="hover:text-slate-900 transition-colors">{t('navHowItWorks')}</a>
          <a href="#accommodations" className="hover:text-slate-900 transition-colors">{t('navAccommodations')}</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">{t('navFaq')}</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            {ta('signIn')}
          </Link>
          <Link href="/signup" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
            {t('getStarted')}
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <a href="#services" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-1">{t('navServices')}</a>
          <a href="#journey" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-1">{t('navHowItWorks')}</a>
          <a href="#accommodations" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-1">{t('navAccommodations')}</a>
          <a href="#faq" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-1">{t('navFaq')}</a>
          <div className="pt-3 space-y-2 border-t border-slate-100">
            <div className="pb-2"><LanguageSwitcher /></div>
            <Link href="/login" className="block text-center py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-xl">{ta('signIn')}</Link>
            <Link href="/signup" className="block text-center py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl">{t('getStarted')}</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
