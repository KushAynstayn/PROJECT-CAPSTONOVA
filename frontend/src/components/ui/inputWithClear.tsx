"use client"

import * as React from "react";
import { X } from "lucide-react";
import { Input, InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// We extend the standard InputProps to add our own onClear function
interface InputWithClearProps extends InputProps {
  onClear: () => void;
}

export const InputWithClear = React.forwardRef<HTMLInputElement, InputWithClearProps>(
  ({ value, onClear, onFocus, onBlur, ...props }, ref) => {
    // State to track if the input is currently focused
    const [isFocused, setIsFocused] = React.useState(false);

    // We create our own focus and blur handlers to manage the state,
    // while also calling any handlers passed in through props.
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <div className="relative w-full">
        {/* The regular input field with our new focus/blur handlers */}
        <Input 
          ref={ref} 
          value={value} 
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props} 
        />
        
        {/* The clear button, which now appears only if there is a value AND the input is focused */}
        {value && isFocused && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 text-muted-foreground hover:bg-transparent"
            // Use onMouseDown to prevent the input from losing focus before the click is registered
            onMouseDown={(e) => {
              e.preventDefault(); // This stops the input's onBlur from firing
              onClear();
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
