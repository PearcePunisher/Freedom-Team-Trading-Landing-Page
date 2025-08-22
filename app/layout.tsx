import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Freedom Team Trading - Become A Profitable Trader",
  description: "Learn to trade, master 3 simple trading systems. And become a trader that can trade any market.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${manrope.variable} antialiased`}>
      <body className="bg-background text-foreground font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
