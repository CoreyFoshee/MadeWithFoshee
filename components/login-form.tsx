"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { signInWithEmail, createUser, onAuthStateChange } from "@/lib/firebase/auth"
import { useRouter, usePathname } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const hasAttemptedSignIn = useRef(false)

  // Listen for auth state changes
  useEffect(() => {
    console.log('LoginForm: Setting up auth listener...')
    console.log('LoginForm: Current pathname:', pathname)
    
    const unsubscribe = onAuthStateChange((user) => {
      console.log('LoginForm: Auth state changed:', user ? `User: ${user.email}` : 'No user')
      console.log('LoginForm: Current pathname during auth change:', pathname)
      console.log('LoginForm: Has attempted sign in:', hasAttemptedSignIn.current)
      
      // Only redirect if we're on the login page, user is signed in, AND we've attempted a sign-in
      // This handles cases where user was already signed in from a previous session
      if (user && pathname === '/auth/login' && hasAttemptedSignIn.current) {
        console.log('LoginForm: User is signed in on login page after sign-in attempt, redirecting to home page...')
        
        // Try Next.js router first, then fallback to window.location
        setTimeout(() => {
          console.log('LoginForm: Executing redirect now...')
          try {
            router.push('/')
            console.log('LoginForm: Next.js router.push executed')
            
            // Fallback: if router doesn't work, use window.location
            setTimeout(() => {
              if (window.location.pathname === '/auth/login') {
                console.log('LoginForm: Router failed, using window.location fallback')
                window.location.href = '/'
              }
            }, 500)
          } catch (error) {
            console.log('LoginForm: Router error, using window.location fallback:', error)
            window.location.href = '/'
          }
        }, 100)
      }
    })

    return () => unsubscribe()
  }, [router, pathname])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('LoginForm: Form submitted, starting authentication process...')
    setIsLoading(true)
    setMessage(null)
    hasAttemptedSignIn.current = true

    try {
      if (isSignUp) {
        console.log('LoginForm: Creating account for:', email)
        const { user, error } = await createUser(email, password)
        if (error) {
          console.log('LoginForm: Account creation error:', error)
          setMessage({ type: 'error', text: error })
        } else {
          console.log('LoginForm: Account created successfully')
          setMessage({ type: 'success', text: 'Account created successfully! You can now sign in.' })
          setIsSignUp(false)
        }
      } else {
        console.log('LoginForm: Signing in user:', email)
        const { user, error } = await signInWithEmail(email, password)
        if (error) {
          console.log('LoginForm: Sign in error:', error)
          setMessage({ type: 'error', text: error })
        } else {
          console.log('LoginForm: Sign in successful, forcing redirect now...')
          setMessage({ type: 'success', text: 'Signed in successfully! Redirecting...' })
          
          // Force redirect immediately after successful sign-in
          hasAttemptedSignIn.current = true
          
          // Try Next.js router first, then fallback to window.location
          setTimeout(() => {
            console.log('LoginForm: Executing immediate redirect...')
            try {
              router.push('/')
              console.log('LoginForm: Next.js router.push executed')
              
              // Fallback: if router doesn't work, use window.location
              setTimeout(() => {
                if (window.location.pathname === '/auth/login') {
                  console.log('LoginForm: Router failed, using window.location fallback')
                  window.location.href = '/'
                }
              }, 500)
            } catch (error) {
              console.log('LoginForm: Router error, using window.location fallback:', error)
              window.location.href = '/'
            }
          }, 100)
        }
      }
    } catch (error: any) {
      console.log('LoginForm: Unexpected error:', error.message)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-gray-600">
          {isSignUp 
            ? "Sign up to start booking your lake house getaway" 
            : "Sign in to access your account"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 text-base"
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 text-base"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-fos-primary hover:bg-fos-primary-dark text-white py-6 text-lg font-medium rounded-lg h-[60px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignUp ? "Creating account..." : "Signing in..."}
            </>
          ) : (
            <>
              {isSignUp ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Create Account
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setMessage(null)
          }}
          className="text-fos-primary hover:text-fos-primary-dark text-sm font-medium"
        >
          {isSignUp 
            ? "Already have an account? Sign in" 
            : "Don't have an account? Sign up"
          }
        </button>
      </div>
    </div>
  )
}
