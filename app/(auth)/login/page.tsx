import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { signIn } from '@/lib/supabase/actions'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const [params, t] = await Promise.all([searchParams, getTranslations('auth')])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl">🇫🇷</span>
            <span className="text-xl font-semibold text-slate-800">Le Parcours</span>
          </Link>
          <p className="mt-2 text-slate-500 text-sm">{t('loginTitle')}</p>
          <div className="mt-3 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {params.error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {decodeURIComponent(params.error)}
            </div>
          )}

          <form action={signIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">{t('email')}</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">{t('password')}</label>
              <input id="password" name="password" type="password" required autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••" />
            </div>
            <button type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              {t('signIn')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {t('noAccount')}{' '}
            <Link href="/signup" className="text-blue-600 font-medium hover:underline">{t('createOne')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
