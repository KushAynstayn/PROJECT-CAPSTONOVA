"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiCall } from "@/lib/api"; // Corrected: Import apiCall function

// Define the expected data structure
interface ProjectTrendData {
  year: string;
  bsis: number;
  bsit: number;
  "bit-ct": number;
}

export const ArchivedProjectsChart = ({
  selectedYear,
}: {
  selectedYear: number;
}) => {
  const [data, setData] = useState<ProjectTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Corrected: Use apiCall with the correct path and method
        const response = await apiCall(
          "/util/projects-per-year-department",
          "GET"
        );
        if (response && response.data) {
          setData(response.data);
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch project trend data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="text-center p-4">Loading Chart...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">
        Archived Projects by Department
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis dataKey="year" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 30, 30, 0.85)",
              borderColor: "#f5b301",
              color: "#ffffff",
            }}
          />
          <Legend wrapperStyle={{ color: "#ffffff" }} />
          <Bar dataKey="bsis" name="BSIS" fill="#3b82f6" />
          <Bar dataKey="bsit" name="BSIT" fill="#84cc16" />
          <Bar dataKey="bit-ct" name="BIT-CT" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
