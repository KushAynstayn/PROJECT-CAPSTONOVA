"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Input, InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InputWithClearProps extends InputProps {
  onClear?: () => void;
}

export const InputWithClear = React.forwardRef<
  HTMLInputElement,
  InputWithClearProps
>(
  (
    { value, defaultValue, onChange, onClear, onFocus, onBlur, ...props },
    ref
  ) => {
    // Internal state for uncontrolled usage
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? ""
    );
    const [isFocused, setIsFocused] = React.useState(false);

    // Check if parent is controlling the value
    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value as string) : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      onClear?.();
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {currentValue && isFocused && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 text-muted-foreground hover:bg-transparent"
            onMouseDown={(e) => {
              e.preventDefault();
              handleClear();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

InputWithClear.displayName = "InputWithClear";
