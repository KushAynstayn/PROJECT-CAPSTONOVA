"use client"

import * as React from "react";
import { AppSidebar, UserRole } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function UserRoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const getRoleFromPath = (): UserRole => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/super-admin')) return 'super-admin';
    if (pathname.startsWith('/proponent')) return 'proponent';
    return 'adviser';
  };

  const currentRole = getRoleFromPath();

  return (
    <SidebarProvider isOpen={isSidebarOpen} setIsOpen={setSidebarOpen}>
      <div className={cn(
        "grid h-screen w-full",
        isSidebarOpen ? "grid-cols-[260px_1fr]" : "grid-cols-[72px_1fr]"
      )}>
        <AppSidebar userRole={currentRole} isOpen={isSidebarOpen} />
        
        {/* Main Content Area with Fixed Header */}
        <div className="flex flex-col overflow-hidden">
        
          {/* 1. Default Header (This part is fixed) */}
          <header className="w-full px-6 pt-6 pb-4 flex-shrink-0">
            <h1 className="text-left text-base font-semibold text-[#a7561f] opacity-50 md:text-lg">
              Enhancing Capstone Archiving and Optimizing Data Intelligence with
              Project CapstoNova
            </h1>
            <div className="h-[2px] w-full bg-gray-200 mt-5" />
          </header>

          {/* 2. Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
          
        </div>
      </div>
    </SidebarProvider>
  )
}