"use client";

import React from "react";
import { apiCall } from "@/lib/api";

// 1. Define the type for a single notification object based on the data dictionary
interface Notification {
  notification_id: number;
  user_id: number;
  message: string;
  notification_date: string;
  is_read: boolean;
}

// Component for a single notification item
const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-lg shadow-sm mb-3 ${
        notification.is_read ? "bg-gray-100" : "bg-white"
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <svg
          className={`w-6 h-6 ${
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
      {/* Notification Message and Date */}
      <div className="flex-grow">
        <p className="text-gray-800 font-medium">{notification.message}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(notification.notification_date).toLocaleString()}
        </p>
      </div>
      {/* Unread Indicator */}
      {!notification.is_read && (
        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
      )}
    </div>
  );
};

// Component for the list of notifications
const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiCall("/user/notifications");
        if (response.success) {
          setNotifications(response.data);
        } else {
          setError("Failed to fetch notifications.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center text-gray-600">Loading notifications...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
      <div>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.notification_id}
              notification={notification}
            />
          ))
        ) : (
          <p className="text-gray-600 text-center">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
