"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { apiCall } from "@/lib/api"; // Corrected: Import apiCall function

// Data structure for keyword usage
interface KeywordData {
  keyword_name: string;
  project_count: number;
}

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

export const EnvironmentStudyChart = ({ year }: { year: number }) => {
  const [data, setData] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!year) return;
      try {
        setLoading(true);
        // Corrected: Use apiCall with the correct path and method
        const response = await apiCall(`/util/keyword-usage/${year}`, "GET");
        if (response && response.data) {
          setData(response.data);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        setError(`Failed to fetch keyword usage data for ${year}.`);
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
        Keyword Usage / Environment ({year})
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="project_count"
              nameKey="keyword_name"
              label={(entry) => entry.keyword_name}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 30, 30, 0.85)",
                borderColor: "#f5b301",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center p-10 text-gray-400">
          No keyword data available for {year}.
        </div>
      )}
    </div>
  );
};
