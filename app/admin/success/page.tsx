"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import BrandHeader from '@/components/brand-header'
import { BrandCard } from '@/components/ui/brand-card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminSuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<string>('')
  const [bookingId, setBookingId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const statusParam = searchParams.get('status')
    const bookingIdParam = searchParams.get('bookingId')
    
    setStatus(statusParam || '')
    setBookingId(bookingIdParam || '')
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-fos-neutral-light">
        <BrandHeader />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <BrandCard>
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fos-primary mx-auto"></div>
              <p className="text-fos-neutral">Processing...</p>
            </div>
          </BrandCard>
        </div>
      </div>
    )
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />,
          title: 'Booking Approved!',
          message: 'The booking has been successfully approved and the guest has been notified.',
          color: 'text-green-600'
        }
      case 'denied':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500 mx-auto" />,
          title: 'Booking Denied',
          message: 'The booking has been denied and the guest has been notified.',
          color: 'text-red-600'
        }
      default:
        return {
          icon: <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />,
          title: 'Action Completed',
          message: 'The requested action has been completed.',
          color: 'text-yellow-600'
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="min-h-screen bg-fos-neutral-light">
      <BrandHeader />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BrandCard>
          <div className="text-center space-y-6">
            {statusInfo.icon}
            <h1 className={`text-3xl font-serif font-bold ${statusInfo.color}`}>
              {statusInfo.title}
            </h1>
            <p className="text-fos-neutral text-lg">
              {statusInfo.message}
            </p>
            
            {bookingId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Booking ID:</strong> {bookingId}
                </p>
              </div>
            )}
            
            <div className="pt-6 space-y-3">
              <Link href="/admin">
                <Button className="bg-fos-primary hover:bg-fos-primary-dark text-white w-full">
                  Return to Admin Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        </BrandCard>
      </div>
    </div>
  )
}
