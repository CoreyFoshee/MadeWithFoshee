"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const createBookingSchema = z.object({
  listingId: z.string().uuid("Invalid listing ID"),
  startDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Invalid start date"),
  endDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Invalid end date"),
  guests: z.number().min(1, "At least 1 guest required").max(20, "Too many guests"),
  notes: z.string().optional(),
})

export async function createBooking(prevState: any, formData: FormData) {
  const supabase = createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to make a booking" }
  }

  // Validate form data
  const rawData = {
    listingId: formData.get("listingId")?.toString(),
    startDate: formData.get("startDate")?.toString(),
    endDate: formData.get("endDate")?.toString(),
    guests: Number.parseInt(formData.get("guests")?.toString() || "0"),
    notes: formData.get("notes")?.toString() || "",
  }

  const validation = createBookingSchema.safeParse(rawData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { listingId, startDate, endDate, guests, notes } = validation.data

  const start = new Date(startDate)
  const end = new Date(endDate)

  // Validate date range
  if (start >= end) {
    return { error: "End date must be after start date" }
  }

  if (start < new Date()) {
    return { error: "Start date cannot be in the past" }
  }

  // Get listing details
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single()

  if (listingError || !listing) {
    return { error: "Listing not found" }
  }

  // Check minimum nights
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (nights < listing.min_nights) {
    return { error: `Minimum stay is ${listing.min_nights} nights` }
  }

  // Check maximum guests
  if (guests > listing.max_guests) {
    return { error: `Maximum ${listing.max_guests} guests allowed` }
  }

  try {
    // Check for booking overlaps using the RPC function
    const { data: bookingOverlap } = await supabase.rpc("booking_overlap", {
      p_listing: listingId,
      p_start: start.toISOString().split("T")[0],
      p_end: end.toISOString().split("T")[0],
    })

    if (bookingOverlap && bookingOverlap.length > 0) {
      return { error: "Selected dates are not available" }
    }

    // Check for blackout overlaps using the RPC function
    const { data: blackoutOverlap } = await supabase.rpc("blackout_overlap", {
      p_listing: listingId,
      p_start: start.toISOString().split("T")[0],
      p_end: end.toISOString().split("T")[0],
    })

    if (blackoutOverlap && blackoutOverlap.length > 0) {
      return { error: "Selected dates are not available" }
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        listing_id: listingId,
        user_id: user.id,
        start_date: start.toISOString().split("T")[0],
        end_date: end.toISOString().split("T")[0],
        guests,
        notes,
        status: "pending",
      })
      .select()
      .single()

    if (bookingError) {
      console.error("Booking creation error:", bookingError)
      return { error: "Failed to create booking. Please try again." }
    }

    // Send email notification (placeholder - would use Resend in production)
    try {
      await sendBookingNotification({
        booking,
        listing,
        user,
        type: "request",
      })
    } catch (emailError) {
      console.error("Email notification error:", emailError)
      // Don't fail the booking if email fails
    }

    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("Booking error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Placeholder for email notification - would use Resend API in production
async function sendBookingNotification({
  booking,
  listing,
  user,
  type,
}: {
  booking: any
  listing: any
  user: any
  type: "request" | "approved" | "denied" | "cancelled"
}) {
  // In production, this would use Resend API
  console.log(`Sending ${type} email for booking ${booking.id}`)
  console.log(`To: ${user.email}`)
  console.log(`Listing: ${listing.name}`)
  console.log(`Dates: ${booking.start_date} to ${booking.end_date}`)

  // Example Resend implementation:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
            from: 'Lake With Foshee <noreply@lakewithfoshee.com>',
    to: [user.email],
    subject: `Booking ${type} - ${listing.name}`,
    html: generateEmailTemplate(booking, listing, user, type)
  })
  */
}

export async function approveBooking(bookingId: string) {
  const supabase = createClient()

  // Check if user is owner
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

  if (profile?.role !== "owner") {
    return { error: "Only owners can approve bookings" }
  }

  const { error } = await supabase.from("bookings").update({ status: "approved" }).eq("id", bookingId)

  if (error) {
    return { error: "Failed to approve booking" }
  }

  return { success: true }
}

export async function denyBooking(bookingId: string) {
  const supabase = createClient()

  // Check if user is owner
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

  if (profile?.role !== "owner") {
    return { error: "Only owners can deny bookings" }
  }

  const { error } = await supabase.from("bookings").update({ status: "denied" }).eq("id", bookingId)

  if (error) {
    return { error: "Failed to deny booking" }
  }

  return { success: true }
}

export async function cancelBooking(bookingId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Users can only cancel their own bookings
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("user_id", user.id)

  if (error) {
    return { error: "Failed to cancel booking" }
  }

  return { success: true }
}

export async function createBlackout(prevState: any, formData: FormData) {
  const supabase = createClient()

  // Check if user is owner
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

  if (profile?.role !== "owner") {
    return { error: "Only owners can create blackout dates" }
  }

  const listingId = formData.get("listingId")?.toString()
  const startDate = formData.get("startDate")?.toString()
  const endDate = formData.get("endDate")?.toString()
  const reason = formData.get("reason")?.toString() || ""

  if (!listingId || !startDate || !endDate) {
    return { error: "Missing required fields" }
  }

  const { error } = await supabase.from("blackout_dates").insert({
    listing_id: listingId,
    start_date: startDate,
    end_date: endDate,
    reason,
  })

  if (error) {
    return { error: "Failed to create blackout dates" }
  }

  return { success: true }
}
