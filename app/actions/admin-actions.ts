"use server"

import { revalidatePath } from "next/cache"
import { getAdminDb } from "@/lib/firebase/admin"

// Check if user is owner (simplified for now - you can add proper auth later)
async function checkOwnerPermission() {
  // For now, allow all authenticated users to be admin
  // In production, you'd check Firebase Auth and user roles
  return true
}

export async function approveBooking(bookingId: string) {
  try {
    const hasPermission = await checkOwnerPermission()
    if (!hasPermission) {
      return { error: "Permission denied" }
    }

    const adminDb = getAdminDb()
    
    // Update the booking status to approved
    await adminDb.collection('bookings').doc(bookingId).update({ 
      status: "approved",
      updated_at: new Date()
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error('Error approving booking:', error)
    return { error: error instanceof Error ? error.message : "Failed to approve booking" }
  }
}

export async function denyBooking(bookingId: string) {
  try {
    const hasPermission = await checkOwnerPermission()
    if (!hasPermission) {
      return { error: "Permission denied" }
    }

    const adminDb = getAdminDb()
    
    // Update the booking status to denied
    await adminDb.collection('bookings').doc(bookingId).update({ 
      status: "denied",
      updated_at: new Date()
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error('Error denying booking:', error)
    return { error: error instanceof Error ? error.message : "Failed to deny booking" }
  }
}

export async function createBlackout(prevState: any, formData: FormData) {
  try {
    const hasPermission = await checkOwnerPermission()
    if (!hasPermission) {
      return { error: "Permission denied" }
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

export async function deleteBlackout(blackoutId: string) {
  try {
    const hasPermission = await checkOwnerPermission()
    if (!hasPermission) {
      return { error: "Permission denied" }
    }

    const adminDb = getAdminDb()
    
    await adminDb.collection('blackout_dates').doc(blackoutId).delete()

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error('Error deleting blackout:', error)
    return { error: error instanceof Error ? error.message : "Failed to delete blackout dates" }
  }
}
