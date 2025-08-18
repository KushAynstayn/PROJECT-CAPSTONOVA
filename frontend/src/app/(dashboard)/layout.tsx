"use client"

import * as React from "react"; // Import React for useState
import { AppSidebar, UserRole } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar"; // 1. Import SidebarProvider
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils"; // Import cn for conditional classes

export default function UserRoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  // 2. Add state to control the sidebar's open/closed status
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const getRoleFromPath = (): UserRole => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/super-admin')) return 'super-admin';
    if (pathname.startsWith('/proponent')) return 'proponent';
    return 'adviser';
  };

  const currentRole = getRoleFromPath();

  return (
    // 3. Wrap everything in SidebarProvider, passing the state to it
    <SidebarProvider isOpen={isSidebarOpen} setIsOpen={setSidebarOpen}>
      {/* 4. Make the grid layout dynamic based on the sidebar state */}
      <div className={cn(
        "grid h-screen w-full transition-all duration-300",
        isSidebarOpen ? "grid-cols-[260px_1fr]" : "grid-cols-[72px_1fr]"
      )}>
        
        {/* 5. Pass the isOpen prop to the AppSidebar */}
        <AppSidebar userRole={currentRole} isOpen={isSidebarOpen} />

        <div className="flex flex-col">
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}