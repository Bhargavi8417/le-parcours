'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard?welcome=1')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const redirectTo = formData.get('redirectTo') as string | null
    const base = `/login?error=${encodeURIComponent(error.message)}`
    redirect(redirectTo ? `${base}&redirect=${encodeURIComponent(redirectTo)}` : base)
  }

  revalidatePath('/', 'layout')

  // Explicit redirect (e.g. coming from /admin/dashboard while logged out)
  const redirectTo = formData.get('redirectTo') as string | null
  if (redirectTo?.startsWith('/')) redirect(redirectTo)

  // Role-based default destination
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const admin = await createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    if (profile?.role === 'admin') redirect('/admin/dashboard')
  }

  redirect('/dashboard')
}


export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
