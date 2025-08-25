import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import Script from "next/script"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Local Manrope font (all included weights) - served from public for maximum performance & control
const manrope = localFont({
  src: [
  // Paths are relative to this file (app/) so we traverse up one level to project root then into public
  { path: "../public/fonts/manrope/Manrope-ExtraLight.ttf", weight: "200", style: "normal" },
  { path: "../public/fonts/manrope/Manrope-Light.ttf", weight: "300", style: "normal" },
  { path: "../public/fonts/manrope/Manrope-Regular.ttf", weight: "400", style: "normal" },
  { path: "../public/fonts/manrope/Manrope-Medium.ttf", weight: "500", style: "normal" },
  { path: "../public/fonts/manrope/Manrope-SemiBold.ttf", weight: "600", style: "normal" },
  { path: "../public/fonts/manrope/Manrope-Bold.ttf", weight: "700", style: "normal" },
  { path: "../public/fonts/manrope/Manrope-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-manrope",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W3CSSFXF');
`}</Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="bg-background text-foreground font-sans">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W3CSSFXF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
