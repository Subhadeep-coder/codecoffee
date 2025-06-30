import React from "react"
import { Navbar } from "@/components/layout/navbar"

interface Props {
  children: React.ReactNode;
}

export default function HomePage({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
    </div>
  )
}
