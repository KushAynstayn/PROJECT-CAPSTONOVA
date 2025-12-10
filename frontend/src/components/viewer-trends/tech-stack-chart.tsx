"use client";

import React, { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";
import { ArrowRight } from "lucide-react";

// --- Type Definitions for API Response ---
interface Combination {
  if_using: string[];
  then_add: string[];
  confidence: number;
  lift: number;
}

interface PlatformAssociations {
  core_stack: string[]; // Although empty in example, good to have
  popular_combinations: Combination[];
}

interface AssociationData {
  [platform: string]: PlatformAssociations;
}

// --- Main Component ---
export const TechStackChart = () => {
  const [data, setData] = useState<AssociationData | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiCall(
          "/ml-service/predict-association",
          "GET"
        );

        if (response && response.associations) {
          setData(response.associations);
          // Set the first platform as the default selection
          const firstPlatform = Object.keys(response.associations)[0];
          if (firstPlatform) {
            setSelectedPlatform(firstPlatform);
          }
        } else {
          setError("No association data found in the API response.");
        }
      } catch (err) {
        setError("Failed to fetch technology stack associations.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch data only once on component mount

  if (loading) {
    return (
      <div className="text-center p-4">Loading Technology Associations...</div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!data) {
    return (
      <div className="text-center p-10 text-gray-400">
        No association data available.
      </div>
    );
  }

  const currentCombinations =
    data[selectedPlatform]?.popular_combinations || [];

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">
        Technology Stack Association Rules
      </h3>

      {/* Platform Selector Tabs 
        Updated to handle dynamic tabs (Hybrid, Cloud, etc.) with horizontal scrolling 
      */}
      <div className="flex gap-2 border-b border-gray-700 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {Object.keys(data).map((platform) => (
          <button
            key={platform}
            onClick={() => setSelectedPlatform(platform)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
              selectedPlatform === platform
                ? "border-b-2 border-yellow-400 text-yellow-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {/* Capitalize first letter just in case backend sends lowercase */}
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Display */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {currentCombinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCombinations.map((combo, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col justify-between hover:border-yellow-500/50 transition-colors"
              >
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-mono uppercase tracking-wider">
                    If you use...
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {combo.if_using.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-950/60 border border-blue-800 text-blue-200 text-xs px-2 py-1 rounded shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-center items-center my-2">
                    <ArrowRight className="w-5 h-5 text-gray-500 animate-pulse" />
                  </div>

                  <p className="text-xs text-gray-400 mb-2 font-mono uppercase tracking-wider">
                    ...consider adding
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {combo.then_add.map((tech) => (
                      <span
                        key={tech}
                        className="bg-green-950/60 border border-green-800 text-green-200 text-xs px-2 py-1 rounded shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-4 pt-3 flex justify-between text-xs text-gray-300">
                  <span title="Probability that the rule is correct">
                    Conf:{" "}
                    <span className="text-yellow-400">
                      {(combo.confidence * 100).toFixed(0)}%
                    </span>
                  </span>
                  <span title="Strength of the association">
                    Lift:{" "}
                    <span className="text-yellow-400">
                      {combo.lift.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 text-gray-400 italic">
            No specific stack recommendations found for {selectedPlatform} yet.
          </div>
        )}
      </div>
    </div>
  );
};
