"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface Project {
  id: number;
  title: string;
  project_leader: string;
  adviser_name: string;
  submission_year: number;
}

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onArchive: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onArchive,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col font-sans">
    <h3 className="text-xl font-bold text-[#6b0000] text-center mb-2 tracking-wide uppercase">
      {project.title}
    </h3>
    <hr className="border-gray-300 mb-4" />
    <div className="text-gray-600 text-sm space-y-1 flex-grow">
      <p>
        <span className="font-semibold">Project Leader:</span>{" "}
        {project.project_leader}
      </p>
      <p>
        <span className="font-semibold">Adviser:</span> {project.adviser_name}
      </p>
      <p>
        <span className="font-semibold">School Year:</span>{" "}
        {project.submission_year}
      </p>
    </div>
    <div className="flex justify-center gap-4 mt-6">
      <Button
        onClick={() => onArchive(project.id)}
        className="bg-[#6b0000] hover:bg-[#8a0000] text-white font-semibold"
      >
        Archive
      </Button>
      <Button
        onClick={() => onViewDetails(project)}
        variant="outline"
        className="text-gray-800 font-semibold border-gray-300 hover:bg-gray-100"
      >
        See More
      </Button>
    </div>
  </div>
);

export default ProjectCard;
