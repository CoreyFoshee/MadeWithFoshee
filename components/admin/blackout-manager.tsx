"use client"

import { useState } from "react"
import { createBlackout, deleteBlackout } from "@/app/actions/admin-actions"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Trash2, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/firebase/auth"

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

function SubmitButton({ creating }: { creating: boolean }) {
  return (
    <Button type="submit" disabled={creating} className="bg-fos-primary hover:bg-fos-primary-dark text-white">
      {creating ? (
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



export default function BlackoutManager({ blackoutDates, listings }: BlackoutManagerProps) {
  const { toast } = useToast()
  const [deletingBlackouts, setDeletingBlackouts] = useState<Set<string>>(new Set())
  const [creatingBlackout, setCreatingBlackout] = useState(false)

  const handleDeleteBlackout = async (blackoutId: string) => {
    try {
      setDeletingBlackouts(prev => new Set(prev).add(blackoutId))
      
      const currentUser = getCurrentUser()
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to delete blackout dates",
          variant: "destructive"
        })
        return
      }

      const result = await deleteBlackout(blackoutId, currentUser.uid)
      
      if (result.success) {
        toast({
          title: "Blackout Deleted",
          description: "Blackout period has been removed successfully",
        })
        // Refresh the page to show updated data
        window.location.reload()
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
        description: "Failed to delete blackout period",
        variant: "destructive"
      })
    } finally {
      setDeletingBlackouts(prev => {
        const newSet = new Set(prev)
        newSet.delete(blackoutId)
        return newSet
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Blackout Date Management</h2>

      {/* Create New Blackout */}
      <BrandCard>
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">Create New Blackout Period</h3>

          <form onSubmit={async (e) => {
            e.preventDefault()
            
            if (creatingBlackout) return
            
            const currentUser = getCurrentUser()
            if (!currentUser) {
              toast({
                title: "Error",
                description: "You must be logged in to create blackout dates",
                variant: "destructive"
              })
              return
            }

            setCreatingBlackout(true)
            try {
              const formData = new FormData(e.currentTarget)
              const result = await createBlackout(null, formData, currentUser.uid)
              
              if (result.success) {
                toast({
                  title: "Blackout Created",
                  description: "Blackout period has been created successfully",
                })
                // Reset form
                e.currentTarget.reset()
                // Refresh the page to show updated data
                window.location.reload()
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
                description: "Failed to create blackout period",
                variant: "destructive"
              })
            } finally {
              setCreatingBlackout(false)
            }
          }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="listingId">Property</Label>
                <Select name="listingId" required>
                  <SelectTrigger className="bg-white border-fos-neutral-light">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {listings
                      .filter((listing) => listing.name.toLowerCase().includes('family lake house'))
                      .map((listing) => (
                        <SelectItem key={listing.id} value={listing.id}>
                          {listing.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-fos-neutral-light">Only the Family Lake House can be selected for blackout periods</p>
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

            <SubmitButton creating={creatingBlackout} />
          </form>
        </div>
      </BrandCard>

      {/* Existing Blackouts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">Current Blackout Periods</h3>
          <p className="text-sm text-fos-neutral-light">Click the trash icon to delete a blackout period</p>
        </div>

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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete this blackout period?\n\n${blackout.listings.name} - ${format(new Date(blackout.start_date), "MMM dd")} to ${format(new Date(blackout.end_date), "MMM dd")}\n\nThis action cannot be undone.`)) {
                        handleDeleteBlackout(blackout.id)
                      }
                    }}
                    disabled={deletingBlackouts.has(blackout.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    {deletingBlackouts.has(blackout.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </BrandCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
