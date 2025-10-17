"use client";

import React from "react";
// import { useRouter } from "next/navigation"; // Removed router
import { apiCall } from "@/lib/api";
import { authStore } from "@/lib/auth";

// 1. Define the type for a single notification object
interface Notification {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

// --- SVG Icon (Bell Icon for better context) ---
const BellIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// --- Single Notification Item ---
const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  // const router = useRouter(); // Removed router

  /*
  const handleClick = () => {
    // router.push(`/full-access/${notification.id}`); // Removed navigation
    // The item is now clickable but does nothing
    console.log("Notification clicked:", notification.id);
  };
  */

  const status = "Request Granted";
  const project = notification.message
    .replace("Request for access to '", "")
    .replace("' has been granted.", "");

  return (
    // MODIFIED: Removed onClick handler and cursor-pointer class
    <div
      className={`bg-neutral-950 rounded-lg p-5 hover:bg-neutral-900/80 hover:shadow-lg transition-all duration-300 border ${
        notification.is_read ? "border-yellow-500/20" : "border-yellow-500/50"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {/* MODIFIED: Themed icon */}
          <div className="w-10 h-10 bg-neutral-900 text-[#E0A800] rounded-full flex items-center justify-center">
            <BellIcon />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {/* MODIFIED: Light text colors */}
          <p className="text-sm text-[#E0A800] truncate">{status}</p>
          <p className="text-base font-semibold text-gray-200 mt-1 truncate">
            {project}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {new Date(notification.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main List Component ---
export const ViewerNotification: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const user = authStore.getUser();

    if (!user) {
      setError("You must be logged in to view notifications.");
      setIsLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await apiCall("/user/notifications");
        if (response.success) {
          setNotifications(response.data);
        } else {
          setError(response.message || "Failed to fetch notifications.");
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
      <div className="text-center text-gray-400 mt-10">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))
      ) : (
        // MODIFIED: Themed empty state
        <div className="text-center bg-neutral-950 border border-yellow-500/20 p-10 rounded-lg">
          <p className="text-gray-400">You have no new notifications.</p>
        </div>
      )}
    </div>
  );
};
