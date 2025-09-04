"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdviserSuggestionsDetails from "@/components/admin-suggestions/suggestions-details";

interface Suggestion {
  id: number;
  adviser: string;
  adviserImage: string;
  suggestion: string;
  date: string;
  isArchived: boolean;
}

const mockSuggestions: Suggestion[] = [
  // Existing Suggestions
  {
    id: 1,
    adviser: "Monkey D. Luffy",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Consider integrating a real-time collaboration feature to allow multiple students to edit the proposal simultaneously. This will greatly improve the team's efficiency and communication.",
    date: "March 26, 2025",
    isArchived: false,
  },
  {
    id: 2,
    adviser: "Roronoa Zoro",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Your project scope is too broad. Focus on a specific aspect of the 'Smart Library System' to ensure a more manageable and high-quality outcome.",
    date: "March 25, 2025",
    isArchived: false,
  },
  {
    id: 3,
    adviser: "Nami",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The user interface mockups are good, but they lack accessibility features. Make sure to include proper contrast and navigation for all users.",
    date: "March 24, 2025",
    isArchived: false,
  },
  {
    id: 4,
    adviser: "Usopp",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The database schema needs optimization. Normalizing the tables will prevent data redundancy and improve performance.",
    date: "March 23, 2025",
    isArchived: false,
  },
  {
    id: 5,
    adviser: "Sanji",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Review the project's security protocols. Implement proper input validation and user authentication to protect against common web vulnerabilities.",
    date: "March 22, 2025",
    isArchived: false,
  },
  {
    id: 6,
    adviser: "Tony Tony Chopper",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Ensure the project documentation is thorough and well-organized. This will be crucial for future maintenance and scalability.",
    date: "March 21, 2025",
    isArchived: false,
  },
  {
    id: 7,
    adviser: "Franky",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The project's code structure could be more modular. Break down large functions into smaller, reusable components for better readability.",
    date: "March 20, 2025",
    isArchived: false,
  },
  {
    id: 8,
    adviser: "Brook",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Your presentation slides are a great start, but they need to be more concise. Use bullet points and images to convey key information quickly.",
    date: "March 19, 2025",
    isArchived: false,
  },
  {
    id: 9,
    adviser: "Jimbei",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The project's testing plan is incomplete. Add more unit tests and integration tests to ensure the application is robust and reliable.",
    date: "March 18, 2025",
    isArchived: false,
  },
  {
    id: 10,
    adviser: "Edward Teach",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The project's performance is sluggish. Consider optimizing database queries and implementing caching to speed up data retrieval.",
    date: "March 17, 2025",
    isArchived: false,
  },

  // Added 10 New Suggestions, some are archived
  {
    id: 11,
    adviser: "Monkey D. Luffy",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Your problem statement is clear, but consider adding a section on the potential impact of your project on the community or end-users.",
    date: "March 16, 2025",
    isArchived: true,
  },
  {
    id: 12,
    adviser: "Roronoa Zoro",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The project timeline seems ambitious. Break down larger milestones into smaller, more manageable tasks to better track your progress.",
    date: "March 15, 2025",
    isArchived: true,
  },
  {
    id: 13,
    adviser: "Nami",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Add a user feedback mechanism to your application. Gathering input from early testers will help you refine the final product.",
    date: "March 14, 2025",
    isArchived: false,
  },
  {
    id: 14,
    adviser: "Usopp",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The literature review is missing a few key modern references. Be sure to include recent papers from the last two years.",
    date: "March 13, 2025",
    isArchived: false,
  },
  {
    id: 15,
    adviser: "Sanji",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The system's architecture diagram is unclear. Use standard symbols and labels to make it easier for others to understand.",
    date: "March 12, 2025",
    isArchived: true,
  },
  {
    id: 16,
    adviser: "Tony Tony Chopper",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Ensure your code follows a consistent style guide. This will make it easier for your team members to collaborate and read the code.",
    date: "March 11, 2025",
    isArchived: true,
  },
  {
    id: 17,
    adviser: "Franky",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Your project's main feature needs a clear value proposition. How does it solve the problem more efficiently than existing solutions?",
    date: "March 10, 2025",
    isArchived: false,
  },
  {
    id: 18,
    adviser: "Brook",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The user flow diagram is too simple. Add more detail, including error states and alternative paths, to fully map out the user experience.",
    date: "March 9, 2025",
    isArchived: false,
  },
  {
    id: 19,
    adviser: "Jimbei",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "For your deployment plan, consider using a CI/CD pipeline. Automating tests and deployment will save you a lot of time and effort.",
    date: "March 8, 2025",
    isArchived: true,
  },
  {
    id: 20,
    adviser: "Edward Teach",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Your project's budget analysis needs to be more detailed. Include a breakdown of costs for software, hardware, and any third-party services.",
    date: "March 7, 2025",
    isArchived: true,
  },
];

const AdminSuggestionsPage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list");
  const [selectedAdviser, setSelectedAdviser] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const filteredSuggestions = mockSuggestions
    .filter(s =>
      (date ? format(new Date(s.date), "PPP") === format(date, "PPP") : true) &&
      s.adviser.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
      s.isArchived === showArchived
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSeeMoreClick = (adviserName: string) => {
    setSelectedAdviser(adviserName);
    setView("details");
  };

  const handleGoBack = () => {
    setView("list");
    setSelectedAdviser(null);
  };

  const handleToggleArchive = () => {
    setShowArchived(prev => !prev);
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
                  <Card key={s.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={s.adviserImage} alt={s.adviser} />
                        <AvatarFallback>{s.adviser[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{s.adviser}</CardTitle>
                        <p className="text-sm text-gray-500">Adviser</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-6">
                      <p className="italic text-gray-700">"{s.suggestion}"</p>
                    </CardContent>
                    <div className="px-6 pb-6 text-sm">
                      <p className="text-gray-500">Uploaded: {s.date}</p>
                      <Button variant="link" className="px-0 pt-0 text-blue-500" onClick={() => handleSeeMoreClick(s.adviser)}>
                        See more suggestions from this adviser
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  {showArchived ? "No archived suggestions found." : "No suggestions found for this date."}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        selectedAdviser && (
          <AdviserSuggestionsDetails adviserName={selectedAdviser} onGoBack={handleGoBack} />
        )
      )}
    </div>
  );
};

export default AdminSuggestionsPage;