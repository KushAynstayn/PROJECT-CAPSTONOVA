// src/components/AdviserSuggestionsDetails.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: number;
  adviser: string;
  adviserImage: string;
  suggestion: string;
  date: string;
  isArchived: boolean;
}

const mockSuggestions: Suggestion[] = [
  // This mock data now includes a new 'isArchived' property.
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
    isArchived: true,
  },
  {
    id: 9,
    adviser: "Jimbei",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The project's testing plan is incomplete. Add more unit tests and integration tests to ensure the application is robust and reliable.",
    date: "March 18, 2025",
    isArchived: true,
  },
  {
    id: 10,
    adviser: "Edward Teach",
    adviserImage: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion: "The project's performance is sluggish. Consider optimizing database queries and implementing caching to speed up data retrieval.",
    date: "March 17, 2025",
    isArchived: true,
  },
];

interface AdviserSuggestionsDetailsProps {
  adviserName: string;
  onGoBack: () => void;
}

const AdviserSuggestionsDetails = ({ adviserName, onGoBack }: AdviserSuggestionsDetailsProps) => {
  const [viewMode, setViewMode] = useState<'uploaded' | 'archived'>('uploaded');
  
  const adviserSuggestions = mockSuggestions
    .filter(s => s.adviser === adviserName)
    .filter(s => viewMode === 'uploaded' ? !s.isArchived : s.isArchived);

  return (
    <div>
      {/* Header for Details View with Back Button and Buttons */}
      <div className="flex items-center justify-between p-4"> {/* Added justify-between */}
        <div className="flex items-center"> {/* Group back button and title */}
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mr-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Suggestions of {adviserName}</h1>
        </div>

        {/* Buttons now aligned with the header */}
        <div className="flex space-x-2">
          {/* Uploaded Button */}
          <Button
            onClick={() => setViewMode('uploaded')}
            className={cn(
              "px-6 py-2 rounded-full font-semibold transition-colors duration-200",
              viewMode === 'uploaded'
                ? "bg-[#6b0000] hover:bg-[#5c0000] text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            )}
          >
            Uploaded
          </Button>
          {/* Archived Button */}
          <Button
            onClick={() => setViewMode('archived')}
            className={cn(
              "px-6 py-2 rounded-full font-semibold transition-colors duration-200",
              viewMode === 'archived'
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            )}
          >
            Archived
          </Button>
        </div>
      </div>
      
      {/* Suggestions List for the specific adviser based on viewMode */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adviserSuggestions.length > 0 ? (
            adviserSuggestions.map((s) => (
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
                </div>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No suggestions found for this adviser.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdviserSuggestionsDetails;