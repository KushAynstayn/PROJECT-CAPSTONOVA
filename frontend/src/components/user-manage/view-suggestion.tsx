"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Define the shape of the Adviser object this component expects
interface Adviser {
  id: number;
  name: string;
  idNumber: string;
  email: string;
  numberOfAdvisees: string;
}

// Define the props the component will receive
interface SuggestionViewProps {
  adviser: Adviser;
  onClose: () => void; // A function to handle closing this view
}

const SuggestionView = ({ adviser, onClose }: SuggestionViewProps) => {
  // ADDED: State to manage which view ('Uploaded' or 'Archived') is active
  const [activeView, setActiveView] = useState<"Uploaded" | "Archived">(
    "Uploaded"
  );

  // Reusable Tailwind classes for the navbar buttons
  const buttonBaseClasses = "px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200";
  const activeClasses = "bg-[#6b211d] text-white shadow-sm";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100";

  return (
    // Main container with styling for the suggestion panel
    <div className="rounded-lg border bg-white p-6 shadow-md animate-fade-in">
      {/* MODIFIED: Header now uses justify-between to space out its content */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        {/* Left side of the header (back arrow and title) */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-transform hover:scale-110 hover:bg-gray-100"
            aria-label="Back to Adviser List"
          >
            <img src="/images/arrow.png" alt="Back" className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Suggestions of {adviser.name}
            </h2>
          </div>
        </div>

        {/* =================================================================== */}
        {/* ADDED: Navbar on the right side of the header                     */}
        {/* =================================================================== */}
        <div className="flex items-center gap-1 rounded-lg border bg-gray-50 p-1">
          <button
            onClick={() => setActiveView("Uploaded")}
            className={cn(
              buttonBaseClasses,
              activeView === "Uploaded" ? activeClasses : inactiveClasses
            )}
          >
            Uploaded
          </button>
          <button
            onClick={() => setActiveView("Archived")}
            className={cn(
              buttonBaseClasses,
              activeView === "Archived" ? activeClasses : inactiveClasses
            )}
          >
            Archived
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODIFIED: Content area now renders conditionally based on state     */}
      {/* =================================================================== */}
      <div className="relative max-h-[60vh] overflow-y-auto space-y-4 pr-2">
        {/* If 'Uploaded' is active, show this content */}
        {activeView === "Uploaded" && (
          <>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>Uploaded Suggestions Content Area</p>
            </div>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>More Uploaded Content...</p>
            </div>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>More Uploaded Content...</p>
            </div>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>More Uploaded Content...</p>
            </div>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>More Uploaded Content...</p>
            </div>
          </>
        )}

        {/* If 'Archived' is active, show this content instead */}
        {activeView === "Archived" && (
          <>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>Archived Suggestions Content Area</p>
            </div>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>Archived Suggestions Content Area</p>
            </div>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>Archived Suggestions Content Area</p>
            </div>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>Archived Suggestions Content Area</p>
            </div>
            <div className="rounded-md border border-dashed p-8 text-center text-gray-400">
              <p>Archived Suggestions Content Area</p>
            </div>
          
          </>
        )}
      </div>
    </div>
  );
};

export default SuggestionView;