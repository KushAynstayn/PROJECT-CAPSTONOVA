"use client";

import React, { useState, useEffect } from "react";
import NotificationList from "@/components/ui/notification";
import { apiCall } from "@/lib/api";

const ProponentNotificationsPage = () => {
  // --- START: SYSTEM SETTING CHECK ---
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean>(false);
  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);

  useEffect(() => {
    const settingName = "proponent_getNotifications";

    const checkSetting = async () => {
      setIsSettingLoading(true);
      try {
        const response = await apiCall(
          `/public/system-settings/check?setting_name=${settingName}`
        );
        setIsFeatureEnabled(response.is_enabled);
      } catch (error) {
        console.error(`Error checking system setting ${settingName}:`, error);
        setIsFeatureEnabled(false); // Default to disabled on error
      } finally {
        setIsSettingLoading(false);
      }
    };

    checkSetting();
  }, []);
  // --- END: SYSTEM SETTING CHECK ---

  // --- START: RENDER BASED ON SETTING CHECK ---
  if (isSettingLoading) {
    return <p>Loading page...</p>;
  }

  if (!isFeatureEnabled) {
    return (
      <div className="flex items-center justify-center h-full mt-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">
            Functionality Disabled
          </h2>
          <p className="text-gray-600">
            The administrator has disabled access to this feature.
          </p>
        </div>
      </div>
    );
  }
  // --- END: RENDER BASED ON SETTING CHECK ---

  return (
    <>
      <div>
        <NotificationList />
      </div>
    </>
  );
};

export default ProponentNotificationsPage;
