import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentNav from '@/components/student/StudentNav'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNav profile={profile} />
      <div className="lg:pl-60">
        <div className="pt-14 lg:pt-0 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  )
}
