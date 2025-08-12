"use client"
import { useFormStatus } from "react-dom"
import { createBooking } from "@/app/actions/booking-actions"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, MessageSquare, Loader2 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Listing {
  id: string
  name: string
  description: string
  max_guests: number
  min_nights: number
}

interface BookingFormProps {
  listing: Listing
  fromDate: string
  toDate: string
  guestCount?: string
  initialNotes?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-fos-primary hover:bg-fos-primary-dark text-white py-3 text-lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting Request...
        </>
      ) : (
        "Submit Booking Request"
      )}
    </Button>
  )
}

export default function BookingForm({ listing, fromDate, toDate, guestCount, initialNotes }: BookingFormProps) {
  const startDate = new Date(fromDate)
  const endDate = new Date(toDate)
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-fos-neutral-deep mb-2">Request Your Stay</h1>
          <p className="text-fos-neutral">Review your booking details and submit your request</p>
        </div>

        {/* Booking Summary */}
        <BrandCard>
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Booking Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-fos-neutral-deep">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Dates</span>
                </div>
                <p className="text-fos-neutral">
                  {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}
                </p>
                <p className="text-sm text-fos-neutral">{nights} nights</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-fos-neutral-deep">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Guests</span>
                </div>
                <p className="text-fos-neutral">{guestCount || 2} guests</p>
              </div>
            </div>

            <div className="pt-4 border-t border-fos-neutral-light">
              <h3 className="font-medium text-fos-neutral-deep mb-2">{listing.name}</h3>
              <p className="text-sm text-fos-neutral">{listing.description}</p>
            </div>
          </div>
        </BrandCard>

        {/* Booking Form */}
        <BrandCard>
          <form action={createBooking} className="space-y-6">
            {/* Hidden fields */}
            <input type="hidden" name="listingId" value={listing.id} />
            <input type="hidden" name="startDate" value={fromDate} />
            <input type="hidden" name="endDate" value={toDate} />
            <input type="hidden" name="guests" value={guestCount || "2"} />

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2 text-fos-neutral-deep">
                <MessageSquare className="h-4 w-4" />
                Special Requests or Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any special requests, dietary restrictions, or additional information..."
                defaultValue={initialNotes ? decodeURIComponent(initialNotes) : ""}
                className="bg-white border-fos-neutral-light resize-none"
                rows={4}
              />
              <p className="text-xs text-fos-neutral">
                Let us know if you have any special needs or requests for your stay.
              </p>
            </div>

            {/* Terms */}
            <div className="bg-fos-neutral-light/50 p-4 rounded-lg">
              <h3 className="font-medium text-fos-neutral-deep mb-2">Booking Terms</h3>
              <ul className="text-sm text-fos-neutral space-y-1">
                <li>• Your booking request will be reviewed by the property owner</li>
                <li>• You will receive an email confirmation once approved</li>
                <li>• Minimum stay: {listing.min_nights} nights</li>
                <li>• Maximum guests: {listing.max_guests}</li>
                <li>• Check-in: 4:00 PM, Check-out: 11:00 AM</li>
              </ul>
            </div>

            <SubmitButton />

            <div className="text-center">
              <Button
                asChild
                variant="outline"
                className="border-fos-neutral text-fos-neutral hover:bg-fos-neutral-light bg-transparent"
              >
                <Link href="/place">Back to Property</Link>
              </Button>
            </div>
          </form>
        </BrandCard>
      </div>
    </div>
  )
}
