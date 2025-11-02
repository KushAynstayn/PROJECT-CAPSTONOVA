"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  useSearchParams,
  ReadonlyURLSearchParams,
  useRouter,
} from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/ui/header";
import { apiCall, ApiError } from "@/lib/api";
import { SearchX, ChevronLeft, ChevronRight, Search } from "lucide-react"; // Added Search
import { cn } from "@/lib/utils";
import { AdvancedSearchModal } from "@/components/ui/advanced-search-modal"; // Added modal import

// Define the structure of a project and pagination
interface Project {
  id: number;
  title: string;
  abstract_snippet: string;
  submission_year: string;
  platform_type: string;
  adviser_name: string | null;
  keyword_tags: string[];
  language_tags: string[];
  team_roles: {
    leader: string | null;
    hacker: string | null;
    hipster1: string | null;
    hipster2: string | null;
  };
}

interface PaginationInfo {
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

// New component for the loading skeleton
function SkeletonCard() {
  return (
    <div className="bg-neutral-900/80 border border-yellow-500/20 p-6 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
      <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-600 rounded w-5/6 mb-4"></div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
        <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
}

// ActiveFiltersDisplay component (no changes)
function ActiveFiltersDisplay({ params }: { params: ReadonlyURLSearchParams }) {
  if (params.toString() === "") {
    return null;
  }
  const filters = new Map<string, string[]>();
  params.forEach((value, key) => {
    // Ignore pagination param for display
    if (key === "page") return;
    const cleanKey = key.replace("[]", "");
    if (filters.has(cleanKey)) {
      filters.get(cleanKey)!.push(value);
    } else {
      filters.set(cleanKey, [value]);
    }
  });

  if (filters.size === 0) return null;

  const formatKey = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  return (
    <div className="mb-6 p-4 border border-yellow-500/30 rounded-lg bg-neutral-900/50">
      <h2 className="text-md font-semibold text-yellow-400 mb-3">
        Applied Filters:
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {Array.from(filters.entries()).map(([key, values]) => (
          <div key={key} className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-gray-300">
              {formatKey(key)}:
            </span>
            <span className="text-yellow-200">{values.join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ProjectCard (no changes)
function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="bg-neutral-900 border-yellow-500/30 text-white h-full transform transition-all duration-300 hover:border-yellow-400 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
      <CardHeader>
        <CardTitle className="text-yellow-400 text-lg">
          {project.title}
        </CardTitle>
        <p className="text-sm text-gray-400">
          {project.adviser_name} • {project.submission_year} •{" "}
          {project.platform_type}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4 line-clamp-3">
          {project.abstract_snippet}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.keyword_tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gray-700 text-gray-200"
            >
              {tag}
            </Badge>
          ))}
          {project.language_tags.map((tag, index) => (
            <Badge key={index} className="bg-blue-800 text-blue-200">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Pagination Component (no changes)
function PaginationControls({
  pagination,
  onPageChange,
}: {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}) {
  const { current_page, last_page, from, to, total } = pagination;

  const handlePrev = () => {
    if (current_page > 1) {
      onPageChange(current_page - 1);
    }
  };

  const handleNext = () => {
    if (current_page < last_page) {
      onPageChange(current_page + 1);
    }
  };

  // Don't show anything if there are no results
  if (total === 0) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
      {/* "Showing X to Y of Z results" label */}
      <div className="text-sm text-gray-400">
        Showing <span className="font-medium text-yellow-200">{from}</span> to{" "}
        <span className="font-medium text-yellow-200">{to}</span> of{" "}
        <span className="font-medium text-yellow-200">{total}</span> results
      </div>

      {/* Pagination buttons - only show if there's more than one page */}
      {last_page > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={current_page === 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-800 text-white border border-yellow-500/50",
              "hover:bg-yellow-500/20 hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            )}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <span className="text-sm text-gray-300">
            Page {current_page} of {last_page}
          </span>

          <button
            onClick={handleNext}
            disabled={current_page === last_page}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-800 text-white border border-yellow-500/50",
              "hover:bg-yellow-500/20 hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            )}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // [NEW] State for the simple search bar
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // [NEW] Effect to sync search bar with URL 'q' param
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiCall(
          `/public/search?${searchParams.toString()}`
        );
        setProjects(result.data || []);
        const paginationData: PaginationInfo = {
          current_page: result.current_page,
          last_page: result.last_page,
          total: result.total,
          from: result.from,
          to: result.to,
        };
        if (paginationData.total !== undefined && paginationData.total > 0) {
          setPagination(paginationData);
        } else if (result.data && result.data.length > 0) {
          const total = result.data.length;
          setPagination({
            current_page: 1,
            last_page: 1,
            total: total,
            from: 1,
            to: total,
          });
        } else {
          setPagination(null);
        }
      } catch (e) {
        setError(
          e instanceof ApiError ? e.message : "An unexpected error occurred."
        );
        setProjects([]);
        setPagination(null);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());
    window.scrollTo(0, 0);
    router.push(`?${newParams.toString()}`);
  };

  // [NEW] Handle simple search submission
  const handleSimpleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      newParams.set("q", trimmedSearch);
    } else {
      newParams.delete("q"); // Remove 'q' if search is cleared
    }

    newParams.delete("page"); // Reset to page 1
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        Search Results
      </h1>

      {/* [NEW] Search Bar and Advanced Search Button */}
      <div className="mb-6 p-4 border border-yellow-500/30 rounded-lg bg-neutral-900/50">
        <form onSubmit={handleSimpleSearch} className="w-full">
          <div className="relative search-wrapper">
            <input
              type="text"
              placeholder="Enter title or abstract phrase to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-6 pr-16 text-lg text-gray-900 bg-white placeholder:text-gray-500 rounded-full focus:outline-none"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-700 hover:text-yellow-800"
              aria-label="Search"
            >
              <Search size={24} />
            </button>
          </div>
        </form>
        <div className="mt-4 flex justify-center">
          <AdvancedSearchModal>
            <button
              type="button"
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Advanced Search
            </button>
          </AdvancedSearchModal>
        </div>
      </div>

      <ActiveFiltersDisplay params={searchParams} />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-500 py-10">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <SearchX className="mx-auto h-16 w-16 text-yellow-500/50 mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            No Projects Found
          </h2>
          <p>
            Your search did not match any projects. Try adjusting your filters.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link
                href={`/abstract/${project.id}`}
                key={project.id}
                className="block"
              >
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
          {pagination && (
            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <main className="pt-20">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}
