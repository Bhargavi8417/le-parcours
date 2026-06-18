import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { updateProfile } from '@/lib/actions/student-actions'
import { signOut } from '@/lib/supabase/actions'
import { formatDate } from '@/lib/utils'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [params, t] = await Promise.all([searchParams, getTranslations('profile')])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: bookings }, { data: studentDocs }, { data: docTemplates }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('bookings').select('id, status').eq('student_id', user!.id),
    supabase.from('student_documents').select('is_completed').eq('student_id', user!.id),
    supabase.from('document_templates').select('id'),
  ])

  const completedDocs = studentDocs?.filter((d) => d.is_completed).length ?? 0
  const totalDocs = docTemplates?.length ?? 0
  const totalBookings = bookings?.length ?? 0
  const completedBookings = bookings?.filter((b) => b.status === 'completed').length ?? 0

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-500 mt-1">{t('subtitle')}</p>
      </div>

      {params.success && (
        <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          {t('successMessage')}
        </div>
      )}
      {params.error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {decodeURIComponent(params.error)}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: t('statsBookings'), value: totalBookings },
          { label: t('statsCompleted'), value: completedBookings },
          { label: t('statsDocuments'), value: `${completedDocs}/${totalDocs}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-5">{t('personalInfo')}</h2>
        <form action={updateProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('fullName')}</label>
              <input name="full_name" type="text" required defaultValue={profile?.full_name ?? ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('email')}</label>
              <input type="email" value={profile?.email ?? ''} disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
              <p className="text-xs text-slate-400 mt-1">{t('emailHint')}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('phone')}</label>
              <input name="phone" type="tel" defaultValue={profile?.phone ?? ''} placeholder={t('phonePlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('nationality')}</label>
              <input name="nationality" type="text" defaultValue={profile?.nationality ?? ''} placeholder={t('nationalityPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('university')}</label>
            <input name="university" type="text" defaultValue={profile?.university ?? ''} placeholder={t('universityPlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="pt-2">
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              {t('save', { defaultValue: 'Save changes' })}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">{t('accountSection')}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">{t('roleLabel')}</span>
            <span className="font-medium text-slate-900 capitalize">{profile?.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('memberSince')}</span>
            <span className="font-medium text-slate-900">{formatDate(profile?.created_at ?? null)}</span>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-slate-100">
          <form action={signOut}>
            <button type="submit" className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
              {t('signOut')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
