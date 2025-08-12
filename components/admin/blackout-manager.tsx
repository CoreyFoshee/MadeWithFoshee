"use client"

import { useFormStatus } from "react-dom"
import { createBlackout, deleteBlackout } from "@/app/actions/admin-actions"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Trash2, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface BlackoutDate {
  id: string
  start_date: string
  end_date: string
  reason: string
  listings: { name: string }
}

interface Listing {
  id: string
  name: string
}

interface BlackoutManagerProps {
  blackoutDates: BlackoutDate[]
  listings: Listing[]
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-fos-primary hover:bg-fos-primary-dark text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Create Blackout
        </>
      )}
    </Button>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      size="sm"
      className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}

export default function BlackoutManager({ blackoutDates, listings }: BlackoutManagerProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Blackout Date Management</h2>

      {/* Create New Blackout */}
      <BrandCard>
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">Create New Blackout Period</h3>

          <form action={createBlackout} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="listingId">Property</Label>
                <Select name="listingId" required>
                  <SelectTrigger className="bg-white border-fos-neutral-light">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {listings.map((listing) => (
                      <SelectItem key={listing.id} value={listing.id}>
                        {listing.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Input
                  id="reason"
                  name="reason"
                  placeholder="Maintenance, personal use, etc."
                  className="bg-white border-fos-neutral-light"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  className="bg-white border-fos-neutral-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" required className="bg-white border-fos-neutral-light" />
              </div>
            </div>

            <SubmitButton />
          </form>
        </div>
      </BrandCard>

      {/* Existing Blackouts */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">Current Blackout Periods</h3>

        {blackoutDates.length === 0 ? (
          <BrandCard className="text-center py-8">
            <Calendar className="h-8 w-8 text-fos-neutral mx-auto mb-2" />
            <p className="text-fos-neutral">No blackout periods set</p>
          </BrandCard>
        ) : (
          <div className="space-y-3">
            {blackoutDates.map((blackout) => (
              <BrandCard key={blackout.id}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-fos-neutral-deep">{blackout.listings.name}</h4>
                      {blackout.reason && <span className="text-sm text-fos-neutral">- {blackout.reason}</span>}
                    </div>
                    <p className="text-sm text-fos-neutral">
                      {format(new Date(blackout.start_date), "MMM dd, yyyy")} -{" "}
                      {format(new Date(blackout.end_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <form action={deleteBlackout}>
                    <input type="hidden" name="blackoutId" value={blackout.id} />
                    <DeleteButton />
                  </form>
                </div>
              </BrandCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
