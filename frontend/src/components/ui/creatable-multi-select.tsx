// (MODIFIED)
// Location: frontend/src/components/ui/creatable-multi-select.tsx
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
import { Badge } from "@/components/ui/badge";
import { apiCall } from "../../lib/api";

export interface MultiSelectItem {
  value: string;
  label: string;
}

interface CreatableMultiSelectProps {
  fetchUrl: string;
  value: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

const CreatableMultiSelect: React.FC<CreatableMultiSelectProps> = ({
  fetchUrl,
  value,
  onValueChange,
  placeholder = "Select or create...",
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [items, setItems] = React.useState<MultiSelectItem[]>([]);

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await apiCall(fetchUrl);
        const fetchedItems = data.map((item: string) => ({
          value: item,
          label: item,
        }));
        setItems(fetchedItems);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    if (open) {
      fetchItems();
    }
  }, [fetchUrl, open]);

  const handleSelect = (selectedValue: string) => {
    if (!value.includes(selectedValue)) {
      onValueChange([...value, selectedValue]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      const newValues = inputValue
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      const uniqueNewValues = newValues.filter(
        (v) => !value.includes(v) && !items.some((item) => item.value === v)
      );
      if (uniqueNewValues.length > 0) {
        onValueChange([...value, ...uniqueNewValues]);
      }
      setInputValue("");
    }
  };

  const handleRemove = (val: string) => {
    onValueChange(value.filter((v) => v !== val));
  };

  const filteredItems = items.filter(
    (item) =>
      !value.includes(item.value) &&
      item.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex w-full min-h-10 flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-wrap gap-1">
            {value.map((val) => (
              <Badge
                key={val}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {items.find((i) => i.value === val)?.label || val}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(val);
                  }}
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
            {value.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      {/* FIX: Added onMouseDown listener to prevent the dialog from stealing focus */}
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Command>
          <CommandInput
            placeholder="Add tags separated by comma..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    handleSelect(item.value);
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
      </PopoverContent>
    </Popover>
  );
};

export default CreatableMultiSelect;
