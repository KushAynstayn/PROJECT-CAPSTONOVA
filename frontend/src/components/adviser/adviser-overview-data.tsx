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

  return (
    <div className="flex-1 flex flex-col rounded-lg bg-white shadow-md p-4 border border-gray-50 min-h-0 gap-4">
      <div className="flex justify-between items-center w-full mb-2 p-4">
        <h2 className="text-xl font-bold text-gray-800">Your Overview Data</h2>
        <Link
          href="/adviser/analytics"
          className="bg-red-900 text-white text-sm font-semibold px-4 py-1 rounded-md shadow hover:scale-115 transition-transform duration-200 ease-in-out"
        >
          See More
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-4 pl-10 bg-gray-100 rounded-md justify-center items-center">
        <div className="flex flex-row">
          <img src="/images/advisees.png" className="w-5 h-5" alt="Advisees" />
          <h3 className="text-1xl pl-5 font-semibold text-gray-800">
            Advisees
          </h3>
        </div>
        <div className="justify-center">{renderCount(counts.advisees)}</div>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-4 pl-10 bg-gray-100 rounded-md justify-center items-center">
        <div className="flex flex-row">
          <img
            src="/images/suggestion-log.png"
            className="w-5 h-5"
            alt="Suggestions"
          />
          <h3 className="text-1xl pl-5 font-semibold text-gray-800">
            Suggestion Log
          </h3>
        </div>
        <div className="justify-center">{renderCount(counts.suggestions)}</div>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-4 pl-10 bg-gray-100 rounded-md justify-center items-center">
        <div className="flex flex-row">
          <img
            src="/images/project-advisory.png"
            className="w-5 h-5"
            alt="Projects"
          />
          <h3 className="text-1xl pl-5 font-semibold text-gray-800">
            Project Advisory
          </h3>
        </div>
        <div className="justify-center">{renderCount(counts.projects)}</div>
      </div>
    </div>
  );
};

export default AdviserOverviewData;
