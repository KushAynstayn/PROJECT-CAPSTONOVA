"use client";

import * as React from "react";
import { AppSidebar, UserRole } from "../../components/sidebar/app-sidebar";
import { SidebarProvider, useSidebar } from "../../components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "@/components/dashboard/notification-center";

// This inner component handles the layout logic
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOpen, isPinned } = useSidebar();
  const isSidebarOpen = isOpen || isPinned;

  const getRoleFromPath = (): UserRole => {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/super-admin")) return "super-admin";
    if (pathname.startsWith("/proponent")) return "proponent";
    return "adviser";
  };

  const currentRole = getRoleFromPath();

  return (
    <div
      className={cn(
        "grid h-screen w-full transition-all duration-300 ease-in-out",
        isSidebarOpen ? "grid-cols-[256px_1fr]" : "grid-cols-[64px_1fr]"
      )}
    >
      <AppSidebar userRole={currentRole} />

      <div className="flex flex-col overflow-hidden">
        {/* Header with Notification Center */}
        <header className="w-full px-6 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-left text-base font-semibold text-[#a7561f] opacity-50 md:text-lg">
              Enhancing Capstone Archiving and Optimizing Data Intelligence with
              Project CapstoNova
            </h1>

            {/* Notification Center Component */}
            <div className="flex-shrink-0 ml-4">
              <NotificationCenter userRole={currentRole} />
            </div>
          </div>
          <div className="h-[2px] w-full bg-gray-200 mt-3" />
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

// The main layout component that provides the context
// This EXPORT DEFAULT is critical for Next.js to work
export default function UserRoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
