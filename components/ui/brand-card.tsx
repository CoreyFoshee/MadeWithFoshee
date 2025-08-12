import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BrandCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

export function BrandCard({ children, className, title, description }: BrandCardProps) {
  return (
    <Card className={cn("bg-white rounded-2xl card-shadow border-0 overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && <CardTitle className="font-serif text-xl text-fos-neutral-deep">{title}</CardTitle>}
          {description && <CardDescription className="text-fos-neutral">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}
