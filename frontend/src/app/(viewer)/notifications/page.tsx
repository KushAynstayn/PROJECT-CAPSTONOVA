"use client";

import React from "react";
import { ViewerNotification } from "@/components/viewer/viewer-notification";

const ViewNotificationsPage: React.FC = () => {
  return (
    // MODIFIED: Changed background to black and adjusted padding
    <div className="flex-1 p-6 md:p-8 pt-8 space-y-8 bg-black text-gray-200 min-h-screen">
      <div className="mb-10 mt-24 md:mt-32">
        <h1
          className="mt-1 text-3xl text-center md:text-left text-[#E0A800]"
          style={{ fontFamily: "'Black Ops One', sans-serif" }}
        >
          Notifications
        </h1>
        <p className="text-gray-400 mt-2 text-center md:text-left">
          Stay updated with the latest alerts and updates on your project access
          requests.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <main>
          <ViewerNotification />
        </main>
      </div>
    </div>
  );
};

export default ViewNotificationsPage;
