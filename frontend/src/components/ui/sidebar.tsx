"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- CORRECTED CONTEXT AND PROVIDER ---
// This section is the key fix. It adds 'isPinned' and 'setIsPinned'
// to the context, which resolves the TypeScript errors.
const SidebarContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPinned: boolean;
  setIsPinned: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
  isPinned: false,
  setIsPinned: () => {},
});

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// The provider is simplified to manage both states internally.
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPinned, setIsPinned] = React.useState(false);

  return (
    <SidebarContext.Provider
      value={{ isOpen, setIsOpen, isPinned, setIsPinned }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
// --- END OF FIX ---


const sidebarVariants = cva("transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "bg-[#660000] text-white",
    },
    isOpen: {
      true: "w-64",
      false: "w-16",
    },
  },
  defaultVariants: {
    variant: "default",
    isOpen: false,
  },
});

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, ...props }, ref) => {
    // This part is also updated to check both hover and pinned states.
    const { isOpen, isPinned } = useSidebar();
    const openState = isOpen || isPinned;

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-col",
          sidebarVariants({ variant, isOpen: openState, className })
        )}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

// --- The rest of your components can remain the same ---

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center px-6", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto border-t border-white/20 p-6", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 px-3 py-1 text-sm font-medium text-gray-200",
      className
    )}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isPinned, setIsPinned } = useSidebar();
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white",
        className
      )}
      onClick={() => setIsPinned(!isPinned)} // This button should control pinning
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";


// --- EXPORTS ---
export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};

