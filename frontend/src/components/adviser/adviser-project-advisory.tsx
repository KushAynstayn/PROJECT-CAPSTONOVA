"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { apiCall } from "@/lib/api";

// Interface for a single project based on your backend controller's response
interface AssignedProject {
  id: number;
  title: string;
  abstract_snippet: string;
  platform_type: string;
  keyword_tags: string[];
  language_tags: string[];
  students: string[];
}

const AdviserProjectAdvisory = () => {
  const [projects, setProjects] = useState<AssignedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        // Fetch assigned projects from the API endpoint
        const data = await apiCall("/adviser/assigned-projects");
        setProjects(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch assigned projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedProjects();
  }, []);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (projects.length === 0) {
    return <p className="text-center text-gray-500">No projects found.</p>;
  }

  return (
    // This container enables the custom scrollbar
    <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-2">
      {projects.map((project) => (
        <Card key={project.id} className="w-full shadow-md border border-gray-300">
          <CardContent className="p-3">
            <CardDescription className="text-md text-gray-800 font-semibold">
              {project.title}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdviserProjectAdvisory;
