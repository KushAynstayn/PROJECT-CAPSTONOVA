"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AdviserSuggestionCard, Suggestion } from "./adviser-suggestion-card";
import { apiCall, ApiError } from "@/lib/api";
import { authStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function AdviserSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // State for the actual value in the input field
  const [inputValue, setInputValue] = useState("");
  // State for the debounced search term sent to the API
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Effect to debounce user input and update the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      // Set the term to be searched, which will trigger the data fetch
      if (inputValue !== searchTerm) {
        setSearchTerm(inputValue);
        // Reset to page 1 for every new search query
        setPage(1);
      }
    }, 500); // Wait for 500ms after the user stops typing

    // Cleanup function to clear the timeout on every key press
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, searchTerm]);

  const fetchSuggestions = useCallback(
    async (pageNum: number, adviserName: string) => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `/user/suggestions?page=${pageNum}&sort_by=submission_date&sort_order=desc`;
        if (adviserName) {
          url += `&adviser_name=${encodeURIComponent(adviserName)}`;
        }

        const response = await apiCall(url, "GET");

        setSuggestions(response.data.data);
        setTotalPages(response.data.last_page);
        setPage(response.data.current_page);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load suggestions.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Effect to fetch data when the debounced search term or page changes
  useEffect(() => {
    fetchSuggestions(page, searchTerm);
  }, [searchTerm, page, fetchSuggestions]);

  // Effect to get the current user ID once on component mount
  useEffect(() => {
    const user = authStore.getUser();
    if (user) {
      setCurrentUserId(parseInt(user.id, 10));
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Input
            name="search"
            placeholder="Search by adviser name..."
            className="bg-neutral-900 border-gray-700 text-white placeholder-gray-500 focus:ring-[#E0A800] focus:border-[#E0A800] pr-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {isLoading && (
        <p className="text-center text-gray-400">
          Loading adviser suggestions...
        </p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!isLoading && !error && suggestions.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion) => (
              <AdviserSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                currentUserId={currentUserId}
                onInterestChange={() => fetchSuggestions(page, searchTerm)}
              />
            ))}
          </div>

          <div className="flex justify-center items-center mt-8 gap-2">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-neutral-800 hover:text-white"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-neutral-800 hover:text-white"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {!isLoading && !error && suggestions.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No adviser suggestions found for "{searchTerm}".
        </p>
      )}
    </div>
  );
}
