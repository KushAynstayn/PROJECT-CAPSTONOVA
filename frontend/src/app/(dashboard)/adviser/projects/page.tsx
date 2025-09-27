"use client";

import React, { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";
import { authStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Loader, AlertCircle, ArrowLeft } from "lucide-react";
import ProjectItem from "@/components/adviser/adviser-project-item";
import PdfViewer from "@/components/ui/pdf-viewer";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  title: string;
  students: string[];
}

interface ProjectDetails extends Project {
  abstract: string;
  submission_date: string;
  manuscript_id: number | null;
}

// --- MAIN COMPONENT ---
const ProjectsPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(
    null
  );
  const [viewState, setViewState] = useState<"list" | "details" | "pdf">(
    "list"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (
        !authStore.isAuthenticated() ||
        authStore.getUser()?.role.toLowerCase() !== "adviser"
      ) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const data = await apiCall("/adviser/assigned-projects");
        setProjects(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleProjectClick = async (project: Project) => {
    try {
      setIsLoading(true);
      const details = await apiCall(`/public/project/${project.id}`);
      setSelectedProject({ ...details, students: project.students });
      setViewState("details");
    } catch (err: any) {
      setError(err.message || "Failed to fetch project details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setViewState("list");
  };

  const handleViewPdf = () => {
    if (selectedProject?.manuscript_id) {
      setViewState("pdf");
    }
  };

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-2">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        <AlertCircle className="h-8 w-8 mr-2" />
        <p>Error: {error}</p>
      </div>
    );
  }

  if (viewState === "pdf" && selectedProject) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b">
          <Button variant="ghost" onClick={() => setViewState("details")} className="absolute top-23 right-260 z-10" title="Project Details">
            <img src="/images/arrow.png" className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-grow">
          <PdfViewer
            url={`/user/stream/manuscript/${selectedProject.manuscript_id}`}
          />
        </div>
      </div>
    );
  }

  if (viewState === "details" && selectedProject) {
    return (
      <div className="p-4 md:p-8 overflow-y-auto">
        <Button
          variant="ghost"
          onClick={handleBackToList}
          className="absolute top-23 right-260 z-10"
          title="Project List"
        >
          <img src="/images/arrow.png" className="h-5 w-5" />
        </Button>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {selectedProject.title}
          </h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-2">
              Abstract
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {selectedProject.abstract}
            </p>
          </div>
          <div className="space-y-2 mb-6">
            <p className="text-sm">
              <span className="font-semibold">Proponents:</span>{" "}
              {selectedProject.students.join(", ")}
            </p>
            <p className="text-sm text-gray-500">
              Date Published:{" "}
              {new Date(selectedProject.submission_date).toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={handleViewPdf}
            disabled={!selectedProject.manuscript_id}
            className="bg-[#660000] text-white w-fit px-6 py-2 rounded-md shadow-md hover:bg-[#660000] hover:text-white hover:scale-105 hover:shadow-lg transition-transform duration-200"
          >
            {selectedProject.manuscript_id
              ? "View Full Document"
              : "No Document Available"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Projects</h1>
      <div className="space-y-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            You have no assigned projects.
          </p>
        )}
      </div>
    </main>
  );
};

export default ProjectsPage;
