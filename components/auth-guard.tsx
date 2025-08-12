"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChange } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log('AuthGuard: Setting up auth listener...')
    console.log('AuthGuard: Current pathname:', pathname)
    
    const unsubscribe = onAuthStateChange((user) => {
      console.log('AuthGuard: Auth state changed:', user ? `User: ${user.email}` : 'No user')
      console.log('AuthGuard: Current pathname during auth change:', pathname)
      
      setUser(user)
      setLoading(false)
      
      // Only redirect if we're not on the login page and there's no user
      if (!user && pathname !== '/auth/login') {
        console.log('AuthGuard: No user, redirecting to login...')
        router.push('/auth/login')
      } else if (user && pathname === '/auth/login') {
        console.log('AuthGuard: User authenticated on login page, redirecting to home...')
        router.push('/')
      } else if (user) {
        console.log('AuthGuard: User authenticated, showing content...')
      }
    })

    return () => unsubscribe()
  }, [router, pathname])

  console.log('AuthGuard: Render state - loading:', loading, 'user:', user ? user.email : 'none')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fos-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If we're on the login page and user is authenticated, don't render anything (will redirect)
  if (pathname === '/auth/login' && user) {
    return null
  }

  // If we're not on the login page and no user, don't render anything (will redirect)
  if (pathname !== '/auth/login' && !user) {
    return null
  }

  return <>{children}</>
}
