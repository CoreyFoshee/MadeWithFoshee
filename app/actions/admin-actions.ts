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
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
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

export async function denyBooking(bookingId: string, userId: string) {
  try {
    const hasPermission = await checkOwnerPermission(userId)
    if (!hasPermission) {
      return { error: "Permission denied: Admin access required" }
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
