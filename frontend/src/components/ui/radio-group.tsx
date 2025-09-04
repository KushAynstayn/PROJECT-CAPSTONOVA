"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Context to provide state to radio items from the group
interface RadioGroupContextProps {
  name?: string;
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextProps | null>(
  null
);

const useRadioGroupContext = () => {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup");
  }
  return context;
};

// The main RadioGroup component
const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  }
>(
  (
    { className, value, defaultValue, onValueChange, children, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || ""
    );

    // Controlled component behavior
    const controlledValue = value !== undefined ? value : internalValue;
    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    return (
      <RadioGroupContext.Provider
        value={{
          selectedValue: controlledValue,
          onValueChange: handleValueChange,
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          className={cn("grid gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

// The individual RadioGroupItem component
const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const { selectedValue, onValueChange } = useRadioGroupContext();
  const checked = selectedValue === value;

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onValueChange(value)}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center">
        {checked && (
          <div className="h-2.5 w-2.5 fill-current text-current rounded-full bg-current" />
        )}
      </div>
    </button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
