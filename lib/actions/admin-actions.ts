'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')
  return { supabase, adminClient: await createAdminClient(), user }
}

// ────────────────────────────────────────────────────────── BOOKINGS

export async function updateBookingStatus(bookingId: string, status: string) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('bookings').update({ status }).eq('id', bookingId)
  revalidatePath('/admin/bookings')
}

export async function saveBookingAdminNotes(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const bookingId = formData.get('booking_id') as string
  const adminNotes = formData.get('admin_notes') as string
  await adminClient.from('bookings').update({ admin_notes: adminNotes || null }).eq('id', bookingId)
  revalidatePath('/admin/bookings')
}

// ────────────────────────────────────────────────────────── INQUIRIES

export async function updateInquiryStatus(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const id = formData.get('inquiry_id') as string
  const status = formData.get('status') as string
  const adminNotes = formData.get('admin_notes') as string
  await adminClient.from('inquiries').update({ status, admin_notes: adminNotes || null }).eq('id', id)
  revalidatePath('/admin/inquiries')
}

// ────────────────────────────────────────────────────────── JOURNEY

export async function updateJourneyProgress(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const studentId = formData.get('student_id') as string

  const stageNotes: Record<string, string> = {}
  for (const stage of ['application', 'campus_france', 'visa', 'arrival', 'settlement']) {
    const note = (formData.get(`note_${stage}`) as string)?.trim()
    if (note) stageNotes[stage] = note
  }

  await adminClient.from('journey_progress').update({
    current_stage: formData.get('current_stage'),
    application_status: formData.get('application_status'),
    campus_france_status: formData.get('campus_france_status'),
    visa_status: formData.get('visa_status'),
    arrival_status: formData.get('arrival_status'),
    settlement_status: formData.get('settlement_status'),
    ...(Object.keys(stageNotes).length > 0 ? { stage_notes: stageNotes } : {}),
  }).eq('student_id', studentId)

  redirect(`/admin/students/${studentId}?success=1`)
}

// ────────────────────────────────────────────────────────── SERVICES

export async function createService(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const { error } = await adminClient.from('services').insert({
    title: formData.get('title'),
    title_fr: formData.get('title_fr') || formData.get('title'),
    description: formData.get('description'),
    description_fr: formData.get('description_fr') || formData.get('description'),
    stage: formData.get('stage'),
    category: formData.get('category') || '',
    price: formData.get('price') ? Number(formData.get('price')) : null,
    duration_minutes: formData.get('duration_minutes') ? Number(formData.get('duration_minutes')) : null,
    is_active: true,
    sort_order: Number(formData.get('sort_order') || 0),
  })
  if (error) redirect(`/admin/services?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/services')
  revalidatePath('/services')
  redirect('/admin/services?success=created')
}

export async function updateService(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const id = formData.get('id') as string
  await adminClient.from('services').update({
    title: formData.get('title'),
    title_fr: formData.get('title_fr') || formData.get('title'),
    description: formData.get('description'),
    description_fr: formData.get('description_fr') || formData.get('description'),
    stage: formData.get('stage'),
    category: formData.get('category') || '',
    price: formData.get('price') ? Number(formData.get('price')) : null,
    duration_minutes: formData.get('duration_minutes') ? Number(formData.get('duration_minutes')) : null,
    sort_order: Number(formData.get('sort_order') || 0),
  }).eq('id', id)
  revalidatePath('/admin/services')
  revalidatePath('/services')
  redirect('/admin/services?success=updated')
}

export async function toggleServiceActive(serviceId: string, isActive: boolean) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('services').update({ is_active: !isActive }).eq('id', serviceId)
  revalidatePath('/admin/services')
  revalidatePath('/services')
}

export async function deleteService(serviceId: string) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('services').delete().eq('id', serviceId)
  revalidatePath('/admin/services')
  revalidatePath('/services')
}

// ────────────────────────────────────────────────────────── ARTICLES

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export async function createArticle(formData: FormData) {
  const { adminClient, user } = await requireAdmin()
  const rawSlug = (formData.get('slug') as string) || (formData.get('title') as string)
  const slug = makeSlug(rawSlug)
  const { error } = await adminClient.from('articles').insert({
    slug,
    title: formData.get('title'),
    title_fr: formData.get('title_fr') || formData.get('title'),
    content: formData.get('content'),
    content_fr: formData.get('content_fr') || formData.get('content'),
    stage: formData.get('stage') || null,
    category: formData.get('category') || null,
    cover_image_url: formData.get('cover_image_url') || null,
    is_published: formData.get('is_published') === 'true',
    author_id: user.id,
  })
  if (error) redirect(`/admin/articles/new?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/articles')
  revalidatePath('/guides')
  redirect('/admin/articles?success=created')
}

export async function updateArticle(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const id = formData.get('id') as string
  await adminClient.from('articles').update({
    title: formData.get('title'),
    title_fr: formData.get('title_fr') || formData.get('title'),
    content: formData.get('content'),
    content_fr: formData.get('content_fr') || formData.get('content'),
    stage: formData.get('stage') || null,
    category: formData.get('category') || null,
    cover_image_url: formData.get('cover_image_url') || null,
    is_published: formData.get('is_published') === 'true',
  }).eq('id', id)
  revalidatePath('/admin/articles')
  revalidatePath('/guides')
  redirect('/admin/articles?success=updated')
}

export async function toggleArticlePublished(articleId: string, isPublished: boolean) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('articles').update({ is_published: !isPublished }).eq('id', articleId)
  revalidatePath('/admin/articles')
  revalidatePath('/guides')
}

