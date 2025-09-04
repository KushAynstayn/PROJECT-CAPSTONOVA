"use client";

import React, { useState, useMemo } from "react";
// UI Components
import { cn } from "@/lib/utils";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { Search } from "lucide-react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

// Import mock data
import adviseesData from "@/data/advisees.json";

const AdviseesPage = () => {
  // State for search and date filters
  const [searchQuery, setSearchQuery] = useState("");

  // State for the table row click and modal
  const [selectedUserId] = useState<number | null>(null);

  // Memoized filtering logic
  const filteredAdvisees = useMemo(() => {
    return adviseesData.filter((advisee) => {
      const searchLower = searchQuery.toLowerCase();
      // NOTE: Date filtering is not included as advisees.json has no date field.
      return (
        advisee.name.toLowerCase().includes(searchLower) ||
        advisee.idNumber.toLowerCase().includes(searchLower) ||
        advisee.ctuEmail.toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery]);

  // Handlers for search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <main className="flex h-full flex-col p-2 pt-2 sm:p-2 lg:p-4 lg:pt-0">
      <div className="flex flex-1 flex-col h-full">
        <h1 className="mb-4 text-2xl font-bold">Advisee</h1>

        {/* Search and Date Filter Section */}
        <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative flex items-center w-full grow md:max-w-md rounded-md border border-input bg-background overflow-hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <InputWithClear
              type="search"
              placeholder="Search by Name, ID, or CTU Email"
              className={cn(
                "ml-10 w-full border-none bg-none focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleClear}
            />
          </div>
        </div>

        {/* Advisees Table */}
        <div className="relative max-h-full overflow-y-auto">
          <Table removeWrapper aria-label="Advisee data table">
            <TableHeader>
              <TableColumn className="sticky top-0 z-10 bg-[#EDB4B4] text-left">
                NAME
              </TableColumn>
              <TableColumn className="sticky top-0 z-10 bg-[#EDB4B4] text-left">
                ID NUMBER
              </TableColumn>
              <TableColumn className="sticky top-0 z-10 bg-[#EDB4B4] text-left">
                CTU EMAIL
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No advisees match the current filters."}>
              {filteredAdvisees.map((advisee) => (
                <TableRow
                  key={advisee.id}
                  className={cn(
                    "hover:bg-gray-100 cursor-pointer",
                    selectedUserId === advisee.id && "bg-gray-200"
                  )}
                >
                  <TableCell className="border-b border-gray-200">
                    {advisee.name}
                  </TableCell>
                  <TableCell className="border-b border-gray-200">
                    {advisee.idNumber}
                  </TableCell>
                  <TableCell className="border-b border-gray-200">
                    {advisee.ctuEmail}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
};

export default AdviseesPage;
