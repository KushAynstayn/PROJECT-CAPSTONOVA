"use client";

import React, { useState } from "react";

import { InputWithClear } from "@/components/ui/inputWithClear";
import { Calendar22 } from "@/components/ui/date-picker";
import AdviserSuggestionLog from "@/components/adviser/adviser-suggestion-log";
import AdviserProjectAdvisory from "@/components/adviser/adviser-project-advisory";
import { ViewFullDocument } from "@/data/view-full-document";

// Import mock projects
import { mockProjects, Project } from "@/data/adviser-search";

export default function AdviserDashboardPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFullDocument, setShowFullDocument] = useState(false);

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      project.proponents.toLowerCase().includes(searchValue.toLowerCase()) ||
      project.adviser.toLowerCase().includes(searchValue.toLowerCase())
  );

  const showSearchResults = searchValue.trim() !== "" && !selectedProject;

  // A single function to reset everything back to dashboard
  const handleClearAll = () => {
    setSearchValue("");
    setSelectedProject(null);
    setShowFullDocument(false); // Make sure to reset this state too
  };

  return (
    <main className="flex h-full flex-col p-2 pt-2 sm:p-2 lg:p-4 lg:pt-0">
      {" "}
      {/* Changed min-h-screen to h-screen */}
      <div className="flex flex-1 flex-col h-full">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>

        {/**Search and year picker**/}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputWithClear
            type="search"
            placeholder="Search more capstone projects here"
            className="w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={handleClearAll}
          />
          <Calendar22 />
        </div>

        {showFullDocument ? (
          /** Full Document View **/
          <div className="flex flex-col p-0 relative h-full overflow-y-auto">
            {/* Close Button for Full Document View */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-700 font-bold"
              onClick={handleClearAll}
            >
              ✕
            </button>
            <ViewFullDocument />
          </div>
        ) : selectedProject ? (
          /** Project Detail Container **/
          <div className="flex flex-col bg-white rounded-lg shadow-md p-6 border border-gray-200 relative overflow-y-auto">
            {/* Close Button for Project Details */}
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
                <span className="font-medium">Proponents:</span>{" "}
                {selectedProject.proponents}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Adviser:</span>{" "}
                {selectedProject.adviser}
              </p>
              <p className="text-sm text-gray-500">
                Date Published: {selectedProject.date}
              </p>
            </div>

            <button
              className="bg-red-900 text-white w-80 px-6 py-2 rounded-md shadow hover:scale-105 transition-transform duration-200"
              onClick={() => setShowFullDocument(true)}
            >
              View Full Document
            </button>
          </div>
        ) : showSearchResults ? (
          /** Search Results Container **/
          <div className="flex flex-col bg-white rounded-lg shadow-md p-4 border border-gray-100 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Search Results
            </h2>
            {filteredProjects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredProjects.map((project, index) => (
                  <li
                    key={index}
                    className="py-4 cursor-pointer hover:bg-gray-50 px-2 rounded-md"
                    onClick={() => setSelectedProject(project)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Proponents:</span>{" "}
                      {project.proponents}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Adviser:</span>{" "}
                      {project.adviser}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date Published: {project.date}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Result not found.</p>
            )}
          </div>
        ) : (
          /** Original Dashboard Content **/
          <div className="flex flex-1 flex-row gap-4 min-h-0">
            {/**Division 1**/}
            <div className="flex-1 flex flex-col rounded-lg bg-white shadow-md p-4 border border-gray-50 min-h-0 ">
              <div className="flex justify-between items-center w-full mb-2 p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Your Suggestion Log
                </h2>
                <button className="bg-red-900 text-white text-sm font-semibold px-4 py-1 rounded-md shadow hover:scale-115 transition-transform duration-200 ease-in-out">
                  See More
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <AdviserSuggestionLog />
              </div>
            </div>

            {/**Division 2**/}
            <div className="flex-1 flex flex-col rounded-lg bg-white shadow-md p-4 border border-gray-50 min-h-0">
              <div className="flex justify-between items-center w-full mb-2 p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Your Project Advisory
                </h2>
                <button className="bg-red-900 text-white text-sm font-semibold px-4 py-1 rounded-md shadow hover:scale-115 transition-transform duration-200 ease-in-out">
                  See More
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <AdviserProjectAdvisory />
              </div>
            </div>

            {/**Division 3**/}
            <div className="flex-1 flex flex-col rounded-lg bg-white shadow-md p-4 border border-gray-50 min-h-0 gap-4">
              <div className="flex justify-between items-center w-full mb-2 p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Your Overview Data
                </h2>
                <button className="bg-red-900 text-white text-sm font-semibold px-4 py-1 rounded-md shadow hover:scale-115 transition-transform duration-200 ease-in-out">
                  See More
                </button>
              </div>

              {/* The three overview boxes, adjusted for flex-1 */}
              <div className="flex-1 flex flex-col gap-4 p-4 pl-10 bg-gray-100 rounded-md justify-center items-center">
                <div className="flex flex-row ">
                  <img src="/images/advisees.png" className="w-5 h-5" />
                  <h3 className="text-1xl pl-5 font-semibold text-gray-800">
                    Advisees
                  </h3>
                </div>
                <div className="justify-center">
                  <h1 className="text-4xl font-semibold text-gray-800">20</h1>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 p-4 pl-10 bg-gray-100 rounded-md justify-center items-center">
                <div className="flex flex-row ">
                  <img src="/images/suggestion-log.png" className="w-5 h-5" />
                  <h3 className="text-1xl pl-5 font-semibold text-gray-800">
                    Suggestion Log
                  </h3>
                </div>
                <div className="justify-center">
                  <h1 className="text-4xl font-semibold text-gray-800">20</h1>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 p-4 pl-10 bg-gray-100 rounded-md justify-center items-center">
                <div className="flex flex-row ">
                  <img src="/images/project-advisory.png" className="w-5 h-5" />
                  <h3 className="text-1xl pl-5 font-semibold text-gray-800">
                    Project Advisory
                  </h3>
                </div>
                <div className="justify-center">
                  <h1 className="text-4xl font-semibold text-gray-800">20</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
