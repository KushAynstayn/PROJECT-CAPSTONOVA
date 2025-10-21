"use client";

import React, { useState } from "react";
import { apiCall } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

// 1. Define the type for a single notification object
interface Notification {
  notification_id: number; // <-- FIX: Changed from 'id' to 'notification_id'
  user_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

// 2. Define the props for this component
interface ViewerNotificationItemProps {
  notification: Notification;
  // This callback will now simply trigger a refresh in the parent
  onNotificationUpdated: () => void;
}

// --- Single Notification Item Component (with Modal) ---
export const ViewerNotificationItem: React.FC<ViewerNotificationItemProps> = ({
  notification,
  onNotificationUpdated,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Parse the message for display
  const status = "Request Granted";
  const project = notification.message
    .replace("Request for access to '", "")
    .replace("' has been granted.", "");

  const handleClick = async () => {
    setIsOpen(true); // Open modal immediately

    // If notification is already read, do nothing further
    if (notification.is_read) {
      return;
    }

    try {
      // 3. FIX: Use 'notification_id' to match the working API route
      await apiCall(
        `/user/notifications/${notification.notification_id}/read`,
        "PATCH"
      );

      // 4. Trigger the parent component to refetch the entire list
      onNotificationUpdated();
    } catch (apiError) {
      console.error("Failed to mark notification as read:", apiError);
    }
  };

  return (
    <>
      {/* Clickable Notification Card */}
      <button
        onClick={handleClick}
        className={`group flex w-full items-center gap-4 p-4 border rounded-md shadow-md mb-3 text-left transition-all duration-200 ${
          notification.is_read
            ? "bg-neutral-900 border-yellow-500/10 hover:bg-neutral-800/60" // Read state
            : "bg-neutral-950 border-yellow-500/50 hover:bg-neutral-900/80" // Unread state
        }`}
      >
        {/* Icon design */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
            notification.is_read ? "bg-neutral-700" : "bg-[#E0A800]"
          }`}
        >
          <Bell
            className={`w-5 h-5 transition-colors duration-200 ${
              notification.is_read ? "text-gray-400" : "text-black"
            }`}
          />
        </div>

        {/* Text Content */}
        <div className="flex-grow">
          <p
            className={`font-semibold transition-colors duration-200 ${
              notification.is_read
                ? "text-gray-400"
                : "text-gray-200 group-hover:text-white"
            }`}
          >
            {project}
          </p>
          <p
            className={`text-sm mt-1 transition-colors duration-200 ${
              notification.is_read
                ? "text-gray-500"
                : "text-gray-400 group-hover:text-gray-300"
            }`}
          >
            {new Date(notification.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </button>

      {/* Notification Details Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-neutral-900 border-yellow-500/50 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-[#E0A800]">{status}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {project}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-gray-300">
            <p className="text-sm text-gray-500 mb-2">Full Message:</p>
            {notification.message}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-yellow-600 hover:bg-yellow-700 text-black"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
