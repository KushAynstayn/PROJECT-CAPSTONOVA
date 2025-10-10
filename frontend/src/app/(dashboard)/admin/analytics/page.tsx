"use client";

import React, { useState, useEffect } from "react";
import DataAnalyticsNavbar, {
  AnalyticsRole,
} from "@/components/ui/data-analytics-navbar";
import AdvisoryLoadView from "../../../../components/admin-data-analytics/view-adviser-projects";
import ProjectTypeView from "../../../../components/data-analytics/view-project-type";
import EnvironmentTrendView from "../../../../components/data-analytics/view-environment-trend";
import ProjectToolsView from "../../../../components/data-analytics/view-project-tools";
import ViewMlService from "../../../../components/data-analytics/view-ml-service";
import { apiCall } from "@/lib/api"; // Import the apiCall function

const AdminAnalyticsPage = () => {
  // --- START: SYSTEM SETTING CHECK ---
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean>(false);
  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);

  useEffect(() => {
    const settingName = "admin_dataAnalyticsView";

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

  const [currentRole, setCurrentRole] =
    useState<AnalyticsRole>("Advisory Load");

  const componentMap = {
    "Advisory Load": <AdvisoryLoadView />,
    "Project Type": <ProjectTypeView />,
    "Environment Trend": <EnvironmentTrendView />,
    "Project Tools Trend": <ProjectToolsView />,
    "ML Service" : <ViewMlService/>
  };

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
      <main className="mt-4">
        <DataAnalyticsNavbar
          activeRole={currentRole}
          onSelectRole={setCurrentRole}
        />

        <div className="mt-6 p-1">{componentMap[currentRole]}</div>
      </main>
    </>
  );
};

export default AdminAnalyticsPage;
