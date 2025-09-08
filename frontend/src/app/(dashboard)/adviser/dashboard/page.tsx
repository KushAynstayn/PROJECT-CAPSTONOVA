"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { Calendar22 } from "@/components/ui/date-picker";
import AdviserSuggestionLog from "@/components/adviser/adviser-suggestion-log";
import AdviserProjectAdvisory from "@/components/adviser/adviser-project-advisory";
import AdviserOverviewData from "@/components/adviser/adviser-overview-data";
import PdfViewer from "@/components/ui/pdf-viewer";
import { apiCall, ApiError } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Interfaces based on the backend API
interface SearchResult {
  id: number;
  title: string;
  abstract_snippet: string;
  team_roles: {
    leader?: string;
    hacker?: string;
    hipster1?: string;
    hipster2?: string;
  };
}

interface ProjectDetails extends SearchResult {
  abstract: string;
  submission_date: string;
  manuscript_id: number | null;
  adviser: string | null;
}

export default function AdviserDashboardPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(
    null
  );
  const [showFullDocument, setShowFullDocument] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const user = authStore.getUser();
    if (
      !authStore.isAuthenticated() ||
      user?.role.toLowerCase() !== "adviser"
    ) {
      router.push("/login");
    }
  }, [router]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue.trim() !== "") {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleSearch = async () => {
    if (searchValue.trim() === "") return;

    setIsSearching(true);
    try {
      const response = await apiCall(`/public/search?q=${searchValue}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProject = async (searchResult: SearchResult) => {
    try {
      const projectDetails = await apiCall(
        `/public/project/${searchResult.id}`
      );
      setSelectedProject({
        ...projectDetails,
        team_roles: searchResult.team_roles,
      });
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    }
  };

  const handleClearAll = () => {
    setSearchValue("");
    setSearchResults([]);
    setSelectedProject(null);
    setShowFullDocument(false);
  };

  const renderContent = () => {
    if (showFullDocument && selectedProject && selectedProject.manuscript_id) {
      return (
        <div className="flex flex-col p-0 relative h-full overflow-y-auto">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-700 font-bold z-10"
            onClick={() => setShowFullDocument(false)}
          >
            ✕
          </button>
          <PdfViewer
            url={`/user/stream/manuscript/${selectedProject.manuscript_id}`}
          />
        </div>
      );
    }

    if (selectedProject) {
      const proponents = [
        selectedProject.team_roles.leader,
        selectedProject.team_roles.hacker,
        selectedProject.team_roles.hipster1,
        selectedProject.team_roles.hipster2,
      ]
        .filter(Boolean)
        .join(", ");

      return (
        <div className="flex flex-col bg-white rounded-lg shadow-md p-6 border border-gray-200 relative overflow-y-auto">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-700 font-bold"
            onClick={handleClearAll}
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedProject.title}
          </h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Abstract
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {selectedProject.abstract}
            </p>
          </div>
          <div className="space-y-2 mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Proponents:</span> {proponents}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Adviser:</span>{" "}
              {selectedProject.adviser || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Date Published:{" "}
              {new Date(selectedProject.submission_date).toLocaleDateString()}
            </p>
          </div>
          <Button
            className="bg-red-900 text-white w-80 px-6 py-2 rounded-md shadow hover:scale-105 transition-transform duration-200"
            onClick={() => setShowFullDocument(true)}
            disabled={!selectedProject.manuscript_id}
          >
            {selectedProject.manuscript_id
              ? "View Full Document"
              : "No Document Available"}
          </Button>
        </div>
      );
    }

    if (searchValue.trim() !== "") {
      return (
        <div className="flex flex-col bg-white rounded-lg shadow-md p-4 border border-gray-100 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Search Results
          </h2>
          {isSearching ? (
            <p>Searching...</p>
          ) : searchResults.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {searchResults.map((project) => (
                <li
                  key={project.id}
                  className="py-4 cursor-pointer hover:bg-gray-50 px-2 rounded-md"
                  onClick={() => handleSelectProject(project)}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {project.abstract_snippet}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No results found.</p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-row gap-4 min-h-0">
        <div className="flex-1 flex flex-col rounded-lg bg-white shadow-md p-4 border border-gray-50 min-h-0 ">
          <div className="flex justify-between items-center w-full mb-2 p-4">
            <h2 className="text-xl font-bold text-gray-800">
              Your Suggestion Log
            </h2>
            <Link
              href="/adviser/suggest-ideas"
              className="bg-red-900 text-white text-sm font-semibold px-4 py-1 rounded-md shadow hover:scale-115 transition-transform duration-200 ease-in-out"
            >
              See More
            </Link>
          </div>
          <div className="overflow-y-auto flex-1">
            <AdviserSuggestionLog />
          </div>
        </div>

        <div className="flex-1 flex flex-col rounded-lg bg-white shadow-md p-4 border border-gray-50 min-h-0">
          <div className="flex justify-between items-center w-full mb-2 p-4">
            <h2 className="text-xl font-bold text-gray-800">
              Your Project Advisory
            </h2>
            <Link
              href="/adviser/projects"
              className="bg-red-900 text-white text-sm font-semibold px-4 py-1 rounded-md shadow hover:scale-115 transition-transform duration-200 ease-in-out"
            >
              See More
            </Link>
          </div>
          <div className="overflow-y-auto flex-1">
            <AdviserProjectAdvisory />
          </div>
        </div>

        <AdviserOverviewData />
      </div>
    );
  };

  return (
    <main className="flex h-full flex-col p-2 pt-2 sm:p-2 lg:p-4 lg:pt-0">
      <div className="flex flex-1 flex-col h-full">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputWithClear
            type="search"
            placeholder="Search capstone projects app-wide..."
            className="w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={handleClearAll}
          />
          <Calendar22 />
        </div>

        {renderContent()}
      </div>
    </main>
  );
}
