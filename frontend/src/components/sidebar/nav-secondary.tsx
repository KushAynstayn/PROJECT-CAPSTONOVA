"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// Define the type for a single navigation item
interface NavItem {
  href: string
  label: string
}

// Tell the component to expect an "items" prop which is an array of NavItems
export function NavSecondary({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link
            href={item.href}
            // This will apply a different style to the active link
            className={cn(
              "flex items-center gap-2",
              pathname === item.href && "bg-accent text-accent-foreground"
            )}
          >
            {/* You can add an icon here later */}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
