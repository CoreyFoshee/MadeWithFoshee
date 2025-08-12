"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"

// Check if user is owner
async function checkOwnerPermission() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

  if (profile?.role !== "owner") {
    throw new Error("Only owners can perform this action")
  }

  return { supabase, user }
}

export async function approveBooking(bookingId: string) {
  try {
    const { supabase } = await checkOwnerPermission()

    const { error } = await supabase.from("bookings").update({ status: "approved" }).eq("id", bookingId)

    if (error) {
      return { error: "Failed to approve booking" }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Permission denied" }
  }
}

export async function denyBooking(bookingId: string) {
  try {
    const { supabase } = await checkOwnerPermission()

    const { error } = await supabase.from("bookings").update({ status: "denied" }).eq("id", bookingId)

    if (error) {
      return { error: "Failed to deny booking" }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Permission denied" }
  }
}

const blackoutSchema = z.object({
  listingId: z.string().uuid(),
  startDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Invalid start date"),
  endDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Invalid end date"),
  reason: z.string().optional(),
})

export async function createBlackout(prevState: any, formData: FormData) {
  try {
    const { supabase } = await checkOwnerPermission()

    const rawData = {
      listingId: formData.get("listingId")?.toString(),
      startDate: formData.get("startDate")?.toString(),
      endDate: formData.get("endDate")?.toString(),
      reason: formData.get("reason")?.toString() || "",
    }

    const validation = blackoutSchema.safeParse(rawData)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const { listingId, startDate, endDate, reason } = validation.data

    const { error } = await supabase.from("blackout_dates").insert({
      listing_id: listingId,
      start_date: startDate,
      end_date: endDate,
      reason,
    })

    if (error) {
      return { error: "Failed to create blackout dates" }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Permission denied" }
  }
}

export async function deleteBlackout(blackoutId: string) {
  try {
    const { supabase } = await checkOwnerPermission()

    const { error } = await supabase.from("blackout_dates").delete().eq("id", blackoutId)

    if (error) {
      return { error: "Failed to delete blackout dates" }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Permission denied" }
  }
}

const contentBlockSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  type: z.string().min(1, "Type is required"),
  data: z.string().refine((str) => {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }, "Invalid JSON data"),
  position: z.number().min(0, "Position must be non-negative"),
})

export async function updateContentBlock(prevState: any, formData: FormData) {
  try {
    const { supabase } = await checkOwnerPermission()

    const blockId = formData.get("blockId")?.toString()
    const rawData = {
      slug: formData.get("slug")?.toString(),
      type: formData.get("type")?.toString(),
      data: formData.get("data")?.toString(),
      position: Number.parseInt(formData.get("position")?.toString() || "0"),
    }

    const validation = contentBlockSchema.safeParse(rawData)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const { slug, type, data, position } = validation.data

    let parsedData
    try {
      parsedData = JSON.parse(data)
    } catch {
      return { error: "Invalid JSON format" }
    }

    if (blockId) {
      // Update existing block
      const { error } = await supabase
        .from("content_blocks")
        .update({
          slug,
          type,
          data: parsedData,
          position,
        })
        .eq("id", blockId)

      if (error) {
        return { error: "Failed to update content block" }
      }
    } else {
      // Create new block
      const { error } = await supabase.from("content_blocks").insert({
        slug,
        type,
        data: parsedData,
        position,
      })

      if (error) {
        return { error: "Failed to create content block" }
      }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Permission denied" }
  }
}

export async function deleteContentBlock(blockId: string) {
  try {
    const { supabase } = await checkOwnerPermission()

    const { error } = await supabase.from("content_blocks").delete().eq("id", blockId)

    if (error) {
      return { error: "Failed to delete content block" }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Permission denied" }
  }
}

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
})

export async function inviteUser(prevState: any, formData: FormData) {
  try {
    const { supabase } = await checkOwnerPermission()

    const rawData = {
      email: formData.get("email")?.toString(),
      fullName: formData.get("fullName")?.toString(),
    }

    const validation = inviteSchema.safeParse(rawData)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const { email, fullName } = validation.data

    // For now, just create a profile entry - in production would use Supabase admin API
    const { error } = await supabase.from("profiles").insert({
      user_id: crypto.randomUUID(), // Temporary - would be replaced by actual user ID from invite
      full_name: fullName,
      role: "family",
    })

    if (error) {
      return { error: "Failed to send invitation" }
    }

    // In production, would send actual email invitation here
    console.log(`Invitation sent to ${email} for ${fullName}`)

    return { success: `Invitation sent to ${email}!` }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Permission denied" }
  }
}
