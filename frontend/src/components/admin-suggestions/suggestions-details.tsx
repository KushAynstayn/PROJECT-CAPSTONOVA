"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiCall } from "@/lib/api";
import { format } from "date-fns";
import Pagination from "@/components/ui/pagination";

//==============================================================================
// INTERFACES
//==============================================================================
interface Adviser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Suggestion {
  suggestion_id: number;
  adviser: Adviser;
  title: string;
  suggestion_text: string;
  submission_date: string;
  is_archived: boolean;
}

interface PaginatedSuggestions {
  data: Suggestion[];
  current_page: number;
  last_page: number;
  total: number;
}

interface AdviserSuggestionsDetailsProps {
  adviser: { id?: number; name: string };
  onGoBack: () => void;
}

//==============================================================================
// Adviser Suggestions Details Component
//==============================================================================
const AdviserSuggestionsDetails = ({
  adviser,
  onGoBack,
}: AdviserSuggestionsDetailsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"uploaded" | "archived">("uploaded");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdviserSuggestions = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          per_page: "9",
          is_archived: viewMode === "archived" ? "true" : "false",
        });

        if (adviser.id) {
          params.append("adviser_id", String(adviser.id));
        } else {
          params.append("adviser_name", adviser.name);
        }

        const response = await apiCall(
          `/user/suggestions?${params.toString()}`
        );

        setSuggestions(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
      } catch (err: any) {
        setError(err.message || "Failed to fetch suggestions.");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [adviser, viewMode]
  );

  useEffect(() => {
    fetchAdviserSuggestions(1);
  }, [fetchAdviserSuggestions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAdviserSuggestions(page);
  };

  return (
    <div>
      {/* Header for Details View with Back Button and Buttons */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mr-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Button>
          <h1 className="text-xl font-bold text-gray-800">
            Suggestions of {adviser.name}
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => setViewMode("uploaded")}
            className={cn(
              "px-6 py-2 rounded-full font-semibold transition-colors duration-200",
              viewMode === "uploaded"
                ? "bg-[#6b0000] hover:bg-[#5c0000] text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            )}
          >
            Uploaded
          </Button>
          <Button
            onClick={() => setViewMode("archived")}
            className={cn(
              "px-6 py-2 rounded-full font-semibold transition-colors duration-200",
              viewMode === "archived"
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            )}
          >
            Archived
          </Button>
        </div>
      </div>

      <div className="p-8">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500">
            Loading suggestions...
          </p>
        ) : error ? (
          <p className="col-span-full text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.length > 0 ? (
                suggestions.map((s) => (
                  <Card key={s.suggestion_id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${s.adviser.email}`}
                          alt={s.adviser.first_name}
                        />
                        <AvatarFallback>
                          {s.adviser.first_name?.[0]}
                          {s.adviser.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {s.adviser.first_name} {s.adviser.last_name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">Adviser</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-6">
                      <p className="font-bold text-gray-800">{s.title}</p>
                      <p className="italic text-gray-700">
                        "{s.suggestion_text}"
                      </p>
                    </CardContent>
                    <div className="px-6 pb-6 text-sm">
                      <p className="text-gray-500">
                        Uploaded: {format(new Date(s.submission_date), "PPP")}
                      </p>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No {viewMode === "archived" ? "archived" : "uploaded"}{" "}
                  suggestions found for this adviser.
                </p>
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdviserSuggestionsDetails;
