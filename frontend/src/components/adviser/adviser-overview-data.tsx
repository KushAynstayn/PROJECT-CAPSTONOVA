"use client";

import React, { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";
import Link from "next/link";

const AdviserOverviewData = () => {
  const [counts, setCounts] = useState({
    advisees: 0,
    suggestions: 0,
    projects: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data points concurrently
        const [adviseesData, suggestionsData, projectsData] = await Promise.all(
          [
            apiCall("/adviser/proponents"),
            apiCall("/adviser/suggestions"),
            apiCall("/adviser/assigned-projects"),
          ]
        );

        // Calculate counts
        const activeSuggestions = suggestionsData.filter(
          (s: { is_archived: boolean }) => !s.is_archived
        ).length;

        setCounts({
          advisees: adviseesData.length,
          suggestions: activeSuggestions,
          projects: projectsData.length,
        });
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
        // Keep counts at 0 if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCount = (count: number) => {
    if (isLoading) {
      return <div className="h-10 w-8 bg-gray-200 rounded animate-pulse" />;
    }
    return <h1 className="text-4xl font-semibold text-gray-800">{count}</h1>;
  };

  const statItems = [
    {
      icon: "/images/advisees.png",
      label: "Advisees",
      count: counts.advisees,
    },
    {
      icon: "/images/suggestion-log.png",
      label: "Suggestion Log",
      count: counts.suggestions,
    },
    {
      icon: "/images/project-advisory.png",
      label: "Project Advisory",
      count: counts.projects,
    },
  ];

  return (
    <div className="flex-1 flex flex-col rounded-lg bg-white shadow-md p-4 border border-gray-300 min-h-0">
      <div className="flex justify-between items-center w-full mb-2 p-4 flex-shrink-0">
        <h2 className="text-md font-bold text-gray-800">
          Your Overview
          <br />
          Data
        </h2>
        <Link
          href="/adviser/analytics"
          className="bg-[#660000] text-white text-sm font-semibold px-4 py-1 rounded-md shadow hover:scale-105 transition-transform duration-200 ease-in-out"
        >
          See More
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-2 p-4 bg-gray-50 rounded-md justify-center items-center"
          >
            <div className="flex flex-row items-center">
              <img src={item.icon} className="w-5 h-5" alt={item.label} />
              <h3 className="text-lg pl-3 font-semibold text-gray-700">
                {item.label}
              </h3>
            </div>
            <div className="justify-center">{renderCount(item.count)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdviserOverviewData;
