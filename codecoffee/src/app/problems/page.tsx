"use client"

import { useState } from "react"
import { ProblemsTable } from "@/components/problems/problems-table"
import { ProblemsFilter } from "@/components/problems/problems-filter"
import { Navbar } from "@/components/layout/navbar"

export interface FilterTypes {
  difficulty: string[],
  category: string[],
  status: string
}

export default function ProblemsPage() {
  const [filters, setFilters] = useState<FilterTypes>({
    difficulty: [] as string[],
    category: [] as string[],
    status: ""
  })

  const handleFilter = (newFilters: FilterTypes) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Problems</h1>
          <p className="text-muted-foreground">Solve coding problems to improve your algorithmic thinking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProblemsFilter onFilter={handleFilter} />
          </div>
          <div className="lg:col-span-3">
            <ProblemsTable filters={filters} />
          </div>
        </div>
      </div>
    </div>
  )
}