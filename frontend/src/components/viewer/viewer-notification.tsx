"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { apiCall } from "@/lib/api";
import { authStore } from "@/lib/auth";
import { ViewerNotificationItem } from "./viewer-notification-item";
import { cn } from "@/lib/utils";

// --- 1. Define types ---
interface Notification {
  notification_id: number; // <-- FIX: Changed from 'id' to 'notification_id'
  user_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

type Tab = "all" | "unread" | "read";

// --- 2. TabButton component ---
interface TabButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  count,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "py-3 px-4 font-semibold text-sm transition-colors duration-200 border-b-2",
      isActive
        ? "border-[#E0A800] text-[#E0A800]"
        : "border-transparent text-gray-500 hover:text-gray-300"
    )}
  >
    {label}
    <span
      className={cn(
        "ml-2 py-0.5 px-2 rounded-full text-xs font-mono",
        isActive ? "bg-[#E0A800] text-black" : "bg-neutral-800 text-gray-400"
      )}
    >
      {count}
    </span>
  </button>
);

// --- Main List Component ---
export const ViewerNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>("all");

  // 3. Encapsulate the fetching logic
  const fetchNotifications = useCallback(async () => {
    // Set loading state for refetches
    setIsLoading(true);
    try {
      const response = await apiCall("/user/notifications");
      if (response.success) {
        const sortedData = (response.data || []).sort(
          (a: Notification, b: Notification) =>
            Number(a.is_read) - Number(b.is_read) ||
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setNotifications(sortedData);
      } else {
        setError(response.message || "Failed to fetch notifications.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 4. Initial fetch on component mount
  // --- SYNTAX ERROR FIX: Corrected arrow function syntax ---
  useEffect(() => {
    const user = authStore.getUser();
    if (!user) {
      setError("You must be logged in to view notifications.");
      setIsLoading(false);
      return;
    }
    fetchNotifications();
  }, [fetchNotifications]);

  // 5. This function now simply calls the fetch function to get fresh data
  const handleNotificationUpdated = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // --- 6. Memoized counts and filtering logic (no changes here) ---
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
      case "all":
      default:
        return notifications;
    }
  }, [notifications, currentTab]);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <>
      <div className="border-b border-yellow-500/20 mb-6">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <TabButton
            label="All"
            count={notifications.length}
            isActive={currentTab === "all"}
            onClick={() => setCurrentTab("all")}
          />
          <TabButton
            label="Unread"
            count={unreadCount}
            isActive={currentTab === "unread"}
            onClick={() => setCurrentTab("unread")}
          />
          <TabButton
            label="Read"
            count={readCount}
            isActive={currentTab === "read"}
            onClick={() => setCurrentTab("read")}
          />
        </nav>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 mt-10">
          Loading notifications...
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <ViewerNotificationItem
                // 7. KEY PROP FIX: Use the 'notification_id' which is now correct
                key={notification.notification_id || `item-${index}`}
                notification={notification}
                onNotificationUpdated={handleNotificationUpdated}
              />
            ))
          ) : (
            <div className="text-center bg-neutral-950 border-yellow-500/20 p-10 rounded-lg">
              <p className="text-gray-400">
                {currentTab === "unread"
                  ? "You have no unread notifications."
                  : "No notifications in this category."}
                {/* --- SYNTAX ERROR FIX: Correctly closed the <p> tag --- */}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
