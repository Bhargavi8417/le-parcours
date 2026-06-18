export type UserRole = 'student' | 'admin'
export type ServiceStage = 'pre_arrival' | 'post_arrival' | 'settlement' | 'miscellaneous'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type JourneyStage = 'application' | 'campus_france' | 'visa' | 'arrival' | 'settlement'
export type StageStatus = 'not_started' | 'in_progress' | 'completed'
export type InquiryStatus = 'new' | 'read' | 'replied'
export type AccommodationType = 'studio' | 'shared_room' | 'apartment' | 'residence' | 'homestay'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  phone: string | null
  nationality: string | null
  university: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  title_fr: string
  description: string
  description_fr: string
  stage: ServiceStage
  category: string
  price: number | null
  duration_minutes: number | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Booking {
  id: string
  student_id: string
  service_id: string
  status: BookingStatus
  scheduled_at: string | null
  notes: string | null
  admin_notes: string | null
  flight_number: string | null
  pickup_location: string | null
  created_at: string
  updated_at: string
  service?: Service
  student?: Profile
}

export interface JourneyProgress {
  id: string
  student_id: string
  current_stage: JourneyStage
  application_status: StageStatus
  campus_france_status: StageStatus
  visa_status: StageStatus
  arrival_status: StageStatus
  settlement_status: StageStatus
  stage_notes: Record<string, string> | null
  updated_at: string
}

export interface DocumentTemplate {
  id: string
  stage: JourneyStage
  name: string
  name_fr: string
  description: string | null
  is_required: boolean
  sort_order: number
}

export interface StudentDocument {
  id: string
  student_id: string
  template_id: string
  is_completed: boolean
  file_url: string | null
  file_name: string | null
  uploaded_at: string | null
  template?: DocumentTemplate
}

export interface Inquiry {
  id: string
  student_id: string | null
  name: string
  email: string
  subject: string
  message: string
  status: InquiryStatus
  admin_notes: string | null
  created_at: string
}

export interface Article {
  id: string
  slug: string
  title: string
  title_fr: string
  content: string
  content_fr: string
  stage: ServiceStage | null
  category: string | null
  is_published: boolean
  cover_image_url: string | null
  author_id: string
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  name: string
  name_fr: string
  description: string | null
  description_fr: string | null
  city: string
  is_active: boolean
  sort_order: number
  created_at: string
  accommodations?: Accommodation[]
}

export interface Accommodation {
  id: string
  location_id: string
  title: string
  title_fr: string | null
  description: string | null
  description_fr: string | null
  type: AccommodationType
  price_per_month: number | null
  is_available: boolean
  available_from: string | null
  address: string | null
  amenities: string[] | null
  cover_image_url: string | null
  created_at: string
  updated_at: string
  location?: Location
  images?: AccommodationImage[]
}

export interface AccommodationImage {
  id: string
  accommodation_id: string
  image_url: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface AccommodationInquiry {
  id: string
  accommodation_id: string
  student_id: string | null
  name: string
  email: string
  message: string | null
  created_at: string
  accommodation?: Accommodation
}
