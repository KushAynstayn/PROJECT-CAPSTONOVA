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
      <div className="mb-4 flex gap-2">
        <form onSubmit={handleSearch} className="flex-grow flex gap-2">
          <Input
            name="search"
            placeholder="Search by adviser name..."
            className="bg-gray-800 border-gray-700"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>

      {isLoading && <p>Loading suggestions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion) => (
              <AdviserSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                currentUserId={currentUserId}
                onInterestChange={() => fetchSuggestions(page, searchTerm)}
              />
            ))}
          </div>

          <div className="flex justify-center items-center mt-6 gap-2">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
