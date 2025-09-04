"use client";

import React, { useState } from "react";
import DataAnalyticsNavbar, {
  AnalyticsRole,
} from "@/components/ui/adviser-data-analytics-navbar";
import AdviserOverviewView from "../../../../components/adviser-data-analytics/view-advisers-overview";
import ProjectTypeView from "../../../../components/adviser-data-analytics/view-project-type";
import EnvironmentTrendView from "../../../../components/adviser-data-analytics/view-environment-trend";
import ProjectToolsView from "../../../../components/adviser-data-analytics/view-project-tools";

const AdviserAnalyticsPage = () => {
  const [currentRole, setCurrentRole] =
    useState<AnalyticsRole>("Adviser's Overview");

  const componentMap = {
    "Adviser's Overview": <AdviserOverviewView />,
    "Project Type": <ProjectTypeView />,
    "Environment Trend": <EnvironmentTrendView />,
    "Project Tools Trend": <ProjectToolsView />,
  };

  return (
    <>
      <main className="mt-4">
        <DataAnalyticsNavbar
          activeRole={currentRole}
          onSelectRole={setCurrentRole}
        />

        <div className="mt-6 px-4 md:px-6">
          {componentMap[currentRole]}
        </div>
      </main>
    </>
  );
};

export default AdviserAnalyticsPage;