'use client';

import React from 'react';

// Define and export the type for a project object
export interface Project {
  id: number;
  title: string;
  leader: string;
  yearAndSection: string;
  adviser: string;
  schoolYear: string; // Added schoolYear to the interface
}

// Project Card Component
const ProjectCard = ({ project, onViewDetails }: { project: Project, onViewDetails: (projectId: number) => void }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col font-sans">
    <h3 className="text-xl font-bold text-[#6b0000] text-center mb-2 tracking-wide uppercase">{project.title}</h3>
    <hr className="border-gray-300 mb-4" />
    <div className="text-gray-600 text-sm space-y-1 flex-grow">
      <p><span className="font-semibold">Project Leader:</span> {project.leader}</p>
      <p><span className="font-semibold">Yr & Section:</span> {project.yearAndSection}</p>
      <p><span className="font-semibold">Adviser:</span> {project.adviser}</p>
      {/* Display the school year */}
      <p><span className="font-semibold">School Year:</span> {project.schoolYear}</p>
    </div>
    <div className="flex justify-center gap-4 mt-6">
      <button className="bg-[#6b0000] hover:bg-[#8a0000] text-white font-semibold px-6 py-2 rounded-md shadow-sm transition-colors duration-200">
        Remove
      </button>
      <button 
        onClick={() => onViewDetails(project.id)}
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-6 py-2 rounded-md border border-gray-300 shadow-sm transition-colors duration-200"
      >
        See More
      </button>
    </div>
  </div>
);

export default ProjectCard;
