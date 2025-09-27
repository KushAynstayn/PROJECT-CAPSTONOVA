"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AdviserSuggestionsDetails from "@/components/admin-suggestions/suggestions-details";
import { apiCall, ApiError } from "@/lib/api";
import Pagination from "@/components/ui/pagination";

// --- INTERFACES ---
interface Adviser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Suggestion {
  suggestion_id: number;
  adviser_name: string;
  adviser_id: number;
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

const AdminSuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list");
  const [selectedAdviser, setSelectedAdviser] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSuggestions = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          per_page: "9",
          archived: String(showArchived),
        });

        if (date) {
          params.append("from_year", format(date, "yyyy"));
          params.append("to_year", format(date, "yyyy"));
        }
        if (searchQuery) {
          params.append("adviser_name", searchQuery);
        }

        const response: PaginatedSuggestions = await apiCall(
          `/user-mgt/suggestions?${params.toString()}`
        );

        setSuggestions(response.data);
        setCurrentPage(response.current_page);
        setTotalPages(response.last_page);
      } catch (err: any) {
        setError(err.message || "Failed to fetch suggestions.");
      } finally {
        setIsLoading(false);
      }
    },
    [date, searchQuery, showArchived]
  );

  useEffect(() => {
    fetchSuggestions(1);
  }, [fetchSuggestions]);

  const handlePageChange = (page: number) => {
    fetchSuggestions(page);
  };

  const handleSeeMoreClick = (adviserName: string, adviserId: number) => {
    setSelectedAdviser({ name: adviserName, id: adviserId });
    setView("details");
  };

  const handleGoBack = () => {
    setView("list");
    setSelectedAdviser(null);
  };

  const handleToggleArchive = () => {
    setShowArchived((prev) => !prev);
    setSearchQuery("");
    setDate(undefined);
  };

  return (
    <div>
      {view === "list" ? (
        <>
          <div className="bg-[#6b0000] text-white py-3 font-bold text-center text-lg tracking-wider rounded-t-md">
            {showArchived ? "ARCHIVED SUGGESTIONS" : "ADVISERS' SUGGESTIONS"}
          </div>

          <div className="bg-white p-4 rounded-b-md shadow-md flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:flex-grow">
              <Input
                type="search"
                placeholder="Search adviser here"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {date && (
                  <Button
                    variant="ghost"
                    onClick={() => setDate(undefined)}
                    className="absolute top-1 right-1 h-7 w-7 p-0 rounded-full hover:bg-gray-200"
                  >
                    <span className="text-xl leading-none">&times;</span>
                  </Button>
                )}
              </div>
              <Button
                onClick={handleToggleArchive}
                className="bg-[#5c3c20] hover:bg-[#4a301a] text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-200 whitespace-nowrap"
              >
                {showArchived ? "Back to Active" : "Archived Suggestions"}
              </Button>
            </div>
          </div>

          <div className="p-8">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  {showArchived ? "Archived Suggestions" : "Active Suggestions"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestions.length > 0 ? (
                    suggestions.map((s) => (
                      <Card
                        key={s.suggestion_id}
                        className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                      >
                        <CardHeader className="bg-gradient-to-r from-[#6b0000] to-[#8c0000] text-white p-4 rounded-t-lg">
                          <CardTitle className="text-xl font-extrabold tracking-wide">
                            {s.adviser_name}
                          </CardTitle>
                          <p className="text-sm opacity-90">Adviser</p>
                        </CardHeader>
                        <CardContent className="flex-1 p-6 space-y-4">
                          <p className="font-bold text-lg text-gray-800">
                            {s.title}
                          </p>
                          <p className="italic text-gray-700 leading-relaxed">
                            "{s.suggestion_text}"
                          </p>
                        </CardContent>
                        <div className="px-6 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                          <p className="font-medium">
                            Uploaded:{" "}
                            <span className="text-gray-700">
                              {format(
                                new Date(s.submission_date),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </p>
                          <Button
                            variant="link"
                            className="px-0 pt-2 text-blue-600 hover:text-blue-800 font-semibold"
                            onClick={() =>
                              handleSeeMoreClick(s.adviser_name, s.adviser_id)
                            }
                          >
                            See more suggestions from this adviser
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">
                      No suggestions found.
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
        </>
      ) : (
        selectedAdviser && (
          <AdviserSuggestionsDetails
            adviser={selectedAdviser}
            onGoBack={handleGoBack}
          />
        )
      )}
    </div>
  );
};

export default AdminSuggestionsPage;
