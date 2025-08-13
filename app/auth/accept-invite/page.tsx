"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AcceptInvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [invitation, setInvitation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settingUp, setSettingUp] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      validateInvitation()
    } else {
      setLoading(false)
    }
  }, [token])

  const validateInvitation = async () => {
    try {
      const response = await fetch(`/api/auth/validate-invite?token=${token}`)
      const data = await response.json()
      
      if (data.success) {
        setInvitation(data.invitation)
      } else {
        toast({
          title: "Invalid Invitation",
          description: data.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate invitation",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      })
      return
    }

    setSettingUp(true)

    try {
      // Create user account
      const { createUser } = await import('@/lib/firebase/auth')
      const { user, error } = await createUser(invitation.email, formData.password)
      
      if (error) {
        throw new Error(error)
      }

      // Accept invitation
      const response = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token,
          userId: user?.uid 
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Welcome to Lake With Foshee!",
          description: "Your account has been set up successfully. You can now book the lake house.",
        })
        
        // Redirect to main page
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set up account",
        variant: "destructive"
      })
    } finally {
      setSettingUp(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fos-neutral-light">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fos-primary mx-auto mb-4" />
          <p className="text-gray-600">Validating your invitation...</p>
        </div>
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fos-neutral-light">
        <BrandCard className="max-w-md">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-serif font-bold text-fos-neutral-deep mb-2">Invalid Invitation</h1>
            <p className="text-fos-neutral mb-4">
              This invitation link is invalid or has expired. Please contact the property owner for a new invitation.
            </p>
            <Button onClick={() => router.push('/')} className="bg-fos-primary hover:bg-fos-primary-dark">
              Go to Homepage
            </Button>
          </div>
        </BrandCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fos-neutral-light p-4">
      <BrandCard className="max-w-md w-full">
        <div className="text-center mb-6">
          <Mail className="h-16 w-16 text-fos-primary mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-fos-neutral-deep mb-2">Welcome to Lake With Foshee!</h1>
          <p className="text-fos-neutral">
            You've been invited by <strong>{invitation.inviterName}</strong> to access our lake house.
          </p>
        </div>

        <div className="bg-fos-neutral-light/50 p-4 rounded-lg mb-6">
          <h2 className="font-medium text-fos-neutral-deep mb-2">Invitation Details</h2>
          <div className="text-sm text-fos-neutral space-y-1">
            <p><strong>Name:</strong> {invitation.fullName}</p>
            <p><strong>Email:</strong> {invitation.email}</p>
            <p><strong>Expires:</strong> {new Date(invitation.expiresAt).toLocaleDateString()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Create Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
              className="bg-white border-fos-neutral-light"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
              className="bg-white border-fos-neutral-light"
            />
          </div>

          <Button 
            type="submit" 
            disabled={settingUp} 
            className="w-full bg-fos-primary hover:bg-fos-primary-dark text-white"
          >
            {settingUp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Up Account...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept Invitation & Create Account
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-fos-neutral-light">
            By accepting this invitation, you agree to our terms of service and booking policies.
          </p>
        </div>
      </BrandCard>
    </div>
  )
}
