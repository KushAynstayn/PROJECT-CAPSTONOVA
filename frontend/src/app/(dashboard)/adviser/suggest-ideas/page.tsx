"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, CalendarIcon, PlusCircle, ArrowLeft, MoreVertical, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdviserSuggestionsDetails from "@/components/admin-suggestions/suggestions-details";

//==============================================================================
// ADD SUGGESTION PAGE COMPONENT
//==============================================================================
interface AddSuggestionPageProps {
  onGoBack: () => void;
}

const AddSuggestionPage: React.FC<AddSuggestionPageProps> = ({ onGoBack }) => {
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = () => {
    if (suggestion.trim()) {
      console.log('Suggestion submitted:', suggestion);
      onGoBack();
    } else {
      console.log("Suggestion cannot be empty.");
    }
  };

  return (
    <div className="p-4 md:p-1">
      <div className="flex items-center mb-6 -mt-2">
        <Button variant="ghost" size="icon" onClick={onGoBack} className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold ml-2 md:ml-1 text-gray-800">Suggest Capstone Ideas</h1>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <div className="relative flex justify-center items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Have amazing capstone ideas?</h2>
          </div>
          <Textarea
            placeholder="Suggest here"
            className="w-full h-56 p-4 border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[#6b0000]"
            value={suggestion}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSuggestion(e.target.value)}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="bg-gray-200 hover:bg-gray-300" onClick={onGoBack}>
              Cancel
            </Button>
            <Button className="bg-[#6b0000] hover:bg-[#5a0000] text-white font-semibold" onClick={handleSubmit}>
              Suggest
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
interface Suggestion {
  id: number;
  adviser: string;
  adviserImage: string;
  suggestion: string;
  date: string;
  status: 'active' | 'archived';
}

const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    adviser: "Monkey D. Luffy",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Consider integrating a real-time collaboration feature.",
    date: "March 26, 2025",
    status: 'active',
  },
  {
    id: 2,
    adviser: "Roronoa Zoro",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Your project scope is too broad. Focus on a specific aspect.",
    date: "March 25, 2025",
    status: 'active',
  },
  {
    id: 3,
    adviser: "Nami",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The user interface mockups lack accessibility features.",
    date: "March 24, 2025",
    status: 'archived',
  },
  {
    id: 4,
    adviser: "Usopp",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The database schema needs optimization.",
    date: "March 23, 2025",
    status: 'active',
  },
  {
    id: 5,
    adviser: "Sanji",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Review the project's security protocols.",
    date: "March 22, 2025",
    status: 'active',
  },
  {
    id: 6,
    adviser: "Tony Tony Chopper",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "Ensure the project documentation is thorough and well-organized.",
    date: "March 21, 2025",
    status: 'archived',
  },
  {
    id: 7,
    adviser: "Monkey D. Luffy",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The project's code structure could be more modular.",
    date: "March 20, 2025",
    status: 'active',
  },
  { // Added this item for demonstration
    id: 8,
    adviser: "Monkey D. Luffy",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "This is an archived idea about a pirate ship dashboard.",
    date: "March 19, 2025",
    status: 'archived',
  },
];

const AdviserSuggestionsPage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list");
  const [selectedAdviser, setSelectedAdviser] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'archived'>('all');

  const currentUser = "Monkey D. Luffy";

  const filteredSuggestions = mockSuggestions
    .filter(s => {
      // ** UPDATED FILTER LOGIC **
      if (filterMode === 'mine') {
        if (s.adviser !== currentUser || s.status !== 'active') return false;
      } else if (filterMode === 'archived') {
        // Now checks for archived status AND current user
        if (s.status !== 'archived' || s.adviser !== currentUser) return false;
      } else { // 'all' mode
        if (s.status !== 'active') return false;
      }

      // Secondary filters
      if (date && format(new Date(s.date), "PPP") !== format(date, "PPP")) return false;
      if (!s.adviser.toLowerCase().startsWith(searchQuery.toLowerCase())) return false;

      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getFilterButtonText = () => {
    switch (filterMode) {
      case 'mine':
        return 'My Suggestions';
      case 'archived':
        return 'My Archive'; // <-- Text changed
      default:
        return 'All Suggestions';
    }
  };

  const handleSeeMoreClick = (adviserName: string) => {
    setSelectedAdviser(adviserName);
    setView("details");
  };

  const handleGoBack = () => {
    setView("list");
    setSelectedAdviser(null);
  };
  
  const handleAddClick = () => {
    setView("add");
  };

  if (view === 'add') {
    return <AddSuggestionPage onGoBack={handleGoBack} />;
  }

  if (view === 'details' && selectedAdviser) {
    return <AdviserSuggestionsDetails adviserName={selectedAdviser} onGoBack={handleGoBack} />;
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
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
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
              <DropdownMenuItem onSelect={() => setFilterMode('all')}>
                All Suggestions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterMode('mine')}>
                My Suggestions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterMode('archived')}>
                My Archive {/* <-- Text changed */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleAddClick} className="bg-[#6b0000] hover:bg-[#5a0000] text-white font-bold w-full md:w-auto flex items-center gap-2">
            <PlusCircle size={18} />
            Add Suggestion
          </Button>
        </div>
      </div>
      <div className="p-8">
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
              No suggestions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdviserSuggestionsPage;