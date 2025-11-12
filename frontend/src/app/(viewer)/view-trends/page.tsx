"use client";

import React, { useState, useEffect } from "react"; // --- ADDED useEffect ---
import { ArchivedProjectsChart } from "@/components/viewer-trends/archived-projects-chart";
import { ProjectTypesChart } from "@/components/viewer-trends/project-types-chart";
import { ProgrammingLanguagesChart } from "@/components/viewer-trends/programming-languages-chart";
import { TechStackChart } from "@/components/viewer-trends/tech-stack-chart";
import { EnvironmentStudyChart } from "@/components/viewer-trends/environment-study-chart";
import { TopAdvisersChart } from "@/components/viewer-trends/top-advisers-chart";
import { apiCall, ApiError } from "@/lib/api"; // --- ADDED ---
import { authStore } from "@/lib/auth"; // --- ADDED ---
import { AlertCircle, Loader2 } from "lucide-react"; // --- ADDED ---

const AnalyticsDashboardPage = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

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
        setErrorMessage("You must be logged in to view data analytics.");
        return;
      }

      // 2. Dynamically create the setting name based on user's role
      const role = user.role.toLowerCase();
      const settingName = `${role}_dataAnalyticsView`; // e.g., "viewer_dataAnalyticsView"

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
            `Data analytics is currently disabled for the ${role} role.`
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

  // --- This is your original component, now only rendered if allowed ---
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      {/* Page Header */}
      <div className="mt-28 mb-18 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1
          className="text-3xl text-[#E0A800] mb-4 md:mb-0"
          style={{ fontFamily: "'Black Ops One', sans-serif" }}
        >
          Project Data Analytics
        </h1>

        {/* Year Picker */}
        <div className="flex items-center gap-2">
          <label htmlFor="year-picker" className="text-[#E0A800] font-medium">
            Select Year:
          </label>
          <div className="relative">
            <select
              id="year-picker"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-gray-800 text-white border border-yellow-500/50 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1 */}
        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          <ArchivedProjectsChart selectedYear={selectedYear} />
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          <ProjectTypesChart year={selectedYear} />
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-3 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          <ProgrammingLanguagesChart year={selectedYear} />
        </div>

        {/* Row 3 */}
        <div className="lg:col-span-1 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          <TopAdvisersChart />
        </div>
        <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          <EnvironmentStudyChart year={selectedYear} />
        </div>

        {/* Row 4 (Tech Stacks - MODIFIED) */}
        <div className="mb-30 lg:col-span-3 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
          {/* MODIFICATION: Removed the 'year' prop */}
          <TechStackChart />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
