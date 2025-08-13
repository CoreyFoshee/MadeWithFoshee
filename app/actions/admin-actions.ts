"use server"

import { revalidatePath } from "next/cache"
import { getAdminDb } from "@/lib/firebase/admin"
import { checkAdminPrivileges } from "@/lib/firebase/admin-database"

// Check if user has admin privileges
async function checkOwnerPermission(userId: string) {
  if (!userId) return false
  return await checkAdminPrivileges(userId)
}

export async function approveBooking(bookingId: string, userId: string) {
  try {
    console.log('🚀 Starting approveBooking...')
    console.log('📝 Booking ID:', bookingId)
    console.log('👤 User ID:', userId)
    
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      console.log('❌ Permission denied for user:', userId)
      return { error: "Permission denied: Admin access required" }
    }
    console.log('✅ Permission granted')

    const adminDb = getAdminDb()
    console.log('✅ Admin DB connection established')
    
    // Get the booking details first
    console.log('📖 Fetching booking details...')
    const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get()
    if (!bookingDoc.exists) {
      console.log('❌ Booking not found:', bookingId)
      return { error: "Booking not found" }
    }
    
    const booking = bookingDoc.data()
    if (!booking) {
      console.log('❌ Booking data is null')
      return { error: "Booking data not found" }
    }
    
    console.log('📋 Booking data retrieved:', JSON.stringify(booking, null, 2))
    
    // Update the booking status to approved
    console.log('✏️ Updating booking status to approved...')
    await adminDb.collection('bookings').doc(bookingId).update({ 
      status: "approved",
      updated_at: new Date(),
      approved_at: new Date()
    })
    console.log('✅ Booking status updated successfully')

    // Send confirmation email to the guest
    console.log('📧 Attempting to send approval confirmation email...')
    try {
      const { sendBookingStatusEmail } = await import('@/lib/email')
      console.log('✅ Email module imported successfully')
      
      const emailData = {
        to: booking.guest_email,
        guestName: booking.guest_name,
        listingName: booking.listing_name || 'Family Lake House',
        startDate: booking.start_date.toDate ? booking.start_date.toDate().toISOString().split('T')[0] : booking.start_date,
        endDate: booking.end_date.toDate ? booking.end_date.toDate().toISOString().split('T')[0] : booking.end_date,
        guests: booking.guests,
        status: 'approved' as const,
        notes: booking.notes
      }
      
      console.log('📧 Email data prepared:', JSON.stringify(emailData, null, 2))
      
      await sendBookingStatusEmail(emailData)
      console.log('✅ Approval confirmation email sent successfully!')
    } catch (emailError) {
      console.error('❌ Error sending approval email:', emailError)
      console.error('❌ Error details:', JSON.stringify(emailError, null, 2))
      // Continue even if email fails
    }

    console.log('🔄 Revalidating admin path...')
    revalidatePath("/admin")
    
    console.log('🎉 approveBooking completed successfully!')
    return { success: true }
  } catch (error) {
    console.error('❌ Error in approveBooking:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    return { error: error instanceof Error ? error.message : "Failed to approve booking" }
  }
}

