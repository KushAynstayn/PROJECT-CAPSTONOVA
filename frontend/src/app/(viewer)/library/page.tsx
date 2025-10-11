"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";
import { apiCall, ApiError } from "@/lib/api";
import PdfViewer from "@/components/ui/pdf-viewer-dynamic"; // THIS LINE IS MODIFIED

// Updated Project interface to match backend response
type Project = {
  access_id: number;
  project_id: number;
  project_title: string;
  submission_year: number;
  adviser_name: string;
  project_authors: string[];
  department: string;
  program: string;
  manuscript_id: number | null;
  grant_date: string;
  expiry_date: string | null;
};

const ViewLibrary = () => {
  const router = useRouter();
  // Initialize projects with an empty array to prevent runtime errors
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<
    number | null
  >(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<
    | "grant_date"
    | "submission_year_latest"
    | "submission_year_oldest"
    | "alphabetical"
  >("grant_date");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- Authentication and Data Fetching Effect ---
  useEffect(() => {
    const user = authStore.getUser();
    if (!authStore.isAuthenticated() || user?.role.toLowerCase() !== "viewer") {
      router.push("/login");
      return;
    }

    const fetchAccessedProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall("/viewer/accessed-projects");
        // --- THIS IS THE FIX ---
        // The apiCall function returns the data array directly.
        // We set the state with the response itself, defaulting to an empty array.
        setProjects(response || []);
      } catch (e) {
        if (e instanceof ApiError) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred while fetching projects.");
        }
        setProjects([]); // Also ensure projects is an array on error
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessedProjects();
  }, [router]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSeeMoreClick = (manuscriptId: number | null) => {
    if (manuscriptId) {
      setSelectedManuscriptId(manuscriptId);
      setIsModalOpen(true);
    } else {
      alert("No manuscript available for this project.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedManuscriptId(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (
    order:
      | "grant_date"
      | "submission_year_latest"
      | "submission_year_oldest"
      | "alphabetical"
  ) => {
    setSortOrder(order);
    setIsMenuOpen(false);
  };

  const filteredAndSortedProjects = (projects || []) // Add a guard here as well for extra safety
    .filter((project) =>
      project.project_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "alphabetical":
          return a.project_title.localeCompare(b.project_title);
        case "submission_year_latest":
          return b.submission_year - a.submission_year;
        case "submission_year_oldest":
          return a.submission_year - b.submission_year;
        case "grant_date":
        default:
          return (
            new Date(b.grant_date).getTime() - new Date(a.grant_date).getTime()
          );
      }
    });

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mb-28 p-4 px-8 bg-black min-h-screen text-white">
      <div className="mb-8 mt-28">
        <p
          className="mt-1 text-3xl text-[#E0A800]"
          style={{ fontFamily: "'Black Ops One', sans-serif" }}
        >
          My Library
        </p>
        <p className="text-gray-400 mt-2">
          These are the capstone projects you have been granted access to view.
        </p>
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
                onClick={() => handleSortChange("grant_date")}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                {" "}
                Recently Granted{" "}
              </button>
              <button
                onClick={() => handleSortChange("submission_year_latest")}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                {" "}
                Latest Submission{" "}
              </button>
              <button
                onClick={() => handleSortChange("submission_year_oldest")}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                {" "}
                Oldest Submission{" "}
              </button>
              <button
                onClick={() => handleSortChange("alphabetical")}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                {" "}
                Alphabetically{" "}
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <div className="text-center py-10">Loading projects...</div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProjects.length > 0 ? (
            filteredAndSortedProjects.map((project) => (
              <div
                key={project.access_id}
                className="bg-neutral-900 border-2 border-transparent rounded-lg p-6 flex flex-col justify-between
                                 transition-all duration-300 ease-in-out
                                 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-400/50"
                style={{
                  borderColor: "rgba(255, 165, 0, 0.5)",
                  boxShadow:
                    "0 0 10px rgba(255, 165, 0, 0.3), inset 0 0 5px rgba(255, 165, 0, 0.2)",
                }}
              >
                <div>
                  <h2 className="text-xl font-bold text-center text-[#E0A800] tracking-wider">
                    {project.project_title}
                  </h2>
                  <hr className="my-4 border-neutral-700" />
                  <div className="space-y-2 text-sm text-neutral-300">
                    <p>
                      <span className="font-bold text-neutral-100">
                        Authors:
                      </span>{" "}
                      {project.project_authors.join(", ")}
                    </p>
                    <p>
                      <span className="font-bold text-neutral-100">
                        Department:
                      </span>{" "}
                      {project.department}
                    </p>
                    <p>
                      <span className="font-bold text-neutral-100">
                        Program:
                      </span>{" "}
                      {project.program}
                    </p>
                    <p>
                      <span className="font-bold text-neutral-100">
                        Adviser:
                      </span>{" "}
                      {project.adviser_name}
                    </p>
                    <p>
                      <span className="font-bold text-neutral-100">Year:</span>{" "}
                      {project.submission_year}
                    </p>
                    <p>
                      <span className="font-bold text-neutral-100">
                        Access Granted:
                      </span>{" "}
                      {getFormattedDate(project.grant_date)}
                    </p>
                    {project.expiry_date && (
                      <p className="font-bold text-yellow-400">
                        Access Expires: {getFormattedDate(project.expiry_date)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => handleSeeMoreClick(project.manuscript_id)}
                    disabled={!project.manuscript_id}
                    className="bg-neutral-800 text-neutral-100 font-semibold py-2 px-8 border border-neutral-700 rounded-md hover:bg-neutral-700 transition-colors disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                  >
                    View Document
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-neutral-500 col-span-full py-10">
              <p>You have not been granted access to any projects yet.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && selectedManuscriptId && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
          onClick={handleCloseModal}
        >
          <div
            className="bg-neutral-800 w-full max-w-5xl h-[95vh] rounded-lg shadow-xl border border-orange-400/50 flex flex-col"
            style={{ boxShadow: "0 0 20px rgba(255, 165, 0, 0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-neutral-700 flex-shrink-0">
              <h2 className="text-xl font-bold text-[#E0A800]">
                Document Viewer
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-neutral-400 hover:text-white text-3xl"
              >
                &times;
              </button>
            </div>
            <div className="w-full h-full bg-neutral-900 p-2 md:p-4 overflow-y-auto">
              <PdfViewer url={`/user/stream/acm/${selectedManuscriptId}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLibrary;
