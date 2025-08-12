"use client"

import { useSearchParams } from "next/navigation"
import { cancelBooking } from "@/app/actions/booking-actions"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageSquare, CheckCircle, XCircle, Clock, Ban, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

interface Booking {
  id: string
  start_date: string
  end_date: string
  guests: number
  notes: string
  status: "pending" | "approved" | "denied" | "cancelled"
  created_at: string
  guest_name?: string
  guest_email?: string
  listings: {
    name: string
    description: string
  }
}

interface MyTripsClientProps {
  initialBookings: Booking[]
}

function CancelButton({ bookingId }: { bookingId: string }) {
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      await cancelBooking(bookingId)
    } catch (error) {
      console.error('Error cancelling booking:', error)
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <Button
      type="button"
      disabled={isCancelling}
      variant="outline"
      size="sm"
      className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
      onClick={handleCancel}
    >
      {isCancelling ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Cancelling...
        </>
      ) : (
        "Cancel Request"
      )}
    </Button>
  )
}

export default function MyTripsClient({ initialBookings }: MyTripsClientProps) {
  const searchParams = useSearchParams()

  const showSuccess = searchParams.get("success") === "true"
  const newBookingId = searchParams.get("booking")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "denied":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "cancelled":
        return <Ban className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-orange-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "denied":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-orange-100 text-orange-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-fos-neutral-deep mb-2">My Trips</h1>
          <p className="text-fos-neutral">Manage your booking requests and confirmed stays</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <BrandCard className="border-green-200 bg-green-50">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">Booking Request Submitted!</h3>
                <p className="text-sm text-green-700">
                  Your booking request has been sent to the property owner. You'll receive an email once it's reviewed.
                </p>
              </div>
            </div>
          </BrandCard>
        )}

        {/* Bookings List */}
        {initialBookings.length === 0 ? (
          <BrandCard className="text-center py-12">
            <div className="space-y-4">
              <Calendar className="h-12 w-12 text-fos-neutral mx-auto" />
              <div>
                <h3 className="text-lg font-serif font-bold text-fos-neutral-deep mb-2">No trips yet</h3>
                <p className="text-fos-neutral mb-4">Start planning your lake house getaway!</p>
                <Button asChild className="bg-fos-primary hover:bg-fos-primary-dark text-white">
                  <a href="/">Browse Properties</a>
                </Button>
              </div>
            </div>
          </BrandCard>
        ) : (
          <div className="space-y-6">
            {initialBookings.map((booking) => {
              const startDate = new Date(booking.start_date)
              const endDate = new Date(booking.end_date)
              const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
              const isNewBooking = booking.id === newBookingId

              return (
                <BrandCard key={booking.id} className={isNewBooking ? "ring-2 ring-fos-primary" : ""}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">{booking.listings.name}</h3>
                        <p className="text-sm text-fos-neutral">
                          Requested on {format(new Date(booking.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </Badge>
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
                    {booking.status === "pending" && (
                      <div className="flex gap-2 pt-2 border-t border-fos-neutral-light">
                        <CancelButton bookingId={booking.id} />
                      </div>
                    )}

                    {booking.status === "approved" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700">
                          <strong>Confirmed!</strong> Your booking has been approved. Check your email for details and
                          check-in instructions.
                        </p>
                      </div>
                    )}

                    {booking.status === "denied" && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">
                          Unfortunately, your booking request was not approved. Please try different dates or contact
                          the property owner.
                        </p>
                      </div>
                    )}
                  </div>
                </BrandCard>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
