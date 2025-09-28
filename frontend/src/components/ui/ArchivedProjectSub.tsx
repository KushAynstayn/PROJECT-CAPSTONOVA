"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface ArchivedProject {
  id: number;
  title: string;
  project_leader: string;
  adviser_name: string;
  submission_year: number;
}

interface ArchivedProjectCardProps {
  project: ArchivedProject;
  onViewDetails: (project: ArchivedProject) => void;
  onRestore: (projectId: number) => void;
}

const ArchivedProjectCard: React.FC<ArchivedProjectCardProps> = ({
  project,
  onViewDetails,
  onRestore,
}) => (
  // Matched the container styles from ProjectCard
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col font-sans">
    {/* Matched the title styles */}
    <h3 className="text-xl font-bold text-[#6b0000] text-center mb-2 tracking-wide uppercase">
      {project.title}
    </h3>
    {/* Added the horizontal rule */}
    <hr className="border-gray-300 mb-4" />
    {/* Matched the content container styles and labels */}
    <div className="text-gray-600 text-sm space-y-1 flex-grow">
      <p>
        {/* Changed "Proponents" to "Project Leader" for consistency */}
        <span className="font-semibold">Project Leader:</span>{" "}
        {project.project_leader}
      </p>
      <p>
        <span className="font-semibold">Adviser:</span> {project.adviser_name}
      </p>
      <p>
        {/* Added "School Year:" label for consistency */}
        <span className="font-semibold">School Year:</span>{" "}
        {project.submission_year}
      </p>
    </div>
    {/* Matched the button container styles */}
    <div className="flex justify-center gap-4 mt-6">
      <Button
        onClick={() => onViewDetails(project)}
        variant="outline"
        // Matched the "See More" button styles
        className="bg-[#660000] hover:bg-[#630808] text-white hover:text-white font-semibold transition-transform duration-200 ease-in-out hover:scale-105"
      >
        See More
      </Button>
      <Button
        onClick={() => onRestore(project.id)}
        // Kept the distinct "Restore" color but matched other button styles
        className="text-gray-700 border-gray-700 font-semibold bg-gray-200 hover:bg-[#630808] hover:text-white transition-transform duration-200 ease-in-out hover:scale-105"
      >
        Restore
      </Button>
      
    </div>
  </div>
);

export default ArchivedProjectCard;