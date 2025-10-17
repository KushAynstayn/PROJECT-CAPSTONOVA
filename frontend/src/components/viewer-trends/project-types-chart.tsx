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

// Define expected data structure
interface PlatformData {
  platform_type: string;
  count: number;
}

const COLORS = ["#FFD700", "#DAA520", "#B8860B", "#F0E68C", "#C5B358"];

export const ProjectTypesChart = ({ year }: { year: number }) => {
  const [data, setData] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!year) return;
      try {
        setLoading(true);
        // Corrected: Use apiCall with the correct path and method
        const response = await apiCall(
          `/util/project-type-distribution/${year}`,
          "GET"
        );
        if (response && response.data && response.data.platforms) {
          setData(response.data.platforms);
        } else {
          setData([]); // Clear data if none exists for the year
        }
        setError(null);
      } catch (err) {
        setError(`Failed to fetch project type data for ${year}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]); // Re-fetch when the year changes

  if (loading) {
    return <div className="text-center p-4">Loading Chart...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">
        Project Type Distribution ({year})
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="platform_type"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
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
          No project type data available for {year}.
        </div>
      )}
    </div>
  );
};
