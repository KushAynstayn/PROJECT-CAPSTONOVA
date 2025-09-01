"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface MultiSelectItem {
  value: string;
  label: string;
}

interface MultiSelectProps {
  items: MultiSelectItem[];
  value: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  className?: string;
}

const MultiSelectCombobox: React.FC<MultiSelectProps> = ({
  items,
  value,
  onValueChange,
  placeholder = "Select options...",
  maxSelections = 5,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [showLimitDialog, setShowLimitDialog] = React.useState(false);

  const toggleSelect = (val: string) => {
    let newSelected: string[];
    if (value.includes(val)) {
      newSelected = value.filter((v) => v !== val);
    } else {
      if (value.length >= maxSelections) {
        setShowLimitDialog(true);
        return;
      }
      newSelected = [...value, val];
    }
    onValueChange(newSelected);
  };

  const removeTag = (val: string) => {
    onValueChange(value.filter((v) => v !== val));
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between rounded-none border-[rgba(0,0,0,0.5)] h-auto min-h-12",
              "transition-shadow focus-visible:shadow-md focus-visible:shadow-gray-400/70",
              !value.length && "text-muted-foreground font-normal",
              className
            )}
          >
            <div className="flex flex-wrap gap-1 items-center justify-start py-1">
              {value.length > 0 ? (
                value.map((val) => {
                  const label =
                    items.find((i) => i.value === val)?.label || val;
                  return (
                    <span
                      key={val}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-full text-sm"
                    >
                      {label}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents Popover from opening/closing
                          removeTag(val); // This directly removes the tag
                        }}
                        // Add these Tailwind classes for the desired hover effect
                        className="ml-1 p-1 rounded-full transition-colors duration-200 hover:bg-white/50"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder={`Search ${placeholder}`} />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      toggleSelect(currentValue);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(item.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="flex justify-end p-2 border-t">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold"
            >
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="item-center h-50 w-60">
          <DialogHeader>
            <DialogTitle className="mt-2">Selection Limit Reached</DialogTitle>
            <DialogDescription>
              You can select up to {maxSelections} choices only.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={() => setShowLimitDialog(false)}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MultiSelectCombobox;
