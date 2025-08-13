"use client"

import { useEffect, useState } from "react"
import BrandHeader from "@/components/brand-header"
import PropertyGallery from "@/components/property-gallery"
import BookingPanel from "@/components/booking-panel"
import MonthCalendar from "@/components/month-calendar"
import { BrandCard } from "@/components/ui/brand-card"
import { Badge } from "@/components/ui/badge"
import { getListing, getListings, getBookings, getBlackoutDates } from "@/lib/firebase/database"
import AuthGuard from "@/components/auth-guard"
import type { DateRange } from "react-day-picker"
import {
  Wifi,
  Car,
  Waves,
  TreePine,
  Users,
  Bed,
  Bath,
  CookingPotIcon as Kitchen,
  MapPin,
  Clock,
  Shield,
  Cigarette,
  Volume2,
  PartyPopper,
} from "lucide-react"

export default function PlacePage() {
  const [listing, setListing] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [blackouts, setBlackouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    async function loadData() {
      try {
        console.log('🔍 Place page: Loading data...')
        
        // First, let's get all listings to see what's available
        const allListings = await getListings()
        console.log('🔍 Place page: All listings:', allListings)
        
        // Try to get the 'default' listing first, fallback to first available
        let listingData = await getListing('default')
        if (!listingData && allListings.length > 0) {
          console.log('🔍 Place page: "default" listing not found, using first available listing')
          listingData = allListings[0]
        }
        
        const [bookingsData, blackoutsData] = await Promise.all([
          getBookings(),
          getBlackoutDates()
        ])
        
        console.log('🔍 Place page: Final listing data:', listingData)
        console.log('🔍 Place page: Bookings data:', bookingsData)
        console.log('🔍 Place page: Blackouts data:', blackoutsData)
        
        setListing(listingData)
        setBookings(bookingsData)
        setBlackouts(blackoutsData)
      } catch (error) {
        console.error('❌ Place page: Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setSelectedDateRange(range)
  }

  // Combine and process dates
  const unavailableDates: Date[] = []
  
  // Add booking dates
  bookings?.forEach((booking) => {
    const start = new Date(booking.start_date)
    const end = new Date(booking.end_date)
    for (let d = start; d < end; d.setDate(d.getDate() + 1)) {
      unavailableDates.push(new Date(d))
    }
  })

  // Add blackout dates
  blackouts?.forEach((blackout) => {
    const start = new Date(blackout.start_date)
    const end = new Date(blackout.end_date)
    for (let d = start; d < end; d.setDate(d.getDate() + 1)) {
      unavailableDates.push(new Date(d))
    }
  })

  const images = [
    "/lake-house-dock.png",
    "/lake-house-living-room.png",
    "/lake-house-bedroom.png",
    "/modern-lake-house-kitchen.png",
    "/placeholder-njqf4.png",
  ]

  const amenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Car, label: "Free Parking" },
    { icon: Waves, label: "Lake Access" },
    { icon: TreePine, label: "Private Dock" },
    { icon: Kitchen, label: "Full Kitchen" },
    { icon: Bed, label: "4 Bedrooms" },
    { icon: Bath, label: "3 Bathrooms" },
    { icon: Users, label: `Up to ${listing?.max_guests || 8} Guests` },
  ]

  const houseRules = [
    { icon: Clock, label: "Check-in: 4:00 PM", description: "Check-out: 11:00 AM" },
    { icon: Cigarette, label: "No smoking", description: "Smoking is not allowed anywhere on the property" },
    { icon: Volume2, label: "Quiet hours", description: "10:00 PM - 8:00 AM" },
    { icon: PartyPopper, label: "No parties", description: "Events and parties are not allowed" },
    { icon: Shield, label: "Security deposit", description: "May be required for certain bookings" },
  ]

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fos-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!listing) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Property not found</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-fos-neutral-light">
        <BrandHeader />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Header */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-fos-neutral-deep mb-2">{listing.name}</h1>
                  <div className="flex items-center gap-2 text-fos-neutral">
                    <MapPin className="h-4 w-4" />
                    <span>Private Lake House • Family Retreat</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-fos-primary-light text-fos-primary-dark">
                    Up to {listing.max_guests} guests
                  </Badge>
                  <Badge variant="secondary" className="bg-fos-primary-light text-fos-primary-dark">
                    {listing.min_nights} night minimum
                  </Badge>
                  <Badge variant="secondary" className="bg-fos-accent-green/20 text-fos-accent-green">
                    Family Owned
                  </Badge>
                </div>
              </div>

            {/* Gallery */}
            <PropertyGallery images={images} propertyName={listing.name} />

            {/* Description */}
            <BrandCard>
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">About this place</h2>
                <p className="text-fos-neutral leading-relaxed">{listing.description}</p>
                <p className="text-fos-neutral leading-relaxed">
                  Escape to our beautiful family lake house, where memories are made and relaxation comes naturally.
                  This waterfront retreat offers the perfect blend of comfort and adventure, with direct lake access, a
                  private dock, and stunning sunset views. Whether you're looking to unwind with a book on the deck or
                  enjoy water activities with the family, this is your home away from home.
                </p>
              </div>
            </BrandCard>

            {/* Amenities */}
            <BrandCard>
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">What this place offers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <amenity.icon className="h-5 w-5 text-fos-primary" />
                      <span className="text-fos-neutral">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </BrandCard>

            {/* House Rules */}
            <BrandCard>
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">House rules</h2>
                <div className="space-y-4">
                  {houseRules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <rule.icon className="h-5 w-5 text-fos-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-fos-neutral-deep">{rule.label}</p>
                        <p className="text-sm text-fos-neutral">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BrandCard>

            {/* Map Placeholder */}
            <BrandCard>
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Location</h2>
                <div className="h-64 bg-fos-neutral-light rounded-xl flex items-center justify-center">
                  <div className="text-center text-fos-neutral">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p>Interactive map coming soon</p>
                    <p className="text-sm">Private lake location</p>
                  </div>
                </div>
              </div>
            </BrandCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BookingPanel 
              listing={listing} 
              selectedRange={selectedDateRange}
              onDateRangeChange={handleDateRangeSelect}
              unavailableDates={unavailableDates}
            />
          </div>
        </div>
      </div>
    </div>
      </AuthGuard>
  )
}
