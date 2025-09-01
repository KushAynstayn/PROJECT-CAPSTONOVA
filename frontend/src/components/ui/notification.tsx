// components/ui/notification-list.tsx
import React from "react";

// Define the type for a single notification item
interface NotificationItemProps {
  message: string;
}

// Component for a single notification item
const NotificationItem: React.FC<NotificationItemProps> = ({ message }) => {
  return (
    <div className="flex items-left gap-3 p-4 bg-white border border-gray-800 rounded-lg shadow-lg mb-3">
      {/* Success Checkmark Icon */}
      <div className="flex-shrink-0">
        {/* You can replace this with an actual SVG icon or a custom component */}
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      {/* Notification Message */}
      <h1 className="text-gray-800 text-2xl font-semibold">{message}</h1>
    </div>
  );
};

// Component for the list of notifications
interface NotificationListProps {
  notifications: string[]; // Array of notification messages
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
      <div>
        {notifications.map((message, index) => (
          <NotificationItem key={index} message={message} />
        ))}
        {notifications.length === 0 && (
          <p className="text-gray-600 text-center">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
