"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockProjects, type Project } from "@/data/viewer-abstract-data";
import AuthModal from "@/components/viewer/viewer-auth-modal";

// --- SearchBar Component (No changes) ---
const SearchBar = ({ onSearch, initialValue = "" }: { onSearch: (query: string) => void; initialValue?: string; }) => {
  const [query, setQuery] = useState(initialValue);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSearch(query.trim()); };
  const handleClear = () => { setQuery(""); onSearch(""); };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a topic or project title..." className="w-full py-1 pl-6 pr-20 text-lg text-gray-900 bg-white placeholder:text-gray-500 border-2 border-yellow-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        {query && (<button type="button" onClick={handleClear} className="absolute inset-y-0 right-14 flex items-center text-gray-500 hover:text-gray-900" aria-label="Clear search"><svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>)}
        <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-700 hover:text-yellow-800" aria-label="Search"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
      </div>
    </form>
  );
};

// --- ViewAbstract Component (Page) ---
// 1. Destructure 'id' directly from params in the function signature
const ViewAbstract = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // 2. Use the destructured 'id' variable
    const foundProject = mockProjects.find((p) => p.id.toString() === id);
    setProject(foundProject || null);
  }, [id]); // 3. The dependency is now a safe primitive string

  const handleNewSearch = (newQuery: string) => {
    const route = newQuery
      ? `/projects/${encodeURIComponent(newQuery)}`
      : "/projects/all";
    router.push(route);
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Loading Project...</h1>
        <p className="text-gray-500 mt-2">
           If the project does not load, it may not exist.
        </p>
      </div>
    );
  }

  // Find similar studies from the same category
  const similarStudies = mockProjects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 5);

  return (
    <>
      <style>{`
        .fading-scrollbar::-webkit-scrollbar { width: 8px; }
        .fading-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .fading-scrollbar::-webkit-scrollbar-thumb { background-color: transparent; border-radius: 20px; border: 3px solid transparent; }
        .fading-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4a5568; }
        .fading-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2d3748; }
      `}</style>
      <div className="bg-gray min-h-screen text-black flex flex-col">
        <header className="px-8 mt-18 p-4 border-b border-gray-800 bg-black">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={handleNewSearch} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 max-w-10xl mt-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1 w-full lg:w-80 bg-stone-200 p-6 rounded-lg shadow-lg max-h-[700px]">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 uppercase border-b pb-4">
                {project.title}
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Abstract
              </h3>
              <div className="text-gray-700 leading-relaxed text-justify prose mb-6 border-b pb-4">
                <p>{project.abstract}</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Proponents:</strong> {project.proponents}
                </p>
                <p>
                  <strong>Adviser:</strong> {project.adviser}
                </p>
                <p>
                  <strong>Date Published:</strong>{" "}
                  {new Date(project.datePublished).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Panelists:</strong> {project.panelists}
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-orange-800 text-white text-sm h-12 w-full py-2 px-6 rounded-md shadow-md hover:bg-orange-700 transition-colors duration-300"
              >
                VIEW FULL DOCUMENT
              </button>
              <aside className="w-full lg:w-80 bg-stone-200 p-6 rounded-lg shadow-lg max-h-[500px] overflow-y-auto mt-10 fading-scrollbar">
                <h3 className="text-lg font-bold text-gray-800 mb-4 mt-2">
                  Similar Studies
                </h3>
                <ul className="space-y-3">
                  {mockProjects && mockProjects.length > 0 ? (
                    mockProjects
                      .filter((study) => study.id !== project.id)
                      .slice(0, 20)
                      .map((study) => (
                        <li key={study.id}>
                          <a
                            href="#"
                            className="text-blue-600 hover:underline text-sm block"
                          >
                            {study.title}
                          </a>
                        </li>
                      ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No similar studies found.
                    </p>
                  )}
                </ul>
              </aside>
            </div>
          </div>
        </main>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </div>
    </>
  );
};

export default ViewAbstract;