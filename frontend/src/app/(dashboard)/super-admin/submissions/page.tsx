'use client';


import React, { useState } from 'react';
import ProjectCard, { type Project } from '@/components/ui/ProjectCardSub';
import ArchivedProjectCard, { type ArchivedProject } from '@/components/ui/ArchivedProjectSub';
import { DownloadModal } from '@/components/ui/AllModal';

// A simple search icon component 
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// A simple chevron down icon for select dropdowns
const SelectChevronIcon = () => (
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    </svg>
  </div>
);

// New component for the details page
const ProjectDetailsPage = ({ onGoBack }: { onGoBack: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSourceCodeClick = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    console.log("Okay button clicked, initiating download...");
    // You can add your download logic here
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-0 bg-white min-h-screen font-sans">
      <div className="flex items-center mb-8">
        <button
          onClick={onGoBack}
          className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Project Details</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 md:p-8 bg-gray-100 rounded-lg shadow-inner">
        <div className="flex flex-col items-center">
          <button className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors duration-200">
            {/* SVG for folder icon */}
            <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
            </svg>
            <span className="text-lg font-semibold text-gray-800">Manuscript</span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={handleSourceCodeClick}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors duration-200"
          >
            {/* SVG for folder icon */}
            <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
            </svg>
            <span className="text-lg font-semibold text-gray-800">Source Code</span>
          </button>
        </div>
      </div>
      <DownloadModal
        isOpen={isModalOpen}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

// The main component that renders both views
const SuperAdminSubmissionsPage = () => {
  const [view, setView] = useState('submissions');
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // Mock data for project cards
  const mockProjects: Project[] = [
  { id: 1, title: 'PROJECT CAPSTONOVA', leader: 'Nino John Arado', yearAndSection: 'BSIS 3B', adviser: 'Angelbert Maganoy', schoolYear: '2023-2024' },
  { id: 2, title: 'INVENTORY MASTER', leader: 'Jane Doe', yearAndSection: 'BSCS 4A', adviser: 'John Smith', schoolYear: '2023-2024' },
  { id: 3, title: 'DATA VISUALIZER', leader: 'Peter Jones', yearAndSection: 'BSIT 3C', adviser: 'Emily White', schoolYear: '2022-2023' },
  { id: 4, title: 'E-COMMERCE PLATFORM', leader: 'Sarah Miller', yearAndSection: 'BSIS 4B', adviser: 'Michael Brown', schoolYear: '2022-2023' },
  { id: 5, title: 'MOBILE LEARNING APP', leader: 'David Wilson', yearAndSection: 'BSCS 3A', adviser: 'Jessica Green', schoolYear: '2021-2022' },
  { id: 6, title: 'AI CHATBOT', leader: 'Chris Taylor', yearAndSection: 'BSIT 4D', adviser: 'Robert Black', schoolYear: '2021-2022' },
];
  // Mock data for archived projects
  const mockArchivedProjects: ArchivedProject[] = [
    {
      id: 1,
      title: 'Research and Capstone Project Electronic Repository',
      proponents: ['Proponent 1', 'Proponent 2', 'Proponent 3', 'Proponent 4'],
      adviser: 'Sample Name',
      date: 'March 26, 2024',
    },
    {
      id: 2,
      title: 'Research and Capstone Project Electronic Repository',
      proponents: ['Proponent A', 'Proponent B', 'Proponent C'],
      adviser: 'Another Sample',
      date: 'February 15, 2024',
    },
    {
      id: 3,
      title: 'Research and Capstone Project Electronic Repository',
      proponents: ['Proponent X', 'Proponent Y'],
      adviser: 'Third Adviser',
      date: 'January 10, 2024',
    },
  ];

  // Generates an array of years from the current year down to 2020
  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2020; year--) {
      years.push(year);
    }
    return years;
  };

  const availableYears = generateYears();

  // Functions to handle search and view changes
  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const showArchivedProjects = () => {
    setView('archived');
    setSearchTerm(''); // Clear search term when switching views
  };

  const showSubmissions = () => {
    setView('submissions');
    setSearchTerm(''); // Clear search term when switching views
  };

  // New functions for handling project details view
  const handleViewDetails = (id: number) => {
    setSelectedProjectId(id);
    setView('details');
  };

  const handleGoBack = () => {
    setSelectedProjectId(null);
    // Determine which view to go back to based on the last view
    // For this example, we'll just go back to submissions
    setView('submissions'); 
  };

  // Filter main projects based on search term
  const filteredProjects = mockProjects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.leader.toLowerCase().includes(searchLower) ||
      project.yearAndSection.toLowerCase().includes(searchLower) ||
      project.adviser.toLowerCase().includes(searchLower)
    );
  });

  // Filter archived projects based on search term
  const filteredArchivedProjects = mockArchivedProjects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.proponents.join(' ').toLowerCase().includes(searchLower)
    );
  });

  // Conditional rendering based on the current view state
  let content;
  switch (view) {
    case 'submissions':
      content = (
        <>
          <div className="w-full bg-[#6b0000] text-white text-center py-3 font-bold text-lg tracking-wider rounded-t-md">
            APPROVED PROJECT SUBMISSION
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow-md rounded-b-md border-t-0 border-gray-200 mb-8">
            <div className="relative w-full md:w-auto flex-grow">
              <input
                type="text"
                placeholder="Search here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  onClick={handleSearch}
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-full hover:bg-gray-100"
                  aria-label="Search"
                >
                  <SearchIcon />
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={showArchivedProjects}
                className="bg-[#5c3c20] hover:bg-[#4a301a] text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-200 whitespace-nowrap"
              >
                Archived Projects
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>From:</span>
                <div className="relative">
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(parseInt(e.target.value))}
                    className="bg-gray-200 border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 appearance-none"
                  >
                    {availableYears.map((year) => (
                      <option key={`start-${year}`} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <SelectChevronIcon />
                </div>
                <span>To:</span>
                <div className="relative">
                  <select
                    value={endYear}
                    onChange={(e) => setEndYear(parseInt(e.target.value))}
                    className="bg-gray-200 border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 appearance-none"
                  >
                    {availableYears.map((year) => (
                      <option key={`end-${year}`} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <SelectChevronIcon />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} onViewDetails={handleViewDetails} />
            ))}
          </div>
        </>
      );
      break;
    case 'archived':
      content = (
        <>
          {/* Archived Projects View */}
          <div className="flex items-center mb-6">
            <button
              onClick={showSubmissions}
              className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Archived Projects</h1>
          </div>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <SearchIcon />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
          <div className="space-y-4">
            {filteredArchivedProjects.length > 0 ? (
              filteredArchivedProjects.map((project) => (
                <ArchivedProjectCard key={project.id} project={project} onViewDetails={handleViewDetails} />
              ))
            ) : (
              <p className="text-center text-gray-500">No archived projects found.</p>
            )}
          </div>
        </>
      );
      break;
    case 'details':
      content = <ProjectDetailsPage onGoBack={handleGoBack} />;
      break;
    default:
      content = <p>Error: Unknown view state</p>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-0 bg-white min-h-screen">
      {content}
    </div>
  );
};

export default SuperAdminSubmissionsPage;
