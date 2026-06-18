import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  console.log('[AdminLayout] user.id:', user?.id ?? 'NONE', '| userError:', userError?.message ?? 'none')
  if (!user) {
    console.log('[AdminLayout] no user → /login')
    redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  console.log('[AdminLayout] role:', profile?.role ?? 'null', '| profileError:', profileError?.message ?? 'none')

  if (profile?.role !== 'admin') {
    console.log('[AdminLayout] REDIRECT → /dashboard (role was:', profile?.role, ')')
    redirect('/dashboard')
  }

  console.log('[AdminLayout] ✓ rendering admin layout')

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="lg:pl-60">
        <div className="pt-14 lg:pt-0 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  )
}
