"use client"

import { useEffect, useState } from "react"
import BrandHeader from "@/components/brand-header"
import BookingQueue from "@/components/admin/booking-queue"
import ApprovedBookings from "@/components/admin/approved-bookings"
import BlackoutManager from "@/components/admin/blackout-manager"
import ContentEditor from "@/components/admin/content-editor"
import UserInvites from "@/components/admin/user-invites"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBookings, getBlackoutDates, getContentBlocks, getListings } from "@/lib/firebase/database"
import AuthGuard from "@/components/auth-guard"

export default function AdminPage() {
  const [pendingBookings, setPendingBookings] = useState<any[]>([])
  const [approvedBookings, setApprovedBookings] = useState<any[]>([])
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
        
        setPendingBookings(pending)
        setApprovedBookings(approved)
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fos-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-fos-neutral-light">
        <BrandHeader />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-serif font-bold text-fos-neutral-deep mb-2">Admin Dashboard</h1>
              <p className="text-fos-neutral">Manage bookings, content, and property settings</p>
            </div>

            {/* Admin Tabs */}
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-white">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-fos-primary data-[state=active]:text-white"
                >
                  Pending ({pendingBookings?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-fos-primary data-[state=active]:text-white"
                >
                  Confirmed ({approvedBookings?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="blackouts"
                  className="data-[state=active]:bg-fos-primary data-[state=active]:text-white"
                >
                  Blackout Dates
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-fos-primary data-[state=active]:text-white"
                >
                  Content
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:bg-fos-primary data-[state=active]:text-white"
                >
                  Users
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <BookingQueue bookings={pendingBookings || []} />
              </TabsContent>

              <TabsContent value="approved">
                <ApprovedBookings bookings={approvedBookings || []} />
              </TabsContent>

              <TabsContent value="blackouts">
                <BlackoutManager blackoutDates={blackoutDates || []} listings={listings || []} />
              </TabsContent>

              <TabsContent value="content">
                <ContentEditor contentBlocks={contentBlocks || []} />
              </TabsContent>

              <TabsContent value="users">
                <UserInvites />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