export async function deleteArticle(articleId: string) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('articles').delete().eq('id', articleId)
  revalidatePath('/admin/articles')
  revalidatePath('/guides')
}

// ────────────────────────────────────────────────────────── LOCATIONS

export async function createLocation(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const { error } = await adminClient.from('locations').insert({
    name: formData.get('name'),
    name_fr: formData.get('name_fr') || formData.get('name'),
    description: formData.get('description') || null,
    description_fr: formData.get('description_fr') || null,
    city: formData.get('city') || 'Paris',
    is_active: true,
    sort_order: Number(formData.get('sort_order') || 0),
  })
  if (error) redirect(`/admin/accommodations?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
  redirect('/admin/accommodations?success=location_created')
}

export async function toggleLocationActive(locationId: string, isActive: boolean) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('locations').update({ is_active: !isActive }).eq('id', locationId)
  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
}

export async function deleteLocation(locationId: string) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('locations').delete().eq('id', locationId)
  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
}

// ────────────────────────────────────────────────────────── ACCOMMODATIONS

export async function createAccommodation(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const amenitiesRaw = (formData.get('amenities') as string) || ''
  const amenities = amenitiesRaw ? amenitiesRaw.split(',').map((a) => a.trim()).filter(Boolean) : null
  const { error } = await adminClient.from('accommodations').insert({
    location_id: formData.get('location_id'),
    title: formData.get('title'),
    title_fr: formData.get('title_fr') || formData.get('title'),
    description: formData.get('description') || null,
    description_fr: formData.get('description_fr') || null,
    type: formData.get('type'),
    price_per_month: formData.get('price_per_month') ? Number(formData.get('price_per_month')) : null,
    is_available: formData.get('is_available') === 'true',
    available_from: formData.get('available_from') || null,
    address: formData.get('address') || null,
    amenities,
  })
  if (error) redirect(`/admin/accommodations?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
  redirect('/admin/accommodations?success=accom_created')
}

export async function updateAccommodation(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const id = formData.get('id') as string
  const amenitiesRaw = (formData.get('amenities') as string) || ''
  const amenities = amenitiesRaw ? amenitiesRaw.split(',').map((a) => a.trim()).filter(Boolean) : null
  await adminClient.from('accommodations').update({
    title: formData.get('title'),
    title_fr: formData.get('title_fr') || formData.get('title'),
    description: formData.get('description') || null,
    description_fr: formData.get('description_fr') || null,
    type: formData.get('type'),
    price_per_month: formData.get('price_per_month') ? Number(formData.get('price_per_month')) : null,
    address: formData.get('address') || null,
    amenities,
  }).eq('id', id)
  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
}

export async function toggleAccommodationAvailability(id: string, current: boolean) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('accommodations').update({ is_available: !current }).eq('id', id)
  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
}

export async function deleteAccommodation(id: string) {
  const { adminClient } = await requireAdmin()
  await adminClient.from('accommodations').delete().eq('id', id)
  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
}

// ────────────────────────────────────────────────────────── ACCOMMODATION IMAGES

export async function uploadAccommodationImages(formData: FormData) {
  const { adminClient } = await requireAdmin()
  const accommodationId = formData.get('accommodation_id') as string
  const files = formData.getAll('files') as File[]

  const { data: existing } = await adminClient
    .from('accommodation_images')
    .select('sort_order')
    .eq('accommodation_id', accommodationId)
    .order('sort_order', { ascending: false })
    .limit(1)

  let nextOrder = (existing?.[0]?.sort_order ?? -1) + 1
  let firstUploadedUrl: string | null = null

  for (const file of files) {
    if (!file || file.size === 0) continue
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${accommodationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('accommodations')
      .upload(path, file, { upsert: false })
    if (uploadError) continue
    const { data: { publicUrl } } = adminClient.storage.from('accommodations').getPublicUrl(uploadData.path)
    await adminClient.from('accommodation_images').insert({
      accommodation_id: accommodationId,
      image_url: publicUrl,
      sort_order: nextOrder,
    })
    if (nextOrder === 0) firstUploadedUrl = publicUrl
    nextOrder++
  }

  if (firstUploadedUrl) {
    const { data: accom } = await adminClient
      .from('accommodations').select('cover_image_url').eq('id', accommodationId).single()
    if (!accom?.cover_image_url) {
      await adminClient.from('accommodations')
        .update({ cover_image_url: firstUploadedUrl }).eq('id', accommodationId)
    }
  }

  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
}

export async function deleteAccommodationImage(imageId: string, imageUrl: string) {
  const { adminClient } = await requireAdmin()
  const urlParts = imageUrl.split('/accommodations/')
  if (urlParts.length > 1) {
    await adminClient.storage.from('accommodations').remove([urlParts[1]])
  }
  await adminClient.from('accommodation_images').delete().eq('id', imageId)
  revalidatePath('/admin/accommodations')
  revalidatePath('/accommodations')
}
