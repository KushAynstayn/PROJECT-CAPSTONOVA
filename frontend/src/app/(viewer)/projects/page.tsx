"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, ReadonlyURLSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/ui/header";
import { apiCall, ApiError } from "@/lib/api";
import { SearchX } from "lucide-react";

// Define the structure of a project
interface Project {
  id: number;
  title: string;
  abstract_snippet: string;
  submission_year: number;
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

// ActiveFiltersDisplay component
function ActiveFiltersDisplay({ params }: { params: ReadonlyURLSearchParams }) {
  if (params.toString() === "") {
    return null;
  }
  const filters = new Map<string, string[]>();
  params.forEach((value, key) => {
    const cleanKey = key.replace("[]", "");
    if (filters.has(cleanKey)) {
      filters.get(cleanKey)!.push(value);
    } else {
      filters.set(cleanKey, [value]);
    }
  });
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

// Updated ProjectCard with enhanced hover effect
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

function SearchResults() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiCall(
          `/public/search?${searchParams.toString()}`
        );
        setProjects(result.data);
      } catch (e) {
        setError(
          e instanceof ApiError ? e.message : "An unexpected error occurred."
        );
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        Search Results
      </h1>
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
