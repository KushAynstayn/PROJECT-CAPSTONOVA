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
import { Bell } from "lucide-react"; // 1. Import the Bell icon

// Define the shared Notification interface
interface Notification {
  notification_id: number;
  title: string;
  message: string;
  notification_date: string;
  is_read: boolean;
}

// Define the props for the new component
interface NotificationItemProps {
  notification: Notification;
  onMarkedAsRead: (notificationId: number) => void; // Callback to update parent list
}

export const NotificationItemWithModal: React.FC<NotificationItemProps> = ({
  notification,
  onMarkedAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle the click event (opens modal AND marks as read)
  const handleClick = async () => {
    setIsOpen(true);

    // If it's already read, don't make an API call
    if (notification.is_read) {
      return;
    }

    try {
      // Use the correct apiCall syntax
      await apiCall(
        `/user/notifications/${notification.notification_id}/read`,
        "PATCH"
      );

      // Notify the parent component to update its state
      onMarkedAsRead(notification.notification_id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <>
      {/* 2. The clickable notification item, redesigned to match the image */}
      <button
        onClick={handleClick}
        className={`group flex w-full items-center gap-4 p-4 border rounded-md shadow-md mb-3 text-left transition-all duration-200 ${
          notification.is_read
            ? "bg-gray-100 border-gray-200 hover:bg-gray-200" // Read state
            : "bg-white border-gray-300 hover:bg-[#660000]" // Unread state
        }`}
      >
        {/* 3. New Icon design based on image */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
            notification.is_read ? "bg-gray-400" : "bg-[#660000]"
          }`}
        >
          <Bell className="w-5 h-5 text-white" />
        </div>

        {/* 4. Text Content (styles updated for group-hover) */}
        <div className="flex-grow">
          <p
            className={`font-semibold transition-colors duration-200 ${
              notification.is_read
                ? "text-gray-600"
                : "text-gray-800 group-hover:text-white" // Title turns white on hover
            }`}
          >
            {notification.title}
          </p>
          <p
            className={`text-sm mt-1 transition-colors duration-200 ${
              notification.is_read
                ? "text-gray-500"
                : "text-gray-500 group-hover:text-gray-200" // Date text lightens on hover
            }`}
          >
            {new Date(notification.notification_date).toLocaleString()}
          </p>
        </div>

        {/* 5. Removed the blue dot indicator, as the new design makes it redundant */}
      </button>

      {/* 6. The modal dialog (no change here) */}
      <Dialog open={isOpen} onOpenChange={(openState) => setIsOpen(openState)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{notification.title}</DialogTitle>
            <DialogDescription>
              {new Date(notification.notification_date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {/* whitespace-pre-wrap preserves newlines in the message */}
          <div className="py-4 whitespace-pre-wrap">
            <p>{notification.message}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationItemWithModal;
