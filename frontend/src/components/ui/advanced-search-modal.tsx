'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdvancedSearchModalProps {
  children: React.ReactNode;
}

export function AdvancedSearchModal({ children }: AdvancedSearchModalProps) {
  const [adviser, setAdviser] = useState('');
  const [authors, setAuthors] = useState('');
  const [areaOfStudy, setAreaOfStudy] = useState('');
  const [year, setYear] = useState('');

  const handleSearch = () => {
    console.log({ adviser, authors, areaOfStudy, year });
    // Your search logic goes here
  };

  // Mock data for advisers
  const advisers = [
    'Dr. Elara Vance',
    'Prof. Ronan Gray',
    'Dr. Kenji Tanaka',
    'Ms. Sofia Reyes',
    'Mr. Leo Carter',
  ];

  const areas = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Cybersecurity'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => (currentYear - i).toString());

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-black border-yellow-500/50 text-white rounded-lg shadow-lg shadow-yellow-500/20">
        <DialogHeader className="border-b border-gray-700 pb-4 mb-4">
          <DialogTitle className="text-xl font-bold text-[#E0A800]">Advanced Search</DialogTitle>
        </DialogHeader>
        <div className="p-2 space-y-6">
          <h3 className="text-lg font-semibold text-[#E0A800] text-center">Find Capstone Projects</h3>

          {/* START: Changed Adviser Input to a Select dropdown */}
          <div>
            <label htmlFor="adviser" className="block text-sm font-medium text-[#E0A800] mb-2">
              Adviser
            </label>
            <Select onValueChange={setAdviser} value={adviser}>
              <SelectTrigger className="w-full bg-neutral-900 border-gray-700 text-white focus:ring-[#E0A800] focus:border-[#E0A800]">
                <SelectValue placeholder="Select an adviser" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-gray-700 text-white">
                {advisers.map((name) => (
                  <SelectItem key={name} value={name} className="hover:bg-neutral-800 focus:bg-neutral-800">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* END: Changed Adviser Input */}

          {/* Author/s Input */}
          <div>
            <label htmlFor="authors" className="block text-sm font-medium text-[#E0A800] mb-2">
              Author/s
            </label>
            <Input
              id="authors"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="w-full bg-neutral-900 border-gray-700 text-white placeholder-gray-500 focus:ring-[#E0A800] focus:border-[#E0A800]"
            />
          </div>

          {/* Area of Study Select */}
          <div>
            <label htmlFor="areaOfStudy" className="block text-sm font-medium text-[#E0A800] mb-2">
              Area of Study
            </label>
            <Select onValueChange={setAreaOfStudy} value={areaOfStudy}>
              <SelectTrigger className="w-full bg-neutral-900 border-gray-700 text-white focus:ring-[#E0A800] focus:border-[#E0A800]">
                <SelectValue placeholder="Select an area" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-gray-700 text-white">
                {areas.map((area) => (
                  <SelectItem key={area} value={area} className="hover:bg-neutral-800 focus:bg-neutral-800">
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-[#E0A800] mb-2">
              Select Year
            </label>
            <Select onValueChange={setYear} value={year}>
              <SelectTrigger className="w-full bg-neutral-900 border-gray-700 text-white focus:ring-[#E0A800] focus:border-[#E0A800]">
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-gray-700 text-white">
                {years.map((y) => (
                  <SelectItem key={y} value={y} className="hover:bg-neutral-800 focus:bg-neutral-800">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Find Project Button */}
          <Button
            onClick={handleSearch}
            className="w-full bg-[#E0A800] text-black font-semibold hover:bg-yellow-600 transition-colors py-2"
          >
            Find Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}