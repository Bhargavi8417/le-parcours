import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import DocumentChecklist from '@/components/student/DocumentChecklist'
import type { DocumentTemplate, StudentDocument } from '@/types'

const STAGES = [
  { key: 'application',    icon: '🎓' },
  { key: 'campus_france',  icon: '📋' },
  { key: 'visa',           icon: '📄' },
  { key: 'arrival',        icon: '🛬' },
  { key: 'settlement',     icon: '🏡' },
] as const

export default async function DocumentsPage() {
  const [t, ts] = await Promise.all([
    getTranslations('documents'),
    getTranslations('stages'),
  ])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: templates }, { data: studentDocs }] = await Promise.all([
    supabase.from('document_templates').select('*').order('sort_order'),
    supabase.from('student_documents').select('*').eq('student_id', user!.id),
  ])

  const allTemplates = (templates ?? []) as DocumentTemplate[]
  const allStudentDocs = (studentDocs ?? []) as StudentDocument[]

  const completed = allStudentDocs.filter((d) => d.is_completed).length
  const total = allTemplates.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-500 mt-1">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-slate-900">{t('overallCompletion')}</p>
          <p className="text-sm font-semibold text-blue-600">{pct}%</p>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {t('ofDocuments', { completed, total })}
        </p>
      </div>

      <div className="space-y-6">
        {STAGES.map(({ key, icon }) => {
          const stageTemplates = allTemplates.filter((t) => t.stage === key)
          const stageDocs = allStudentDocs.filter(
            (d) => stageTemplates.some((t) => t.id === d.template_id)
          )
          const stageDone = stageDocs.filter((d) => d.is_completed).length

          return (
            <div key={key} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <h2 className="font-semibold text-slate-900">{ts(key)}</h2>
                    <p className="text-xs text-slate-400">{stageDone}/{stageTemplates.length} completed</p>
                  </div>
                </div>
                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: stageTemplates.length > 0 ? `${(stageDone / stageTemplates.length) * 100}%` : '0%' }}
                  />
                </div>
              </div>
              <DocumentChecklist templates={stageTemplates} studentDocs={stageDocs} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
