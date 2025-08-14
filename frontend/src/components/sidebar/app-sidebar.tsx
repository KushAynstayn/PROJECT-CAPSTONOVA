"use client"

import Link from "next/link"
import { Package2 } from "lucide-react" 
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"

// --- DATA FOR ALL USER ROLES ---
// This object holds the unique sidebar data for each user role.
const sidebarData = {
  adviser: {
    user: { name: "ADVISER", email: "adviser@gmail.com" },
    navMain: [
      { href: "/adviser/dashboard", label: "Dashboard" },
      { href: "/adviser/advisees", label: "Advisee" },
      { href: "/adviser/projects", label: "Projects" },
      { href: "/adviser/suggest-ideas", label: "Suggest Capstone Ideas" },
      { href: "/adviser/analytics", label: "Data Analytics" },
      { href: "/adviser/notifications", label: "Notifications" },
      { href: "/adviser/settings", label: "Account Settings" },
    ],
  },
  admin: {
    user: { name: "ADMIN", email: "admin@gmail.com" },
    navMain: [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/upload-whitelist", label: "Upload Whitelist" },
        { href: "/admin/user-management", label: "User Management" },
        { href: "/admin/submissions", label: "Submissions" },
        { href: "/admin/suggestions", label: "Suggestions" },
        { href: "/admin/analytics", label: "Data Analytics" },
        { href: "/admin/reports", label: "Reports" },
        { href: "/admin/notifications", label: "Notifications" },
        { href: "/admin/settings", label: "Account Settings" },
    ],
  },
  "super-admin": {
    user: { name: "SUPER ADMIN", email: "superadmin@gmail.com" },
    navMain: [
        { href: "/super-admin/dashboard", label: "Dashboard" },
        { href: "/super-admin/upload-whitelist", label: "Upload Whitelist" },
        { href: "/super-admin/user-management", label: "User Management" },
        { href: "/super-admin/submissions", label: "Submissions" },
        { href: "/super-admin/analytics", label: "Data Analytics" },
        { href: "/super-admin/pending-access-requests", label: "Pending Access Requests" },
        { href: "/super-admin/reports", label: "Reports" },
        { href: "/super-admin/notifications", label: "Notifications" },
        { href: "/super-admin/system-configuration", label: "System Configuration" },
        { href: "/super-admin/settings", label: "Account Settings" },
    ],
  },
  proponent: {
    user: { name: "Proponent", email: "proponent@gmail.com" },
    navMain: [
        { href: "/proponent/manage-account", label: "Manage Personal Account" },
        { href: "/proponent/upload-project", label: "Upload Capstone Project" },
        { href: "/proponent/notifications", label: "Notifications" },
    ],
  },
};

// --- DYNAMIC SIDEBAR COMPONENT ---
export type UserRole = keyof typeof sidebarData;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  // --- FIX ---
  // The userRole prop is now optional. If it's not provided, it will default to 'adviser'.
  // This prevents the sidebar from disappearing.
  userRole?: UserRole;
}

export function AppSidebar({ userRole = 'adviser', ...props }: AppSidebarProps) {
  // We now default to the 'adviser' role if no role is specified.
  const data = sidebarData[userRole];
  
  // The 'href' for the main link is now dynamic.
  // For proponent, the first link is different, so we handle that case.
  const mainLinkHref = userRole === 'proponent' ? data.navMain[0].href : `/${userRole}/dashboard`;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Link href={mainLinkHref} className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <span className="text-base font-semibold">CAPSTONOVA</span>
          </Link>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* The NavMain component receives the specific menu items for the role. */}
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        {/* The user info is also dynamically set. */}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
