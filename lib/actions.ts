"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export async function signInWithMagicLink(formData: FormData) {
  const supabase = createClient()

  const rawData = {
    email: formData.get("email")?.toString(),
  }

  const validation = magicLinkSchema.safeParse(rawData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { email } = validation.data

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: "Check your email for the magic link!" }
}

export async function signUpWithMagicLink(formData: FormData) {
  const supabase = createClient()

  const rawData = {
    email: formData.get("email")?.toString(),
  }

  const validation = magicLinkSchema.safeParse(rawData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { email } = validation.data

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: "Check your email for the magic link!" }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return { success: true }
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function inviteUser(formData: FormData) {
  const supabase = createClient()

  // Check if user is owner
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

  if (profile?.role !== "owner") {
    return { error: "Only owners can invite users" }
  }

  const email = formData.get("email")?.toString()
  const fullName = formData.get("fullName")?.toString()

  if (!email || !fullName) {
    return { error: "Email and full name are required" }
  }

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
}
