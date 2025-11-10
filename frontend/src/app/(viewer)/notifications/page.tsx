"use client";

import React, { useState, useEffect } from "react";
import { ViewerNotification } from "@/components/viewer/viewer-notification";
import { apiCall, ApiError } from "@/lib/api"; // --- ADDED ---
import { authStore } from "@/lib/auth"; // --- ADDED ---
import { AlertCircle, Loader2 } from "lucide-react"; // --- ADDED ---

const ViewNotificationsPage: React.FC = () => {
  // --- ADDED: State for permission checking ---
  const [permissionStatus, setPermissionStatus] = useState<
    "checking" | "allowed" | "denied"
  >("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- ADDED: useEffect to check permission on mount ---
  useEffect(() => {
    const checkPermission = async () => {
      // 1. Check if user is logged in
      const user = authStore.getUser();
      if (!user) {
        setPermissionStatus("denied");
        setErrorMessage("You must be logged in to view notifications.");
        return;
      }

      // 2. Dynamically create the setting name based on user's role
      const role = user.role.toLowerCase();
      // This will check for viewer_getNotifications, admin_getNotifications, etc.
      const settingName = `${role}_getNotifications`;

      // 3. Check the system setting
      try {
        setPermissionStatus("checking");
        const setting = await apiCall(
          `/public/system-settings/check?setting_name=${settingName}`,
          "GET"
        );

        if (setting && setting.is_enabled) {
          setPermissionStatus("allowed");
        } else {
          setPermissionStatus("denied");
          setErrorMessage(
            `Viewing notifications is currently disabled for the ${role} role.`
          );
        }
      } catch (err) {
        console.error("Failed to check permission:", err);
        setPermissionStatus("denied"); // Fail-safe
        if (err instanceof ApiError && err.status === 401) {
          setErrorMessage("You are not authorized to view this page.");
        } else {
          setErrorMessage("Could not verify permissions to view this page.");
        }
      }
    };

    checkPermission();
  }, []); // Runs once on component mount

  // --- ADDED: Conditional rendering for loading state ---
  if (permissionStatus === "checking") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          <span className="text-gray-400">Verifying permissions...</span>
        </div>
      </div>
    );
  }

  // --- ADDED: Conditional rendering for permission denied ---
  if (permissionStatus === "denied") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black text-white p-4">
        <div className="mt-10 flex flex-col items-center justify-center">
          <div className="rounded-md border border-yellow-700 bg-yellow-900/30 p-6 text-center shadow-lg">
            <div className="flex justify-center gap-2">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
              <h2 className="text-xl font-bold tracking-tight text-yellow-300">
                Access Denied
              </h2>
            </div>
            <p className="mt-3 text-sm text-yellow-500">
              {errorMessage || "You do not have permission to view this page."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- This is your original component, rendered only if allowed ---
  return (
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
