'use client';

import React, { useState, useRef, useEffect } from 'react';

// 1. Define the Suggestion interface
interface Suggestion {
  adviserName: string;
  role: string;
  suggestionText: string;
  uploadDate: string;
}

const ViewSuggestions = () => {
  // Sample data with the correct type
  const suggestions: Suggestion[] = [
    {
      adviserName: 'Monkey D. Luffy',
      role: 'Adviser',
      suggestionText: 'Consider integrating a real-time collaboration feature to allow multiple students to edit the proposal simultaneously. This will greatly improve the team\'s efficiency and communication.',
      uploadDate: 'March 26, 2025',
    },
    {
      adviserName: 'Roronoa Zoro',
      role: 'Adviser',
      suggestionText: 'Your project scope is too broad. Focus on a specific aspect of the \'Smart Library System\' to ensure a more manageable and high-quality outcome.',
      uploadDate: 'March 25, 2025',
    },
    {
      adviserName: 'Nami',
      role: 'Adviser',
      suggestionText: 'The user interface mockups are good, but they lack accessibility features. Make sure to include proper contrast and navigation for all users.',
      uploadDate: 'March 24, 2025',
    },
    {
      adviserName: 'Sanji Vinsmoke',
      role: 'Adviser',
      suggestionText: 'The project plan is missing key ingredients. Define your technology stack and component architecture clearly before starting development.',
      uploadDate: 'March 23, 2025',
    },
    {
      adviserName: 'Nico Robin',
      role: 'Adviser',
      suggestionText: 'Your literature review needs more depth. Research historical data and previous systems to build a stronger foundation for your project.',
      uploadDate: 'March 22, 2025',
    },
    {
      adviserName: 'Tony Tony Chopper',
      role: 'Adviser',
      suggestionText: 'Ensure the application is user-friendly to prevent user frustration. Consider the well-being of the end-user in your design choices.',
      uploadDate: 'March 21, 2025',
    },
    {
      adviserName: 'Monkey D. Luffy',
      role: 'Adviser',
      suggestionText: 'Make sure your project includes a version control system like Git to track changes and manage collaboration effectively.',
      uploadDate: 'March 20, 2025',
    },
    {
      adviserName: 'Roronoa Zoro',
      role: 'Adviser',
      suggestionText: 'A solid risk assessment is crucial. Identify potential challenges and outline mitigation strategies.',
      uploadDate: 'March 19, 2025',
    },
  ];

  // 2. Add types to state variables
  const [selectedAdviser, setSelectedAdviser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest' | 'alphabetical'>('latest');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 3. Add types to function parameters
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
    <div className="p-4 bg-black min-h-screen text-white">
      <div className="mb-8 flex justify-between items-center flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">Suggestions</h1>
          <p className="mt-1 text-md text-neutral-400">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
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