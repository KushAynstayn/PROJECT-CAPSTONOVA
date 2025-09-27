"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { mockProjects, type Project } from "@/data/viewer-abstract-data";

// --- Reusable Icon Component ---
const CheckCircleIcon = () => (
    <svg
        className="w-8 h-8 text-blue-600 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
        ></path>
    </svg>
);

// --- Reusable SearchBar Component ---
const SearchBar = ({
    onSearch,
    initialValue = "",
}: {
    onSearch: (query: string) => void;
    initialValue?: string;
}) => {
    const [query, setQuery] = React.useState(initialValue);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };
    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a topic or project title..."
                    className="w-full py-1 pl-6 pr-20 text-lg text-gray-900 bg-white placeholder:text-gray-500 border-2 border-yellow-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-14 flex items-center text-gray-500 hover:text-gray-900"
                        aria-label="Clear search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-700 hover:text-yellow-800"
                    aria-label="Search"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </form>
    );
};

// --- Main Page Component ---
const ViewProjectsPage = ({ params }: { params: { id: string } }) => {
    const [filteredProjects, setFilteredProjects] = React.useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const router = useRouter();

    React.useEffect(() => {
        const currentSearchTerm = params.id ? decodeURIComponent(params.id) : "";
        const effectiveSearchTerm = currentSearchTerm === 'all' ? '' : currentSearchTerm;

        setSearchTerm(effectiveSearchTerm);

        if (effectiveSearchTerm) {
            const lowercasedTerm = effectiveSearchTerm.toLowerCase();
            const results = mockProjects.filter(
                (project) =>
                    project.category.toLowerCase().includes(lowercasedTerm) ||
                    project.title.toLowerCase().includes(lowercasedTerm) ||
                    project.proponents.toLowerCase().includes(lowercasedTerm) ||
                    project.adviser.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredProjects(results);
        } else {
            setFilteredProjects(mockProjects);
        }
    }, [params.id]);

    const handleNewSearch = (newQuery: string) => {
        const route = newQuery ? `/projects/${encodeURIComponent(newQuery)}` : '/projects/all';
        router.push(route);
    };

    const handleViewAbstract = (projectId: string) => {
        // Navigate to the dedicated abstract page
        router.push(`/abstract/${projectId}`);
    };

    return (
        <>
            <style>{`
                .fading-scrollbar::-webkit-scrollbar { width: 8px; }
                .fading-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .fading-scrollbar::-webkit-scrollbar-thumb { background-color: transparent; border-radius: 20px; border: 3px solid transparent; }
                .fading-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4a5568; }
                .fading-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2d3748; }
            `}</style>
            <div className="p-4 bg-black h-screen text-white flex flex-col">
                <header className="p-4 px-8 mt-18 border-b border-gray-800 bg-black">
                    <div className="max-w-7xl mx-auto flex items-center gap-6">
                        <div className="w-full max-w-2xl">
                            <SearchBar onSearch={handleNewSearch} initialValue={searchTerm} />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 fading-scrollbar">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-200 mb-6 capitalize">
                            {searchTerm
                                ? `${filteredProjects.length} Projects Found for "${searchTerm}"`
                                : "All Projects"}
                        </h2>

                        {filteredProjects.length > 0 ? (
                            <div className="space-y-4">
                                {filteredProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        // CHANGED: This now navigates to a new page
                                        onClick={() => handleViewAbstract(project.id.toString())}
                                        className="bg-white rounded-lg p-4 border border-gray-700 flex items-center gap-4 hover:shadow-lg hover:scale-[1.01] transform transition-all duration-300 cursor-pointer"
                                    >
                                        <CheckCircleIcon />
                                        <div className="flex-grow">
                                            <p className="text-md font-bold text-gray-900 uppercase">
                                                {project.title}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Proponents: {project.proponents} | Adviser:{" "}
                                                {project.adviser}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium ml-4 whitespace-nowrap text-right">
                                            <p className="text-xs text-gray-600">Date Published: </p>
                                            {new Date(project.datePublished).toLocaleDateString(
                                                "en-US",
                                                { month: "short", day: "numeric", year: "numeric" }
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6">
                                <h3 className="text-2xl text-white font-semibold">
                                    No Projects Found
                                </h3>
                                <p className="text-gray-400 mt-2">
                                    We couldn't find any projects matching your search.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default ViewProjectsPage;