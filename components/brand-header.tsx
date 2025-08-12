"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { signOutUser, onAuthStateChange } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User as FirebaseUser } from "firebase/auth"

interface BrandHeaderProps {
  className?: string
}

export default function BrandHeader({ className = "" }: BrandHeaderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/auth/login')
  }

  return (
    <header className={`bg-white border-b border-fos-neutral-light ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-3xl font-serif font-bold text-fos-neutral-deep">Made By Foshee</h1>
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
                <span>{user.email}</span>
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
