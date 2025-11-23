"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useUser } from "../../hooks/user-user";

const sidebarData = {
  adviser: {
    navMain: [
      {
        href: "/adviser/dashboard",
        label: "Dashboard",
        icon: "/images/dashboard_icon.png",
      },
      {
        href: "/adviser/advisees",
        label: "Advisee",
        icon: "/images/advisee_usermanagement_icon.png",
      },
      {
        href: "/adviser/projects",
        label: "Projects",
        icon: "/images/projects_icon.png",
      },
      {
        href: "/adviser/suggest-ideas",
        label: "Suggest Capstone Ideas",
        icon: "/images/suggest_icon.png",
      },
      {
        href: "/adviser/analytics",
        label: "Data Analytics",
        icon: "/images/data_analytics_icon.png",
      },
      // REMOVED: Notifications (Now in Header)
      {
        href: "/adviser/settings",
        label: "Account Settings",
        icon: "/images/account_icon.png",
      },
    ],
  },
  admin: {
    navMain: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: "/images/dashboard_icon.png",
      },
      {
        href: "/admin/upload-whitelist",
        label: "Upload Whitelist",
        icon: "/images/upload_icon.png",
      },
      {
        href: "/admin/user-management",
        label: "User Management",
        icon: "/images/advisee_usermanagement_icon.png",
      },
      {
        href: "/admin/submissions",
        label: "Submissions",
        icon: "/images/submission_icon.png",
      },
      {
        href: "/admin/suggestions",
        label: "Suggestions",
        icon: "/images/suggest_icon.png",
      },
      {
        href: "/admin/analytics",
        label: "Data Analytics",
        icon: "/images/data_analytics_icon.png",
      },
      {
        href: "/admin/reports",
        label: "Reports",
        icon: "/images/report_icon.png",
      },
      // REMOVED: Notifications (Now in Header)
      {
        href: "/admin/settings",
        label: "Account Settings",
        icon: "/images/account_icon.png",
      },
    ],
  },
  "super-admin": {
    navMain: [
      {
        href: "/super-admin/dashboard",
        label: "Dashboard",
        icon: "/images/dashboard_icon.png",
      },
      {
        href: "/super-admin/upload-whitelist",
        label: "Upload Whitelist",
        icon: "/images/upload_icon.png",
      },
      {
        href: "/super-admin/user-management",
        label: "User Management",
        icon: "/images/advisee_usermanagement_icon.png",
      },
      {
        href: "/super-admin/submissions",
        label: "Submissions",
        icon: "/images/submission_icon.png",
      },
      {
        href: "/super-admin/analytics",
        label: "Data Analytics",
        icon: "/images/data_analytics_icon.png",
      },
      {
        href: "/super-admin/pending-access-requests",
        label: "Pending Access Requests",
        icon: "/images/request_access_icon.png",
      },
      {
        href: "/super-admin/reports",
        label: "Reports",
        icon: "/images/report_icon.png",
      },
      // REMOVED: Notifications (Now in Header)
      {
        href: "/super-admin/system-configuration",
        label: "System Configuration",
        icon: "/images/configuration_icon.png",
      },
      {
        href: "/super-admin/activity-logs",
        label: "Activity Logs",
        icon: "/images/activity_log.png",
      },
      {
        href: "/super-admin/settings",
        label: "Account Settings",
        icon: "/images/account_icon.png",
      },
    ],
  },
  proponent: {
    navMain: [
      {
        href: "/proponent/manage-account",
        label: "Manage Personal Account",
        icon: "/images/account_icon.png",
      },
      {
        href: "/proponent/upload-project",
        label: "Upload Capstone Project",
        icon: "/images/upload_icon.png",
      },
      // REMOVED: Notifications (Now in Header)
    ],
  },
};

export type UserRole = keyof typeof sidebarData;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: UserRole;
}

export function AppSidebar({
  userRole = "adviser",
  ...props
}: AppSidebarProps) {
  const { isOpen, setIsOpen, isPinned, setIsPinned } = useSidebar();
  const { user, isLoading } = useUser();

  const data = sidebarData[userRole as UserRole] || sidebarData.adviser;
  const mainLinkHref =
    userRole === "proponent"
      ? data.navMain[0]?.href || "/"
      : `/${userRole}/dashboard`;

  const handleMouseEnter = () => {
    if (!isPinned) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) setIsOpen(false);
  };

  const handlePinToggle = () => {
    if (isPinned) {
      setIsPinned(false);
      setIsOpen(false);
    } else {
      setIsPinned(true);
    }
  };

  const isSidebarOpen = isOpen || isPinned;

  return (
    <Sidebar
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader className="h-auto px-4 pt-3 pb-2">
        <div className="flex w-full items-center justify-between">
          <Link
            href={mainLinkHref}
            className={cn(
              "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
              isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            <Image
              src="/images/logo_capstonova1.png"
              alt="Project Capstonova Logo"
              width={30}
              height={10}
            />
            <span className="whitespace-nowrap font-cinzel bg-gradient-to-b from-amber-400 to-yellow-600 bg-clip-text text-[14px] text-transparent ml-2">
              PROJECT CAPSTONOVA
            </span>
          </Link>

          <button onClick={handlePinToggle} className="p-1.5">
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

      <SidebarContent className="flex-1 overflow-y-auto">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="p-2">
        <NavUser user={user} isLoading={isLoading} />
      </SidebarFooter>
    </Sidebar>
  );
}
