"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// This component now manages two separate dates
export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()

  return (
    // Use a flex container to place the date pickers side-by-side
    <div className={cn("flex flex-col md:flex-row gap-4", className)}>
      {/* --- Start Date Picker --- */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="start-date"
            variant={"outline"}
            className={cn(
              "w-4/5 justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "LLL dd, y") : <span>Start date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>

      {/* --- End Date Picker --- */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="end-date"
            variant={"outline"}
            className={cn(
              "w-4/5 justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "LLL dd, y") : <span>End date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            // This is the key change: it disables all dates before the selected start date
            disabled={startDate ? { before: startDate } : false}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}