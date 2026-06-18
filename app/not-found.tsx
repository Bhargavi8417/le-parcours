import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🇫🇷</div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">404</h1>
        <p className="text-lg text-slate-600 mb-2">Page not found</p>
        <p className="text-sm text-slate-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-white transition-colors"
          >
            My dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
