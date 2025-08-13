"use server"

import { getAdminDb } from "@/lib/firebase/admin"
import { sendBookingConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email"
import { revalidatePath } from "next/cache"

export async function createBookingWithEmails(bookingData: any) {
  try {
    console.log('🚀 Starting createBookingWithEmails...')
    console.log('📝 Booking data received:', JSON.stringify(bookingData, null, 2))
    
    const adminDb = getAdminDb()
    console.log('✅ Admin DB connection established')
    
    // Create the booking in Firestore
    const docRef = await adminDb.collection('bookings').add({
      ...bookingData,
      created_at: new Date(),
      updated_at: new Date()
    })
    
    const result = { id: docRef.id, ...bookingData }
    console.log('✅ Booking created successfully in Firestore:', result.id)
    
    // Send confirmation email to user
    console.log('📧 Attempting to send user confirmation email...')
    try {
      const emailData = {
        to: bookingData.guest_email,
        guestName: bookingData.guest_name,
        listingName: bookingData.listing_name || 'Family Lake House',
        startDate: bookingData.start_date,
        endDate: bookingData.end_date,
        guests: bookingData.guests,
        notes: bookingData.notes,
        bookingId: result.id
      }
      console.log('📧 User email data:', JSON.stringify(emailData, null, 2))
      
      await sendBookingConfirmationEmail(emailData)
      console.log('✅ User confirmation email sent successfully!')
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError)
      // Don't fail the booking if email fails
    }
    
    // Send notification email to admin
    console.log('📧 Attempting to send admin notification email...')
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const adminToken = process.env.ADMIN_APPROVAL_TOKEN || 'default-token'
      
      console.log('🔗 Site URL:', siteUrl)
      console.log('🔑 Admin token:', adminToken ? 'Set' : 'Not set')
      
      const adminEmailData = {
        to: 'corey@cfdesign.studio', // TODO: Make this configurable
        adminName: 'Property Owner',
        guestName: bookingData.guest_name,
        listingName: bookingData.listing_name || 'Family Lake House',
        startDate: bookingData.start_date,
        endDate: bookingData.end_date,
        guests: bookingData.guests,
        notes: bookingData.notes,
        bookingId: result.id,
        approveUrl: `${siteUrl}/api/admin/approve-booking?bookingId=${result.id}&token=${encodeURIComponent(adminToken)}`,
        denyUrl: `${siteUrl}/api/admin/deny-booking?bookingId=${result.id}&token=${encodeURIComponent(adminToken)}`
      }
      console.log('📧 Admin email data:', JSON.stringify(adminEmailData, null, 2))
      
      await sendAdminNotificationEmail(adminEmailData)
      console.log('✅ Admin notification email sent successfully!')
    } catch (emailError) {
      console.error('❌ Error sending admin notification email:', emailError)
      // Don't fail the booking if email fails
    }
    
    console.log('🔄 Revalidating /my-trips path...')
    revalidatePath("/my-trips")
    
    console.log('🎉 createBookingWithEmails completed successfully!')
    return { success: true, bookingId: result.id }
    
  } catch (error) {
    console.error('❌ Error in createBookingWithEmails:', error)
    return { error: error instanceof Error ? error.message : "Failed to create booking" }
  }
}
