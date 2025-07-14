"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilterTypes } from "@/app/problems/page"

interface ProblemsFilterProps {
    onFilter: (filters: FilterTypes) => void
}

export function ProblemsFilter({ onFilter }: ProblemsFilterProps) {
    const [difficulty, setDifficulty] = useState<string[]>([])
    const [category, setCategory] = useState<string[]>([])
    const [status, setStatus] = useState("all")

    const difficulties = ["Easy", "Medium", "Hard"]
    const categories = ["Array", "String", "Linked List", "Tree", "Graph", "Dynamic Programming"]

    const handleDifficultyChange = (diff: string, checked: boolean) => {
        const newDifficulty = checked ? [...difficulty, diff] : difficulty.filter((d) => d !== diff)
        setDifficulty(newDifficulty)
        onFilter({ difficulty: newDifficulty, category, status })
    }

    const handleCategoryChange = (cat: string, checked: boolean) => {
        const newCategory = checked ? [...category, cat] : category.filter((c) => c !== cat)
        setCategory(newCategory)
        onFilter({ difficulty, category: newCategory, status })
    }

    const handleStatusChange = (value: string) => {
        setStatus(value)
        onFilter({ difficulty, category, status: value })
    }

    const clearFilters = () => {
        setDifficulty([])
        setCategory([])
        setStatus("all")
        onFilter({ difficulty: [], category: [], status: "all" })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="All problems" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All problems</SelectItem>
                            <SelectItem value="solved">Solved</SelectItem>
                            <SelectItem value="unsolved">Unsolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-sm font-medium mb-3 block">Difficulty</Label>
                    <div className="space-y-2">
                        {difficulties.map((diff) => (
                            <div key={diff} className="flex items-center space-x-2">
                                <Checkbox
                                    id={diff}
                                    checked={difficulty.includes(diff)}
                                    onCheckedChange={(checked) => handleDifficultyChange(diff, checked as boolean)}
                                />
                                <Label htmlFor={diff} className="text-sm">
                                    {diff}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <Label className="text-sm font-medium mb-3 block">Category</Label>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div key={cat} className="flex items-center space-x-2">
                                <Checkbox
                                    id={cat}
                                    checked={category.includes(cat)}
                                    onCheckedChange={(checked) => handleCategoryChange(cat, checked as boolean)}
                                />
                                <Label htmlFor={cat} className="text-sm">
                                    {cat}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                    Clear Filters
                </Button>
            </CardContent>
        </Card>
    )
}
