import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null): string {
  if (price === null) return 'Contact for price'
  if (price === 0) return 'Free'
  return `€${price}`
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const STAGE_LABELS: Record<string, string> = {
  pre_arrival: 'Pre-Arrival',
  post_arrival: 'Post-Arrival',
  settlement: 'Settlement',
  miscellaneous: 'Miscellaneous',
  application: 'Application',
  campus_france: 'Campus France',
  visa: 'Visa',
  arrival: 'Arrival',
}

export const STAGE_COLORS: Record<string, string> = {
  pre_arrival: 'bg-violet-100 text-violet-700',
  post_arrival: 'bg-blue-100 text-blue-700',
  settlement: 'bg-emerald-100 text-emerald-700',
  miscellaneous: 'bg-amber-100 text-amber-700',
}

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

export const INQUIRY_STATUS_COLORS: Record<string, string> = {
  new:     'bg-violet-100 text-violet-700',
  read:    'bg-slate-100 text-slate-600',
  replied: 'bg-emerald-100 text-emerald-700',
}

export const ACCOMMODATION_TYPE_LABELS: Record<string, string> = {
  studio:      'Studio',
  shared_room: 'Shared Room',
  apartment:   'Apartment',
  residence:   'Student Residence',
  homestay:    'Homestay',
}
