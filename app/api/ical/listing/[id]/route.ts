import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { createEvents } from "ics"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  try {
    // Get approved bookings for the listing
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        listings (name),
        profiles (full_name)
      `,
      )
      .eq("listing_id", params.id)
      .eq("status", "approved")

    if (error) {
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    // Convert bookings to iCal events
    const events = bookings?.map((booking) => {
      const startDate = new Date(booking.start_date)
      const endDate = new Date(booking.end_date)

      return {
        start: [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()],
        end: [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()],
        title: `${booking.listings.name} - ${booking.profiles.full_name}`,
        description: `Booking for ${booking.guests} guests${booking.notes ? `\n\nNotes: ${booking.notes}` : ""}`,
        location: booking.listings.name,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        uid: `booking-${booking.id}@madebyfoshee.com`,
      }
    })

    // Generate iCal content
    const { error: icsError, value: icsContent } = createEvents(events || [])

    if (icsError) {
      return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 })
    }

    // Return iCal file
    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": `attachment; filename="lake-house-bookings.ics"`,
      },
    })
  } catch (error) {
    console.error("iCal generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
