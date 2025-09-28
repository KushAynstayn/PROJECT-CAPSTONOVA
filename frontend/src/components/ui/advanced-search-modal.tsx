"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedSearchModalProps {
  children: React.ReactNode;
}

export function AdvancedSearchModal({ children }: AdvancedSearchModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [adviser, setAdviser] = useState("");
  const [platformType, setPlatformType] = useState("");
  const [keywords, setKeywords] = useState("");
  const [languages, setLanguages] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (title) params.append("title", title);
    if (adviser) params.append("adviser", adviser);
    if (platformType) params.append("platform_type", platformType);
    if (yearFrom) params.append("year_from", yearFrom);
    if (yearTo) params.append("year_to", yearTo);

    // Helper function to safely process and append array-like string values
    const appendArrayParams = (paramName: string, value: string) => {
      if (value && typeof value === "string") {
        const values = value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
        if (values.length > 0) {
          values.forEach((val) => {
            params.append(`${paramName}[]`, val);
          });
        }
      }
    };

    appendArrayParams("authors", authors);
    appendArrayParams("keywords", keywords);
    appendArrayParams("languages", languages);

    // Navigate to the projects page with the query string
    router.push(`/projects?${params.toString()}`);
    setIsOpen(false); // Close the modal after search
  };

  const platformTypes = ["Desktop", "Web", "Mobile", "IoT"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2009 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px] bg-black border-yellow-500/50 text-white rounded-lg shadow-lg shadow-yellow-500/20">
        <DialogHeader className="border-b border-gray-700 pb-4 mb-4">
          <DialogTitle className="text-xl font-bold text-[#E0A800]">
            Advanced Search
          </DialogTitle>
        </DialogHeader>
        <div className="p-2 space-y-4 max-h-[70vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-[#E0A800] text-center">
            Find Capstone Projects
          </h3>

          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#E0A800] mb-2"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border-gray-700 text-white placeholder-gray-500 focus:ring-[#E0A800] focus:border-[#E0A800]"
            />
          </div>

          {/* Author/s Input */}
          <div>
            <label
              htmlFor="authors"
              className="block text-sm font-medium text-[#E0A800] mb-2"
            >
              Author/s (comma-separated)
            </label>
            <Input
              id="authors"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="w-full bg-neutral-900 border-gray-700 text-white placeholder-gray-500 focus:ring-[#E0A800] focus:border-[#E0A800]"
            />
          </div>

          {/* Adviser Input */}
          <div>
            <label
              htmlFor="adviser"
              className="block text-sm font-medium text-[#E0A800] mb-2"
            >
              Adviser
            </label>
            <Input
              id="adviser"
              value={adviser}
              onChange={(e) => setAdviser(e.target.value)}
              className="w-full bg-neutral-900 border-gray-700 text-white placeholder-gray-500 focus:ring-[#E0A800] focus:border-[#E0A800]"
            />
          </div>

          {/* Platform Type Select */}
          <div>
            <label
              htmlFor="platformType"
              className="block text-sm font-medium text-[#E0A800] mb-2"
            >
              Platform Type
            </label>
            <Select onValueChange={setPlatformType} value={platformType}>
              <SelectTrigger className="w-full bg-neutral-900 border-gray-700 text-white focus:ring-[#E0A800] focus:border-[#E0A800]">
                <SelectValue placeholder="Select a platform type" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-gray-700 text-white">
                {platformTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="hover:bg-neutral-800 focus:bg-neutral-800"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords Input */}
          <div>
            <label
              htmlFor="keywords"
              className="block text-sm font-medium text-[#E0A800] mb-2"
            >
              Keywords (comma-separated)
            </label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-neutral-900 border-gray-700 text-white placeholder-gray-500 focus:ring-[#E0A800] focus:border-[#E0A800]"
            />
          </div>

          {/* Languages Input */}
          <div>
            <label
              htmlFor="languages"
              className="block text-sm font-medium text-[#E0A800] mb-2"
            >
              Languages (comma-separated)
            </label>
            <Input
              id="languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="w-full bg-neutral-900 border-gray-700 text-white placeholder-gray-500 focus:ring-[#E0A800] focus:border-[#E0A800]"
            />
          </div>

          {/* Year Range Select */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="yearFrom"
                className="block text-sm font-medium text-[#E0A800] mb-2"
              >
                Year From
              </label>
              <Select onValueChange={setYearFrom} value={yearFrom}>
                <SelectTrigger className="w-full bg-neutral-900 border-gray-700 text-white focus:ring-[#E0A800] focus:border-[#E0A800]">
                  <SelectValue placeholder="Start year" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-gray-700 text-white">
                  {years.map((y) => (
                    <SelectItem
                      key={`from-${y}`}
                      value={y}
                      className="hover:bg-neutral-800 focus:bg-neutral-800"
                    >
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="yearTo"
                className="block text-sm font-medium text-[#E0A800] mb-2"
              >
                Year To
              </label>
              <Select onValueChange={setYearTo} value={yearTo}>
                <SelectTrigger className="w-full bg-neutral-900 border-gray-700 text-white focus:ring-[#E0A800] focus:border-[#E0A800]">
                  <SelectValue placeholder="End year" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-gray-700 text-white">
                  {years.map((y) => (
                    <SelectItem
                      key={`to-${y}`}
                      value={y}
                      className="hover:bg-neutral-800 focus:bg-neutral-800"
                    >
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSearch}
              className="w-full bg-[#E0A800] text-black font-semibold hover:bg-yellow-600 transition-colors py-2"
            >
              Find Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
