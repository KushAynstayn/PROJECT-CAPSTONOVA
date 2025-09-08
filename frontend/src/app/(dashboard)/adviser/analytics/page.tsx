"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";
import DataAnalyticsNavbar, {
  AnalyticsRole,
} from "@/components/ui/adviser-data-analytics-navbar";
import AdviserOverviewView from "../../../../components/adviser-data-analytics/view-advisers-overview";
import ProjectTypeView from "../../../../components/data-analytics/view-project-type";
import EnvironmentTrendView from "../../../../components/data-analytics/view-environment-trend";
import ProjectToolsView from "../../../../components/data-analytics/view-project-tools";

const AdviserAnalyticsPage = () => {
  const router = useRouter();
  const [currentRole, setCurrentRole] =
    useState<AnalyticsRole>("Adviser's Overview");

  useEffect(() => {
    const user = authStore.getUser();
    if (
      !authStore.isAuthenticated() ||
      user?.role.toLowerCase() !== "adviser"
    ) {
      router.push("/login");
    }
  }, [router]);

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

        <div className="mt-6 px-4 md:px-6">{componentMap[currentRole]}</div>
      </main>
    </>
  );
};

export default AdviserAnalyticsPage;
