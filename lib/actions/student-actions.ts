'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ── Bookings ────────────────────────────────────────────────

export async function createBooking(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('bookings').insert({
    student_id:      user.id,
    service_id:      formData.get('service_id') as string,
    scheduled_at:    formData.get('scheduled_at') as string || null,
    notes:           formData.get('notes') as string || null,
    flight_number:   formData.get('flight_number') as string || null,
    pickup_location: formData.get('pickup_location') as string || null,
  })

  if (error) redirect(`/bookings/new?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/bookings')
  redirect('/bookings?success=1')
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('student_id', user.id)

  revalidatePath('/bookings')
}

// ── Documents ───────────────────────────────────────────────

export async function toggleDocument(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const templateId = formData.get('template_id') as string
  const isCompleted = formData.get('is_completed') === 'true'

  await supabase
    .from('student_documents')
    .upsert({
      student_id:   user.id,
      template_id:  templateId,
      is_completed: isCompleted,
    }, { onConflict: 'student_id,template_id' })

  revalidatePath('/documents')
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const templateId = formData.get('template_id') as string
  const file = formData.get('file') as File

  if (!file || file.size === 0) return

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${templateId}.${ext}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(path, file, { upsert: true })

  if (uploadError) return

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(uploadData.path)

  await supabase
    .from('student_documents')
    .upsert({
      student_id:   user.id,
      template_id:  templateId,
      is_completed: true,
      file_url:     publicUrl,
      file_name:    file.name,
      uploaded_at:  new Date().toISOString(),
    }, { onConflict: 'student_id,template_id' })

  revalidatePath('/documents')
}

// ── Profile ─────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name:   formData.get('full_name') as string,
      phone:       formData.get('phone') as string || null,
      nationality: formData.get('nationality') as string || null,
      university:  formData.get('university') as string || null,
    })
    .eq('id', user.id)

  if (error) redirect(`/profile?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/profile')
  redirect('/profile?success=1')
}

// ── Inquiries ────────────────────────────────────────────────

export async function submitInquiry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('inquiries').insert({
    student_id: user?.id ?? null,
    name:       formData.get('name') as string,
    email:      formData.get('email') as string,
    subject:    formData.get('subject') as string,
    message:    formData.get('message') as string,
  })

  if (error) return { error: error.message }
  return { success: true }
}

// ── Accommodation Inquiry ────────────────────────────────────

export async function submitAccommodationInquiry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('accommodation_inquiries').insert({
    accommodation_id: formData.get('accommodation_id') as string,
    student_id:       user?.id ?? null,
    name:             formData.get('name') as string,
    email:            formData.get('email') as string,
    message:          formData.get('message') as string || null,
  })

  revalidatePath('/accommodations')
}
