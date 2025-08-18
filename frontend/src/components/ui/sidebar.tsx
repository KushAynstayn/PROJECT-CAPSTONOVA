"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isOpen: true,
  setIsOpen: () => {},
})

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const SidebarProvider = ({
  children,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}: {
  children: React.ReactNode
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [internalIsOpen, internalSetIsOpen] = React.useState(true)

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen =
    externalSetIsOpen !== undefined ? externalSetIsOpen : internalSetIsOpen

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

// --- MODIFIED VARIANTS ---
// I've updated the background and text colors here.
const sidebarVariants = cva("transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "bg-[#660000] text-white", // Changed background to #660000 and text to white
    },
    isOpen: {
      true: "w-64",
      false: "w-16",
    },
  },
  defaultVariants: {
    variant: "default",
    isOpen: true,
  },
})

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, isOpen, ...props }, ref) => {
    const { isOpen: contextIsOpen } = useSidebar()
    const open = isOpen !== undefined ? isOpen : contextIsOpen
    return (
      <div
        ref={ref}
        className={cn("flex h-full flex-col", sidebarVariants({ variant, isOpen: open, className }))}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center px-6", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

// --- MODIFIED FOOTER ---
// I updated the border color to be semi-transparent white for a cleaner look.
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto border-t border-white/20 p-6", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

// --- MODIFIED MENU ITEM ---
// I updated the text and hover colors to look good on the new dark background.
const SidebarMenuItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "flex items-center gap-3 px-3 py-1 text-sm font-medium text-gray-200 transition-colors transition-transform duration-150 ease-in-out hover:bg-white/10 hover:text-white hover:scale-110",
      className
    )}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { setIsOpen, isOpen } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn("rounded-full", className)}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    />
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-300 ease-in-out", isOpen ? "pl-16" : "pl-4", className)}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
  SidebarInset,
}
