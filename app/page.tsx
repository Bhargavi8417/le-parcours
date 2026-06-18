import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import LandingNav from '@/components/landing/LandingNav'
import FaqAccordion from '@/components/landing/FaqAccordion'

export default async function LandingPage() {
  const t = await getTranslations('landing')

  const heroTitle = t('heroTitle')
  const heroHighlight = t('heroHighlight')
  const heroLine1 = heroTitle.replace(heroHighlight, '').trimEnd()

  const stages = [
    {
      emoji: '✈️',
      label: t('stagePreLabel'),
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      services: [t('stagePreService1'), t('stagePreService2'), t('stagePreService3'), t('stagePreService4')],
    },
    {
      emoji: '🛬',
      label: t('stagePostLabel'),
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      services: [t('stagePostService1'), t('stagePostService2'), t('stagePostService3'), t('stagePostService4')],
    },
    {
      emoji: '🏡',
      label: t('stageSettleLabel'),
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      services: [t('stageSettleService1'), t('stageSettleService2'), t('stageSettleService3'), t('stageSettleService4')],
    },
    {
      emoji: '⭐',
      label: t('stageMiscLabel'),
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      services: [t('stageMiscService1'), t('stageMiscService2'), t('stageMiscService3'), t('stageMiscService4')],
    },
  ]

  const serviceCards = [
    { icon: '🎓', title: t('servicePreview1Title'), stage: t('serviceStagePreArrival'), price: '€150', desc: t('servicePreview1Desc') },
    { icon: '📋', title: t('servicePreview2Title'), stage: t('serviceStagePreArrival'), price: '€100', desc: t('servicePreview2Desc') },
    { icon: '📄', title: t('servicePreview3Title'), stage: t('serviceStagePreArrival'), price: '€120', desc: t('servicePreview3Desc') },
    { icon: '🚗', title: t('servicePreview4Title'), stage: t('serviceStagePostArrival'), price: '€80',  desc: t('servicePreview4Desc') },
    { icon: '🏦', title: t('servicePreview5Title'), stage: t('serviceStageSettlement'),  price: '€50',  desc: t('servicePreview5Desc') },
    { icon: '💊', title: t('servicePreview6Title'), stage: t('serviceStageSettlement'),  price: '€40',  desc: t('servicePreview6Desc') },
  ]

  const whyUs = [
    { icon: '🗺️', title: t('why1Title'), desc: t('why1Desc') },
    { icon: '🤝', title: t('why2Title'), desc: t('why2Desc') },
    { icon: '🇫🇷', title: t('why3Title'), desc: t('why3Desc') },
    { icon: '🛡️', title: t('why4Title'), desc: t('why4Desc') },
  ]

  const accomCards = [
    { location: t('accomPreview1Location'), type: t('accomPreview1Type'), price: t('accomPreview1Price'), available: true,  img: '🏛️' },
    { location: t('accomPreview2Location'), type: t('accomPreview2Type'), price: t('accomPreview2Price'), available: true,  img: '🗼' },
    { location: t('accomPreview3Location'), type: t('accomPreview3Type'), price: t('accomPreview3Price'), available: false, img: '🏫' },
  ]

  const testimonials = [
    { quote: t('testimonial1Quote'), name: t('testimonial1Name'), from: t('testimonial1From'), program: t('testimonial1Program') },
    { quote: t('testimonial2Quote'), name: t('testimonial2Name'), from: t('testimonial2From'), program: t('testimonial2Program') },
    { quote: t('testimonial3Quote'), name: t('testimonial3Name'), from: t('testimonial3From'), program: t('testimonial3Program') },
  ]

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
    { q: t('faq6Q'), a: t('faq6A') },
  ]

  const footerServices = [
    t('footerService1'), t('footerService2'), t('footerService3'), t('footerService4'), t('footerService5'),
  ]

  const footerResources = [
    t('footerResource1'), t('footerResource2'), t('footerResource3'), t('footerResource4'), t('footerResource5'),
  ]

  return (
    <div className="bg-white">
      <LandingNav />

      {/* Hero */}
      <section className="pt-16 min-h-[92vh] flex items-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <span>🇫🇷</span> {t('heroEyebrow')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {heroLine1}<br />
              <span className="text-blue-400">{heroHighlight}</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-7 py-4 rounded-xl transition-colors text-base"
              >
                {t('heroCta')}
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-4 rounded-xl transition-colors border border-white/20 text-base"
              >
                {t('heroSecondaryCta')}
              </a>
            </div>

            {/* Stats */}
            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
              {[
                { value: t('stat1Value'), label: t('stat1Label') },
                { value: t('stat2Value'), label: t('stat2Label') },
                { value: t('stat3Value'), label: t('stat3Label') },
                { value: t('stat4Value'), label: t('stat4Label') },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey stages */}
      <section id="journey" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">{t('stagesEyebrow')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('stagesTitle')}</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">{t('stagesSubtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stages.map((stage) => (
              <div key={stage.label} className={`rounded-2xl border p-6 ${stage.bg} ${stage.border}`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-lg mb-4`}>
                  {stage.emoji}
                </div>
                <h3 className="font-bold text-slate-900 mb-3">{stage.label}</h3>
                <ul className="space-y-1.5">
                  {stage.services.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400">›</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services catalog */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">{t('servicesEyebrow')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('servicesTitle')}</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">{t('servicesSubtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceCards.map((s) => (
              <div key={s.title} className="group border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-sm font-semibold text-slate-900">{s.price}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{s.desc}</p>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{s.stage}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              {t('seeAllServices')}
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">{t('whyEyebrow')}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">{t('whyTitle')}</h2>
              <p className="text-slate-500 leading-relaxed mb-8">{t('whyBody')}</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                {t('createFreeAccount')}
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {whyUs.map((w) => (
                <div key={w.title} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="text-2xl mb-3">{w.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-1">{w.title}</h3>
                  <p className="text-sm text-slate-500">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accommodations preview */}
      <section id="accommodations" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">{t('accomEyebrow')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('accomTitle')}</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">{t('accomSubtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {accomCards.map((a) => (
              <div key={a.location} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
                  {a.img}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{a.location}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${a.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {a.available ? t('previewAvailable') : t('previewUnavailable')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{a.type}</p>
                  <p className="font-bold text-slate-900">{a.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/signup" className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-6 py-3 rounded-xl transition-colors">
              {t('browseAccom')}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-2">{t('testimonialsEyebrow')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('testimonialsTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <p className="text-white/80 text-sm leading-relaxed mb-5">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{testimonial.from}</p>
                  <p className="text-white/40 text-xs">{testimonial.program}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">{t('faqEyebrow')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('faqTitle')}</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 px-6 py-2">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
          <p className="text-white/70 text-lg mb-8">{t('ctaBody')}</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-blue-700 font-bold px-8 py-4 rounded-xl transition-colors text-base">
            {t('ctaButton')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🇫🇷</span>
                <span className="font-semibold text-white">Le Parcours</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{t('footerTagline')}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">{t('footerServices')}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {footerServices.map((s) => (
                  <li key={s}><Link href="/signup" className="hover:text-white transition-colors">{s}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">{t('footerResources')}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {footerResources.map((s) => (
                  <li key={s}><Link href="/signup" className="hover:text-white transition-colors">{s}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} {t('footerCopyright')}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link href="/login" className="hover:text-white transition-colors">{t('footerSignIn')}</Link>
              <Link href="/signup" className="hover:text-white transition-colors">{t('footerCreateAccount')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
