"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";
import NotificationList from "@/components/ui/notification";
import { apiCall } from "@/lib/api"; // Import the apiCall function

const AdviserNotificationsPage = () => {
  const router = useRouter();

  // --- START: SYSTEM SETTING CHECK ---
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean>(false);
  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);

  useEffect(() => {
    const settingName = "adviser_getNotifications";

    const checkSetting = async () => {
      setIsSettingLoading(true);
      try {
        const response = await apiCall(
          `/public/system-settings/check?setting_name=${settingName}`
        );
        setIsFeatureEnabled(response.is_enabled);
      } catch (error) {
        // Corrected: Added opening curly brace
        console.error(`Error checking system setting ${settingName}:`, error);
        setIsFeatureEnabled(false); // Default to disabled on error
      } finally {
        setIsSettingLoading(false);
      }
    };

    checkSetting();
  }, []);
  // --- END: SYSTEM SETTING CHECK ---

  useEffect(() => {
    const user = authStore.getUser();
    if (
      !authStore.isAuthenticated() ||
      user?.role.toLowerCase() !== "adviser"
    ) {
      router.push("/login");
    }
  }, [router]);

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
    <div>
      <NotificationList />
    </div>
  );
};

export default AdviserNotificationsPage;
