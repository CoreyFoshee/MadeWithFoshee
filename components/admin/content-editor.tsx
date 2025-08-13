"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { updateContentBlock, deleteContentBlock } from "@/app/actions/admin-actions"
import { BrandCard } from "@/components/ui/brand-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Loader2, Eye } from "lucide-react"
import ContentRenderer from "@/components/content-renderer"

interface ContentBlock {
  id: string
  slug: string
  type: string
  data: any
  position: number
}

interface ContentEditorProps {
  contentBlocks: ContentBlock[]
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-fos-primary hover:bg-fos-primary-dark text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Content"
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

export default function ContentEditor({ contentBlocks }: ContentEditorProps) {
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock(block)
    setShowPreview(false)
  }

  const handleNewBlock = () => {
    setEditingBlock({
      id: "",
      slug: "home",
      type: "hero",
      data: {},
      position: contentBlocks.length,
    })
    setShowPreview(false)
  }

  const exampleData = {
    hero: {
              title: "Lake With Foshee",
      subtitle: "Your family lake house awaits",
      cta_text: "Request Dates",
      background_image: "/images/lake-house-hero.jpg",
    },
    highlights: {
      title: "Lake House Highlights",
      items: [
        { title: "Waterfront Views", description: "Stunning lake views from every room" },
        { title: "Private Dock", description: "Your own dock for swimming and boating" },
      ],
    },
    feature: {
      title: "Feature Title",
      description: "Feature description text",
      cta_text: "Learn More",
      cta_link: "/place",
      image: "/images/feature.jpg",
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-fos-neutral-deep">Homepage Content Editor</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="border-fos-primary text-fos-primary hover:bg-fos-primary hover:text-white bg-transparent"
          >
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleNewBlock} className="bg-fos-primary hover:bg-fos-primary-dark text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <BrandCard>
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">Live Preview</h3>
            <div className="border border-fos-neutral-light rounded-lg overflow-hidden">
              <ContentRenderer blocks={contentBlocks} />
            </div>
          </div>
        </BrandCard>
      )}

      {/* Content Blocks List */}
      {!editingBlock && (
        <div className="space-y-4">
          {contentBlocks.length === 0 ? (
            <BrandCard className="text-center py-8">
              <p className="text-fos-neutral">No content blocks yet. Create your first one!</p>
            </BrandCard>
          ) : (
            contentBlocks.map((block) => (
              <BrandCard key={block.id}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-fos-neutral-deep">
                      {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
                    </h4>
                    <p className="text-sm text-fos-neutral">
                      Position: {block.position} | Slug: {block.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(block)}
                      variant="outline"
                      size="sm"
                      className="border-fos-primary text-fos-primary hover:bg-fos-primary hover:text-white bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <form action={deleteContentBlock} className="inline">
                      <input type="hidden" name="blockId" value={block.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </div>
              </BrandCard>
            ))
          )}
        </div>
      )}

      {/* Edit Form */}
      {editingBlock && (
        <BrandCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">
                {editingBlock.id ? "Edit" : "Create"} Content Block
              </h3>
              <Button
                onClick={() => setEditingBlock(null)}
                variant="outline"
                className="border-fos-neutral text-fos-neutral hover:bg-fos-neutral-light bg-transparent"
              >
                Cancel
              </Button>
            </div>

            <form action={updateContentBlock} className="space-y-4">
              {editingBlock.id && <input type="hidden" name="blockId" value={editingBlock.id} />}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={editingBlock.slug}
                    className="bg-white border-fos-neutral-light"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue={editingBlock.type} required>
                    <SelectTrigger className="bg-white border-fos-neutral-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="highlights">Highlights</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    min="0"
                    defaultValue={editingBlock.position}
                    className="bg-white border-fos-neutral-light"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">JSON Data</Label>
                <Textarea
                  id="data"
                  name="data"
                  defaultValue={JSON.stringify(editingBlock.data, null, 2)}
                  className="bg-white border-fos-neutral-light font-mono text-sm resize-none"
                  rows={12}
                  required
                />
                <div className="text-xs text-fos-neutral">
                  <p className="mb-2">Example data structures:</p>
                  <details className="bg-fos-neutral-light/50 p-2 rounded">
                    <summary className="cursor-pointer font-medium">Hero Block</summary>
                    <pre className="mt-2 text-xs overflow-x-auto">{JSON.stringify(exampleData.hero, null, 2)}</pre>
                  </details>
                </div>
              </div>

              <SubmitButton />
            </form>
          </div>
        </BrandCard>
      )}
    </div>
  )
}
