"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Option {
  value: string;
  label: string;
}

interface CreatableComboboxProps {
  items: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  onCreate?: (value: string) => void;
}

export function CreatableCombobox({
  items,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  className,
  onCreate,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selectedItem = items.find((item) => item.value === value);

  // If the value isn't in the items list, treat it as a custom value
  const displayValue = selectedItem ? selectedItem.label : value;

  const handleSelect = (currentValue: string) => {
    // If the selected value matches an existing item's label (normalized), use the item's value
    // Otherwise, it's a new custom value
    const matchedItem = items.find(
      (item) => item.label.toLowerCase() === currentValue.toLowerCase()
    );

    if (matchedItem) {
      onValueChange(matchedItem.value);
    } else {
      // It's a custom value
      onValueChange(currentValue);
      onCreate?.(currentValue);
    }
    setOpen(false);
  };

  // Filter items based on input value if not empty
  const filteredItems =
    inputValue === ""
      ? items
      : items.filter((item) =>
          item.label.toLowerCase().includes(inputValue.toLowerCase())
        );

  const showCreateOption =
    inputValue !== "" &&
    !items.some(
      (item) => item.label.toLowerCase() === inputValue.toLowerCase()
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {value ? displayValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={handleSelect}
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

            {showCreateOption && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value={inputValue}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create "{inputValue}"
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
