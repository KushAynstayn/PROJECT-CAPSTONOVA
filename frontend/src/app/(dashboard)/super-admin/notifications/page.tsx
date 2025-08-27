"use client";

import React, { useState } from 'react';

// Define the type for a single notification object
interface Notification {
  title: string;
  date: string;
  status: string;
}

const SuperAdminNotificationsPage = () => {
  const allNotifications: Notification[] = [
    { title: "Request full document access by guest John Arado", date: "August 23, 2025", status: "New" },
    { title: "New Whitelist Uploaded by Admin 1", date: "August 22, 2025", status: "Viewed" },
    { title: "Admin 2 Archived Projects", date: "August 22, 2025", status: "Viewed" },
    { title: "Admin 2 Returned Projects", date: "August 21, 2025", status: "Viewed" },
    { title: "Adviser 1 Update his Account Information", date: "August 20, 2025", status: "Viewed" },
  ];

  const unreadNotifications: Notification[] = [
    { title: "Request full document access by guest John Arado", date: "August 23, 2025", status: "New" },
  ];

  const [displayContent, setDisplayContent] = useState<Notification[]>(allNotifications);
  
  // 1. State to track the active button ('all' or 'unread')
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const handleAllClick = () => {
    setDisplayContent(allNotifications);
    // 2. Update the active button state on click
    setActiveFilter('all');
  };

  const handleUnreadClick = () => {
    setDisplayContent(unreadNotifications);
    // 2. Update the active button state on click
    setActiveFilter('unread');
  };

  return (
    <div>
      <div className="flex justify-end space-x-2">
        <button
          // 3. Apply styles conditionally based on the active button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-[#511b10] text-white'
              // Inactive styles:
              : 'bg-gray-200 text-[#511b10] hover:bg-gray-300'
          }`}
          onClick={handleAllClick}
        >
          All
        </button>
        <button
          // 3. Apply styles conditionally based on the active button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'unread'
              ? 'bg-[#511b10] text-white'
              // Inactive styles:
              : 'bg-gray-200 text-[#511b10] hover:bg-gray-300'
          }`}
          onClick={handleUnreadClick}
        >
          Unread
        </button>
      </div>

      <div className="mt-8">
        {displayContent && displayContent.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {displayContent === allNotifications ? 'All Notifications' : 'New'}
            </h2>
            {displayContent.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-2 shadow-sm">
                <p className="font-medium text-gray-800">{item.title}</p>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{item.date} 
                        <span className={`ml-2 font-bold ${item.status === 'New' ? 'text-red-600' : 'text-gray-400'}`}>
                            {item.status}
                        </span>
                    </p>
                    {item.status === 'New' && <span className="w-3 h-3 bg-red-600 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No notifications to display.</p>
        )}
      </div>
    </div>
  );
};

export default SuperAdminNotificationsPage;