import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import type { JourneyProgress } from '@/types'

const STAGES = [
  { key: 'application',   statusKey: 'application_status',   icon: '🎓', descKey: 'applicationDesc',   color: 'violet' },
  { key: 'campus_france', statusKey: 'campus_france_status',  icon: '📋', descKey: 'campusFranceDesc',  color: 'blue'   },
  { key: 'visa',          statusKey: 'visa_status',           icon: '📄', descKey: 'visaDesc',          color: 'amber'  },
  { key: 'arrival',       statusKey: 'arrival_status',        icon: '🛬', descKey: 'arrivalDesc',       color: 'emerald'},
  { key: 'settlement',    statusKey: 'settlement_status',     icon: '🏡', descKey: 'settlementDesc',    color: 'teal'   },
] as const

const STEPS: Record<string, string[]> = {
  application: [
    'Research universities and programs',
    'Prepare academic transcripts and diplomas',
    'Write your statement of purpose',
    'Submit applications through Campus France or directly',
    'Await acceptance letter',
  ],
  campus_france: [
    'Create account on campusfrance.org',
    'Complete your online dossier',
    'Upload all required documents',
    'Schedule and attend your Campus France interview',
    'Receive your Campus France number',
  ],
  visa: [
    'Complete the visa application form',
    'Gather all required documents',
    'Book your VFS appointment for visa drop-off',
    'Attend your VFS appointment',
    'Receive your visa and verify all details',
  ],
  arrival: [
    'Arrange airport transfer to your accommodation',
    'Validate your visa on ofii.fr within 3 months of arrival',
    'Collect your university enrollment certificate',
    'Set up your French address',
    'Complete OFII medical appointment if required',
  ],
  settlement: [
    'Open a French bank account',
    'Obtain your Navigo transit pass',
    'Register for Carte Vitale health insurance',
    'Get a French SIM card and mobile plan',
    'Apply for CAF housing assistance if eligible',
  ],
}

const STATUS_STYLES: Record<string, { dot: string; badge: string }> = {
  not_started: { dot: 'bg-slate-200',                           badge: 'bg-slate-100 text-slate-500' },
  in_progress:  { dot: 'bg-blue-400 ring-4 ring-blue-100',      badge: 'bg-blue-100 text-blue-700'   },
  completed:    { dot: 'bg-emerald-500',                         badge: 'bg-emerald-100 text-emerald-700' },
}

export default async function JourneyPage() {
  const [t, ts] = await Promise.all([
    getTranslations('journey'),
    getTranslations('stages'),
  ])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: journey } = await supabase
    .from('journey_progress')
    .select('*')
    .eq('student_id', user!.id)
    .single<JourneyProgress>()

  const completedCount = journey
    ? STAGES.filter((s) => journey[s.statusKey as keyof JourneyProgress] === 'completed').length
    : 0

  const statusLabel: Record<string, string> = {
    not_started: t('notStarted'),
    in_progress:  t('inProgress'),
    completed:    t('completed'),
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-slate-900">{t('overallProgress')}</p>
          <p className="text-sm font-semibold text-slate-600">{completedCount} / {STAGES.length} {t('stagesComplete')}</p>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${(completedCount / STAGES.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          {STAGES.map((stage) => {
            const status = (journey?.[stage.statusKey as keyof JourneyProgress] as string) ?? 'not_started'
            return (
              <div key={stage.key} className="flex flex-col items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full ${STATUS_STYLES[status].dot} transition-all`} />
                <span className="text-[10px] text-slate-400 hidden sm:block">{ts(stage.key)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage cards */}
      <div className="space-y-4">
        {STAGES.map((stage, i) => {
          const status = (journey?.[stage.statusKey as keyof JourneyProgress] as string) ?? 'not_started'
          const styles = STATUS_STYLES[status]

          return (
            <div key={stage.key} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl
                    ${status === 'completed' ? 'bg-emerald-50' : status === 'in_progress' ? 'bg-blue-50' : 'bg-slate-50'}`}>
                    {status === 'completed' ? '✓' : stage.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{ts(stage.key)}</h3>
                      <span className="hidden sm:block text-xs text-slate-400">Step {i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{t(stage.descKey as any)}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${styles.badge}`}>
                  {statusLabel[status]}
                </span>
              </div>

              <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{t('keySteps')}</p>
                <ul className="space-y-2">
                  {STEPS[stage.key].map((step, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className={`mt-0.5 text-base leading-none ${status === 'completed' ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {status === 'completed' ? '✓' : '○'}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {journey?.stage_notes?.[stage.key] && (
                <div className="border-t border-blue-100 bg-blue-50 px-5 py-3">
                  <p className="text-xs font-semibold text-blue-600 mb-1">{t('updatedByConsultant', { defaultValue: 'Note from your consultant' })}</p>
                  <p className="text-sm text-blue-800">{journey.stage_notes[stage.key]}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-6 text-sm text-slate-400 text-center">{t('updatedByConsultant')}</p>
    </div>
  )
}
