"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface NavUserProps {
  user: User | null;
  isLoading: boolean;
}

export function NavUser({ user, isLoading }: NavUserProps) {
  const { isOpen } = useSidebar();

  const getInitials = (name: string) => {
    if (!name) return "...";
    const names = name.split(" ").filter(Boolean);
    if (names.length === 0) return "...";
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  let displayName: string;
  let displayEmail: string;

  if (isLoading) {
    displayName = "Loading...";
    displayEmail = "Please wait";
  } else if (user) {
    displayName = user.name;
    displayEmail = user.email;
  } else {
    displayName = "Guest";
    displayEmail = "Not logged in";
  }

  return (
    // --- MODIFICATION: Removed the "justify-center" class ---
    <div className={cn("flex items-center gap-3 w-full")}>
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
      </Avatar>

      {isOpen && (
        <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
          <span className="truncate font-semibold">{displayName}</span>
          <span className="truncate text-xs text-muted-foreground">
            {displayEmail}
          </span>
        </div>
      )}
    </div>
  );
}
