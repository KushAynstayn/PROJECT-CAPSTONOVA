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
  <div className="flex flex-col md:flex-row items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200">
    <div className="flex-grow">
      <h3 className="text-lg font-bold text-[#6b0000]">{project.title}</h3>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Proponents:</span>{" "}
        {project.project_leader}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Adviser:</span> {project.adviser_name}
      </p>
      <p className="text-sm text-gray-700">{project.submission_year}</p>
    </div>
    <div className="flex-shrink-0 flex gap-2 mt-4 md:mt-0">
      <Button
        onClick={() => onRestore(project.id)}
        className="bg-[#5c3c20] hover:bg-[#4a301a] text-white font-semibold"
      >
        Restore
      </Button>
      <Button
        onClick={() => onViewDetails(project)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
      >
        See More
      </Button>
    </div>
  </div>
);

export default ArchivedProjectCard;
