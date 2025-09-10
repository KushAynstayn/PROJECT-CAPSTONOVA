"use client";

import React from "react";
// Assuming the Project type is exported from your data file
import { type Project } from "@/data/viewer-abstract-data";

// --- ViewAbstract Component (Modal) ---
const ViewAbstract = ({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) => {
  // Effect to prevent body scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300 bg-gray backdrop-blur-sm"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-white text-black rounded-lg shadow-2xl w-full max-w-8xl max-h-[90vh] overflow-y-auto p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 uppercase">
          {project.title}
        </h2>
        <div className="text-sm text-gray-600 mb-6 border-b pb-4">
          <p>
            <strong>Proponents:</strong> {project.proponents}
          </p>
          <p>
            <strong>Adviser:</strong> {project.adviser}
          </p>
          <p>
            <strong>Date Published:</strong>{" "}
            {new Date(project.datePublished).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Abstract</h3>
        <div className="text-gray-700 leading-relaxed text-justify prose">
          <p>{project.abstract}</p>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      {/* Basic CSS for the animation */}
      <style jsx global>{`
        @keyframes fade-in-scale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s forwards
            cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
};

export default ViewAbstract;
