"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ScrambleTitle } from "@/components/ui/scramble-title";
import { apiCall, ApiError } from "@/lib/api";
import Link from "next/link";

export interface CapstoneProject {
  id: string;
  title: string;
  proponents: string[];
  adviser: string;
  dateSubmitted: string;
  platform: string;
}

interface ApiProject {
  project_id: number;
  title: string;
  members: string[];
  adviser_name: string;
  date_published: string;
  platform_type: string;
}

interface ApiProjectResponse {
  data: ApiProject[];
  count: number;
}

const ProjectCard: React.FC<CapstoneProject> = ({
  id,
  title,
  proponents,
  adviser,
  dateSubmitted,
  platform,
}) => {
  const platformColor = useMemo(() => {
    const platformUpper = platform ? platform.toUpperCase() : "OTHER";
    switch (platformUpper) {
      case "WEB":
        return "border-blue-400 bg-blue-500/50 text-blue-200";
      case "MOBILE":
        return "border-green-400 bg-green-500/50 text-green-200";
      case "DESKTOP":
        return "border-purple-400 bg-purple-500/50 text-purple-200";
      default:
        return "border-gray-400 bg-gray-500/50 text-gray-200";
    }
  }, [platform]);

  return (
    <Link href={`/abstract/${id}`} className="group">
      <div
        className="flex h-[400px] w-[300px] flex-shrink-0 flex-col 
                     justify-between rounded-xl border border-amber-500/30 bg-black/30 
                     p-6 shadow-md shadow-amber-900/20 backdrop-blur-md
                     transition-all duration-300 
                     group-hover:scale-[1.02] 
                     group-hover:border-amber-500/60 
                     group-hover:shadow-amber-600/30 
                     md:w-[380px]"
      >
        <div>
          <div className="mb-3 flex items-start justify-between">
            <h3 className="pr-3 text-xl font-semibold text-amber-300">
              {title}
            </h3>
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${platformColor}`}
            >
              {platform}
            </span>
          </div>

          <p className="mb-4 h-16 overflow-hidden text-sm text-amber-100/70">
            <span className="font-semibold text-amber-100/90">
              Proponents:{" "}
            </span>
            {proponents.length > 0 ? proponents.join(", ") : "N/A"}
          </p>
        </div>

        <div className="space-y-2 border-t border-amber-600/20 pt-4 text-sm text-amber-100/80">
          <p>
            <span className="font-medium text-amber-100/90">Adviser: </span>
            {adviser}
          </p>
          <p>
            <span className="font-medium text-amber-100/90">Submitted: </span>
            {dateSubmitted}
          </p>
        </div>
      </div>
    </Link>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div
      className="flex h-[400px] w-[300px] flex-shrink-0 flex-col 
                   justify-between rounded-xl border border-amber-500/30 bg-black/30 
                   p-6 shadow-md shadow-amber-900/20 backdrop-blur-md 
                   md:w-[380px]"
    >
      <div className="animate-pulse">
        <div className="mb-3 flex items-start justify-between">
          <div className="h-6 w-3/4 rounded bg-gray-800"></div>
          <div className="h-5 w-16 rounded bg-gray-800"></div>
        </div>
        <div className="mb-4 h-16 space-y-2">
          <div className="h-4 w-full rounded bg-gray-800"></div>
          <div className="h-4 w-5/6 rounded bg-gray-800"></div>
        </div>
      </div>

      <div className="animate-pulse space-y-2 border-t border-amber-600/20 pt-4">
        <div className="h-4 w-1/2 rounded bg-gray-800"></div>
        <div className="h-4 w-1/3 rounded bg-gray-800"></div>
      </div>
    </div>
  );
};

export default function RealWorldSolutions() {
  const [projects, setProjects] = useState<CapstoneProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const responseData = (await apiCall(
          "/public/featured-projects",
          "GET"
        )) as ApiProjectResponse;

        if (!responseData || !Array.isArray(responseData.data)) {
          console.error("Unexpected API response structure:", responseData);
          throw new Error("Invalid data received from server.");
        }

        const formattedProjects = responseData.data.map(
          (item: ApiProject): CapstoneProject => {
            const formattedDate = new Date(
              item.date_published
            ).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            });

            const platformDisplay =
              item.platform_type && item.platform_type.trim() !== ""
                ? item.platform_type
                : "OTHER";

            return {
              id: String(item.project_id),
              title: item.title,
              proponents: item.members,
              adviser: item.adviser_name,
              dateSubmitted: formattedDate,
              platform: platformDisplay,
            };
          }
        );

        setProjects(formattedProjects);
      } catch (err) {
        console.error("Failed to fetch featured projects:", err);
        if (err instanceof ApiError) {
          setError(`Error ${err.status}: ${err.message}`);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching projects.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const duplicatedProjects = useMemo(() => {
    if (projects.length === 0) return [];
    return [...projects, ...projects];
  }, [projects]);

  if (isLoading) {
    return (
      <section
        className="relative mb-20 w-full overflow-hidden 
                        bg-gradient-to-b from-black via-gray-900/50 to-black py-20"
      >
        <div className="absolute inset-0 z-0">
          <div
            className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 
                        -translate-y-1/2 rounded-full bg-amber-600/20 
                        opacity-30 blur-[120px]"
          ></div>
        </div>

        <div className="relative z-10 mx-auto max-w-screen-xl px-4">
          <ScrambleTitle text="Real-World Solutions" />

          <div
            className="w-full overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <div className="flex w-max space-x-6 py-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="relative mb-20 w-full overflow-hidden 
                        bg-gradient-to-b from-black via-gray-900/50 to-black py-20"
      >
        <div className="relative z-10 mx-auto max-w-screen-xl px-4">
          <ScrambleTitle text="Real-World Solutions" />
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-lg text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0 && !isLoading) {
    return (
      <section
        className="relative mb-20 w-full overflow-hidden 
                        bg-gradient-to-b from-black via-gray-900/50 to-black py-20"
      >
        <div className="relative z-10 mx-auto max-w-screen-xl px-4">
          <ScrambleTitle text="Real-World Solutions" />
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-lg text-amber-300/70">
              No featured projects available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative mb-20 w-full overflow-hidden 
                      bg-gradient-to-b from-black via-gray-900/50 to-black py-20"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 
                      -translate-Y-1/2 rounded-full bg-amber-600/20 
                      opacity-30 blur-[120px]"
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl px-4">
        <ScrambleTitle text="Real-World Solutions" />

        <div
          className="w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .scrolling-wrapper {
              animation: scroll ${projects.length * 6.67}s linear infinite;
            }
            .scrolling-wrapper:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex w-max space-x-6 py-4 scrolling-wrapper">
            {duplicatedProjects.map((project, index) => (
              <ProjectCard key={`${project.id}-${index}`} {...project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
