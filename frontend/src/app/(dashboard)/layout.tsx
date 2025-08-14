"use client" // <-- This is now a client component to access the URL path.

import { AppSidebar, UserRole } from "@/components/sidebar/app-sidebar";
import { usePathname } from 'next/navigation'; // <-- Import the hook to read the URL.

// This layout will wrap every page and dynamically change the sidebar.
export default function UserRoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname(); // Gets the current URL path (e.g., "/adviser/dashboard")

  // --- LOGIC TO DETERMINE ROLE FROM URL ---
  // This function checks the first part of the URL (like 'adviser' or 'admin')
  // and selects the correct sidebar menu.
  const getRoleFromPath = (): UserRole => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/super-admin')) return 'super-admin';
    if (pathname.startsWith('/proponent')) return 'proponent';
    // If it's none of the above, we default to 'adviser'.
    return 'adviser';
  };

  const currentRole = getRoleFromPath();

  return (
    // This main div creates the layout with the sidebar on the left.
    <div className="grid h-screen w-full grid-cols-[260px_1fr]">
      
      {/* --- DYNAMIC SIDEBAR --- */}
      {/* We now pass the 'currentRole' to the AppSidebar. */}
      {/* It will automatically show the correct menu based on the URL. */}
      <AppSidebar userRole={currentRole} />

      {/* This is the main content area for your pages. */}
      <div className="flex flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          {/* The content of your pages will appear here. */}
          {children}
        </main>
      </div>
    </div>
  )
}
