"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { signOutUser, onAuthStateChange } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User as FirebaseUser } from "firebase/auth"
import { getUserProfile } from "@/lib/firebase/database"

interface BrandHeaderProps {
  className?: string
}

interface UserProfile {
  first_name: string
  last_name: string
  email: string
}

export default function BrandHeader({ className = "" }: BrandHeaderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
      if (user) {
        // Fetch user profile when user is authenticated
        fetchUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId)
      if (profile) {
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/auth/login')
  }

  const displayName = userProfile 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : user?.email || 'User'

  return (
    <header className={`bg-white border-b border-fos-neutral-light ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-3xl font-serif font-bold text-fos-neutral-deep">Lake With Foshee</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-fos-neutral hover:text-fos-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/place" className="text-fos-neutral hover:text-fos-primary transition-colors font-medium">
              Lake House
            </Link>
            <Link href="/my-trips" className="text-fos-neutral hover:text-fos-primary transition-colors font-medium">
              My Trips
            </Link>
          </nav>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{displayName}</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
