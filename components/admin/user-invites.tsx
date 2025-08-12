"use client"

import { useFormStatus } from "react-dom"
import { inviteUser } from "@/app/actions/admin-actions"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2, Mail } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-fos-primary hover:bg-fos-primary-dark text-white">
      {pending ? (
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

          <form action={inviteUser} className="space-y-4">
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

            <SubmitButton />
          </form>
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
