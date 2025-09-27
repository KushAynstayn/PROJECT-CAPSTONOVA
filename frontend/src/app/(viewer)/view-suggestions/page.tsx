'use client';

import React, { useState, useRef, useEffect } from 'react';
// 1. Import Carousel components from Shadcn UI
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'; // Make sure this path is correct for your project structure

// Define the Suggestion interface
interface Suggestion {
  adviserName: string;
  role: string;
  suggestionText: string;
  uploadDate: string;
}

const ViewSuggestions = () => {
  // Sample data for adviser suggestions
  const suggestions: Suggestion[] = [
    {
      adviserName: 'Monkey D. Luffy',
      role: 'Adviser',
      suggestionText:
        "Consider integrating a real-time collaboration feature to allow multiple students to edit the proposal simultaneously. This will greatly improve the team's efficiency and communication.",
      uploadDate: 'March 26, 2025',
    },
    {
      adviserName: 'Roronoa Zoro',
      role: 'Adviser',
      suggestionText:
        "Your project scope is too broad. Focus on a specific aspect of the 'Smart Library System' to ensure a more manageable and high-quality outcome.",
      uploadDate: 'March 25, 2025',
    },
    {
      adviserName: 'Nami',
      role: 'Adviser',
      suggestionText:
        'The user interface mockups are good, but they lack accessibility features. Make sure to include proper contrast and navigation for all users.',
      uploadDate: 'March 24, 2025',
    },
    {
      adviserName: 'Sanji Vinsmoke',
      role: 'Adviser',
      suggestionText:
        'The project plan is missing key ingredients. Define your technology stack and component architecture clearly before starting development.',
      uploadDate: 'March 23, 2025',
    },
    {
      adviserName: 'Nico Robin',
      role: 'Adviser',
      suggestionText:
        'Your literature review needs more depth. Research historical data and previous systems to build a stronger foundation for your project.',
      uploadDate: 'March 22, 2025',
    },
    {
      adviserName: 'Tony Tony Chopper',
      role: 'Adviser',
      suggestionText:
        'Ensure the application is user-friendly to prevent user frustration. Consider the well-being of the end-user in your design choices.',
      uploadDate: 'March 21, 2025',
    },
  ];

  // 2. Sample data for AI suggestions
  const aiSuggestions: Suggestion[] = [
    {
      adviserName: 'AI Assistant',
      role: 'Syntax & Grammar',
      suggestionText:
        'In section 2.1, the phrase "the data is..." should be "the data are..." for formal academic writing, as "data" is the plural of "datum".',
      uploadDate: 'March 26, 2025',
    },
    {
      adviserName: 'AI Assistant',
      role: 'Clarity Enhancement',
      suggestionText:
        'The abstract is a bit vague. Try rephrasing the sentence "This project will make things better" to specify what will be improved and for whom.',
      uploadDate: 'March 26, 2025',
    },
    {
      adviserName: 'AI Assistant',
      role: 'Structural Analysis',
      suggestionText:
        'The "Methodology" section seems to jump directly into implementation details. Consider adding a subsection that outlines the research design first.',
      uploadDate: 'March 26, 2025',
    },
    {
      adviserName: 'AI Assistant',
      role: 'Citation Check',
      suggestionText:
        'The citation for Smith (2023) in the literature review appears to be missing from the bibliography. Please verify and add it.',
      uploadDate: 'March 26, 2025',
    },
    {
      adviserName: 'AI Assistant',
      role: 'Scope Suggestion',
      suggestionText:
        'Based on your project timeline, the goal of creating three mobile apps is ambitious. Consider starting with a single cross-platform web application.',
      uploadDate: 'March 26, 2025',
    },
  ];

  const [selectedAdviser, setSelectedAdviser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest' | 'alphabetical'>('latest');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSeeMoreClick = (adviserName: string) => {
    setSelectedAdviser(adviserName);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const handleGoBack = () => {
    setSelectedAdviser(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSelectedAdviser(null);
  };

  const handleSortChange = (order: 'latest' | 'oldest' | 'alphabetical') => {
    setSortOrder(order);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredAndSortedSuggestions = suggestions
    .filter((suggestion) => {
      const matchesAdviser = selectedAdviser === null || suggestion.adviserName === selectedAdviser;
      const matchesSearch = suggestion.adviserName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAdviser && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      if (sortOrder === 'oldest') {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      }
      if (sortOrder === 'alphabetical') {
        return a.adviserName.localeCompare(b.adviserName);
      }
      return 0;
    });

  return (
    <div className="p-4 px-8 mt-32 bg-black min-h-screen text-white">
      {/* START: AI Suggestions Carousel Section */}
      <div className="mb-16">
        <p
          className="mt-1 text-3xl text-[#E0A800]"
          style={{ fontFamily: "'Black Ops One', sans-serif" }}
        >
          AI Suggestions
        </p>
        <Carousel className="w-full mt-6" opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-4">
            {aiSuggestions.map((suggestion, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div
                    className="bg-neutral-900 border-2 border-transparent rounded-lg p-6 flex flex-col h-full
                                   transition-all duration-300 ease-in-out
                                   hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-400/50"
                    style={{
                      borderColor: 'rgba(255, 165, 0, 0.5)',
                      boxShadow: '0 0 10px rgba(255, 165, 0, 0.3), inset 0 0 5px rgba(255, 165, 0, 0.2)',
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-orange-400"
                        >
                          <path d="M12 8V4H8" />
                          <rect width="16" height="12" x="4" y="8" rx="2" />
                          <path d="M2 14h2" />
                          <path d="M20 14h2" />
                          <path d="M15 13v2" />
                          <path d="M9 13v2" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-md font-bold text-[#E0A800]">{suggestion.adviserName}</div>
                        <div className="text-sm text-neutral-400">{suggestion.role}</div>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-neutral-300 italic">"{suggestion.suggestionText}"</p>
                    </div>
                    <div className="mt-6 border-t border-neutral-800 pt-4">
                      <p className="text-sm text-neutral-500">Analyzed: {suggestion.uploadDate}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
      {/* END: AI Suggestions Carousel Section */}

      <div className="mb-8 flex justify-between items-center flex-wrap">
        <div>
          <p
            className="mt-1 text-3xl text-[#E0A800]"
            style={{ fontFamily: "'Black Ops One', sans-serif" }}
          >
            {selectedAdviser ? `Feedback from ${selectedAdviser}` : 'Feedback from Advisers'}
          </p>
        </div>
        {selectedAdviser && (
          <button
            onClick={handleGoBack}
            className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search adviser's name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            Filter
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => handleSortChange('latest')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                Latest to Oldest
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                Oldest to Latest
              </button>
              <button
                onClick={() => handleSortChange('alphabetical')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                Alphabetically
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAndSortedSuggestions.length > 0 ? (
          filteredAndSortedSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-neutral-900 border-2 border-transparent rounded-lg p-6 flex flex-col
                                 transition-all duration-300 ease-in-out
                                 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-400/50"
              style={{
                borderColor: 'rgba(255, 165, 0, 0.5)',
                boxShadow: '0 0 10px rgba(255, 165, 0, 0.3), inset 0 0 5px rgba(255, 165, 0, 0.2)',
              }}
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-400"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-md font-bold text-[#E0A800]">{suggestion.adviserName}</div>
                  <div className="text-sm text-neutral-400">{suggestion.role}</div>
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-neutral-300 italic">"{suggestion.suggestionText}"</p>
              </div>
              <div className="mt-6 border-t border-neutral-800 pt-4">
                <p className="text-sm text-neutral-500">Uploaded: {suggestion.uploadDate}</p>
                {!selectedAdviser && (
                  <button
                    onClick={() => handleSeeMoreClick(suggestion.adviserName)}
                    className="text-sm text-orange-400 hover:text-orange-300 mt-2 inline-block transition-colors"
                  >
                    See more suggestions from this adviser
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-neutral-500 col-span-full py-10">
            <p>No suggestions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSuggestions;