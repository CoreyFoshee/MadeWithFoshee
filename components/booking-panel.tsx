"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BrandCard } from "@/components/ui/brand-card"
import { Calendar, Users, MessageSquare, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DayPicker } from "react-day-picker"
import Link from "next/link"
import "react-day-picker/dist/style.css"

interface BookingPanelProps {
  listing: {
    id: string
    name: string
    max_guests: number
    min_nights: number
  }
  selectedRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  className?: string
}

export default function BookingPanel({ listing, selectedRange, onDateRangeChange, className = "" }: BookingPanelProps) {
  const [guests, setGuests] = useState(2)
  const [notes, setNotes] = useState("")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  // Debug calendar state changes
  useEffect(() => {
    console.log('Calendar open state changed:', isCalendarOpen)
  }, [isCalendarOpen])
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>()
 
  const calendarRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)

  const nights =
    selectedRange?.from && selectedRange?.to
      ? Math.ceil((selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  const canBook =
    selectedRange?.from && selectedRange?.to && nights >= listing.min_nights && guests <= listing.max_guests

  // Handle click outside to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      
      // Don't close if clicking inside the calendar
      if (calendarRef.current && calendarRef.current.contains(target)) {
        console.log('Click inside calendar - keeping open')
        return
      }
      
      // Don't close if clicking the input field
      if (inputRef.current && inputRef.current.contains(target)) {
        console.log('Click on input field - keeping open')
        return
      }
      
      // Close if clicking outside both
      console.log('Click outside calendar and input - closing')
      setIsCalendarOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])





  return (
    <div className={`sticky top-8 ${className}`}>
      <BrandCard>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-serif font-bold text-fos-neutral-deep mb-2">Book Your Stay</h3>
            <p className="text-sm text-fos-neutral">Reserve your dates at {listing.name}</p>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-fos-neutral-deep">
              <Calendar className="h-4 w-4" />
              Dates
            </Label>
            <div 
              ref={inputRef}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="p-3 border border-fos-neutral-light rounded-lg bg-white cursor-pointer hover:border-fos-primary transition-colors relative"
            >
              {selectedRange?.from && selectedRange?.to ? (
                <div className="text-center">
                  <p className="font-medium text-fos-neutral-deep">
                    {format(selectedRange.from, "MMM dd")} - {format(selectedRange.to, "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-fos-neutral">{nights} nights</p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-fos-neutral">Select dates on calendar</p>
                  <ChevronDown className="h-4 w-4 text-fos-neutral" />
                </div>
              )}
              
              {/* Calendar Popup */}
              {isCalendarOpen && (
                <div 
                  ref={calendarRef}
                  className="absolute top-full left-0 mt-2 z-50 bg-white border border-fos-neutral-light rounded-lg shadow-lg p-4"
                >
                  <div className="mb-3 text-center">
                    <p className="text-sm text-fos-neutral-deep font-medium">Select your stay dates</p>
                    {tempStartDate && !selectedRange?.to ? (
                      <div className="space-y-2">
                        <p className="text-xs text-fos-primary font-medium">
                          Start date selected! Now click your end date
                        </p>
                        <button
                          onClick={() => {
                            setTempStartDate(undefined)
                            if (onDateRangeChange) {
                              onDateRangeChange(undefined)
                            }
                          }}
                          className="text-xs text-fos-neutral hover:text-fos-primary underline"
                        >
                          Reset selection
                        </button>
                      </div>
                    ) : selectedRange?.from && selectedRange?.to ? (
                      <p className="text-xs text-fos-accent-green font-medium">
                        ✓ Complete range selected
                      </p>
                    ) : (
                      <p className="text-xs text-fos-neutral">Click start date, then end date</p>
                    )}
                  </div>
                  <div className="calendar-scroll-container max-h-96 overflow-y-auto">
                    <DayPicker
                      key="calendar-picker"
                      mode="single"
                      selected={tempStartDate}
                      onSelect={(date) => {
                        if (!date) return
                        
                        if (!tempStartDate) {
                          // First click - set start date
                          console.log('First click - setting start date:', date)
                          setTempStartDate(date)
                          // Don't update parent yet - wait for end date
                        } else {
                          // Second click - check if it's a valid end date
                          if (date > tempStartDate) {
                            // Valid range - complete the selection
                            const newRange = { from: tempStartDate, to: date }
                            console.log('Second click - completing range:', newRange)
                            
                            if (onDateRangeChange) {
                              onDateRangeChange(newRange)
                            }
                            
                            // Reset temp state and close calendar
                            setTempStartDate(undefined)
                            setTimeout(() => setIsCalendarOpen(false), 300)
                          } else {
                            // Invalid end date (before or same as start) - reset and start over
                            console.log('Invalid end date, resetting to new start date:', date)
                            setTempStartDate(date)
                          }
                        }
                      }}
                      numberOfMonths={12}
                      className="calendar-popup"
                      disabled={{ before: new Date() }}
                      showOutsideDays={false}
                      captionLayout="dropdown"
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guest Selection */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2 text-fos-neutral-deep">
              <Users className="h-4 w-4" />
              Guests
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={listing.max_guests}
              value={guests}
              onChange={(e) => setGuests(Number.parseInt(e.target.value) || 1)}
              className="bg-white border-fos-neutral-light"
            />
            <p className="text-xs text-fos-neutral">Maximum {listing.max_guests} guests</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2 text-fos-neutral-deep">
              <MessageSquare className="h-4 w-4" />
              Special Requests (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white border-fos-neutral-light resize-none"
              rows={3}
            />
          </div>

          {/* Validation Messages */}
          {selectedRange?.from && selectedRange?.to && nights < listing.min_nights && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                Minimum stay is {listing.min_nights} nights. Please select at least {listing.min_nights} nights.
              </p>
            </div>
          )}

          {guests > listing.max_guests && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                Maximum {listing.max_guests} guests allowed. Please reduce the number of guests.
              </p>
            </div>
          )}

          {/* Book Button */}
          <Button
            asChild={canBook}
            disabled={!canBook}
            className="w-full bg-fos-primary hover:bg-fos-primary-dark text-white py-3 text-lg"
          >
            {canBook ? (
              <Link
                href={`/book?listing=${listing.id}&from=${selectedRange?.from?.toISOString()}&to=${selectedRange?.to?.toISOString()}&guests=${guests}&notes=${encodeURIComponent(notes)}`}
              >
                Request Booking
              </Link>
            ) : (
              <span>Select Dates to Book</span>
            )}
          </Button>

          <div className="text-center text-xs text-fos-neutral">
            Your booking request will be reviewed by the property owner
          </div>
        </div>
      </BrandCard>
      
      {/* Calendar Popup Styles */}
      <style jsx global>{`
        .calendar-popup .rdp {
          --rdp-cell-size: 32px;
          --rdp-accent-color: var(--fos-primary);
          --rdp-background-color: var(--fos-primary-light);
          --rdp-accent-color-dark: var(--fos-primary-dark);
          margin: 0;
        }

        .calendar-popup .rdp-day_today {
          border: 2px solid var(--fos-primary);
          border-radius: 50%;
        }

        .calendar-popup .rdp-day_range_middle {
          background-color: var(--fos-primary-light) !important;
          color: var(--fos-primary-dark) !important;
        }

        .calendar-popup .rdp-day_range_start,
        .calendar-popup .rdp-day_range_end {
          background-color: var(--fos-primary) !important;
          color: white !important;
          border-radius: 50% !important;
        }

        .calendar-popup .rdp-day_selected {
          background-color: var(--fos-primary) !important;
          color: white !important;
        }

        .calendar-popup .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
          background-color: var(--fos-primary-light);
          color: var(--fos-primary-dark);
        }

        .calendar-popup .rdp-head_cell {
          font-weight: 600;
          color: var(--fos-neutral);
        }

        .calendar-popup .rdp-day_range_middle:first-of-type {
          border-top-left-radius: 50%;
          border-bottom-left-radius: 50%;
        }

        .calendar-popup .rdp-day_range_middle:last-of-type {
          border-top-right-radius: 50%;
          border-bottom-right-radius: 50%;
        }

        /* 12-month layout styles */
        .calendar-popup .rdp-months {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .calendar-popup .rdp-month {
          min-width: 240px;
        }

        /* Hide navigation arrows since we're scrolling vertically */
        .calendar-popup .rdp-nav {
          display: none !important;
        }

        .calendar-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: var(--fos-primary-light) transparent;
        }

        .calendar-scroll-container::-webkit-scrollbar {
          width: 8px;
        }

        .calendar-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .calendar-scroll-container::-webkit-scrollbar-thumb {
          background-color: var(--fos-primary-light);
          border-radius: 4px;
        }

        .calendar-scroll-container::-webkit-scrollbar-thumb:hover {
          background-color: var(--fos-primary);
        }
      `}</style>
    </div>
  )
}
