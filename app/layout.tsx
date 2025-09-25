import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AppHeader } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Python to Pseudocode Converter",
  description: "Convert Python code to IB and Cambridge pseudocode standards.",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHeader />
        <main className="min-h-screen bg-white p-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
