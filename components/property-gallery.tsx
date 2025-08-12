"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyGalleryProps {
  images: string[]
  propertyName: string
  className?: string
}

export default function PropertyGallery({ images, propertyName, className = "" }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden ${className}`}>
        {/* Main Image */}
        <div className="md:col-span-2 md:row-span-2 relative h-64 md:h-full cursor-pointer">
          <Image
            src={images[0] || "/placeholder.svg?height=400&width=600&query=lake house main view"}
            alt={`${propertyName} - Main view`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedImage(0)}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Secondary Images */}
        {images.slice(1, 5).map((image, index) => (
          <div key={index + 1} className="relative h-32 cursor-pointer">
            <Image
              src={
                image ||
                `/placeholder.svg?height=200&width=300&query=lake house ${index === 0 ? "interior" : index === 1 ? "bedroom" : index === 2 ? "kitchen" : "outdoor"}`
              }
              alt={`${propertyName} - View ${index + 2}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage(index + 1)}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}

        {/* Show More Button */}
        {images.length > 5 && (
          <div className="relative h-32 bg-fos-neutral-light flex items-center justify-center cursor-pointer hover:bg-fos-neutral-light/80 transition-colors">
            <Button
              variant="outline"
              onClick={() => setSelectedImage(5)}
              className="border-fos-primary text-fos-primary hover:bg-fos-primary hover:text-white"
            >
              +{images.length - 5} more
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={`${propertyName} - View ${selectedImage + 1}`}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />

            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
