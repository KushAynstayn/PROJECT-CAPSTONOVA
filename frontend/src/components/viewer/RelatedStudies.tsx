"use client";

import React, { useState, useEffect, useRef } from "react";
import { apiCall, ApiError } from "@/lib/api";
import RelatedStudyCard, { RelatedStudy } from "./RelatedStudyCard";
import { BrainCircuit, ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedStudiesProps {
  projectId: string;
}

const RelatedStudiesSkeleton = () => (
  <div className="flex space-x-4 overflow-x-hidden">
    {[...Array(2)].map((_, i) => (
      <div
        key={i}
        className="bg-stone-800/60 p-5 rounded-lg border border-stone-700/50 animate-pulse flex-shrink-0 w-[350px] h-[280px]"
      >
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-600 rounded w-full"></div>
          <div className="h-3 bg-gray-600 rounded w-full"></div>
          <div className="h-3 bg-gray-600 rounded w-5/6"></div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-gray-600 rounded-full"></div>
            <div className="h-5 w-20 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const RelatedStudies: React.FC<RelatedStudiesProps> = ({ projectId }) => {
  const [studies, setStudies] = useState<RelatedStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchRelatedStudies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiCall(`/public/project/${projectId}/related`);
        setStudies(data);
      } catch (e) {
        setError(
          e instanceof ApiError
            ? `Error: ${e.message}`
            : "Failed to load related studies."
        );
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedStudies();
  }, [projectId]);

  const checkOverflowAndScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setIsOverflowing(hasOverflow);
      if (hasOverflow) {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft <
            container.scrollWidth - container.clientWidth - 1
        );
      } else {
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }
    }
  };

  useEffect(() => {
    checkOverflowAndScroll();
    window.addEventListener("resize", checkOverflowAndScroll);
    return () => window.removeEventListener("resize", checkOverflowAndScroll);
  }, [loading, studies]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (error || (!loading && studies.length === 0)) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BrainCircuit size={20} className="text-yellow-400" />
          Related Studies
        </h2>
        {isOverflowing && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="bg-stone-800 p-1.5 rounded-full text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="bg-stone-800 p-1.5 rounded-full text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      {loading ? (
        <RelatedStudiesSkeleton />
      ) : (
        <div
          ref={scrollContainerRef}
          onScroll={checkOverflowAndScroll}
          className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar"
        >
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          {studies.map((study) => (
            <RelatedStudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedStudies;
