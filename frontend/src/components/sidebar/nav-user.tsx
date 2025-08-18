"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
// 1. Import the useSidebar hook
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Define the type for the user object
interface User {
  name: string
  email: string
  avatar?: string
}

// Tell the component to expect a "user" prop of that type
export function NavUser({ user }: { user: User }) {
  // 2. Get the sidebar's state using the hook
  const { isOpen } = useSidebar();

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          
          {/* 3. Conditionally render the name and email */}
          {isOpen && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}