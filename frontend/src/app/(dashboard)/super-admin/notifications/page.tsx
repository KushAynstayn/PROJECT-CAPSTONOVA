"use client";

import React, { useState, useEffect } from "react";
import NotificationList from "@/components/ui/notification";

const SuperAdminNotificationsPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect will only run on the client side, after the initial render.
    setIsClient(true);
  }, []);

  return (
    <div>
      {/* By waiting for isClient to be true, we ensure NotificationList only renders in the browser, avoiding the hydration error. */}
      {isClient ? (
        <NotificationList />
      ) : (
        <div className="text-center text-gray-600">
          Loading notifications...
        </div>
      )}
    </div>
  );
};

export default SuperAdminNotificationsPage;
