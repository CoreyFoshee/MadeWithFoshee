"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User, Menu, X } from "lucide-react"
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
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
      if (user) {
        // Fetch user profile when user is authenticated
        fetchUserProfile(user.uid)
        // Check admin privileges
        checkAdminStatus(user.uid)
      } else {
        setUserProfile(null)
        setIsAdmin(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (mobileMenuOpen && !target.closest('header')) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen])

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

  const checkAdminStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/check-admin?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } else {
        console.error('Error checking admin privileges:', response.statusText)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Error checking admin privileges:', error)
      setIsAdmin(false)
    }
  }

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/auth/login')
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
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

          {/* Desktop Navigation */}
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
            {isAdmin && (
              <Link href="/admin" className="text-fos-neutral hover:text-fos-primary transition-colors font-medium">
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop User Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-fos-neutral-light">
            <nav className="py-4 space-y-4">
              <Link 
                href="/" 
                onClick={closeMobileMenu}
                className="block px-4 py-2 text-fos-neutral hover:text-fos-primary hover:bg-fos-neutral-light/30 transition-colors font-medium rounded-lg"
              >
                Home
              </Link>
              <Link 
                href="/place" 
                onClick={closeMobileMenu}
                className="block px-4 py-2 text-fos-neutral hover:text-fos-primary hover:bg-fos-neutral-light/30 transition-colors font-medium rounded-lg"
              >
                Lake House
              </Link>
              <Link 
                href="/my-trips" 
                onClick={closeMobileMenu}
                className="block px-4 py-2 text-fos-neutral hover:text-fos-primary hover:bg-fos-neutral-light/30 transition-colors font-medium rounded-lg"
              >
                My Trips
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-fos-neutral hover:text-fos-primary hover:bg-fos-neutral-light/30 transition-colors font-medium rounded-lg"
                >
                  Admin
                </Link>
              )}
              
              {user && (
                <>
                  <div className="border-t border-fos-neutral-light pt-4 mt-4">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{displayName}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        closeMobileMenu()
                        handleSignOut()
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full mx-4 mt-2 flex items-center justify-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
