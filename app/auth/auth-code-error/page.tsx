import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fos-neutral-light to-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-fos-neutral-deep font-serif">Authentication Error</h1>
          <p className="text-fos-neutral">
            Sorry, we couldn't log you in. The link may have expired or been used already.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/auth/login">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}
