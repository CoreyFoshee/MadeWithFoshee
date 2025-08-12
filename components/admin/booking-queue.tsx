"use client"

import { useState } from "react"
import { approveBooking, denyBooking } from "@/app/actions/admin-actions"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react"
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

interface BookingQueueProps {
  bookings: Booking[]
}

function ApproveButton({ bookingId }: { bookingId: string }) {
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await approveBooking(bookingId)
      // Optionally refresh the page or update state
      window.location.reload()
    } catch (error) {
      console.error('Error approving booking:', error)
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <Button 
      type="button" 
      disabled={isApproving} 
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={handleApprove}
    >
      {isApproving ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Approving...
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve
        </>
      )}
    </Button>
  )
}

function DenyButton({ bookingId }: { bookingId: string }) {
  const [isDenying, setIsDenying] = useState(false)

  const handleDeny = async () => {
    setIsDenying(true)
    try {
      await denyBooking(bookingId)
      // Optionally refresh the page or update state
      window.location.reload()
    } catch (error) {
      console.error('Error denying booking:', error)
    } finally {
      setIsDenying(false)
    }
  }

  return (
    <Button
      type="button"
      disabled={isDenying}
      variant="outline"
      className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
      onClick={handleDeny}
    >
      {isDenying ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Denying...
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 mr-2" />
          Deny
        </>
      )}
    </Button>
  )
}

export default function BookingQueue({ bookings }: BookingQueueProps) {
  if (bookings.length === 0) {
    return (
      <BrandCard className="text-center py-12">
        <div className="space-y-4">
          <CheckCircle className="h-12 w-12 text-fos-primary mx-auto" />
          <div>
            <h3 className="text-lg font-serif font-bold text-fos-neutral-deep mb-2">All caught up!</h3>
            <p className="text-fos-neutral">No pending booking requests to review.</p>
          </div>
        </div>
      </BrandCard>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Pending Booking Requests</h2>
        <Badge className="bg-orange-100 text-orange-800">{bookings.length} pending</Badge>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const startDate = new Date(booking.start_date)
          const endDate = new Date(booking.end_date)
          const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

          return (
            <BrandCard key={booking.id}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">
                      {booking.listings.name} - {booking.guest_name || booking.guest_email}
                    </h3>
                    <p className="text-sm text-fos-neutral">
                      Requested on {format(new Date(booking.created_at), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-fos-neutral-deep">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Dates</span>
                    </div>
                    <p className="text-fos-neutral">
                      {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}
                    </p>
                    <p className="text-sm text-fos-neutral">{nights} nights</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-fos-neutral-deep">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Guests</span>
                    </div>
                    <p className="text-fos-neutral">{booking.guests} guests</p>
                  </div>

                  {booking.notes && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-fos-neutral-deep">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Notes</span>
                      </div>
                      <p className="text-sm text-fos-neutral">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-fos-neutral-light">
                  <form action={approveBooking}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <ApproveButton bookingId={booking.id} />
                  </form>
                  <form action={denyBooking}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <DenyButton bookingId={booking.id} />
                  </form>
                </div>
              </div>
            </BrandCard>
          )
        })}
      </div>
    </div>
  )
}
