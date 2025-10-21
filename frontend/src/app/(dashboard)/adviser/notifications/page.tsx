"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";
// 1. Import new component and utilities
import { NotificationItemWithModal } from "@/components/ui/notification-item-with-modal";
import { cn } from "@/lib/utils";
import { apiCall } from "@/lib/api"; // This import already exists

// 2. Define Notification interface
interface Notification {
  notification_id: number;
  title: string;
  message: string;
  notification_date: string;
  is_read: boolean;
}

// 3. Define Tab type
type Tab = "all" | "unread" | "read";

// --- Tab Button Component ---
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
      "py-3 px-5 font-semibold text-sm transition-colors duration-200",
      "border-b-4",
      isActive
        ? "border-[#660000] text-[#660000]"
        : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
    )}
  >
    {label}
    <span
      className={cn(
        "ml-2 py-0.5 px-2 rounded-full text-xs",
        isActive ? "bg-[#660000] text-white" : "bg-gray-200 text-gray-600"
      )}
    >
      {count}
    </span>
  </button>
);

const AdviserNotificationsPage = () => {
  const router = useRouter();

  // --- START: SYSTEM SETTING CHECK (UNCHANGED) ---
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean>(false);
  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);

  useEffect(() => {
    const settingName = "adviser_getNotifications";

    const checkSetting = async () => {
      setIsSettingLoading(true);
      try {
        const response = await apiCall(
          `/public/system-settings/check?setting_name=${settingName}`
        );
        setIsFeatureEnabled(response.is_enabled);
      } catch (error) {
        // Corrected: Added opening curly brace
        console.error(`Error checking system setting ${settingName}:`, error);
        setIsFeatureEnabled(false); // Default to disabled on error
      } finally {
        setIsSettingLoading(false);
      }
    };

    checkSetting();
  }, []);
  // --- END: SYSTEM SETTING CHECK (UNCHANGED) ---

  // --- 4. Add Notification State ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>("all");

  // --- START: AUTH CHECK (UNCHANGED) ---
  useEffect(() => {
    const user = authStore.getUser();
    if (
      !authStore.isAuthenticated() ||
      user?.role.toLowerCase() !== "adviser"
    ) {
      router.push("/login");
    }
  }, [router]);
  // --- END: AUTH CHECK (UNCHANGED) ---

  // --- 5. Add Notification Fetching Logic ---
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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
      setError(err.message || "Failed to fetch notifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 6. Tie fetching to the existing feature flag
  useEffect(() => {
    if (isFeatureEnabled) {
      fetchNotifications();
    }
  }, [fetchNotifications, isFeatureEnabled]);

  // --- 7. Add Callback and Memoized Lists ---
  const handleMarkedAsRead = (notificationId: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.notification_id === notificationId ? { ...n, is_read: true } : n
      )
    );
  };

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

  // --- 8. Add Notification Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-gray-500 pt-10">
          Loading notifications...
        </p>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 pt-10">{error}</p>;
    }
    if (filteredNotifications.length > 0) {
      return (
        <div className="mt-4">
          {filteredNotifications.map((notification) => (
            <NotificationItemWithModal
              key={notification.notification_id}
              notification={notification}
              onMarkedAsRead={handleMarkedAsRead}
            />
          ))}
        </div>
      );
    }
    let emptyMessage = "No notifications to display.";
    if (currentTab === "unread") {
      emptyMessage = "You have no unread notifications.";
    } else if (currentTab === "read") {
      emptyMessage = "You have no read notifications.";
    }
    return <p className="text-center text-gray-500 pt-10">{emptyMessage}</p>;
  };

  // --- START: RENDER BASED ON SETTING CHECK (UNCHANGED) ---
  if (isSettingLoading) {
    return <p>Loading page...</p>;
  }

  if (!isFeatureEnabled) {
    return (
      <div className="flex items-center justify-center h-full mt-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">
            Functionality Disabled
          </h2>
          <p className="text-gray-600">
            The administrator has disabled access to this feature.
          </p>
        </div>
      </div>
    );
  }
  // --- END: RENDER BASED ON SETTING CHECK (UNCHANGED) ---

  // --- 9. Replace Final Render ---
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>

      {/* --- Tab Navigation --- */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
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

      {/* --- Notification List --- */}
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
};

export default AdviserNotificationsPage;
