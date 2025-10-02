import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define input styles with cva
const inputVariants = cva(
  [
     // Placeholder + selection color
    "file:text-muted-foreground placeholder:text-gray-400 placeholder:font-normal selection:bg-gray-500 selection:text-white",

    // Default border + background
    "flex w-full min-w-0 rounded-md border border-gray-300 bg-white shadow-sm",

    // Transition + disabled states
    "transition-[color,box-shadow,border] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-normal",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

    // Hover state
    "hover:border-gray-400",

    // Focus state (changed from blue → gray)
    "focus-visible:border-gray-500 focus-visible:ring-2 focus-visible:ring-gray-300",

    // Error state
    "aria-invalid:border-red-500 aria-invalid:ring-red-500/30",
  ],
  {
    variants: {
      size: {
        default:
          "h-10 px-3 py-2 text-base font-normal md:text-sm file:h-7 file:text-sm",
        sm: "h-8 px-2 text-sm file:h-6 file:text-xs",
        lg: "h-12 px-4 py-3 text-lg file:h-9 file:text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// Props
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

// Component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
