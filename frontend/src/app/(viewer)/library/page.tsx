'use client';

import React, { useState, useEffect, useRef } from 'react';

type Project = {
  title: string;
  leader: string;
  section: string;
  adviser: string;
  schoolYear: string;
  authors: string[];
  fullAdviserName: string;
  uploadDate: string;
  panelists: string[];
};

const ViewLibrary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState<number | ''>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'recently-added' | 'latest' | 'oldest' | 'alphabetical'>('recently-added');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen || isRemoveModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen, isRemoveModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSeeMoreClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentPage(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };
  
  const handleRemoveClick = (project: Project) => {
      setSelectedProject(project);
      setIsRemoveModalOpen(true);
  };
  
  const handleCloseRemoveModal = () => {
      setIsRemoveModalOpen(false);
      setSelectedProject(null);
  };

  const handleConfirmRemove = () => {
      if (selectedProject) {
          console.log(`Removing project: ${selectedProject.title}`);
      }
      handleCloseRemoveModal();
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      let page = parseInt(value, 10);
      if (value === '') {
        setCurrentPage('');
      } else if (!isNaN(page)) {
        if (page > 177) page = 177;
        if (page < 1) page = 1;
        setCurrentPage(page);
      }
    }
  };
  
  const handlePageInputBlur = () => {
      if (currentPage === '') {
          setCurrentPage(1);
      }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (order: 'recently-added' | 'latest' | 'oldest' | 'alphabetical') => {
    setSortOrder(order);
    setIsMenuOpen(false);
  };

  const renderPageContent = (page: number | '') => {
    if (!selectedProject) return null;
    const pageNum = Number(page);

    const documentTitle = selectedProject.title === 'PROJECT CAPSTONOVA'
      ? 'Enhancing Capstone Archiving and Optimizing Data Intelligence with Project Capstonova'
      : selectedProject.title;
    
    switch (pageNum) {
      case 1:
        return (
          <div className="text-center flex flex-col h-full">
            <p className="font-bold text-lg leading-relaxed uppercase">{documentTitle}</p>
            <p className="mt-16">A Capstone Project Presented to the Faculty of</p>
            <p className="font-semibold mt-2">
                College of Computer, Information and Communications Technology<br/>
                Cebu Technological University-Main Campus
            </p>
            <p className="mt-24">In Partial Fulfillment<br/>of Requirements for the degree</p>
            <p className="font-semibold mt-2">Bachelor of Science in Information Systems</p>
            <div className="flex-grow"></div>
            <div className="mb-16">
                 <p>By</p>
                 <div className="mt-4 space-y-1">
                    {selectedProject.authors.map((author, i) => <p key={i}>{author}</p>)}
                 </div>
            </div>
            <div className="mb-8">
                 <p className="font-semibold">{selectedProject.fullAdviserName}</p>
                 <hr className="w-24 mx-auto mt-1 border-black"/>
                 <p className="text-sm">Adviser</p>
            </div>
            <p className="text-sm">May 2025</p>
          </div>
        );
      case 2:
        return (
            <div className="px-4">
                <h2 className="text-center font-bold text-lg mb-8">APPROVAL SHEET</h2>
                <p className="text-right text-sm mb-6">ii</p>
                <p className="mb-6 leading-relaxed text-justify">
                    The Capstone Project entitled {documentTitle} prepared and submitted by {selectedProject.authors.join(', ')} has been examined and is recommended for approval and acceptance.
                </p>
                <p className="mb-8 font-semibold">Recommended:</p>
                <p className="mb-12 font-bold">{selectedProject.fullAdviserName.split(',')[0]}<br /><span className="font-normal">Adviser</span></p>
                <p className="mb-8">Approved by the Committee on PROPOSAL HEARING with a verdict of APPROVED WITH MINOR REVISIONS on May 9, 2025.</p>
            </div>
        );
      case 3:
        return (
            <div className="px-4">
                <h2 className="text-center font-bold text-lg mb-8">ACKNOWLEDGEMENT</h2>
                <p className="text-right text-sm mb-6">iii</p>
                <p className="mb-6 leading-relaxed text-justify">
                    With sincere gratitude, we acknowledge the individuals and institutions whose unwavering support and guidance made this capstone project possible. This journey has been filled with challenges, but through the kindness and encouragement of many, we have preserved.
                </p>
                <p className="mb-6 leading-relaxed text-justify">
                    First and foremost, we thank God for His wisdom and strength. His presence gave us courage during difficult times.
                </p>
                <p className="mb-6 leading-relaxed text-justify">
                    Our heartfelt gratitude goes to our adviser, {selectedProject.fullAdviserName.split(',')[0]}, for his patience and invaluable guidance. His belief in our abilities inspired us to do our best.
                </p>
                 <p className="text-right mt-12">The Researchers</p>
            </div>
        );
      default:
        return (
          <div className="text-center p-10">
            <h2 className="font-bold text-lg">Page {pageNum}</h2>
            <p className="mt-4 text-neutral-600">This is sample content for page {pageNum}. The full document would be displayed here.</p>
          </div>
        );
    }
  };

  const projects: Project[] = [
    {
      title: 'PROJECT CAPSTONOVA',
      leader: 'Niño John Arado',
      section: 'BSIS 3B',
      adviser: 'Angelbert Maghanoy',
      schoolYear: '2023-2024',
      authors: ['Arado Niño John,', ' ', 'Canales Kingston Harddy,', ' ', 'Genson Leah Faye,', ' ', 'Jubahib Shekinah Mae'],
      fullAdviserName: 'Angelbert P. Maghanoy, Ph.D.',
      uploadDate: '2025-05-20',
      panelists: ['Dr. Noreen Fuentes', 'Prof. Janeth Ugang', 'Prof. Emilie Villaceran'],
    },
    {
      title: 'INVENTORY MASTER',
      leader: 'Jane Doe',
      section: 'BSCS 4A',
      adviser: 'John Smith',
      schoolYear: '2023-2024',
      authors: ['Doe, Jane', 'Smith, John', 'Jones, Peter'],
      fullAdviserName: 'John Smith, Ph.D.',
      uploadDate: '2025-05-18',
      panelists: ['Luffy', 'Zoro', 'Sanji'],
    },
    {
      title: 'DATA VISUALIZER',
      leader: 'Peter Jones',
      section: 'BSIT 3C',
      adviser: 'Emily White',
      schoolYear: '2022-2023',
      authors: ['Jones, Peter', 'White, Emily', 'Brown, Chris'],
      fullAdviserName: 'Emily White, M.S.',
      uploadDate: '2024-06-15',
      panelists: ['Luffy', 'Zoro', 'Sanji'],
    },
    {
      title: 'E-LEARNING PLATFORM',
      leader: 'Maria Clara',
      section: 'BSCS 4B',
      adviser: 'Jose Rizal',
      schoolYear: '2023-2024',
       authors: ['Clara, Maria', 'Rizal, Jose'],
      fullAdviserName: 'Jose Rizal, Ph.D.',
      uploadDate: '2025-05-19',
      panelists: ['Luffy', 'Zoro', 'Sanji'],
    },
    {
      title: 'MOBILE ATTENDANCE SYSTEM',
      leader: 'Andres Bonifacio',
      section: 'BSIT 3A',
      adviser: 'Apolinario Mabini',
      schoolYear: '2022-2023',
       authors: ['Bonifacio, Andres', 'Mabini, Apolinario'],
      fullAdviserName: 'Apolinario Mabini',
      uploadDate: '2024-06-25',
      panelists: ['Luffy', 'Zoro', 'Sanji'],
    },
    {
      title: 'CAMPUS NAVIGATION APP',
      leader: 'Gabriela Silang',
      section: 'BSIS 3C',
      adviser: 'Emilio Aguinaldo',
      schoolYear: '2023-2024',
       authors: ['Silang, Gabriela', 'Aguinaldo, Emilio'],
      fullAdviserName: 'Emilio Aguinaldo',
      uploadDate: '2025-05-17',
      panelists: ['Luffy', 'Zoro', 'Sanji'],
    },
  ];

  const filteredAndSortedProjects = projects
    .filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortOrder === 'latest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      if (sortOrder === 'oldest') {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      }
      return 0; // 'recently-added' or default
    });

  return (
    <div className="p-4 px-8 mt-32 bg-black min-h-screen text-white">
      <div className="mb-8">
        <p className="mt-1 text-3xl text-[#E0A800]" style={{ fontFamily: "'Black Ops One', sans-serif" }}>Requested Capstone Projects</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search project title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            Filter
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => handleSortChange('recently-added')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                Recently Added
              </button>
              <button
                onClick={() => handleSortChange('latest')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                Latest to Oldest
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                Oldest to Latest
              </button>
              <button
                onClick={() => handleSortChange('alphabetical')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                Alphabetically
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAndSortedProjects.length > 0 ? (
          filteredAndSortedProjects.map((project, index) => (
            <div
              key={index}
              className="bg-neutral-900 border-2 border-transparent rounded-lg p-6 flex flex-col justify-between
                       transition-all duration-300 ease-in-out
                       hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-400/50"
              style={{ borderColor: 'rgba(255, 165, 0, 0.5)', boxShadow: '0 0 10px rgba(255, 165, 0, 0.3), inset 0 0 5px rgba(255, 165, 0, 0.2)'}}
            >
              <div>
                <h2 className="text-xl font-bold text-center text-[#E0A800] tracking-wider">{project.title}</h2>
                <hr className="my-4 border-neutral-700" />
                <div className="space-y-2 text-sm text-neutral-300">
                   <p><span className="font-bold text-neutral-100">Project Authors:</span> {project.authors}</p>
                   <p><span className="font-bold text-neutral-100">Yr & Section:</span> {project.section}</p>
                   <p><span className="font-bold text-neutral-100">Adviser:</span> {project.adviser}</p>
                   <p><span className="font-bold text-neutral-100">School Year:</span> {project.schoolYear}</p>
                   <p><span className="font-bold text-neutral-100">Panelists:</span> {project.panelists}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button 
                  onClick={() => handleRemoveClick(project)}
                  className="bg-[#800000] text-white font-semibold py-2 px-8 rounded-md hover:bg-opacity-80 transition-colors">
                  Remove
                </button>
                <button
                  onClick={() => handleSeeMoreClick(project)}
                  className="bg-neutral-800 text-neutral-100 font-semibold py-2 px-8 border border-neutral-700 rounded-md hover:bg-neutral-700 transition-colors">
                  See More
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-neutral-500 col-span-full py-10">
            <p>No projects found.</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedProject && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={handleCloseModal}
        >
          <div
            className="bg-neutral-800 w-full max-w-4xl h-[90vh] rounded-lg shadow-xl border border-orange-400/50 flex flex-col"
            style={{ boxShadow: '0 0 20px rgba(255, 165, 0, 0.5)'}}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-neutral-700 flex-shrink-0">
                <h2 className="text-xl font-bold text-[#E0A800] uppercase">{selectedProject.title}</h2>
                <div className="flex items-center gap-2 text-sm">
                    <span>Page</span>
                    <input
                        type="text"
                        value={currentPage}
                        onChange={handlePageInputChange}
                        onBlur={handlePageInputBlur}
                        className="w-16 text-center bg-neutral-700 border border-neutral-600 rounded-md p-1"
                        maxLength={3}
                    />
                    <span>of 177</span>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-neutral-400 hover:text-white text-3xl"
                >&times;</button>
            </div>
            <div className="w-full h-full bg-neutral-900 p-4 overflow-y-auto">
                 <div className="bg-white text-black font-serif max-w-2xl mx-auto p-12 shadow-lg min-h-full">
                    {renderPageContent(currentPage)}
                 </div>
            </div>
          </div>
        </div>
      )}

      {isRemoveModalOpen && selectedProject && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={handleCloseRemoveModal}
            >
              <div
                className="bg-neutral-900 border-2 border-orange-400/50 rounded-lg shadow-xl p-6 w-full max-w-sm text-center"
                style={{ boxShadow: '0 0 20px rgba(255, 165, 0, 0.5)'}}
                onClick={(e) => e.stopPropagation()}
              >
                  <h3 className="text-lg font-bold text-white mb-4">Confirm Removal</h3>
                  <p className="text-neutral-300 mb-6">
                      Are you sure you want to remove "<span className="font-semibold text-orange-400">{selectedProject.title}</span>" from the library?
                  </p>
                  <div className="flex justify-center gap-4">
                      <button 
                        onClick={handleCloseRemoveModal}
                        className="bg-neutral-700 text-white font-semibold py-2 px-6 rounded-md hover:bg-neutral-600 transition-colors"
                        >
                          Cancel
                      </button>
                      <button 
                        onClick={handleConfirmRemove}
                        className="bg-red-700 text-white font-semibold py-2 px-6 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Remove
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ViewLibrary;