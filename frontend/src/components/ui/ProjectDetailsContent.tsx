// components/ProjectDetailsContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { apiCall, ApiError } from "@/lib/api";
import { authStore } from "@/lib/auth";
import {
  User,
  Tag,
  Code,
  Info,
  Users,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";
import PdfViewer from "@/components/ui/pdf-viewer-dynamic";
import RelatedStudies from "@/components/viewer/RelatedStudies";

// (Interface and Skeleton component are unchanged)
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
  panel_members: {
    panelist1: string | null;
    panelist2: string | null;
    panelist3: string | null;
  } | null;
  keyword_tags: string[];
  language_tags: string[];
  manuscript_id: number | null;
}

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

// Main component
export default function ProjectDetailsContent({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true); // For main project data
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [showPdf, setShowPdf] = useState(false);

  // State for abstract permission
  const [abstractPermission, setAbstractPermission] = useState<
    "checking" | "allowed" | "denied"
  >("checking");

  // State for request access permission
  const [requestPermission, setRequestPermission] = useState<
    "checking" | "allowed" | "denied"
  >("checking");

  // This useEffect fetches the main project data
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

  // This useEffect checks BOTH permissions in parallel
  useEffect(() => {
    const checkPermissions = async () => {
      setAbstractPermission("checking");
      setRequestPermission("checking");

      try {
        // Run both API calls in parallel for efficiency
        const [abstractSetting, requestSetting] = await Promise.all([
          apiCall(
            "/public/system-settings/check?setting_name=viewer_viewAbstract",
            "GET"
          ),
          apiCall(
            "/public/system-settings/check?setting_name=viewer_requestFullAccess",
            "GET"
          ),
        ]);

        // Set abstract permission
        if (abstractSetting && abstractSetting.is_enabled === true) {
          setAbstractPermission("allowed");
        } else {
          setAbstractPermission("denied");
        }

        // Set request permission
        if (requestSetting && requestSetting.is_enabled === true) {
          setRequestPermission("allowed");
        } else {
          setRequestPermission("denied");
        }
      } catch (settingError) {
        console.error("Failed to check settings:", settingError);
        // Fail-safe: deny both if API call fails
        setAbstractPermission("denied");
        setRequestPermission("denied");
      }
    };

    checkPermissions();
  }, []); // Runs once on component mount

  const handleRequestAccess = async () => {
    // Guard clause: Check permission before doing anything
    if (requestPermission !== "allowed") {
      console.warn("Request access attempted but permission is denied.");
      return;
    }

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
      if (err instanceof ApiError && err.status === 409) {
        setShowPdf(true);
      } else {
        setRequestStatus("error");
      }
    }
  };

  useEffect(() => {
    if (showPdf) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPdf]);

  // Main page loading skeleton
  if (loading) return <ProjectDetailSkeleton />;
  // Main page error
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  // Main page not found
  if (!project)
    return (
      <div className="text-center py-20 text-gray-400">Project not found.</div>
    );

  const teamMembers = Object.entries(project.team_roles).filter(
    ([, name]) => name
  );

  const panelMembers = project.panel_members
    ? Object.entries(project.panel_members).filter(([, name]) => name)
    : [];

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 lg:items-start">
          <main className="lg:col-span-2 bg-stone-900/50 p-8 rounded-lg">
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              {project.title}
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Submitted in {project.submission_year}
            </p>

            {/* Abstract Section (modified) */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-yellow-500/30 pb-2">
                Abstract
              </h2>

              {abstractPermission === "checking" && (
                <div className="flex items-center justify-center h-20 text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}

              {abstractPermission === "denied" && (
                <div className="rounded-md border border-yellow-700 bg-yellow-900/30 p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <AlertCircle className="h-6 w-6 text-yellow-400" />
                    <h3 className="text-lg font-bold text-yellow-300">
                      Feature Disabled
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-yellow-500">
                    Viewing abstracts is currently disabled by the
                    administrator.
                  </p>
                </div>
              )}

              {abstractPermission === "allowed" && (
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {project.abstract}
                </p>
              )}
            </div>

            {/* (Rest of <main> is unchanged) */}
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

            <RelatedStudies projectId={id} />
          </main>

          <aside className="space-y-8">
            {/* --- MODIFIED: Request Access Button --- */}
            <button
              onClick={handleRequestAccess}
              disabled={
                requestPermission !== "allowed" || // Disabled if checking or denied
                requestStatus === "pending" ||
                requestStatus === "success"
              }
              className="w-full bg-yellow-600 text-black font-bold h-12 py-2 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {requestPermission === "checking" && "CHECKING PERMISSIONS..."}
              {requestPermission === "denied" && "REQUESTS DISABLED"}
              {requestPermission === "allowed" &&
                requestStatus === "idle" &&
                "VIEW FULL DOCUMENT"}
              {requestPermission === "allowed" &&
                requestStatus === "pending" &&
                "SUBMITTING REQUEST..."}
              {requestPermission === "allowed" &&
                requestStatus === "success" &&
                "REQUEST SUBMITTED!"}
              {requestPermission === "allowed" &&
                requestStatus === "error" &&
                "REQUEST FAILED, TRY AGAIN"}
            </button>
            {/* --- END OF MODIFICATION --- */}

            {/* (Rest of <aside> is unchanged) */}
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

            {panelMembers.length > 0 && (
              <div className="bg-stone-900/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield size={20} /> Panel Members
                </h3>
                <ul className="space-y-2 text-gray-300">
                  {panelMembers.map(([role, name]) => (
                    <li key={role}>
                      <span className="capitalize font-semibold">
                        {role.replace("panelist", "Panelist ")}:
                      </span>{" "}
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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

      {/* (PDF Modal is unchanged) */}
      {showPdf && project.manuscript_id && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
          onClick={() => setShowPdf(false)}
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
                onClick={() => setShowPdf(false)}
                className="text-neutral-400 hover:text-white text-3xl"
              >
                &times;
              </button>
            </div>
            <div className="w-full h-full bg-neutral-900 p-2 md:p-4 overflow-y-auto">
              <PdfViewer url={`/user/stream/acm/${project.manuscript_id}`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
