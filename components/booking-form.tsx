"use client"
import { useState, useEffect } from "react"
import { createBooking } from "@/lib/firebase/database"
import { getUserProfile } from "@/lib/firebase/database"
import { onAuthStateChange, getCurrentUser } from "@/lib/firebase/auth"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, MessageSquare, Loader2, CheckCircle, AlertCircle, User } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Listing {
  id: string
  name: string
  description: string
  max_guests: number
  min_nights: number
}

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface BookingFormProps {
  listing: Listing
  fromDate: string
  toDate: string
  guestCount?: string
  initialNotes?: string
}

export default function BookingForm({ listing, fromDate, toDate, guestCount, initialNotes }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [notes, setNotes] = useState(initialNotes ? decodeURIComponent(initialNotes) : '')
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get current user and profile
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      if (authUser) {
        setUser(authUser)
        try {
          const profile = await getUserProfile(authUser.uid)
          setUserProfile(profile)
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const startDate = new Date(fromDate)
  const endDate = new Date(toDate)
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !userProfile) {
      setErrorMessage('You must be logged in to make a booking')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Validate dates
      if (startDate >= endDate) {
        throw new Error('End date must be after start date')
      }

      if (startDate < new Date()) {
        throw new Error('Start date cannot be in the past')
      }

      // Validate minimum nights
      if (nights < listing.min_nights) {
        throw new Error(`Minimum stay is ${listing.min_nights} nights`)
      }

      // Validate guests
      const guests = parseInt(guestCount || '2')
      if (guests > listing.max_guests) {
        throw new Error(`Maximum ${listing.max_guests} guests allowed`)
      }

      // Create booking data with user profile
      const bookingData = {
        listing_id: listing.id,
        user_id: user.uid,
        start_date: fromDate,
        end_date: toDate,
        guests,
        notes,
        status: 'pending',
        guest_name: `${userProfile.first_name} ${userProfile.last_name}`,
        guest_email: userProfile.email
      }

      // Submit to Firebase
      const result = await createBooking(bookingData)
      
      setSubmitStatus('success')
      console.log('Booking created successfully:', result)
      
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
      console.error('Booking error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BrandCard>
          <div className="text-center space-y-4">
            <Loader2 className="h-16 w-16 text-fos-primary mx-auto animate-spin" />
            <p className="text-fos-neutral">Loading your profile...</p>
          </div>
        </BrandCard>
      </div>
    )
  }

  // Show login required message
  if (!user || !userProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BrandCard>
          <div className="text-center space-y-4">
            <User className="h-16 w-16 text-fos-neutral mx-auto" />
            <h1 className="text-3xl font-serif font-bold text-fos-neutral-deep">Login Required</h1>
            <p className="text-fos-neutral">You must be logged in to make a booking request.</p>
            <div className="pt-4">
              <Link href="/auth/login">
                <Button className="bg-fos-primary hover:bg-fos-primary-dark text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </BrandCard>
      </div>
    )
  }

  if (submitStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BrandCard>
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-3xl font-serif font-bold text-fos-neutral-deep">Booking Request Submitted!</h1>
            <p className="text-fos-neutral">Thank you for your booking request, {userProfile.first_name}! We'll review it and get back to you soon.</p>
            <div className="pt-4">
              <Link href="/my-trips">
                <Button className="bg-fos-primary hover:bg-fos-primary-dark text-white">
                  View My Bookings
                </Button>
              </Link>
            </div>
          </div>
        </BrandCard>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-fos-neutral-deep mb-2">Request Your Stay</h1>
          <p className="text-fos-neutral">Review your booking details and submit your request</p>
        </div>

        {/* Error Message */}
        {submitStatus === 'error' && (
          <BrandCard>
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          </BrandCard>
        )}

        {/* Booking Summary */}
        <BrandCard>
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Booking Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-fos-neutral-deep">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Dates</span>
                </div>
                <p className="text-fos-neutral">
                  {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}
                </p>
                <p className="text-sm text-fos-neutral">{nights} nights</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-fos-neutral-deep">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Guests</span>
                </div>
                <p className="text-fos-neutral">{guestCount || 2} guests</p>
              </div>
            </div>

            <div className="pt-4 border-t border-fos-neutral-light">
              <h3 className="font-medium text-fos-neutral-deep mb-2">{listing.name}</h3>
              <p className="text-sm text-fos-neutral">{listing.description}</p>
            </div>
          </div>
        </BrandCard>

        {/* Booking Form */}
        <BrandCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2 text-fos-neutral-deep">
                <MessageSquare className="h-4 w-4" />
                Special Requests or Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests, dietary restrictions, or additional information..."
                className="bg-white border-fos-neutral-light resize-none"
                rows={4}
              />
              <p className="text-xs text-fos-neutral">
                Let us know if you have any special needs or requests for your stay.
              </p>
            </div>

            {/* Terms */}
            <div className="bg-fos-neutral-light/50 p-4 rounded-lg">
              <p className="text-sm text-fos-neutral">
                By submitting this booking request, you agree to our terms and conditions. 
                This is a request only and will be confirmed upon approval.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-fos-primary hover:bg-fos-primary-dark text-white py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                "Submit Booking Request"
              )}
            </Button>
          </form>
        </BrandCard>
      </div>
    </div>
  )
}
