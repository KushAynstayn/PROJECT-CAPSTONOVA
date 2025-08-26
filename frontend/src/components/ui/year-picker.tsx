"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

// Define the props for our new component
interface YearPickerProps {
  year: number | undefined;
  setYear: (year: number | undefined) => void;
  placeholder: string;
  fromYear: number;
  toYear: number;
  disabled?: boolean;
}

export const YearPicker = ({
  year,
  setYear,
  placeholder,
  fromYear,
  toYear,
  disabled = false,
}: YearPickerProps) => {
  const years = [];
  for (let i = fromYear; i <= toYear; i++) {
    years.push(i);
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    setYear(isNaN(selectedYear) ? undefined : selectedYear);
  };

  return (
    <div className="relative w-full md:w-35">
      <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <select
        value={year ?? ""}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full appearance-none rounded-md border border-input bg-transparent py-2 pl-10 pr-8 text-left font-normal",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          !year && "text-muted-foreground"
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};
