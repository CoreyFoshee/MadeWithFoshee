"use client"

import MonthCalendar from "@/components/month-calendar"
import PropertyGallery from "@/components/property-gallery"
import BrandHeader from "@/components/brand-header"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Users, Wifi, Car, Coffee } from "lucide-react"
import Link from "next/link"
import AuthGuard from "@/components/auth-guard"
import { useEffect, useState } from "react"
import { getContentBlocks, getListings } from "@/lib/firebase/database"

interface ContentBlock {
  id: string
  title: string
  content: string
  position: number
  type: string
}

interface Listing {
  id: string
  name: string
  description: string
  max_guests: number
  min_nights: number
  price_per_night: number
}

export default function HomePage() {
  // Updated for Firebase integration - trigger redeploy
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [blocks, listingsData] = await Promise.all([
          getContentBlocks(),
          getListings()
        ])
        
        setContentBlocks(blocks)
        setListings(listingsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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

  const defaultListing = listings[0] || {
    name: 'Family Lake House',
    max_guests: 8,
    min_nights: 2
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <BrandHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">
              Welcome to Your Family Lake House
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the perfect blend of luxury and nature in our stunning lakefront property. 
              Book your next family getaway today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/place">
                <Button size="lg" className="bg-fos-primary hover:bg-fos-primary-dark text-white px-8 py-4 text-lg">
                  Book Your Stay
                </Button>
              </Link>
              <Link href="/place">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  View Property
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-fos-primary-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="h-8 w-8 text-fos-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
                <p className="text-gray-600">Simple and secure booking process for your perfect getaway</p>
              </div>
              <div className="text-center">
                <div className="bg-fos-primary-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-fos-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Prime Location</h3>
                <p className="text-gray-600">Located in a beautiful, private lake setting with stunning views</p>
              </div>
              <div className="text-center">
                <div className="bg-fos-primary-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-fos-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Friendly</h3>
                <p className="text-gray-600">Perfect for families with activities and amenities for all ages</p>
              </div>
            </div>
          </div>
        </section>

        {/* Property Preview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Perfect Lake House</h2>
              <p className="text-xl text-gray-600">Discover the beauty and comfort of our family retreat</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <PropertyGallery 
                  images={[
                    "/lake-house-dock.png",
                    "/lake-house-living-room.png",
                    "/lake-house-bedroom.png",
                    "/modern-lake-house-kitchen.png"
                  ]} 
                  propertyName={defaultListing.name}
                />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">{defaultListing.name}</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our beautiful lake house offers the perfect blend of comfort and adventure. 
                  With direct lake access, a private dock, and stunning sunset views, you'll 
                  create memories that last a lifetime.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-fos-primary" />
                    <span className="text-gray-600">Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-fos-primary" />
                    <span className="text-gray-600">Free Parking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coffee className="h-5 w-5 text-fos-primary" />
                    <span className="text-gray-600">Full Kitchen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-fos-primary" />
                    <span className="text-gray-600">Up to {defaultListing.max_guests} Guests</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link href="/place">
                    <Button className="w-full bg-fos-primary hover:bg-fos-primary-dark text-white">
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-fos-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready for Your Lake House Adventure?</h2>
            <p className="text-xl text-fos-primary-light mb-8 max-w-2xl mx-auto">
              Book your stay today and experience the perfect family getaway in our beautiful lake house.
            </p>
            <Link href="/place">
              <Button size="lg" className="bg-white text-fos-primary hover:bg-gray-100 px-8 py-4 text-lg">
                Start Booking Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </AuthGuard>
  )
}
