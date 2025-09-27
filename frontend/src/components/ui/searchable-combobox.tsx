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

interface SearchableComboboxProps {
  items: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
   className?: string; 
}

export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  items,
  value,
  onValueChange,
  placeholder,
  onFocus,
   className,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedLabel = items.find((item) => item.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
           className={cn(
            "w-full justify-between rounded-none border-[rgba(0,0,0,0.5)]",
            !value && "text-muted-foreground", // This is the key change
            className
          )}
          onFocus={onFocus}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search adviser..." />
          <CommandList>
            <CommandEmpty>No adviser found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label} // Set the searchable value to the label
                  onSelect={(currentLabel) => {
                    const selectedItem = items.find(
                      (i) =>
                        i.label.toLowerCase() === currentLabel.toLowerCase()
                    );
                    if (selectedItem) {
                      onValueChange(
                        selectedItem.value === value ? "" : selectedItem.value
                      );
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
