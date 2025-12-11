"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Types for Projects (Preserved for existing usage) ---
interface Project {
  project_id: number;
  title: string;
  abstract: string;
  date_published: string;
  platform_type: string | null;
  adviser_name: string;
  members: string[];
  panel: string[];
}

// --- Types for Features (Added for About Page) ---
interface Feature {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
}

// --- Combined Props: Accepts either projects OR features ---
interface FeaturesCarousel3DProps {
  projects?: Project[];
  features?: Feature[];
}

export default function FeaturesCarousel3D({
  projects = [],
  features = [],
}: FeaturesCarousel3DProps) {
  // Determine mode based on props
  const isFeatureMode = features && features.length > 0;
  const items = isFeatureMode ? features : projects;

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate effect
  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, items.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Helper for Project Tags
  const getDisplayPlatform = (platform: string | null | undefined) => {
    if (!platform || !platform.trim()) {
      return "Others";
    }
    const firstTag = platform.split(",")[0].trim();
    return firstTag || "Others";
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No content available.
      </div>
    );
  }

  // Calculate indices for 3D effect
  const getSlideStyles = (index: number) => {
    const total = items.length;
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;

    const isActive = diff === 0;
    const isPrev = diff === -1;
    const isNext = diff === 1;

    let style = {
      x: 0,
      scale: 0.8,
      opacity: 0,
      zIndex: 0,
      rotateY: 0,
      display: "none", // Hide non-adjacent for performance
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
        x: -250,
        scale: 0.85,
        opacity: 0.6,
        zIndex: 5,
        rotateY: 15,
        display: "block",
      };
    } else if (isNext) {
      style = {
        x: 250,
        scale: 0.85,
        opacity: 0.6,
        zIndex: 5,
        rotateY: -15,
        display: "block",
      };
    }

    return style;
  };

  // --- Render Logic Swapper ---
  const renderCardContent = (item: Project | Feature) => {
    if (isFeatureMode) {
      // --- RENDER FEATURE (About Page) ---
      const feature = item as Feature;
      return (
        <>
          {/* Video Area */}
          <div className="h-48 w-full bg-black relative overflow-hidden border-b border-neutral-800">
            {feature.videoSrc ? (
              <video
                src={feature.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-700">
                No Video Preview
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
          </div>

          {/* Content Area */}
          <div className="p-6 flex-grow flex flex-col text-center">
            <h3 className="text-xl font-bold text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </>
      );
    } else {
      // --- RENDER PROJECT (Original Usage) ---
      const project = item as Project;
      return (
        <>
          {/* Card Header with Tag */}
          <div className="p-6 pb-2 border-b border-neutral-800">
            <div className="flex justify-between items-start mb-2">
              <Badge
                variant="outline"
                className="bg-yellow-500/10 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/20"
              >
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
        </>
      );
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[550px] flex items-center justify-center perspective-1000">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden py-10">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const styles = getSlideStyles(index);

            // Only render if visible (Active, Prev, or Next)
            if (styles.display === "none") return null;

            // Safe key extraction
            const key = isFeatureMode
              ? (item as Feature).id
              : (item as Project).project_id;

            return (
              <motion.div
                key={key}
                className="absolute bg-neutral-900 border border-yellow-500/30 rounded-xl overflow-hidden shadow-2xl shadow-yellow-500/10 w-[320px] md:w-[400px] h-[450px] flex flex-col"
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
                {renderCardContent(item as Project & Feature)}
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
