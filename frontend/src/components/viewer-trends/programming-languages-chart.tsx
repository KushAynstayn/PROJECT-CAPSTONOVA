"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { apiCall } from "@/lib/api"; // Corrected: Import apiCall function

// Data structure for language usage
interface LanguageUsageData {
  language_name: string;
  project_count: number;
}

export const ProgrammingLanguagesChart = ({ year }: { year: number }) => {
  const [data, setData] = useState<LanguageUsageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!year) return;
      try {
        setLoading(true);
        // Corrected: Use apiCall with the correct path and method
        const response = await apiCall(`/util/language-usage/${year}`, "GET");
        if (response && response.data) {
          setData(response.data);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        setError(`Failed to fetch language usage data for ${year}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]); // Re-run effect when year changes

  if (loading) {
    return <div className="text-center p-4">Loading Chart...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">
        Most Used Programming Languages ({year})
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis type="number" stroke="#888888" />
            <YAxis
              type="category"
              dataKey="language_name"
              stroke="#888888"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 30, 30, 0.85)",
                borderColor: "#f5b301",
              }}
            />
            <Legend />
            <Bar dataKey="project_count" name="Projects" fill="#E0A800" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center p-10 text-gray-400">
          No language usage data available for {year}.
        </div>
      )}
    </div>
  );
};
