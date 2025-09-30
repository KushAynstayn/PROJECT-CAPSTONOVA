"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import { Badge } from "@/components/ui/badge";
import { apiCall, ApiError } from "@/lib/api";
import { authStore } from "@/lib/auth";
import { User, Tag, Code, Info, Users } from "lucide-react";

// Define the detailed project structure based on the controller's response
interface ProjectDetails {
  id: number;
  title: string;
  abstract: string;
  submission_date: string;
  submission_year: number;
  platform_type: string;
  is_archived: boolean;
  adviser: string | null;
  team_roles: {
    leader: string | null;
    hacker: string | null;
    hipster1: string | null;
    hipster2: string | null;
  };
  keyword_tags: string[];
  language_tags: string[];
}

// Loading Skeleton Component
function ProjectDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 bg-gray-700 rounded w-3/4 mb-6"></div>
      <div className="h-4 bg-gray-700 rounded w-1/3 mb-10"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-600 rounded w-full"></div>
        </div>
        <div className="space-y-6">
          <div className="h-12 bg-gray-700 rounded-lg w-full mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-full"></div>
          <div className="h-8 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

// Main component to fetch and display project details
function ProjectDetailsContent({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (!id) return;
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiCall(`/public/project/${id}`);
        setProject(data);
      } catch (e) {
        setError(
          e instanceof ApiError
            ? `Error: ${e.message}`
            : "Failed to load project details."
        );
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  const handleRequestAccess = async () => {
    if (!authStore.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const user = authStore.getUser();
    if (user?.role.toLowerCase() !== "viewer") {
      router.push("/login");
      return;
    }

    setRequestStatus("pending");
    try {
      await apiCall(`/viewer/request-project/${id}`, "POST");
      setRequestStatus("success");
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setRequestStatus("error");
      } else {
        setRequestStatus("error");
      }
    }
  };

  if (loading) return <ProjectDetailSkeleton />;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!project)
    return (
      <div className="text-center py-20 text-gray-400">Project not found.</div>
    );

  const teamMembers = Object.entries(project.team_roles).filter(
    ([, name]) => name
  );

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Main Content: Title, Abstract, etc. */}
          <main className="lg:col-span-2 bg-stone-900/50 p-8 rounded-lg">
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              {project.title}
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Submitted in {project.submission_year}
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-yellow-500/30 pb-2">
              Abstract
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {project.abstract}
            </p>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Tag size={20} /> Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.keyword_tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-700 text-gray-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Code size={20} /> Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.language_tags.map((tag) => (
                  <Badge key={tag} className="bg-blue-800 text-blue-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar: Details and Actions */}
          <aside className="space-y-8">
            <button
              onClick={handleRequestAccess}
              disabled={
                requestStatus === "pending" || requestStatus === "success"
              }
              className="w-full bg-yellow-600 text-black font-bold h-12 py-2 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {requestStatus === "idle" && "VIEW FULL DOCUMENT"}
              {requestStatus === "pending" && "SUBMITTING REQUEST..."}
              {requestStatus === "success" && "REQUEST SUBMITTED!"}
              {requestStatus === "error" && "ALREADY REQUESTED"}
            </button>

            <div className="bg-stone-900/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={20} /> Team Members
              </h3>
              <ul className="space-y-2 text-gray-300">
                {teamMembers.map(([role, name]) => (
                  <li key={role}>
                    <span className="capitalize font-semibold">{role}:</span>{" "}
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-900/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User size={20} /> Adviser
              </h3>
              <p className="text-gray-300">{project.adviser || "N/A"}</p>
            </div>

            <div className="bg-stone-900/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info size={20} /> Details
              </h3>
              <p className="text-gray-300">
                <strong>Platform:</strong> {project.platform_type}
              </p>
              <p className="text-gray-300">
                <strong>Submitted:</strong>{" "}
                {new Date(project.submission_date).toLocaleDateString()}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

// Page component
export default function AbstractPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <main className="pt-16">
        <Suspense fallback={<ProjectDetailSkeleton />}>
          <ProjectDetailsContent id={id} />
        </Suspense>
      </main>
    </div>
  );
}
