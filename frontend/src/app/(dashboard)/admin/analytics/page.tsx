"use client";

import React, { useState } from "react";
import DataAnalyticsNavbar, {
  AnalyticsRole,
} from "@/components/ui/data-analytics-navbar";
import AdvisoryLoadView from "../../../../components/admin-data-analytics/view-adviser-projects"; // 1. Import the new view
import ProjectTypeView from "../../../../components/data-analytics/view-project-type";
import EnvironmentTrendView from "../../../../components/data-analytics/view-environment-trend";
import ProjectToolsView from "../../../../components/data-analytics/view-project-tools";

const AdminAnalyticsPage = () => {
  const [currentRole, setCurrentRole] =
    useState<AnalyticsRole>("Advisory Load");

  // 2. Create a map to hold your view components, just like in your other page
  const componentMap = {
    "Advisory Load": <AdvisoryLoadView />,
    "Project Type": <ProjectTypeView />, // Placeholder
    "Environment Trend": <EnvironmentTrendView />, // Placeholder
    "Project Tools Trend": <ProjectToolsView />, // Placeholder
  };

  return (
    <>
      <main className="mt-4">
        <DataAnalyticsNavbar
          activeRole={currentRole}
          onSelectRole={setCurrentRole}
        />

        <div className="mt-6 p-1">
          {/* 3. Render the component from the map based on the current role */}
          {componentMap[currentRole]}
        </div>
      </main>
    </>
  );
};

export default AdminAnalyticsPage;