export async function denyBooking(bookingId: string, userId: string) {
  try {
    console.log('🚀 Starting denyBooking...')
    console.log('📝 Booking ID:', bookingId)
    console.log('👤 User ID:', userId)
    
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      console.log('❌ Permission denied for user:', userId)
      return { error: "Permission denied: Admin access required" }
    }
    console.log('✅ Permission granted')

    const adminDb = getAdminDb()
    console.log('✅ Admin DB connection established')
    
    // Get the booking details first
    console.log('📖 Fetching booking details...')
    const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get()
    if (!bookingDoc.exists) {
      console.log('❌ Booking not found:', bookingId)
      return { error: "Booking not found" }
    }
    
    const booking = bookingDoc.data()
    if (!booking) {
      console.log('❌ Booking data is null')
      return { error: "Booking data not found" }
    }
    
    console.log('📋 Booking data retrieved:', JSON.stringify(booking, null, 2))
    
    // Update the booking status to denied
    console.log('✏️ Updating booking status to denied...')
    await adminDb.collection('bookings').doc(bookingId).update({ 
      status: "denied",
      updated_at: new Date(),
      denied_at: new Date()
    })
    console.log('✅ Booking status updated successfully')

    // Send notification email to the guest
    console.log('📧 Attempting to send denial notification email...')
    try {
      const { sendBookingStatusEmail } = await import('@/lib/email')
      console.log('✅ Email module imported successfully')
      
      const emailData = {
        to: booking.guest_email,
        guestName: booking.guest_name,
        listingName: booking.listing_name || 'Family Lake House',
        startDate: booking.start_date.toDate ? booking.start_date.toDate().toISOString().split('T')[0] : booking.start_date,
        endDate: booking.end_date.toDate ? booking.end_date.toDate().toISOString().split('T')[0] : booking.end_date,
        guests: booking.guests,
        status: 'denied' as const,
        notes: booking.notes
      }
      
      console.log('📧 Email data prepared:', JSON.stringify(emailData, null, 2))
      
      await sendBookingStatusEmail(emailData)
      console.log('✅ Denial notification email sent successfully!')
    } catch (emailError) {
      console.error('❌ Error sending denial email:', emailError)
      console.error('❌ Error details:', JSON.stringify(emailError, null, 2))
      // Continue even if email fails
    }

    console.log('🔄 Revalidating admin path...')
    revalidatePath("/admin")
    
    console.log('🎉 denyBooking completed successfully!')
    return { success: true }
  } catch (error) {
    console.error('❌ Error in denyBooking:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    return { error: error instanceof Error ? error.message : "Failed to deny booking" }
  }
}

export async function cancelConfirmedBooking(bookingId: string, userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }

    const adminDb = getAdminDb()
    
    // Get the booking details first
    const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get()
    if (!bookingDoc.exists) {
      return { error: "Booking not found" }
    }
    
    const booking = bookingDoc.data()
    if (!booking) {
      return { error: "Booking data not found" }
    }
    
    // Update the booking status to cancelled
    await adminDb.collection('bookings').doc(bookingId).update({ 
      status: "cancelled",
      updated_at: new Date(),
      cancelled_by: userId,
      cancelled_at: new Date()
    })

    // Send cancellation email to the guest
    try {
      const { sendBookingStatusEmail } = await import('@/lib/email')
      await sendBookingStatusEmail({
        to: booking.guest_email,
        guestName: booking.guest_name,
        listingName: booking.listing_name || 'Family Lake House',
        startDate: booking.start_date.toDate ? booking.start_date.toDate().toISOString().split('T')[0] : booking.start_date,
        endDate: booking.end_date.toDate ? booking.end_date.toDate().toISOString().split('T')[0] : booking.end_date,
        guests: booking.guests,
        status: 'cancelled',
        notes: booking.notes
      })
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError)
      // Continue even if email fails
    }

    revalidatePath("/admin")
    return { success: true, message: "Booking cancelled successfully" }
  } catch (error) {
    console.error('Error cancelling confirmed booking:', error)
    return { error: error instanceof Error ? error.message : "Failed to cancel booking" }
  }
}

export async function createBlackout(prevState: any, formData: FormData, userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }

    const adminDb = getAdminDb()
    
    const listingId = formData.get("listingId")?.toString()
    const startDate = formData.get("startDate")?.toString()
    const endDate = formData.get("endDate")?.toString()
    const reason = formData.get("reason")?.toString() || ""

    if (!listingId || !startDate || !endDate) {
      return { error: "Missing required fields" }
    }

    // Create blackout date
    await adminDb.collection('blackout_dates').add({
      listing_id: listingId,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      reason,
      created_at: new Date()
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error('Error creating blackout:', error)
    return { error: error instanceof Error ? error.message : "Failed to create blackout dates" }
  }
}

