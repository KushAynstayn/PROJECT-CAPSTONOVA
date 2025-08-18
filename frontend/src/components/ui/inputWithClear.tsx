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
  ({ value, onClear, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* The regular input field */}
        <Input ref={ref} value={value} {...props} />
        
        {/* The clear button, which only appears if there is a value */}
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 text-muted-foreground hover:bg-transparent"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);
InputWithClear.displayName = "InputWithClear";