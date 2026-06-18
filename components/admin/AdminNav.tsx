'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '@/lib/supabase/actions'

const navItems = [
  { href: '/admin/dashboard',       label: 'Overview',        icon: '⊞' },
  { href: '/admin/students',        label: 'Students',        icon: '👥' },
  { href: '/admin/bookings',        label: 'Bookings',        icon: '⊡' },
  { href: '/admin/inquiries',       label: 'Inquiries',       icon: '✉' },
  { href: '/admin/services',        label: 'Services',        icon: '✦' },
  { href: '/admin/articles',        label: 'Articles',        icon: '📖' },
  { href: '/admin/accommodations',  label: 'Accommodations',  icon: '⌂' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavLinks = () => (
    <nav className="flex-1 py-4 space-y-0.5">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-slate-900 border-r border-slate-800 z-40">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800">
          <span className="text-xl">🇫🇷</span>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">Admin Panel</p>
            <p className="text-slate-500 text-[11px]">Le Parcours</p>
          </div>
        </div>

        <NavLinks />

        <div className="border-t border-slate-800 p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            <span className="text-base">↗</span>
            View site
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800 w-full text-left"
            >
              <span className="text-base">↩</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-40 bg-slate-900 border-b border-slate-800 h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-400 hover:text-white"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-white text-sm font-semibold">Admin Panel</span>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-64 bg-slate-900 h-full shadow-xl">
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇫🇷</span>
                <p className="text-white text-sm font-semibold">Admin Panel</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <NavLinks />

            <div className="border-t border-slate-800 p-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <span>↗</span> View site
              </Link>
              <form action={signOut}>
                <button type="submit" className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors w-full text-left">
                  <span>↩</span> Sign out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
