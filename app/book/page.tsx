"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import BrandHeader from "@/components/brand-header"
import BookingForm from "@/components/booking-form"
import { getListing } from "@/lib/firebase/database"
import AuthGuard from "@/components/auth-guard"

interface SearchParams {
  listing?: string
  from?: string
  to?: string
  guests?: string
  notes?: string
}

export default function BookPage() {
  const searchParams = useSearchParams()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const listingId = searchParams.get('listing')
  const fromDate = searchParams.get('from')
  const toDate = searchParams.get('to')
  const guestCount = searchParams.get('guests')
  const initialNotes = searchParams.get('notes')

  useEffect(() => {
    async function loadListing() {
      if (listingId) {
        try {
          const listingData = await getListing(listingId)
          setListing(listingData)
        } catch (error) {
          console.error('Error loading listing:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadListing()
  }, [listingId])

  if (!listingId || !fromDate || !toDate) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-fos-neutral-light">
          <BrandHeader />
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-serif font-bold text-fos-neutral-deep mb-4">Invalid Booking Request</h1>
            <p className="text-fos-neutral mb-6">Please select dates and try again.</p>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-fos-primary text-white hover:bg-fos-primary-dark h-10 px-4 py-2"
            >
              Return Home
            </a>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fos-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!listing) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-fos-neutral-light">
          <BrandHeader />
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-serif font-bold text-fos-neutral-deep mb-4">Listing Not Found</h1>
            <p className="text-fos-neutral mb-6">The requested listing could not be found.</p>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-fos-primary text-white hover:bg-fos-primary-dark h-10 px-4 py-2"
            >
              Return Home
            </a>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-fos-neutral-light">
        <BrandHeader />
        <BookingForm
          listing={listing}
          fromDate={fromDate!}
          toDate={toDate!}
          guestCount={guestCount || undefined}
          initialNotes={initialNotes || undefined}
        />
      </div>
    </AuthGuard>
  )
}
