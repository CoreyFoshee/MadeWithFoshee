import { createClient } from "@/lib/supabase/server"

export async function getContentBlocks() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("content_blocks")
    .select("*")
    .order("position", { ascending: true })

  if (error) {
    console.error("Error fetching content blocks:", error)
    return []
  }

  return data || []
}

export async function getListings(filters?: any) {
  const supabase = createClient()
  
  let query = supabase.from("listings").select("*")

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }

  if (filters?.maxGuests) {
    query = query.gte("max_guests", filters.maxGuests)
  }

  if (filters?.minNights) {
    query = query.gte("min_nights", filters.minNights)
  }

  const { data, error } = await query.order("name", { ascending: true })

  if (error) {
    console.error("Error fetching listings:", error)
    return []
  }

  return data || []
}

export async function getBookings(userId?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from("bookings")
    .select(`
      *,
      listings (name, description),
      profiles (full_name, email)
    `)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query.order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data || []
}

export async function getBlackoutDates() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("blackout_dates")
    .select(`
      *,
      listings (name)
    `)
    .order("start_date", { ascending: true })

  if (error) {
    console.error("Error fetching blackout dates:", error)
    return []
  }

  return data || []
}
