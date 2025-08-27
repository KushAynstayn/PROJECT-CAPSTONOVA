'use client';

import React from 'react';

// Define and export the type for an archived project
export interface ArchivedProject {
  id: number;
  title: string;
  proponents: string[];
  adviser: string;
  date: string;
}

// Archived Project Card Component
const ArchivedProjectCard = ({ project, onViewDetails }: { project: ArchivedProject, onViewDetails: (projectId: number) => void }) => (
  <div className="flex flex-col md:flex-row items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200">
    <div className="flex-grow">
      <h3 className="text-lg font-bold text-[#6b0000]">{project.title}</h3>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Proponents:</span> {project.proponents.join(', ')}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Adviser:</span> {project.adviser}
      </p>
      <p className="text-sm text-gray-700">{project.date}</p>
    </div>
    <div className="flex-shrink-0 flex gap-2 mt-4 md:mt-0">
      <button className="bg-[#5c3c20] hover:bg-[#4a301a] text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200">
        Restore
      </button>
      <button 
        onClick={() => onViewDetails(project.id)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-md transition-colors duration-200"
      >
        See More
      </button>
    </div>
  </div>
);

export default ArchivedProjectCard;
