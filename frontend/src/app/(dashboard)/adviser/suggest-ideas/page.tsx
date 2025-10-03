"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Settings,
  X,
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
import { apiCall, ApiError } from "@/lib/api";
import { authStore } from "@/lib/auth";
import Pagination from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

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
  adviser?: Adviser; // Optional for edit modal
  title: string;
  suggestion_text: string;
  submission_date?: string;
  is_archived: boolean;
}

interface PaginatedSuggestions {
  data: Suggestion[];
  current_page: number;
  last_page: number;
  total: number;
}

//==============================================================================
// EDIT SUGGESTION MODAL
//==============================================================================
interface EditSuggestionModalProps {
  suggestion: Suggestion | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSuggestionModal: React.FC<EditSuggestionModalProps> = ({
  suggestion,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [suggestionText, setSuggestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (suggestion) {
      setSuggestionText(suggestion.suggestion_text);
    }
  }, [suggestion]);

  const handleSave = async () => {
    if (!suggestion) return;

    setIsLoading(true);
    setError(null);
    try {
      await apiCall(`/adviser/suggestions/${suggestion.suggestion_id}`, "PUT", {
        title: suggestion.title, // Title is required but not changed
        suggestion_text: suggestionText,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update suggestion.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!suggestion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-md shadow-md border-1 border-gray-300">
        <DialogHeader>
          <DialogTitle>Edit Suggestion</DialogTitle>
          <DialogDescription>
            You can only edit the content of your suggestion.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Title (Read-only)</Label>
            <Input id="title" value={suggestion.title} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="suggestion_text">Suggestion</Label>
            <Textarea
              id="suggestion_text"
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              className="min-h-[150px] rounded-md shadow-md border-gray-300"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#660000] hover:shadow-lg hover:bg-[#660000] hover:text-white text-white transition-transform duration-200 ease-in-out hover:scale-105"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-md shadow-md hover:bg-gray-200 hover:text-black hover:shadow-lg bg-gray-300 text-gray-700 border-1 border-gray-300 hover:scale-105 "
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

//==============================================================================
// MANAGE SUGGESTIONS MODAL
//==============================================================================
interface ManageSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageSuggestionsModal: React.FC<ManageSuggestionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mySuggestions, setMySuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(
    null
  );

  const fetchMySuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall("/adviser/suggestions");
      setMySuggestions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load your suggestions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMySuggestions();
    }
  }, [isOpen, fetchMySuggestions]);

  const handleArchive = async (suggestionId: number) => {
    if (confirm("Are you sure you want to archive this suggestion?")) {
      try {
        await apiCall(`/adviser/suggestions/${suggestionId}/archive`, "PATCH");
        fetchMySuggestions();
      } catch (err: any) {
        setError(err.message || "Failed to archive suggestion.");
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen && !editingSuggestion} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl rounded-md shadow-md border-1 border-gray-300">
          <DialogHeader>
            <DialogTitle>Manage Your Suggestions</DialogTitle>
            <DialogDescription>
              Here you can edit or archive your submitted ideas.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] p-4">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && mySuggestions.length === 0 && (
              <p>You have not submitted any suggestions yet.</p>
            )}
            <div className="space-y-4">
              {mySuggestions.map((suggestion) => (
                <div
                  key={suggestion.suggestion_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p
                      className={`font-semibold ${
                        suggestion.is_archived
                          ? "text-gray-400 line-through"
                          : ""
                      }`}
                    >
                      {suggestion.title}
                    </p>
                    <p
                      className={`text-sm text-gray-600 ${
                        suggestion.is_archived ? "text-gray-400" : ""
                      }`}
                    >
                      {suggestion.suggestion_text.substring(0, 50)}...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSuggestion(suggestion)}
                      disabled={suggestion.is_archived}
                      className="rounded-md shadow-md bg-[#660000] hover:bg-[#660000] hover:shadow-lg hover:text-white text-white border-1 border-gray-300 hover:scale-105 "
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleArchive(suggestion.suggestion_id)}
                      disabled={suggestion.is_archived}
                      className="rounded-md shadow-md hover:bg-gray-200 hover:text-black hover:shadow-lg bg-gray-300 text-gray-700 border-1 border-gray-300 hover:scale-105 "
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <EditSuggestionModal
        isOpen={!!editingSuggestion}
        onClose={() => setEditingSuggestion(null)}
        suggestion={editingSuggestion}
        onSuccess={() => {
          setEditingSuggestion(null);
          fetchMySuggestions();
        }}
      />
    </>
  );
};

//==============================================================================
// ADD SUGGESTION PAGE COMPONENT
//==============================================================================
interface AddSuggestionPageProps {
  onGoBack: () => void;
  onSuggestionAdded: () => void;
}

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
        <div className="bg-white p-10 rounded-md shadow-md border-1 border-gray-300">
          <div className="relative flex justify-center items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Have amazing capstone ideas?
            </h2>
          </div>
          <Input
            placeholder="Title"
            className="w-full mb-4 p-4 border-gray-300 shadow-md rounded-md"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          <Textarea
            placeholder="Suggest here"
            className="w-full h-56 p-4 border-gray-300 rounded-md resize-none shadow-md"
            value={suggestionText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setSuggestionText(e.target.value)
            }
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              className="bg-[#660000] hover:bg-[#660000] hover:text-white transition-transform duration-200 ease-in-out hover:scale-105 text-white"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Suggest"}
            </Button>
            <Button
              variant="outline"
              className="bg-gray-300 border-gray-300 hover:bg-[#660000] hover:text-white text-gray-700 transition-transform duration-200 ease-in-out hover:scale-105"
              onClick={onGoBack}
            >
              Cancel
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
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    const user = authStore.getUser();
    if (
      !authStore.isAuthenticated() ||
      user?.role.toLowerCase() !== "adviser"
    ) {
      router.push("/login");
    }
  }, [router]);

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
    fetchSuggestions(1);
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
    fetchSuggestions();
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
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="Search adviser by name..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative w-full md:w-auto flex-shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  style={{ paddingRight: "2.5rem" }}
                  className={cn(
                    "w-full md:w-auto justify-start text-left font-normal bg-white border-gray-300 rounded-md shadow-md",
                    !date && "text-black"
                  )}
                >
                  <CalendarIcon className="mr-0 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-gray-300 rounded-md shadow-md">
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
                className="absolute top-1 right-1 h-7 w-7 p-0 rounded-md hover:bg-gray-200 flex items-center justify-center "
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex-shrink-0">
            <DropdownMenu className="rounded-md shadow-md ">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto border-gray-300 border-1"
                >
                  {getFilterButtonText()}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-300 rounded-md shadow-md">
                <DropdownMenuItem
                  onSelect={() => setFilterMode("all")}
                  className="text-gray-700 hover:bg-gray-300 hover:border-gray-300 hover:border-1 hover:text-black hover:shadow-md"
                >
                  All Suggestions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setFilterMode("mine")}
                  className="text-gray-700 hover:bg-gray-300 hover:border-gray-300 hover:border-1 hover:text-black hover:shadow-md"
                >
                  My Suggestions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setFilterMode("archived")}
                  className="text-gray-700 hover:bg-gray-300 hover:border-gray-300 hover:border-1 hover:text-black hover:shadow-md"
                >
                  My Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <Button
              onClick={() => setIsManageModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2 rounded-md shadow-md border-gray-300 border-1"
            >
              <Settings size={18} />
              Manage
            </Button>
            <Button
              onClick={handleAddClick}
              className="bg-[#660000] hover:bg-[#6b0000] hover:shadow-md hover:scale-105 hover:text-white text-white font-bold flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Add Suggestion
            </Button>
          </div>
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
                    className="flex flex-col shadow-md rounded-md border-gray-300 hover:shadow-xl transition-shadow duration-300 ease-in-out pt-0 overflow-hidden"
                  >
                    <CardHeader className="bg-gradient-to-r from-[#660000] to-[#8c0000] text-white p-4">
                      <CardTitle className="text-xl font-extrabold tracking-wide">
                        {s.adviser?.first_name} {s.adviser?.last_name}
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
                          {s.submission_date
                            ? format(new Date(s.submission_date), "MMM d, yyyy")
                            : "N/A"}
                        </span>
                      </p>
                      {s.adviser && (
                        <Button
                          variant="link"
                          className="px-0 pt-2 text-blue-600 hover:text-blue-800 font-semibold"
                          onClick={() => handleSeeMoreClick(s.adviser!)}
                        >
                          See more suggestions from this adviser
                        </Button>
                      )}
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
      <ManageSuggestionsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
      />
    </div>
  );
};

export default AdviserSuggestionsPage;
