"use client";

import React, { useState } from "react";
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

interface Suggestion {
  id: number;
  adviser: string;
  suggestion: string;
  date: string;
  isArchived: boolean;
  adviserId?: number;
}

const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    adviser: "Monkey D. Luffy",
    suggestion:
      "Consider integrating a real-time collaboration feature to allow multiple students to edit the proposal simultaneously. This will greatly improve the team's efficiency and communication.",
    date: "March 26, 2025",
    isArchived: false,
    adviserId: 1,
  },
  {
    id: 2,
    adviser: "Roronoa Zoro",
    suggestion:
      "Your project scope is too broad. Focus on a specific aspect of the 'Smart Library System' to ensure a more manageable and high-quality outcome.",
    date: "March 25, 2025",
    isArchived: false,
    adviserId: 2,
  },
];

const AdminSuggestionsPage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list");
  const [selectedAdviser, setSelectedAdviser] = useState<{
    id?: number;
    name: string;
  } | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const filteredSuggestions = mockSuggestions
    .filter(
      (s) =>
        (date
          ? format(new Date(s.date), "PPP") === format(date, "PPP")
          : true) &&
        s.adviser.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
        s.isArchived === showArchived
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSeeMoreClick = (
    adviser: Suggestion["adviser"],
    adviserId?: Suggestion["adviserId"]
  ) => {
    setSelectedAdviser({ name: adviser, id: adviserId });
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
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              {showArchived ? "Archived Suggestions" : "Active Suggestions"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((s) => (
                  <Card
                    key={s.id}
                    className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                  >
                    <CardHeader className="bg-gradient-to-r from-[#6b0000] to-[#8c0000] text-white p-4 rounded-t-lg">
                      <CardTitle className="text-xl font-extrabold tracking-wide">
                        {s.adviser}
                      </CardTitle>
                      <p className="text-sm opacity-90">Adviser</p>
                    </CardHeader>
                    <CardContent className="flex-1 p-6 space-y-4">
                      <p className="italic text-lg text-gray-700 leading-relaxed">
                        "{s.suggestion}"
                      </p>
                    </CardContent>
                    <div className="px-6 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                      <p className="font-medium">
                        Uploaded:{" "}
                        <span className="text-gray-700">
                          {format(new Date(s.date), "MMM d, yyyy")}
                        </span>
                      </p>
                      <Button
                        variant="link"
                        className="px-0 pt-2 text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() =>
                          handleSeeMoreClick(s.adviser, s.adviserId)
                        }
                      >
                        See more suggestions from this adviser
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  {showArchived
                    ? "No archived suggestions found."
                    : "No suggestions found for this date."}
                </p>
              )}
            </div>
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
