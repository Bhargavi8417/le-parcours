'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { signOut } from '@/lib/supabase/actions'
import { cn } from '@/lib/utils'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import type { Profile } from '@/types'

interface StudentNavProps {
  profile: Profile | null
}

export default function StudentNav({ profile }: StudentNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations('nav')

  const navItems = [
    { href: '/dashboard',      label: t('dashboard'),      icon: '⊞' },
    { href: '/services',       label: t('services'),       icon: '✦' },
    { href: '/journey',        label: t('journey'),        icon: '◎' },
    { href: '/documents',      label: t('documents'),      icon: '☑' },
    { href: '/bookings',       label: t('bookings'),       icon: '⊡' },
    { href: '/accommodations', label: t('accommodations'), icon: '⌂' },
    { href: '/guides',         label: t('guides'),         icon: '⊛' },
  ]

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
          active
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        )}
      >
        <span className="text-base w-5 text-center">{item.icon}</span>
        {item.label}
      </Link>
    )
  }

  const UserFooter = () => (
    <>
      <Link
        href="/profile"
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
          pathname === '/profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
        )}
      >
        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
          {profile?.full_name?.[0]?.toUpperCase() ?? 'S'}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-800">{profile?.full_name ?? t('profile')}</p>
          <p className="truncate text-xs text-slate-500">{profile?.email}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between px-3 py-1.5 mt-1">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span>↩</span> {t('signOut')}
          </button>
        </form>
        <LanguageSwitcher compact />
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-white border-r border-slate-200 z-30">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-slate-200 shrink-0">
          <span className="text-xl">🇫🇷</span>
          <span className="font-semibold text-slate-800 text-sm">Le Parcours</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>

        {profile?.role === 'admin' && (
          <div className="px-3 pb-2 border-t border-slate-200 pt-3">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors"
            >
              <span className="text-base w-5 text-center">⚙</span>
              Admin Dashboard
            </Link>
          </div>
        )}

        <div className="border-t border-slate-200 px-3 py-4">
          <UserFooter />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-30">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg">🇫🇷</span>
          <span className="font-semibold text-slate-800 text-sm">Le Parcours</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        'lg:hidden fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transition-transform duration-200',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-200">
          <span className="text-xl">🇫🇷</span>
          <span className="font-semibold text-slate-800 text-sm">Le Parcours</span>
        </div>
        <nav className="px-3 py-4 space-y-0.5">
          {navItems.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>
        {profile?.role === 'admin' && (
          <div className="px-3 pb-2 border-t border-slate-200 pt-3">
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors"
            >
              <span className="text-base w-5 text-center">⚙</span>
              Admin Dashboard
            </Link>
          </div>
        )}

        <div className="border-t border-slate-200 px-3 py-4">
          <UserFooter />
        </div>
      </aside>
    </>
  )
}
