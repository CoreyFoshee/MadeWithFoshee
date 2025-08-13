"use client"

import { BrandCard } from "@/components/ui/brand-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageSquare, CheckCircle, MapPin } from "lucide-react"
import { format } from "date-fns"

interface Booking {
  id: string
  start_date: string
  end_date: string
  guests: number
  notes: string
  created_at: string
  guest_name?: string
  guest_email?: string
  listings: { name: string }
}

interface ApprovedBookingsProps {
  bookings: Booking[]
}

export default function ApprovedBookings({ bookings }: ApprovedBookingsProps) {
  if (bookings.length === 0) {
    return (
      <BrandCard className="text-center py-12">
        <div className="space-y-4">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
          <div>
            <h3 className="text-lg font-serif font-bold text-fos-neutral-deep mb-2">No confirmed bookings</h3>
            <p className="text-fos-neutral">Approved bookings will appear here once you approve them.</p>
          </div>
        </div>
      </BrandCard>
    )
  }

  // Sort bookings by start date (earliest first)
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Confirmed Bookings</h2>
        <Badge className="bg-green-100 text-green-800">
          {bookings.length} confirmed
        </Badge>
      </div>

      <div className="space-y-4">
        {sortedBookings.map((booking) => {
          const startDate = new Date(booking.start_date)
          const endDate = new Date(booking.end_date)
          const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
          const isUpcoming = startDate > new Date()
          const isCurrent = startDate <= new Date() && endDate >= new Date()

          return (
            <BrandCard key={booking.id} className="space-y-4">
              {/* Header with Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">{booking.listings.name}</h3>
                  <p className="text-sm text-fos-neutral">
                    Confirmed on {format(new Date(booking.created_at), "MMM dd, yyyy")}
                  </p>
                </div>
                <Badge className={
                  isCurrent 
                    ? "bg-blue-100 text-blue-800" 
                    : isUpcoming 
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }>
                  <div className="flex items-center gap-1">
                    {isCurrent ? (
                      <MapPin className="h-4 w-4" />
                    ) : isUpcoming ? (
                      <Calendar className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {isCurrent ? "Currently Staying" : isUpcoming ? "Upcoming" : "Completed"}
                  </div>
                </Badge>
              </div>

              {/* Guest Info */}
              <div className="flex items-center gap-2 text-sm text-fos-neutral">
                <Users className="h-4 w-4" />
                <span>
                  <strong>{booking.guest_name || booking.guest_email}</strong> - {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 text-sm text-fos-neutral">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")} ({nights} nights)
                </span>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="flex items-start gap-2 text-sm text-fos-neutral">
                  <MessageSquare className="h-4 w-4 mt-0.5" />
                  <span>{booking.notes}</span>
                </div>
              )}

              {/* Additional Info */}
              <div className="pt-2 border-t border-fos-neutral-light">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-fos-neutral-deep">Check-in:</span>
                    <p className="text-fos-neutral">{format(startDate, "EEEE, MMMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <span className="font-medium text-fos-neutral-deep">Check-out:</span>
                    <p className="text-fos-neutral">{format(endDate, "EEEE, MMMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>
            </BrandCard>
          )
        })}
      </div>
    </div>
  )
}
