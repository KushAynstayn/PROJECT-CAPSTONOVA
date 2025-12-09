// src/components/ui/features-carousel-3d.tsx
// [MODIFIED FILE]
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Define the shape based on your JSON data
interface Project {
  project_id: number;
  title: string;
  abstract: string;
  date_published: string;
  platform_type: string | null; // Can be null or comma-separated string
  adviser_name: string;
  members: string[];
  panel: string[];
}

interface FeaturesCarousel3DProps {
  projects: Project[]; // The component expects the array from the 'data' key of your JSON
}

export default function FeaturesCarousel3D({
  projects = [],
}: FeaturesCarousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate effect
  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [activeIndex, projects.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // --- THE FIX: Tag Parsing Logic ---
  const getDisplayPlatform = (platform: string | null | undefined) => {
    if (!platform || !platform.trim()) {
      return "Others";
    }
    // Split by comma, take the first one, and trim whitespace
    const firstTag = platform.split(",")[0].trim();

    // If the result is still empty (e.g. input was just ","), fallback to Others
    return firstTag || "Others";
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No featured projects available.
      </div>
    );
  }

  // Calculate indices for 3D effect
  const getSlideStyles = (index: number) => {
    const total = projects.length;
    // Calculate distance from active index, handling wrap-around
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;

    const isActive = diff === 0;
    const isPrev = diff === -1;
    const isNext = diff === 1;

    // Default hidden style
    let style = {
      x: 0,
      scale: 0.8,
      opacity: 0,
      zIndex: 0,
      rotateY: 0,
      display: "none", // Hide non-adjacent slides for performance/cleanliness
    };

    if (isActive) {
      style = {
        x: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        rotateY: 0,
        display: "block",
      };
    } else if (isPrev) {
      style = {
        x: -250, // Move left
        scale: 0.85,
        opacity: 0.6,
        zIndex: 5,
        rotateY: 15, // Tilt inward
        display: "block",
      };
    } else if (isNext) {
      style = {
        x: 250, // Move right
        scale: 0.85,
        opacity: 0.6,
        zIndex: 5,
        rotateY: -15, // Tilt inward
        display: "block",
      };
    }

    return style;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[500px] flex items-center justify-center perspective-1000">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden py-10">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            const styles = getSlideStyles(index);

            // Only render if visible (Active, Prev, or Next)
            if (styles.display === "none") return null;

            return (
              <motion.div
                key={project.project_id}
                className="absolute bg-neutral-900 border border-yellow-500/30 rounded-xl overflow-hidden shadow-2xl shadow-yellow-500/10 w-[350px] md:w-[450px] h-[400px] flex flex-col"
                initial={false}
                animate={{
                  x: styles.x,
                  scale: styles.scale,
                  opacity: styles.opacity,
                  zIndex: styles.zIndex,
                  rotateY: styles.rotateY,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Card Header with Tag */}
                <div className="p-6 pb-2 border-b border-neutral-800">
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant="outline"
                      className="bg-yellow-500/10 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/20"
                    >
                      {/* APPLYING THE FIX HERE */}
                      {getDisplayPlatform(project.platform_type)}
                    </Badge>
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(project.date_published).getFullYear()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                    {project.title}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-400 line-clamp-4 mb-4 italic">
                      "{project.abstract}"
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        <span className="text-neutral-400 font-semibold">
                          Adviser:
                        </span>{" "}
                        {project.adviser_name}
                      </p>
                      {project.members && project.members.length > 0 && (
                        <p>
                          <span className="text-neutral-400 font-semibold">
                            Team:
                          </span>{" "}
                          {project.members[0]}{" "}
                          {project.members.length > 1
                            ? `+${project.members.length - 1} others`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link href={`/abstract/${project.project_id}`}>
                      <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold transition-all duration-300">
                        View Project <ExternalLink size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all z-20"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all z-20"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
