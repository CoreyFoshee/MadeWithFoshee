import type React from "react"
import type { Metadata } from "next"
import { Libre_Baskerville, Montserrat } from "next/font/google"
import "./globals.css"
import { FirebaseAuthProvider } from "@/components/firebase-auth-provider"

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-serif",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Lake With Foshee - Family Lake House",
  description: "Your family lake house booking platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${montserrat.variable} antialiased`}>
      <body>
        <FirebaseAuthProvider>
          {children}
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}
