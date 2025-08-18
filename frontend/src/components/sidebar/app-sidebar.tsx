"use client"

import { cn } from "@/lib/utils";
import Image from 'next/image';
import Link from "next/link";
// 1. Import the useSidebar hook
import { useSidebar } from "@/components/ui/sidebar"; 
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";

// --- DATA FOR ALL USER ROLES ---
const sidebarData = {
  adviser: {
    user: { name: "ADVISER", email: "adviser@gmail.com" },
    navMain: [
      { href: "/adviser/dashboard", label: "Dashboard", icon: "/images/dashboard_icon.png" },
      { href: "/adviser/advisees", label: "Advisee", icon: "/images/advisee_usermanagement_icon.png" },
      { href: "/adviser/projects", label: "Projects", icon: "/images/projects_icon.png" },
      { href: "/adviser/suggest-ideas", label: "Suggest Capstone Ideas", icon: "/images/suggest_icon.png" },
      { href: "/adviser/analytics", label: "Data Analytics", icon: "/images/data_analytics_icon.png" },
      { href: "/adviser/notifications", label: "Notifications", icon: "/images/notification_icon.png" },
      { href: "/adviser/settings", label: "Account Settings", icon: "/images/account_icon.png" },
    ],
  },
  admin: {
    user: { name: "ADMIN", email: "admin@gmail.com" },
    navMain: [
        { href: "/admin/dashboard", label: "Dashboard", icon: "/images/dashboard_icon.png" },
        { href: "/admin/upload-whitelist", label: "Upload Whitelist", icon: "/images/upload_icon.png" },
        { href: "/admin/user-management", label: "User Management", icon: "/images/advisee_usermanagement_icon.png" },
        { href: "/admin/submissions", label: "Submissions", icon: "/images/submission_icon.png" },
        { href: "/admin/suggestions", label: "Suggestions", icon: "/images/suggest_icon.png" },
        { href: "/admin/analytics", label: "Data Analytics", icon: "/images/data_analytics_icon.png" },
        { href: "/admin/reports", label: "Reports", icon: "/images/report_icon.png" },
        { href: "/admin/notifications", label: "Notifications", icon: "/images/notification_icon.png" },
        { href: "/admin/settings", label: "Account Settings", icon: "/images/account_icon.png" },
    ],
  },
  "super-admin": {
    user: { name: "SUPER ADMIN", email: "superadmin@gmail.com" },
    navMain: [
        { href: "/super-admin/dashboard", label: "Dashboard", icon: "/images/dashboard_icon.png" },
        { href: "/super-admin/upload-whitelist", label: "Upload Whitelist", icon: "/images/upload_icon.png" },
        { href: "/super-admin/user-management", label: "User Management", icon: "/images/advisee_usermanagement_icon.png" },
        { href: "/super-admin/submissions", label: "Submissions", icon: "/images/submission_icon.png" },
        { href: "/super-admin/analytics", label: "Data Analytics", icon: "/images/data_analytics_icon.png" },
        { href: "/super-admin/pending-access-requests", label: "Pending Access Requests", icon: "/images/request_access_icon.png" },
        { href: "/super-admin/reports", label: "Reports", icon: "/images/report_icon.png" },
        { href: "/super-admin/notifications", label: "Notifications", icon: "/images/notification_icon.png" },
        { href: "/super-admin/system-configuration", label: "System Configuration",  icon: "/images/configuration_icon.png"  },
        { href: "/super-admin/settings", label: "Account Settings", icon: "/images/account_icon.png" },
    ],
  },
  proponent: {
    user: { name: "Proponent", email: "proponent@gmail.com" },
    navMain: [
        { href: "/proponent/manage-account", label: "Manage Personal Account", icon: "/images/account_icon.png" },
        { href: "/proponent/upload-project", label: "Upload Capstone Project", icon: "/images/upload_icon.png" },
        { href: "/proponent/notifications", label: "Notifications", icon: "/images/notification_icon.png" },
    ],
  },
};

// --- DYNAMIC SIDEBAR COMPONENT ---
export type UserRole = keyof typeof sidebarData;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: UserRole;
}

export function AppSidebar({ userRole = 'adviser', ...props }: AppSidebarProps) {
  const { isOpen, setIsOpen } = useSidebar();
  const data = sidebarData[userRole];
  const mainLinkHref = userRole === 'proponent' ? data.navMain[0].href : `/${userRole}/dashboard`;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-auto p-4">
        <div className="flex w-full items-center justify-between">
          {/* This Link container will now shrink and fade */}
          <Link 
            href={mainLinkHref} 
            className={cn(
              "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
              isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            <Image
              src="/images/capstonova_logo.png"
              alt="Capstonova Logo"
              width={32}
              height={40} 
            />
            <span className="whitespace-nowrap bg-gradient-to-b from-red-500 to-yellow-200 bg-clip-text text-lg text-transparent ml-5 font-semibold">
              CAPSTONOVA
            </span>
          </Link>
          
          {/* Collapse/Expand Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="p-1.5">
            <Image
              src="/images/collapse_sidebar.png"
              alt="Toggle sidebar"
              width={20}
              height={20}
              className="opacity-75 transition-opacity hover:opacity-100"
            />
          </button>
        </div>
      </SidebarHeader>

      <div className="my-2 h-px w-full bg-white/20" /> 

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      
      <SidebarFooter className="p-2">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}