"use client"

import { useState, useEffect } from "react"
import { approveBooking, denyBooking } from "@/lib/firebase/database"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { onAuthStateChange } from "@/lib/firebase/auth"
import { User as FirebaseUser } from "firebase/auth"

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

function ApproveButton({ bookingId, userId }: { bookingId: string; userId: string }) {
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = async () => {
    if (!userId) {
      console.error('No user ID available')
      return
    }
    
    setIsApproving(true)
    try {
      const result = await approveBooking(bookingId, userId)
      if (result.error) {
        console.error('Error approving booking:', result.error)
        // You could add a toast notification here
      } else {
        // Refresh the page to show updated status
        window.location.reload()
      }
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

function DenyButton({ bookingId, userId }: { bookingId: string; userId: string }) {
  const [isDenying, setIsDenying] = useState(false)

  const handleDeny = async () => {
    if (!userId) {
      console.error('No user ID available')
      return
    }
    
    setIsDenying(true)
    try {
      const result = await denyBooking(bookingId, userId)
      if (result.error) {
        console.error('Error denying booking:', result.error)
        // You could add a toast notification here
      } else {
        // Refresh the page to show updated status
        window.location.reload()
      }
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
  const [user, setUser] = useState<FirebaseUser | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  if (bookings.length === 0) {
    return (
      <BrandCard className="text-center py-12">
        <div className="space-y-4">
          <Calendar className="h-12 w-12 text-fos-neutral mx-auto" />
          <div>
            <h3 className="text-lg font-serif font-bold text-fos-neutral-deep mb-2">No pending bookings</h3>
            <p className="text-fos-neutral">All booking requests have been reviewed.</p>
          </div>
        </div>
      </BrandCard>
    )
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const startDate = new Date(booking.start_date)
        const endDate = new Date(booking.end_date)
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

        return (
          <BrandCard key={booking.id} className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">{booking.listings.name}</h3>
                <p className="text-sm text-fos-neutral">
                  Requested on {format(new Date(booking.created_at), "MMM dd, yyyy")}
                </p>
              </div>
              <Badge className="bg-orange-100 text-orange-800">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Pending Review
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

            {/* Actions */}
            {user && (
              <div className="flex gap-2 pt-2 border-t border-fos-neutral-light">
                <ApproveButton bookingId={booking.id} userId={user.uid} />
                <DenyButton bookingId={booking.id} userId={user.uid} />
              </div>
            )}
          </BrandCard>
        )
      })}
    </div>
  )
}
