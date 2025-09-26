import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// All styles are defined here using cva
const inputVariants = cva(
  [
    "file:text-foreground placeholder:text-muted-foreground placeholder:font-normal selection:bg-primary selection:text-primary-foreground",
    // Added 'w-full' back to this line for flexible width control
    "dark:bg-input/50 border-gray-500 flex w-full min-w-0 rounded-md border bg-transparent shadow-xs",
    "transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ],
  {
    variants: {
      size: {
        default:
          "h-9 px-3 py-1 text-base font-semibold md:text-sm file:h-7 file:text-sm",
        sm: "h-8 px-2 text-sm file:h-6 file:text-xs",
        lg: "h-11 px-4 py-2 text-lg file:h-9 file:text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// The component props now include the size variants
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

// The component uses React.forwardRef to pass a ref to the input element
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
