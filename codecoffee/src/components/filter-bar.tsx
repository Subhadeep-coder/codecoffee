"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string
    difficulty: string[]
    tags: string[]
  }) => void
  availableTags: string[]
}

const difficulties = ["All", "Easy", "Medium", "Hard"]

export function FilterBar({ onFilterChange, availableTags }: FilterBarProps) {
  const [search, setSearch] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [openDifficulty, setOpenDifficulty] = useState(false)
  const [openTags, setOpenTags] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange({
      search: value,
      difficulty: selectedDifficulty === "All" ? [] : [selectedDifficulty],
      tags: selectedTags,
    })
  }

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value)
    setOpenDifficulty(false)
    onFilterChange({
      search,
      difficulty: value === "All" ? [] : [value],
      tags: selectedTags,
    })
  }

  const handleTagToggle = (tag: string) => {
    const updatedTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]

    setSelectedTags(updatedTags)
    onFilterChange({
      search,
      difficulty: selectedDifficulty === "All" ? [] : [selectedDifficulty],
      tags: updatedTags,
    })
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search problems..."
          className="pl-8"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Popover open={openDifficulty} onOpenChange={setOpenDifficulty}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openDifficulty}
              className="justify-between min-w-[130px]"
            >
              {selectedDifficulty}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[130px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {difficulties.map((difficulty) => (
                    <CommandItem
                      key={difficulty}
                      value={difficulty}
                      onSelect={() => handleDifficultyChange(difficulty)}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedDifficulty === difficulty ? "opacity-100" : "opacity-0")}
                      />
                      {difficulty}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandEmpty>No difficulties found.</CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openTags} onOpenChange={setOpenTags}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openTags}
              className="justify-between min-w-[130px]"
            >
              {selectedTags.length > 0 ? `${selectedTags.length} tags` : "Tags"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search tags..." />
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {availableTags.map((tag) => (
                    <CommandItem key={tag} value={tag} onSelect={() => handleTagToggle(tag)}>
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : "opacity-50",
                        )}
                      >
                        {selectedTags.includes(tag) && <Check className="h-3 w-3" />}
                      </div>
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandEmpty>No tags found.</CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
