import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandCard } from "@/components/ui/brand-card"

interface ContentBlock {
  id: string
  slug: string
  type: string
  data: any
  position: number
}

interface ContentRendererProps {
  blocks: ContentBlock[]
  className?: string
}

function HeroBlock({ data }: { data: any }) {
  return (
    <section className="relative bg-gradient-to-br from-fos-neutral-light to-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-fos-neutral-deep">{data.title}</h1>
          <p className="text-xl md:text-2xl text-fos-neutral max-w-2xl mx-auto">{data.subtitle}</p>
        </div>

        {data.background_image && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden card-shadow">
            <Image
              src={data.background_image || "/placeholder.svg"}
              alt="Lake House Hero"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        )}

        <Button asChild size="lg" className="bg-fos-primary hover:bg-fos-primary-dark text-white px-8 py-3 text-lg">
          <Link href="/book">{data.cta_text}</Link>
        </Button>
      </div>
    </section>
  )
}

function HighlightsBlock({ data }: { data: any }) {
  return (
    <section className="airy-section bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-fos-neutral-deep mb-4">{data.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items?.map((item: any, index: number) => (
            <BrandCard key={index} className="text-center">
              <div className="space-y-3">
                <h3 className="text-lg font-serif font-bold text-fos-neutral-deep">{item.title}</h3>
                <p className="text-fos-neutral text-sm">{item.description}</p>
              </div>
            </BrandCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureBlock({ data }: { data: any }) {
  return (
    <section className="airy-section bg-fos-neutral-light">
      <div className="max-w-4xl mx-auto">
        <BrandCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-fos-neutral-deep">{data.title}</h2>
              <p className="text-fos-neutral leading-relaxed">{data.description}</p>
              {data.cta_text && data.cta_link && (
                <Button asChild className="bg-fos-primary hover:bg-fos-primary-dark text-white">
                  <Link href={data.cta_link}>{data.cta_text}</Link>
                </Button>
              )}
            </div>
            {data.image && (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <Image src={data.image || "/placeholder.svg"} alt={data.title} fill className="object-cover" />
              </div>
            )}
          </div>
        </BrandCard>
      </div>
    </section>
  )
}

export default function ContentRenderer({ blocks, className = "" }: ContentRendererProps) {
  const sortedBlocks = blocks.sort((a, b) => a.position - b.position)

  return (
    <div className={className}>
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case "hero":
            return <HeroBlock key={block.id} data={block.data} />
          case "highlights":
            return <HighlightsBlock key={block.id} data={block.data} />
          case "feature":
            return <FeatureBlock key={block.id} data={block.data} />
          default:
            return null
        }
      })}
    </div>
  )
}
