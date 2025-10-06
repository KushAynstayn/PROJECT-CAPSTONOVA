"use client";

import React, { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";
import { authStore } from "@/lib/auth";

const withPermissionCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  settingName: string
): React.FC<P> => {
  const WithPermissionCheck: React.FC<P> = (props) => {
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const user = authStore.getUser();

    useEffect(() => {
      const checkPermission = async () => {
        if (!user || !user.role) {
          setIsLoading(false);
          return;
        }

        try {
          // Normalize role to lowercase to match backend prefix
          const role = user.role.toLowerCase().replace(/\s+/g, "");
          const fullSettingName = `${role}_${settingName}`;
          const response = await apiCall(
            `/public/system-settings/check?setting_name=${fullSettingName}`
          );
          setIsAllowed(response?.is_enabled ?? false);
        } catch (error) {
          console.error(`Error checking permission for ${settingName}:`, error);
          setIsAllowed(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkPermission();
    }, [user]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      );
    }

    if (!isAllowed) {
      return (
        <div className="flex flex-col justify-center items-center h-screen text-center p-4">
          <h1 className="text-3xl font-bold mb-4">Feature Disabled</h1>
          <p className="text-lg text-gray-600">
            The administrator has currently disabled this feature. Please
            contact support if you believe this is an error.
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithPermissionCheck.displayName = `WithPermissionCheck(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithPermissionCheck;
};

export default withPermissionCheck;
