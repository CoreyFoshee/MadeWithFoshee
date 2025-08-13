"use client"

import { useEffect, useState } from "react"
import BrandHeader from "@/components/brand-header"
import BookingQueue from "@/components/admin/booking-queue"
import ApprovedBookings from "@/components/admin/approved-bookings"
import BlackoutManager from "@/components/admin/blackout-manager"
import UserInvites from "@/components/admin/user-invites"
import CancelledBookings from "@/components/admin/cancelled-bookings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBookings, getBlackoutDates, getContentBlocks, getListings } from "@/lib/firebase/database"
import AuthGuard from "@/components/auth-guard"

export default function AdminPage() {
  const [pendingBookings, setPendingBookings] = useState<any[]>([])
  const [approvedBookings, setApprovedBookings] = useState<any[]>([])
  const [cancelledBookings, setCancelledBookings] = useState<any[]>([])
  const [blackoutDates, setBlackoutDates] = useState<any[]>([])
  const [contentBlocks, setContentBlocks] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [bookingsData, blackoutsData, contentData, listingsData] = await Promise.all([
          getBookings(),
          getBlackoutDates(),
          getContentBlocks(),
          getListings()
        ])
        
        // Filter bookings by status
        const pending = bookingsData.filter((booking: any) => booking.status === 'pending')
        const approved = bookingsData.filter((booking: any) => booking.status === 'approved')
        const cancelled = bookingsData.filter((booking: any) => booking.status === 'cancelled')
        
        setPendingBookings(pending)
        setApprovedBookings(approved)
        setCancelledBookings(cancelled)
        setBlackoutDates(blackoutsData)
        setContentBlocks(contentData)
        setListings(listingsData)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-fos-primary mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-fos-neutral-light">
        <BrandHeader />

        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center px-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-fos-neutral-deep mb-2">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-fos-neutral">Manage bookings, content, and property settings</p>
            </div>

                        {/* Admin Tabs */}
            <Tabs defaultValue="pending" className="space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                  <div className="flex justify-end mb-2 sm:hidden">
                    <span className="text-xs text-fos-neutral-light">← Scroll →</span>
                  </div>
                <TabsList className="grid w-full min-w-max grid-cols-5 bg-white text-xs sm:text-sm h-auto py-2 sm:py-1">
                  <TabsTrigger
                    value="pending"
                    className="data-[state=active]:bg-fos-primary data-[state=active]:text-white py-2 sm:py-1 px-1 sm:px-2"
                  >
                    Pending ({pendingBookings?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="approved"
                    className="data-[state=active]:bg-fos-primary data-[state=active]:text-white py-2 sm:py-1 px-1 sm:px-2"
                  >
                    Confirmed ({approvedBookings?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="blackouts"
                    className="data-[state=active]:bg-fos-primary data-[state=active]:text-white py-2 sm:py-1 px-1 sm:px-2"
                  >
                    Blackout Dates
                  </TabsTrigger>
                  <TabsTrigger
                    value="cancelled"
                    className="data-[state=active]:bg-fos-primary data-[state=active]:text-white py-2 sm:py-1 px-1 sm:px-2"
                  >
                    Cancelled ({cancelledBookings?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users" 
                    className="data-[state=active]:bg-fos-primary data-[state=active]:text-white py-2 sm:py-1 px-1 sm:px-2"
                  >
                    Users
                  </TabsTrigger>
                </TabsList>
                </div>
              </div>

              <TabsContent value="pending" className="px-2 sm:px-0">
                <BookingQueue bookings={pendingBookings || []} />
              </TabsContent>

              <TabsContent value="approved" className="px-2 sm:px-0">
                <ApprovedBookings bookings={approvedBookings || []} />
              </TabsContent>

              <TabsContent value="cancelled" className="px-2 sm:px-0">
                <CancelledBookings bookings={cancelledBookings || []} />
              </TabsContent>

              <TabsContent value="blackouts" className="px-2 sm:px-0">
                <BlackoutManager blackoutDates={blackoutDates || []} listings={listings || []} />
              </TabsContent>

              <TabsContent value="users" className="px-2 sm:px-0">
                <UserInvites />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
