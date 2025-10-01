"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProjectCard, { type Project } from "@/components/ui/ProjectCardSub";
import ArchivedProjectCard, {
  type ArchivedProject,
} from "@/components/ui/ArchivedProjectSub";
import { DownloadModal } from "@/components/ui/AllModal";
import { YearPicker } from "@/components/ui/year-picker";
import { Button } from "@/components/ui/button";
import { apiCall, ApiError } from "@/lib/api";
import PdfViewer from "@/components/ui/pdf-viewer";
import { ArrowLeft, Search, X } from "lucide-react";
import Pagination from "@/components/ui/pagination";

// New component for the details page
const ProjectDetailsPage = ({
  project,
  onGoBack,
}: {
  project: any;
  onGoBack: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPdf, setViewPdf] = useState(false);

  const handleSourceCodeClick = () => { 
    if (project.source_code_id) {
      setIsModalOpen(true);
    } else {
      alert("No source code available for this project.");
    }
  };

  const handleManuscriptClick = () => {
    if (project.manuscript_id) {
      setViewPdf(true);
    } else {
      alert("No manuscript available for this project.");
    }
  };

   const handleUserGuideClick = () => {
    if (project.source_code_id) {
      setIsModalOpen(true);
    } else {
      alert("No source code available for this project.");
    }
  };

  const handleSystemManualClick = () => {
    if (project.source_code_id) {
      setIsModalOpen(true);
    } else {
      alert("No source code available for this project.");
    }
  };

  const handleModalConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/download/source-code/${project.source_code_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.title.replace(/\s+/g, "_")}_source_code.tar`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download source code.");
    }
    setIsModalOpen(false);
  };

  const handleModalCancel = () => setIsModalOpen(false);

  if (viewPdf) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-shrink-0 p-4 border-b">
          <Button variant="ghost" onClick={() => setViewPdf(false)}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Details
          </Button>
        </div>
        <div className="flex-grow">
          <PdfViewer url={`/user/stream/manuscript/${project.manuscript_id}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-0 bg-white min-h-screen font-sans">
      <div className="flex items-center mb-8">
        <button
          onClick={onGoBack}
          className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <img src="/images/arrow.png" className="h-5 w-5 " />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 md:p-8 bg-gray-100 rounded-lg shadow-inner">
        <div className="flex flex-col items-center">
          <button
            onClick={handleManuscriptClick}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors duration-200"
          >
            <svg
              className="w-16 h-16 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
            </svg>
            <span className="text-lg font-semibold text-gray-800">
              Manuscript
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={handleSourceCodeClick}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors duration-200"
          >
            <svg
              className="w-16 h-16 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
            </svg>
            <span className="text-lg font-semibold text-gray-800">
              Source Code
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={handleUserGuideClick}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors duration-200"
          >
            <svg
              className="w-16 h-16 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
            </svg>
            <span className="text-lg font-semibold text-gray-800">
              User Guide
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={handleSystemManualClick}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors duration-200"
          >
            <svg
              className="w-16 h-16 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
            </svg>
            <span className="text-lg font-semibold text-gray-800">
              System Manual
            </span>
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
  const [view, setView] = useState<"submissions" | "archived" | "details">(
    "submissions"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<ArchivedProject[]>(
    []
  );
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [startYear, setStartYear] = useState<number | undefined>(undefined);
  const [endYear, setEndYear] = useState<number | undefined>(undefined);
  const fromYear = 2020;
  const toYear = new Date().getFullYear();

  const fetchProjects = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          per_page: "6",
        });

        if (searchTerm) params.append("search", searchTerm);
        if (startYear) params.append("start_year", String(startYear));
        if (endYear) params.append("end_year", String(endYear));

        const endpoint =
          view === "submissions"
            ? "/super-admin/capstone-projects"
            : "/super-admin/capstone-projects/archived";

        const response = await apiCall(`${endpoint}?${params.toString()}`);

        if (view === "submissions") {
          setProjects(response.data);
        } else {
          setArchivedProjects(response.data);
        }

        setPagination({
          currentPage: response.current_page,
          totalPages: response.last_page,
          totalItems: response.total,
        });
      } catch (err) {
        setError("Failed to fetch projects.");
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, startYear, endYear, view]
  );

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  const handlePageChange = (page: number) => {
    fetchProjects(page);
  };

  const handleStartYearChange = (year: number | undefined) => {
    setStartYear(year);
  };

  const handleEndYearChange = (year: number | undefined) => {
    setEndYear(year);
  };

  const handleResetYears = () => {
    setStartYear(undefined);
    setEndYear(undefined);
  };

  const handleSearch = () => {
    fetchProjects(1);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const showArchivedProjects = () => setView("archived");
  const showSubmissions = () => setView("submissions");

  const handleViewDetails = (project: Project | ArchivedProject) => {
    setSelectedProject(project);
    setView("details");
  };

  const handleGoBack = () => {
    setSelectedProject(null);
    setView(view === "details" ? "submissions" : view);
  };

  const handleArchive = async (projectId: number) => {
    try {
      await apiCall(
        `/super-admin/capstone-projects/${projectId}/archive`,
        "PATCH"
      );
      fetchProjects(pagination.currentPage);
    } catch (error) {
      alert("Failed to archive project.");
    }
  };

  const handleRestore = async (projectId: number) => {
    try {
      await apiCall(
        `/super-admin/capstone-projects/${projectId}/unarchive`,
        "PATCH"
      );
      fetchProjects(pagination.currentPage);
    } catch (error) {
      alert("Failed to restore project.");
    }
  };

  let content;
  switch (view) {
    case "submissions":
    case "archived":
      const currentData = view === "submissions" ? projects : archivedProjects;
      content = (
        <>
          <div className="w-full bg-[#6b0000] text-white text-center py-3 font-bold text-lg tracking-wider rounded-t-md">
            {view === "submissions"
              ? "APPROVED PROJECT SUBMISSION"
              : "ARCHIVED PROJECTS"}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow-md rounded-b-md border-t-0 border-gray-200 mb-8">
            <div className="relative w-full md:w-auto flex-grow">
              <input
                type="text"
                placeholder="Search by title, abstract, or names"
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
                  <Search className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={
                  view === "submissions"
                    ? showArchivedProjects
                    : showSubmissions
                }
                className="bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
              >
                {view === "submissions"
                  ? "View Archived Projects"
                  : "View Active Projects"}
              </Button>
              <div className="flex items-center gap-2">
                <YearPicker
                  year={startYear}
                  setYear={handleStartYearChange}
                  placeholder="Start year"
                  fromYear={fromYear}
                  toYear={toYear}
                />
                <span className="text-gray-500">-</span>
                <YearPicker
                  year={endYear}
                  setYear={handleEndYearChange}
                  placeholder="End year"
                  fromYear={startYear || fromYear}
                  toYear={toYear}
                />
                {(startYear !== undefined || endYear !== undefined) && (
                  <Button
                    variant="ghost"
                    onClick={handleResetYears}
                    className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                    aria-label="Clear years"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <p>Loading projects...</p>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-8">{error}</p>
          ) : currentData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentData.map((project) =>
                  view === "submissions" ? (
                    <ProjectCard
                      key={project.id}
                      project={project as Project}
                      onViewDetails={handleViewDetails}
                      onArchive={handleArchive}
                    />
                  ) : (
                    <ArchivedProjectCard
                      key={project.id}
                      project={project as ArchivedProject}
                      onViewDetails={handleViewDetails}
                      onRestore={handleRestore}
                    />
                  )
                )}
              </div>
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 mt-8 py-8">
              {searchTerm || startYear || endYear
                ? "No projects match your search criteria."
                : "No projects found."}
            </p>
          )}
        </>
      );
      break;
    case "details":
      content = (
        <ProjectDetailsPage project={selectedProject} onGoBack={handleGoBack} />
      );
      break;
    default:
      content = <p>Error: Unknown view state</p>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white min-h-screen">{content}</div>
  );
};

export default SuperAdminSubmissionsPage;
