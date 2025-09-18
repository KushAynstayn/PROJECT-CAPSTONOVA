"use client";

import * as React from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define props for the component
interface Calendar22Props {
  year: number | undefined;
  setYear: (year: number | undefined) => void;
}

export function Calendar22({ year, setYear }: Calendar22Props) {
  const [open, setOpen] = React.useState(false);

  // Generate last 50 years
  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2">
          {/* Trigger Button */}
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="year"
              className="w-48 justify-between font-normal"
            >
              {year ? year : "Select Year"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>

          {/* X Button (separate, won’t trigger popover) */}
          {year && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setYear(undefined)}
              className="h-9 w-9"
            >
              <XIcon className="h-4 w-4 text-gray-500 hover:text-red-500" />
            </Button>
          )}
        </div>

        <PopoverContent
          className="w-48 max-h-60 overflow-y-auto p-2"
          align="start"
        >
          <div className="grid grid-cols-1 gap-1">
            {years.map((yr) => (
              <Button
                key={yr}
                variant={yr === year ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setYear(yr);
                  setOpen(false);
                }}
              >
                {yr}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
