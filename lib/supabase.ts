import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  location: string | null
  avatar_url: string | null
  favorite_sports: string[] | null
  role: string | null // Added role field
  created_at: string
  updated_at: string
}

export interface Venue {
  id: string
  name: string
  location: string
  description: string | null
  image_url: string | null
  rating: number
  review_count: number
  price_per_hour: number
  amenities: string[]
  sports: string[]
  contact_phone: string | null
  contact_email: string | null
  address: string | null
  availability_status: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  venue_id: string
  booking_date: string
  time_slots: string[]
  sport: string
  player_count: number
  total_amount: number
  platform_fee: number
  final_amount: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  booking_id: string
  user_name: string | null
  user_phone: string | null
  user_email: string | null
  special_notes: string | null
  payment_status: "pending" | "completed" | "failed" | "refunded"
  payment_id: string | null
  created_at: string
  updated_at: string
  venues?: Venue
}

export interface VenueAvailability {
  id: string
  venue_id: string
  date: string
  time_slot: string
  is_available: boolean
  created_at: string
}
