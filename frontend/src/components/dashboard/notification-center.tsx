"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import { NotificationItemWithModal } from "@/components/ui/notification-item-with-modal";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react"; // Fallback icon

// --- Types ---
interface Notification {
  notification_id: number;
  title: string;
  message: string;
  notification_date: string;
  is_read: boolean;
}

type Tab = "all" | "unread" | "read";
type UserRole = "admin" | "super-admin" | "proponent" | "adviser";

// --- Components ---

const PopoverTabButton = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 py-2 text-xs font-semibold transition-colors duration-200 border-b-2",
      isActive
        ? "border-[#660000] text-[#660000]"
        : "border-transparent text-gray-500 hover:text-gray-800"
    )}
  >
    {label} ({count})
  </button>
);

// --- Main Component ---

export function NotificationCenter({ userRole }: { userRole: UserRole }) {
  const [open, setOpen] = useState(false);

  // --- Data State ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>("all");

  // --- Feature Flag State ---
  // Default to TRUE so it works by default unless explicitly disabled by the API
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean>(true);

  // 1. Check System Setting dynamically based on role
  useEffect(() => {
    // MODIFICATION: Super Admin bypasses this check completely
    if (userRole === "super-admin") {
      setIsFeatureEnabled(true);
      return;
    }

    const checkSetting = async () => {
      const settingPrefix = userRole ? userRole.replace(/-/g, "_") : "adviser";
      const settingName = `${settingPrefix}_getNotifications`;

      try {
        const response = await apiCall(
          `/public/system-settings/check?setting_name=${settingName}`
        );
        // We only update if the response explicitly tells us the status.
        if (response && typeof response.is_enabled !== "undefined") {
          setIsFeatureEnabled(response.is_enabled);
        }
      } catch (error) {
        console.error(`Error checking system setting ${settingName}`, error);
        // On error, we generally keep the default (true) to avoid blocking the user
        // unless you prefer to fail safe (false). Keeping true for now based on "reverse it" feedback.
        setIsFeatureEnabled(true);
      }
    };

    if (userRole) {
      checkSetting();
    }
  }, [userRole]);

  // 2. Fetch Notifications (Generic)
  const fetchNotifications = useCallback(async () => {
    if (!isFeatureEnabled) return;

    setIsLoading(true);
    try {
      const response = await apiCall(`/user/notifications`);
      const sortedData = (response.data || []).sort(
        (a: Notification, b: Notification) =>
          Number(a.is_read) - Number(b.is_read) ||
          new Date(b.notification_date).getTime() -
            new Date(a.notification_date).getTime()
      );
      setNotifications(sortedData);
    } catch (err: any) {
      setError("Failed to load");
    } finally {
      setIsLoading(false);
    }
  }, [isFeatureEnabled]);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 3. Mark as Read Callback
  const handleMarkedAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === notificationId ? { ...n, is_read: true } : n
      )
    );
  };

  // 4. Derived State
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const readCount = useMemo(
    () => notifications.filter((n) => n.is_read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    switch (currentTab) {
      case "unread":
        return notifications.filter((n) => !n.is_read);
      case "read":
        return notifications.filter((n) => n.is_read);
      default:
        return notifications;
    }
  }, [notifications, currentTab]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <Image
            src="/images/notification-bell-2.png"
            alt="Notifications"
            width={24}
            height={24}
            className="opacity-75 transition-opacity hover:opacity-100 object-contain"
          />

          {/* Badge shows if enabled AND unread > 0 */}
          {isFeatureEnabled && unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#660000] border-2 border-white"></span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[400px] p-0 overflow-hidden shadow-xl border-none z-50"
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b flex justify-between items-center">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#660000]" /> Notifications
          </h4>
          {isLoading && (
            <span className="text-xs text-gray-400 animate-pulse">
              Syncing...
            </span>
          )}
        </div>

        {!isFeatureEnabled ? (
          <div className="h-[150px] flex flex-col items-center justify-center text-gray-500 space-y-2 p-4 text-center">
            <Bell className="h-8 w-8 opacity-20" />
            <p className="text-sm font-medium">
              Notifications are currently disabled.
            </p>
          </div>
        ) : (
          <>
            <div className="flex border-b px-2 bg-white">
              <PopoverTabButton
                label="All"
                count={notifications.length}
                isActive={currentTab === "all"}
                onClick={() => setCurrentTab("all")}
              />
              <PopoverTabButton
                label="Unread"
                count={unreadCount}
                isActive={currentTab === "unread"}
                onClick={() => setCurrentTab("unread")}
              />
              <PopoverTabButton
                label="Read"
                count={readCount}
                isActive={currentTab === "read"}
                onClick={() => setCurrentTab("read")}
              />
            </div>

            <div className="h-[400px] overflow-y-auto bg-gray-50/30 p-2">
              {error ? (
                <div className="h-full flex items-center justify-center text-red-500 text-sm">
                  {error}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                  <Image
                    src="/images/notification-bell-2.png"
                    width={40}
                    height={40}
                    alt="No notifications"
                    className="opacity-20 grayscale"
                  />
                  <p className="text-sm">No notifications found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <NotificationItemWithModal
                      key={notification.notification_id}
                      notification={notification}
                      onMarkedAsRead={handleMarkedAsRead}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
