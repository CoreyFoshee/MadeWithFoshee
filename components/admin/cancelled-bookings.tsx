"use client"

import { BrandCard } from "@/components/ui/brand-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageSquare, XCircle, MapPin } from "lucide-react"
import { format } from "date-fns"

interface Booking {
  id: string
  start_date: string
  end_date: string
  guests: number
  notes: string
  created_at: string
  cancelled_at?: string | { toDate: () => Date } | number
  cancelled_by?: string
  guest_name?: string
  guest_email?: string
  listings: { name: string }
}

interface CancelledBookingsProps {
  bookings: Booking[]
}

export default function CancelledBookings({ bookings }: CancelledBookingsProps) {
  if (bookings.length === 0) {
    return (
      <BrandCard className="text-center py-12">
        <div className="space-y-4">
          <XCircle className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-serif font-bold text-fos-neutral-deep mb-2">No cancelled bookings</h3>
            <p className="text-fos-neutral">Cancelled bookings will appear here.</p>
          </div>
        </div>
      </BrandCard>
    )
  }

  // Sort bookings by cancellation date (most recent first)
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = a.cancelled_at ? new Date(a.cancelled_at).getTime() : new Date(a.created_at).getTime()
    const dateB = b.cancelled_at ? new Date(b.cancelled_at).getTime() : new Date(b.created_at).getTime()
    return dateB - dateA
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Cancelled Bookings</h2>
        <Badge className="bg-red-100 text-red-800">
          {bookings.length} cancelled
        </Badge>
      </div>

      <div className="space-y-4">
        {sortedBookings.map((booking) => {
          const startDate = new Date(booking.start_date)
          const endDate = new Date(booking.end_date)
          const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
          
          // Handle Firebase Timestamp objects properly
          let cancelledDate = null
          try {
            if (booking.cancelled_at) {
              if (typeof booking.cancelled_at === 'object' && booking.cancelled_at.toDate) {
                // Firebase Timestamp object
                cancelledDate = booking.cancelled_at.toDate()
              } else if (typeof booking.cancelled_at === 'string') {
                // String date
                cancelledDate = new Date(booking.cancelled_at)
              } else if (typeof booking.cancelled_at === 'number') {
                // Unix timestamp
                cancelledDate = new Date(booking.cancelled_at)
              }
            }
          } catch (error) {
            console.warn('Error parsing cancelled_at date:', error, booking.cancelled_at)
            cancelledDate = null
          }

          return (
            <BrandCard key={booking.id} className="space-y-4 border-l-4 border-l-red-400">
              {/* Header with Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">{booking.listings.name}</h3>
                                  <p className="text-sm text-fos-neutral">
                  Cancelled on {cancelledDate && !isNaN(cancelledDate.getTime()) ? format(cancelledDate, "MMM dd, yyyy") : "Unknown date"}
                </p>
                </div>
                <Badge className="bg-red-100 text-red-800">
                  <div className="flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    Cancelled
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
                {cancelledDate && (
                  <div className="mt-2 pt-2 border-t border-fos-neutral-light">
                    <span className="font-medium text-fos-neutral-deep">Cancelled:</span>
                    <p className="text-fos-neutral">{format(cancelledDate, "EEEE, MMMM dd, yyyy 'at' h:mm a")}</p>
                  </div>
                )}
              </div>
            </BrandCard>
          )
        })}
      </div>
    </div>
  )
}
