"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiCall } from "@/lib/api";

// --- Reusable NotificationItem Component ---
interface Notification {
  notification_id: number;
  message: string;
  notification_date: string;
  is_read: boolean;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => (
  <div
    className={`group flex items-start gap-3 p-4 border border-gray-300 rounded-md shadow-md mb-3 hover:bg-[#660000] transition-colors duration-200 ${
      notification.is_read ? "bg-gray-100" : "bg-white"
    }`}
  >
    <div className="flex-shrink-0">
      <svg
        className={`w-6 h-6 group-hover:text-white ${
          notification.is_read ? "text-gray-400" : "text-blue-500"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </div>
    <div className="flex-grow">
      <p className="text-gray-800 font-medium group-hover:text-white">
        {notification.message}
      </p>
      <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-200">
        {new Date(notification.notification_date).toLocaleString()}
      </p>
    </div>
    {!notification.is_read && (
      <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
    )}
  </div>
);

// --- Main Page Component ---
const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Corrected API endpoint to /user/notifications
      const response = await apiCall(`/user/notifications`);
      setNotifications(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-gray-500">Loading notifications...</p>
      );
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    if (notifications.length > 0) {
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      return (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            All Notifications ({unreadCount} unread)
          </h2>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.notification_id}
              notification={notification}
            />
          ))}
        </div>
      );
    }
    return (
      <p className="text-center text-gray-500">No notifications to display.</p>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default AdminNotificationsPage;
