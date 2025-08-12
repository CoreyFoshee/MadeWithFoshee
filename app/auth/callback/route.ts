import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the user to create/update their profile
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Upsert profile
        await supabase.from("profiles").upsert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          role: "family", // Default role, owners need to be set manually
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
