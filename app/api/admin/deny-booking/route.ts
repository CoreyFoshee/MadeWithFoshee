import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'
import { sendBookingStatusEmail } from '@/lib/email'

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')
    const token = searchParams.get('token')
    
    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }
    
    // Verify admin token (you should use a more secure method in production)
    const expectedToken = process.env.ADMIN_APPROVAL_TOKEN || 'default-token'
    if (token !== expectedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const adminDb = getAdminDb()
    
    // Get the booking details
    const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get()
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    const booking = bookingDoc.data()
    
    // Update the booking status to denied
    await adminDb.collection('bookings').doc(bookingId).update({
      status: 'denied',
      updated_at: new Date(),
      denied_at: new Date()
    })
    
    // Send notification email to the guest
    try {
      await sendBookingStatusEmail({
        to: booking.guest_email,
        guestName: booking.guest_name,
        listingName: booking.listing_name || 'Family Lake House',
        startDate: booking.start_date.toDate ? booking.start_date.toDate().toISOString().split('T')[0] : booking.start_date,
        endDate: booking.end_date.toDate ? booking.end_date.toDate().toISOString().split('T')[0] : booking.end_date,
        guests: booking.guests,
        status: 'denied',
        notes: booking.notes
      })
    } catch (emailError) {
      console.error('Error sending denial email:', emailError)
      // Continue even if email fails
    }
    
    // Redirect to a success page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/admin/success?status=denied&bookingId=${bookingId}`)
    
  } catch (error) {
    console.error('Error denying booking:', error)
    return NextResponse.json({ error: 'Failed to deny booking' }, { status: 500 })
  }
}
