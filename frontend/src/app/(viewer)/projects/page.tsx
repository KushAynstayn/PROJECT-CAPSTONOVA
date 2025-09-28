"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, ReadonlyURLSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { apiCall, ApiError } from "@/lib/api";

// Define the structure of a project based on your backend's transformed response
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

// A component to display the active search filters
function ActiveFiltersDisplay({ params }: { params: ReadonlyURLSearchParams }) {
  if (params.toString() === "") {
    return null; // Don't render anything if there are no search params
  }

  const filters = new Map<string, string[]>();

  params.forEach((value, key) => {
    const cleanKey = key.replace("[]", ""); // Group keys like 'authors[]' into 'authors'
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

// A component to display a single project card
function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="bg-neutral-900 border-yellow-500/30 text-white mb-4 h-full transform transition-all duration-300 hover:border-yellow-400 hover:scale-[1.02]">
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
        <p className="text-gray-300 mb-4">{project.abstract_snippet}</p>
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

// The main search results component
function SearchResults() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      const queryString = searchParams.toString();

      try {
        const result = await apiCall(`/public/search?${queryString}`);
        setProjects(result.data); // Data is under the 'data' key for paginated responses
      } catch (e) {
        if (e instanceof ApiError) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred.");
        }
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
        <p className="text-center text-gray-300">Loading projects...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && projects.length === 0 && (
        <p className="text-center text-gray-400">
          No projects found matching your criteria.
        </p>
      )}
      {!loading && !error && projects.length > 0 && (
        <div>
          {projects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// The page component that wraps the results in a Suspense boundary
export default function ProjectsPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <main className="pt-20">
        <Suspense
          fallback={<div className="text-center p-8">Loading search...</div>}
        >
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
