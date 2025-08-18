"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const advisers = [
  { value: "dr_reyes", label: "Dr. Reyes" },
  { value: "prof_santos", label: "Prof. Santos" },
  { value: "dr_cruz", label: "Dr. Cruz" },
  { value: "prof_garcia", label: "Prof. Garcia" },
  { value: "ms_ocampo", label: "Ms. Ocampo" },
];

// MODIFIED: Component now accepts props to be controlled by a parent
export default function Combobox({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-none border-[rgba(0,0,0,0.5)]",
            "transition-shadow focus-visible:shadow-md focus-visible:shadow-gray-400/70",
            !value && "text-muted-foreground font-normal"
          )}
        >
          {value
            ? advisers.find((adviser) => adviser.value === value)?.label
            : "Select adviser"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search adviser" />
          <CommandList>
            <CommandEmpty>No adviser found.</CommandEmpty>
            <CommandGroup>
              {advisers.map((adviser) => (
                <CommandItem
                  key={adviser.value}
                  value={adviser.value}
                  onSelect={(currentValue) => {
                    // MODIFIED: Calls the parent's function instead of setting its own state
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === adviser.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {adviser.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}