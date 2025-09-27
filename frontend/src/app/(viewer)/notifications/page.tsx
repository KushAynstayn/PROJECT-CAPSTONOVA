"use client";

import React from "react";
import { useRouter } from "next/navigation";

// --- TypeScript Interface ---
interface Notification {
  id: number;
  status: string;
  project: string;
  date: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    status: "Request Granted",
    project:
      "PROJECT CAPSTONOVA: Enhancing Capstone Archiving and Optimizing Data Intelligence with Project CapstoNova",
    date: "May 14, 2025",
  },
  {
    id: 2,
    status: "Request Granted",
    project:
      "PROJECT CAPSTONOVA: Enhancing Capstone Archiving and Optimizing Data Intelligence with Project CapstoNova",
    date: "May 14, 2025",
  },
  // ... keep the rest
];

// --- SVG Icon ---
const CheckIcon: React.FC = () => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

type NotificationItemProps = Notification;

// --- Single Notification Item ---
const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  status,
  project,
  date,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/full-access/${id}`); // Navigate to dynamic page
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md hover:scale-102 transform transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
            <CheckIcon />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">{status}</p>
          <p className="text-base font-semibold text-gray-800 mt-1 truncate">
            {project}
          </p>
        </div>

        {/* Date */}
        <div className="flex-shrink-0 text-right">
          <p className="text-sm text-gray-500 whitespace-nowrap">{date}</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const ViewNotifications: React.FC = () => {
  return (
    <div className="p-4 px-8">
      <div className="mb-10 mt-32">
        <h1 className="mt-1 text-3xl text-[#E0A800]" style={{ fontFamily: "'Black Ops One', sans-serif" }}>Notifications</h1>
      </div>
      <div className="ml-20 mr-20 pl-2 sm:p-1 lg:p-2">
        <main>
          <div className="flex flex-col space-y-2">
            {mockNotifications.map((notif) => (
              <NotificationItem key={notif.id} {...notif} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewNotifications;
