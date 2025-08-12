"use client"

import { useEffect, useState } from "react"
import BrandHeader from "@/components/brand-header"
import MyTripsClient from "@/components/my-trips-client"
import { getBookings } from "@/lib/firebase/database"
import AuthGuard from "@/components/auth-guard"

export default function MyTripsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBookings() {
      try {
        const bookingsData = await getBookings()
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error loading bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fos-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-fos-neutral-light">
        <BrandHeader />
        <MyTripsClient initialBookings={bookings} />
      </div>
    </AuthGuard>
  )
}
