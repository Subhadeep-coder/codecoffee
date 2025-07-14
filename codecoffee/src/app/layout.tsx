import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { RouteGuard } from "@/components/auth/route-guard"
import { Toaster } from "sonner"
import { Navbar } from "@/components/layout/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeCoffee - Practice Coding",
  description: "Practice coding, one problem at a time",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <RouteGuard>
            <div className="min-h-screen bg-background">
              <Navbar />
              {children}
            </div>
          </RouteGuard>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
