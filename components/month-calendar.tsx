"use client"

import { useState } from "react"
import { DayPicker, type DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { BrandCard } from "@/components/ui/brand-card"
import Link from "next/link"
import "react-day-picker/dist/style.css"

interface MonthCalendarProps {
  unavailableDates?: Date[]
  onDateRangeSelect?: (range: DateRange | undefined) => void
  selectedRange?: DateRange
  className?: string
  listingId?: string
}

export default function MonthCalendar({
  unavailableDates = [],
  onDateRangeSelect,
  selectedRange,
  className = "",
  listingId,
}: MonthCalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>(selectedRange)

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange)
    onDateRangeSelect?.(newRange)
  }

  const modifiers = {
    unavailable: unavailableDates,
    selected: range,
  }

  const modifiersStyles = {
    unavailable: {
      backgroundColor: "#f3f4f6",
      color: "#9ca3af",
      textDecoration: "line-through",
    },
    selected: {
      backgroundColor: "var(--fos-primary)",
      color: "white",
    },
  }

  return (
    <BrandCard className={className}>
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-serif font-bold text-fos-neutral-deep mb-2">Select Your Dates</h3>
          {range?.from && range?.to && (
            <p className="text-sm text-fos-neutral">
              {format(range.from, "MMM dd")} - {format(range.to, "MMM dd, yyyy")}
            </p>
          )}
        </div>

        <style jsx global>{`
          .rdp {
            --rdp-cell-size: 40px;
            --rdp-accent-color: var(--fos-primary);
            --rdp-background-color: var(--fos-primary-light);
            --rdp-accent-color-dark: var(--fos-primary-dark);
            margin: 0;
          }

          .rdp-day_today {
            border: 2px solid var(--fos-primary);
            border-radius: 50%;
          }

          .rdp-day_range_middle {
            background-color: var(--fos-primary-light) !important;
            color: var(--fos-primary-dark) !important;
          }

          .rdp-day_range_start,
          .rdp-day_range_end {
            background-color: var(--fos-primary) !important;
            color: white !important;
          }

          .rdp-day_selected {
            background-color: var(--fos-primary) !important;
            color: white !important;
          }

          .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
            background-color: var(--fos-primary-light);
            color: var(--fos-primary-dark);
          }

          .rdp-head_cell {
            font-weight: 600;
            color: var(--fos-neutral);
          }

          .rdp-caption {
            color: var(--fos-neutral-deep);
            font-weight: 600;
          }
        `}</style>

        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          disabled={[{ before: new Date() }, ...unavailableDates]}
          className="mx-auto"
        />

        {range?.from && range?.to && listingId && (
          <Button asChild className="w-full bg-fos-primary hover:bg-fos-primary-dark text-white">
            <Link
              href={`/book?listing=${listingId}&from=${range.from.toISOString()}&to=${range.to.toISOString()}&guests=2`}
            >
              Request These Dates
            </Link>
          </Button>
        )}
      </div>
    </BrandCard>
  )
}
