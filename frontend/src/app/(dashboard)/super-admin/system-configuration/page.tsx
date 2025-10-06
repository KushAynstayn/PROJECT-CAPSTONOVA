"use client";

import React, { useState, useEffect } from "react";
import AdminPanel from "../../../../components/sysconfig-panels/AdminPanel";
import AdviserPanel from "../../../../components/sysconfig-panels/AdviserPanel";
import ProponentPanel from "../../../../components/sysconfig-panels/ProponentPanel";
import ViewerPanel from "../../../../components/sysconfig-panels/ViewerPanel";
import { apiCall } from "@/lib/api";
import { AllSettings } from "@/types/system-settings";

const SystemConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState("Admin");
  const [settings, setSettings] = useState<AllSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const settingKeys: { [key: string]: string[] } = {
    admin: [
      "updateProfile",
      "changePassword",
      "createAdviserAccount",
      "uploadWhitelist",
      "viewWhitelist",
      "viewSubmissions",
      "searchProjects",
      "archiveProjects",
      "restoreProjects",
      "viewSuggestions",
      "viewArchived",
      "dataAnalyticsView",
      "reportsView",
      "getNotifications",
    ],
    adviser: [
      "updateProfile",
      "changePassword",
      "viewAdvisee",
      "viewProjects",
      "searchProjects",
      "createSuggestion",
      "viewOwnSuggestion",
      "viewOthersSuggestion",
      "viewArchivedSuggestions",
      "archiveOwnSuggestion",
      "returnArchivedSuggestion",
      "dataAnalyticsView",
      "getNotifications",
    ],
    proponent: [
      "updateProfile",
      "changePassword",
      "uploadProjects",
      "getNotifications",
    ],
    viewer: [
      "updateProfile",
      "changePassword",
      "registerAccount",
      "viewAbstract",
      "requestFullAccess",
      "viewSuggestions",
      "dataAnalyticsView",
      "getNotifications",
    ],
  };

  useEffect(() => {
    const fetchAllSettings = async () => {
      setIsLoading(true);
      try {
        const allSettingsData: any = {
          admin: {},
          adviser: {},
          proponent: {},
          viewer: {},
        };
        for (const role in settingKeys) {
          for (const key of settingKeys[role]) {
            const settingName = `${role}_${key}`;
            const response = await apiCall(
              `/public/system-settings/check?setting_name=${settingName}`
            );
            allSettingsData[role][key] = response?.is_enabled ?? false;
          }
        }
        setSettings(allSettingsData as AllSettings);
      } catch (error) {
        console.error("Failed to fetch system settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = async <R extends keyof AllSettings>(
    role: R,
    key: keyof AllSettings[R]
  ) => {
    if (!settings) return;

    const originalSettings = { ...settings };
    const originalState = settings[role][key];

    const newSettings = JSON.parse(JSON.stringify(settings));
    newSettings[role][key] = !originalState;
    setSettings(newSettings);

    try {
      await apiCall("/super-admin/system-settings/toggle", "POST", {
        setting_name: `${role}_${String(key)}`,
        is_enabled: !originalState,
      });
    } catch (error) {
      console.error(`Failed to toggle ${String(key)} for ${role}:`, error);
      setSettings(originalSettings);
    }
  };

  const renderContent = () => {
    if (isLoading || !settings) {
      return <div className="text-center p-10">Loading system settings...</div>;
    }

    switch (activeTab) {
      case "Admin":
        return (
          <AdminPanel
            settings={settings.admin}
            onToggle={(key) => handleToggle("admin", key)}
          />
        );
      case "Adviser":
        return (
          <AdviserPanel
            settings={settings.adviser}
            onToggle={(key) => handleToggle("adviser", key)}
          />
        );
      case "Proponent":
        return (
          <ProponentPanel
            settings={settings.proponent}
            onToggle={(key) => handleToggle("proponent", key)}
          />
        );
      case "Viewer":
        return (
          <ViewerPanel
            settings={settings.viewer}
            onToggle={(key) => handleToggle("viewer", key)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-start space-x-8">
        {["Admin", "Adviser", "Proponent", "Viewer"].map((tab) => (
          <button
            key={tab} // FIX: Added the unique key prop here
            className={`
              text-xl font-semibold pb-2 
              ${
                activeTab === tab
                  ? "text-blue border-b-2 border-blue"
                  : "text-gray-400"
              }
              transition-colors duration-200
            `}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default SystemConfigurationPage;
