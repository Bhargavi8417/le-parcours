import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { signUp } from '@/lib/supabase/actions'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
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
          <p className="mt-2 text-slate-500 text-sm">{t('signupTitle')}</p>
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

          <form action={signUp} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-1.5">{t('fullName')}</label>
              <input id="full_name" name="full_name" type="text" required autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Maria Santos" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">{t('email')}</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">{t('password')}</label>
              <input id="password" name="password" type="password" required autoComplete="new-password" minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={t('minPassword')} />
            </div>
            <button type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              {t('signUp')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {t('haveAccount')}{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">{t('signIn')}</Link>
          </p>
          <p className="mt-4 text-center text-xs text-slate-400">{t('terms')}</p>
        </div>
      </div>
    </div>
  )
}
