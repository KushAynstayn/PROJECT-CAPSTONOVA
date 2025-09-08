"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  SearchIcon,
  CalendarIcon,
  PlusCircle,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdviserSuggestionsDetails from "@/components/admin-suggestions/suggestions-details";
import { apiCall } from "@/lib/api";
import { authStore } from "@/lib/auth";
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

interface AddSuggestionPageProps {
  onGoBack: () => void;
  onSuggestionAdded: () => void;
}

//==============================================================================
// ADD SUGGESTION PAGE COMPONENT
//==============================================================================
const AddSuggestionPage: React.FC<AddSuggestionPageProps> = ({
  onGoBack,
  onSuggestionAdded,
}) => {
  const [title, setTitle] = useState("");
  const [suggestionText, setSuggestionText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (title.trim() && suggestionText.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        await apiCall("/adviser/suggestions", "POST", {
          title,
          suggestion_text: suggestionText,
        });
        onSuggestionAdded();
        onGoBack();
      } catch (err: any) {
        setError(err.message || "Failed to submit suggestion.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Title and suggestion text cannot be empty.");
    }
  };

  return (
    <div className="p-4 md:p-1">
      <div className="flex items-center mb-6 -mt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onGoBack}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold ml-2 md:ml-1 text-gray-800">
          Suggest Capstone Ideas
        </h1>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <div className="relative flex justify-center items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Have amazing capstone ideas?
            </h2>
          </div>
          <Input
            placeholder="Title"
            className="w-full mb-4 p-4 border-gray-300 rounded-md focus:ring-2 focus:ring-[#6b0000]"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          <Textarea
            placeholder="Suggest here"
            className="w-full h-56 p-4 border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[#6b0000]"
            value={suggestionText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setSuggestionText(e.target.value)
            }
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300"
              onClick={onGoBack}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#6b0000] hover:bg-[#5a0000] text-white font-semibold"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Suggest"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

//==============================================================================
// MAIN SUGGESTIONS PAGE COMPONENT
//==============================================================================
const AdviserSuggestionsPage = () => {
  const router = useRouter();
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
  const [filterMode, setFilterMode] = useState<"all" | "mine" | "archived">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const user = authStore.getUser();
    if (
      !authStore.isAuthenticated() ||
      user?.role.toLowerCase() !== "adviser"
    ) {
      router.push("/login");
    }
  }, [router]);

  const currentUser = authStore.getUser();

  const fetchSuggestions = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          per_page: "9",
        });

        if (filterMode === "mine") {
          params.append("my_suggestions", "true");
          params.append("is_archived", "false");
        } else if (filterMode === "archived") {
          params.append("my_archived_suggestions", "true");
        } else {
          // 'all' mode
          params.append("is_archived", "false");
        }

        if (date) {
          params.append("date", format(date, "yyyy-MM-dd"));
        }
        if (searchQuery) {
          params.append("adviser_name", searchQuery);
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
    [date, searchQuery, filterMode]
  );

  useEffect(() => {
    fetchSuggestions(1); // Reset to page 1 on filter change
  }, [fetchSuggestions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSuggestions(page);
  };

  const getFilterButtonText = () => {
    switch (filterMode) {
      case "mine":
        return "My Suggestions";
      case "archived":
        return "My Archive";
      default:
        return "All Suggestions";
    }
  };

  const handleSeeMoreClick = (adviser: Adviser) => {
    setSelectedAdviser({
      id: adviser.id,
      name: `${adviser.first_name} ${adviser.last_name}`,
    });
    setView("details");
  };

  const handleGoBack = () => {
    setView("list");
    setSelectedAdviser(null);
  };

  const handleAddClick = () => {
    setView("add");
  };

  const onSuggestionAdded = () => {
    fetchSuggestions(); // Refetch suggestions after adding a new one
  };

  if (view === "add") {
    return (
      <AddSuggestionPage
        onGoBack={handleGoBack}
        onSuggestionAdded={onSuggestionAdded}
      />
    );
  }

  if (view === "details" && selectedAdviser) {
    return (
      <AdviserSuggestionsDetails
        adviser={selectedAdviser}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <div>
      <div className="bg-[#6b0000] text-white py-3 font-bold text-center text-lg tracking-wider rounded-t-md">
        ADVISERS' SUGGESTIONS
      </div>
      <div className="bg-white p-4 rounded-b-md shadow-md flex">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
          <div className="relative w-full flex-grow">
            <Input
              type="search"
              placeholder="Search adviser by name..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[240px] justify-start text-left font-normal",
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                {getFilterButtonText()}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setFilterMode("all")}>
                All Suggestions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterMode("mine")}>
                My Suggestions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterMode("archived")}>
                My Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleAddClick}
            className="bg-[#6b0000] hover:bg-[#5a0000] text-white font-bold w-full md:w-auto flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add Suggestion
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
                  <Card
                    key={s.suggestion_id}
                    className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                  >
                    <CardHeader className="bg-gradient-to-r from-[#6b0000] to-[#8c0000] text-white p-4 rounded-t-lg">
                      <CardTitle className="text-xl font-extrabold tracking-wide">
                        {s.adviser.first_name} {s.adviser.last_name}
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
                          {format(new Date(s.submission_date), "MMM d, yyyy")}
                        </span>
                      </p>
                      <Button
                        variant="link"
                        className="px-0 pt-2 text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => handleSeeMoreClick(s.adviser)}
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
    </div>
  );
};

export default AdviserSuggestionsPage;
