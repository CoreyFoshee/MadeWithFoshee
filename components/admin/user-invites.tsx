"use client"


import { useState, useEffect } from "react"
import { inviteUser, getPendingInvitations, cancelInvitation } from "@/app/actions/admin-actions"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2, Mail, Clock, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/firebase/auth"

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting} className="bg-fos-primary hover:bg-fos-primary-dark text-white">
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending Invite...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Send Invitation
        </>
      )}
    </Button>
  )
}

export default function UserInvites() {
  const { toast } = useToast()
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load pending invitations
  useEffect(() => {
    loadPendingInvitations()
  }, [])

  const loadPendingInvitations = async () => {
    try {
      setLoading(true)
      
      // Get current user ID
      const currentUser = getCurrentUser()
      if (!currentUser) {
        console.error('No current user found')
        return
      }

      // Use the server action directly
      const result = await getPendingInvitations(currentUser.uid)
      
      if (result.success) {
        setPendingInvitations(result.invitations || [])
      } else {
        console.error('Error loading invitations:', result.error)
      }
    } catch (error) {
      console.error('Error loading invitations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission
    
    try {
      setIsSubmitting(true)
      
      // Get current user ID
      const currentUser = getCurrentUser()
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to send invitations",
          variant: "destructive"
        })
        return
      }

      // Get form data from the event
      const form = e.currentTarget
      const formData = new FormData(form)
      
      // Use the server action directly
      const result = await inviteUser(formData, currentUser.uid)
      
      if (result.success) {
        toast({
          title: "Invitation Sent!",
          description: result.message,
        })
        // Reload invitations
        loadPendingInvitations()
        // Reset form
        const form = document.querySelector('form') as HTMLFormElement
        if (form) form.reset()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      // Get current user ID
      const currentUser = getCurrentUser()
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to cancel invitations",
          variant: "destructive"
        })
        return
      }

      // Use the server action directly
      const result = await cancelInvitation(invitationId, currentUser.uid)
      
      if (result.success) {
        toast({
          title: "Invitation Cancelled",
          description: result.message,
        })
        loadPendingInvitations()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">User Management</h2>

      {/* Invite Form */}
      <BrandCard>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-fos-primary" />
            <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">Invite Family Member</h3>
          </div>

          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                  className="bg-white border-fos-neutral-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="bg-white border-fos-neutral-light"
                />
              </div>
            </div>

            <div className="bg-fos-neutral-light/50 p-4 rounded-lg">
              <h4 className="font-medium text-fos-neutral-deep mb-2">Invitation Details</h4>
              <ul className="text-sm text-fos-neutral space-y-1">
                <li>• Family members will receive access to book the lake house</li>
                <li>• They can view availability and submit booking requests</li>
                <li>• All bookings require owner approval</li>
                <li>• Invitations are sent via email with setup instructions</li>
              </ul>
            </div>

            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </div>
      </BrandCard>

      {/* Pending Invitations */}
      <BrandCard>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-fos-primary" />
            <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">Pending Invitations</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-fos-primary" />
              <span className="ml-2 text-fos-neutral">Loading invitations...</span>
            </div>
          ) : pendingInvitations.length === 0 ? (
            <div className="text-center py-8 text-fos-neutral">
              <Mail className="h-12 w-12 mx-auto mb-4 text-fos-neutral-light" />
              <p>No pending invitations</p>
              <p className="text-sm">Invitations you send will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 bg-fos-neutral-light/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-fos-neutral-deep">{invitation.fullName}</p>
                        <p className="text-sm text-fos-neutral">{invitation.email}</p>
                        <p className="text-xs text-fos-neutral-light">
                          Sent {new Date(invitation.createdAt).toLocaleDateString()} • 
                          Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelInvitation(invitation.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </BrandCard>

      {/* Instructions */}
      <BrandCard>
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">How Invitations Work</h3>
          <div className="space-y-3 text-sm text-fos-neutral">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-fos-primary text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-fos-neutral-deep">Send Invitation</p>
                <p>Enter the family member's name and email address to send them an invitation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-fos-primary text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-fos-neutral-deep">Email Delivery</p>
                <p>They'll receive an email with a secure link to create their account and access the platform.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-fos-primary text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-fos-neutral-deep">Account Setup</p>
                <p>Once they complete setup, they can browse availability and submit booking requests.</p>
              </div>
            </div>
          </div>
        </div>
      </BrandCard>
    </div>
  )
}
