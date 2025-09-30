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
} from "recharts";
import { apiCall } from "@/lib/api"; // Corrected: Import apiCall function

// Data structure for top advisers
interface AdviserData {
  adviser_name: string;
  project_count: number;
}

export const TopAdvisersChart = () => {
  const [data, setData] = useState<AdviserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Corrected: Use apiCall with the correct path and method
        const response = await apiCall("/util/top-advisers", "GET");
        if (response && response.data) {
          setData(response.data);
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch top advisers data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Runs once on component mount

  if (loading) {
    return <div className="text-center p-4">Loading Chart...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">
        Top 5 Advisers (All Time)
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis dataKey="adviser_name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 30, 30, 0.85)",
                borderColor: "#f5b301",
              }}
            />
            <Bar
              dataKey="project_count"
              name="Projects Advised"
              fill="#d88848"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center p-10 text-gray-400">
          No adviser data available.
        </div>
      )}
    </div>
  );
};
