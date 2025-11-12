"use client";

import React, { useMemo } from 'react';
// --- Import restored as requested ---
import { ScrambleTitle } from "@/components/ui/scramble-title";


// --- (Inline ScrambleTitle Component removed) ---


// --- Database-Ready Type Definition ---
// A clear interface for a project, ready to be fetched from a database
export interface CapstoneProject {
  id: string; // Essential for database records and React keys
  title: string;
  proponents: string[];
  adviser: string;
  dateSubmitted: string;
  platform: 'WEB' | 'MOBILE' | 'DESKTOP' | 'OTHER';
}

// --- Project Card Component ---
// Styled with the "glass-like gold" theme
// It now accepts props matching the CapstoneProject interface
const ProjectCard: React.FC<CapstoneProject> = ({ title, proponents, adviser, dateSubmitted, platform }) => {
  const platformColor = useMemo(() => {
    switch (platform) {
      case 'WEB': return 'bg-blue-500/50 text-blue-200 border-blue-400';
      case 'MOBILE': return 'bg-green-500/50 text-green-200 border-green-400';
      case 'DESKTOP': return 'bg-purple-500/50 text-purple-200 border-purple-400';
      default: return 'bg-gray-500/50 text-gray-200 border-gray-400';
    }
  }, [platform]);

  return (
    <div className="flex-shrink-0 w-[300px] md:w-[380px] h-[400px] p-6 rounded-xl
                   bg-black/30 backdrop-blur-md
                   border border-amber-500/30
                   shadow-md shadow-amber-900/20
                   flex flex-col justify-between
                   transition-all duration-300 hover:shadow-amber-600/30 hover:border-amber-500/60 hover:scale-[1.02]">
      
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-amber-300 pr-3">{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${platformColor}`}>
            {platform}
          </span>
        </div>
        
        <p className="text-sm text-amber-100/70 mb-4 h-16 overflow-hidden">
          <span className="font-semibold text-amber-100/90">Proponents: </span>
          {proponents.join(', ')}
        </p>
      </div>

      <div className="border-t border-amber-600/20 pt-4 text-sm text-amber-100/80 space-y-2">
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
  );
};


// --- Mock Data ---
// Now uses the CapstoneProject type and includes 'id' for database/key mapping
const mockProjects: CapstoneProject[] = [
  {
    id: "proj-nova-001",
    title: "Project Nova",
    proponents: ["J. Doe", "A. Smith", "L. Kim"],
    adviser: "Dr. E. Codd",
    dateSubmitted: "May 2024",
    platform: "WEB",
  },
  {
    id: "proj-aura-002",
    title: "Aura: Mobile Health",
    proponents: ["M. Chen", "S. Patel"],
    adviser: "Prof. A. Turing",
    dateSubmitted: "Apr 2024",
    platform: "MOBILE",
  },
  {
    id: "proj-quantum-003",
    title: "Quantum Desktop Suite",
    proponents: ["R. Singh", "K. Lee", "T. Brown"],
    adviser: "Dr. G. Hopper",
    dateSubmitted: "May 2024",
    platform: "DESKTOP",
  },
  {
    id: "proj-ecom-004",
    title: "E-Commerce Analyst",
    proponents: ["B. Johnson", "F. Williams"],
    adviser: "Dr. E. Codd",
    dateSubmitted: "Jan 2024",
    platform: "WEB",
  },
  {
    id: "proj-geo-005",
    title: "GeoCache Adventure",
    proponents: ["S. Rodriguez", "M. B.", "P. L."],
    adviser: "Prof. A. Turing",
    dateSubmitted: "Mar 2024",
    platform: "MOBILE",
  },
  {
    id: "proj-dataviz-006",
    title: "DataViz Studio",
    proponents: ["L. Nguyen", "P. G."],
    adviser: "Dr. G. Hopper",
    dateSubmitted: "Feb 2024",
    platform: "DESKTOP",
  },
];


// --- RealWorldSolutions Main Component ---
export default function RealWorldSolutions() {
  // TODO: Replace 'mockProjects' with a fetch call to your database
  // For now, we use the mock data
  
  // We duplicate the projects to create a seamless loop
  const duplicatedProjects = [...mockProjects, ...mockProjects];

  return (
    <section className="relative w-full py-20 overflow-hidden 
                      bg-gradient-to-b from-black via-gray-900/50 to-black mb-20">
      {/* Background Glow Effect - similar to the search section */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-1/2 h-1/2 bg-amber-600/20 blur-[120px] rounded-full opacity-30">
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4">
        {/* This now uses the imported component */}
        <ScrambleTitle text="Real-World Solutions" />

        {/* Carousel Container */}
        <div
          className="w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          {/* Automatic Scrolling Animation */}
          <style jsx>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .scrolling-wrapper {
              animation: scroll 40s linear infinite;
            }
            .scrolling-wrapper:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="flex w-max space-x-6 py-4 scrolling-wrapper">
            {duplicatedProjects.map((project, index) => (
              // Using a more robust key for duplicated items
              <ProjectCard key={`${project.id}-${index}`} {...project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}