export async function deleteBlackout(blackoutId: string, userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }

    const adminDb = getAdminDb()
    
    // Delete the blackout date
    await adminDb.collection('blackout_dates').doc(blackoutId).delete()

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error('Error deleting blackout:', error)
    return { error: error instanceof Error ? error.message : "Failed to delete blackout dates" }
  }
}

export async function inviteUser(formData: FormData, userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }

    const email = formData.get("email")?.toString()
    const fullName = formData.get("fullName")?.toString()

    if (!email || !fullName) {
      return { error: "Email and full name are required" }
    }

    // Get inviter's name
    const adminDb = getAdminDb()
    const inviterProfile = await adminDb.collection('profiles').where('user_id', '==', userId).get()
    
    let inviterName = 'Property Owner'
    if (!inviterProfile.empty) {
      const profileData = inviterProfile.docs[0].data()
      // Check for different name field formats
      if (profileData.full_name) {
        inviterName = profileData.full_name
      } else if (profileData.first_name && profileData.last_name) {
        inviterName = `${profileData.first_name} ${profileData.last_name}`
      } else if (profileData.first_name) {
        inviterName = profileData.first_name
      }
    }
    
    console.log('Inviter profile data:', inviterProfile.empty ? 'No profile found' : inviterProfile.docs[0].data())
    console.log('Using inviter name:', inviterName)

    // Import and use the invitation system
    const { createInvitation } = await import('@/lib/invitations')
    const result = await createInvitation(email, fullName, userId, inviterName)

    if (!result.success) {
      return { error: result.error }
    }

    revalidatePath("/admin")
    return { success: true, message: `Invitation sent to ${email}!` }
  } catch (error) {
    console.error('Error inviting user:', error)
    return { error: error instanceof Error ? error.message : "Failed to send invitation" }
  }
}

export async function getPendingInvitations(userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }

    // Import and use the invitation system
    const { getPendingInvitations: getInvitations } = await import('@/lib/invitations')
    const invitations = await getInvitations()

    return { success: true, invitations }
  } catch (error) {
    console.error('Error getting pending invitations:', error)
    return { error: error instanceof Error ? error.message : "Failed to get invitations" }
  }
}

export async function cancelInvitation(invitationId: string, userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }

    // Import and use the invitation system
    const { cancelInvitation: cancelInvite } = await import('@/lib/invitations')
    const result = await cancelInvite(invitationId)

    if (!result.success) {
      return { error: result.error }
    }

    revalidatePath("/admin")
    return { success: true, message: "Invitation cancelled successfully" }
  } catch (error) {
    console.error('Error canceling invitation:', error)
    return { error: error instanceof Error ? error.message : "Failed to cancel invitation" }
  }
}

export async function updateContentBlock(prevState: any, formData: FormData, userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }

    const adminDb = getAdminDb()
    
    const blockId = formData.get("blockId")?.toString()
    const title = formData.get("title")?.toString()
    const content = formData.get("content")?.toString()
    const type = formData.get("type")?.toString()

    if (!blockId || !title || !content || !type) {
      return { error: "Missing required fields" }
    }

    await adminDb.collection('content_blocks').doc(blockId).update({
      title,
      content,
      type,
      updated_at: new Date()
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error('Error updating content block:', error)
    return { error: error instanceof Error ? error.message : "Failed to update content block" }
  }
}

export async function deleteContentBlock(blockId: string, userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }
    
    const adminDb = getAdminDb()
    
    await adminDb.collection('content_blocks').doc(blockId).delete()

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error('Error deleting content block:', error)
    return { error: error instanceof Error ? error.message : "Failed to delete content block" }
  }
}

export async function getExistingUsers(userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
    }

    const adminDb = getAdminDb()
    
    // Get all user profiles
    const profilesSnapshot = await adminDb.collection('profiles').get()
    
    const users = profilesSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        user_id: data.user_id,
        full_name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown Name',
        email: data.email,
        role: data.role || 'family',
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    })

    return { success: true, users }
  } catch (error) {
    console.error('Error getting existing users:', error)
    return { error: error instanceof Error ? error.message : "Failed to get existing users" }
  }
}
