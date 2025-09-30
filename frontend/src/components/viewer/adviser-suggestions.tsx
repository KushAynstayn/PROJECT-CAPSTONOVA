"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AdviserSuggestionCard, Suggestion } from "./adviser-suggestion-card";
import { apiCall, ApiError } from "@/lib/api";
import { authStore } from "@/lib/auth";

export function AdviserSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSuggestions = useCallback(
    async (pageNum = 1, adviserName = "") => {
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

        const user = authStore.getUser();
        if (user) {
          setCurrentUserId(parseInt(user.id, 10));
        }
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

  useEffect(() => {
    const user = authStore.getUser();
    if (user) {
      setCurrentUserId(parseInt(user.id, 10));
    }
    fetchSuggestions(1, searchTerm);
  }, [fetchSuggestions, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    setSearchTerm(input.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchSuggestions(newPage, searchTerm);
    }
  };

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <form onSubmit={handleSearch} className="flex-grow flex gap-2">
          <Input
            name="search"
            placeholder="Search by adviser name..."
            className="bg-neutral-900 border-gray-700 text-white placeholder-gray-500 focus:ring-[#E0A800] focus:border-[#E0A800]"
          />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="border-gray-700 text-gray-300 hover:border-[#E0A800] hover:text-[#E0A800]"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
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
          No adviser suggestions found.
        </p>
      )}
    </div>
  );
}
