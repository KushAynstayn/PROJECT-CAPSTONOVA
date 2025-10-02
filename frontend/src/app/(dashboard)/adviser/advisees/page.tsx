"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { authStore } from "@/lib/auth";
import { apiCall } from "@/lib/api";

// Interface for the proponent data based on the backend controller
interface Proponent {
  id: number;
  full_name: string;
  department: string | null;
  program: string | null;
  team_roles: {
    hacker: string;
    hipster1: string;
    hipster2: string;
  };
}

const AdviseesPage = () => {
  const router = useRouter();
  const [advisees, setAdvisees] = useState<Proponent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAdvisees = async () => {
      if (
        !authStore.isAuthenticated() ||
        authStore.getUser()?.role.toLowerCase() !== "adviser"
      ) {
        router.push("/login");
        return;
      }
      try {
        const data = await apiCall("/adviser/proponents");
        setAdvisees(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch advisees.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvisees();
  }, [router]);

  const filteredAdvisees = useMemo(() => {
    return advisees.filter((advisee) => {
      const searchLower = searchQuery.toLowerCase();
      // FIX: Add checks for null values before calling .toLowerCase()
      return (
        (advisee.full_name || "").toLowerCase().includes(searchLower) ||
        (advisee.department || "").toLowerCase().includes(searchLower) ||
        (advisee.program || "").toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery, advisees]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <main className="flex h-full flex-col p-2 pt-2 sm:p-2 lg:p-4 lg:pt-0">
      <div className="flex flex-1 flex-col h-full">
        <h1 className="mb-4 text-2xl font-bold">Advisee</h1>

        <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative flex items-center w-full grow md:max-w-md rounded-md border border-gray-300 shadow-md bg-background overflow-hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <InputWithClear
              type="search"
              placeholder="Search by name, department, or program"
              className={cn(
                "ml-10 w-full rounded-none border-none bg-none focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleClear}
            />
          </div>
        </div>

        <div className="relative max-h-[60vh] overflow-y-auto scrollbar-gutter-stable bg-[radial-gradient(farthest-side_at_50%_0,_rgba(0,0,0,0.2),_rgba(0,0,0,0))] bg-no-repeat [background-size:100%_15px] [background-attachment:local]">
          <Table removeWrapper aria-label="Advisee data table" isHeaderSticky>
            <TableHeader>
              <TableColumn className={cn("bg-[#660000] text-left text-white")}>
                FULL NAME
              </TableColumn>
              <TableColumn className={cn("bg-[#660000] text-left text-white")}>
                DEPARTMENT
              </TableColumn>
              <TableColumn className={cn("bg-[#660000] text-left text-white")}>
                PROGRAM
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No advisees match the current filters."}>
              {filteredAdvisees.map((advisee) => (
                <TableRow
                  key={advisee.id}
                  className={cn(
                    "hover:bg-[#660000] hover:text-white cursor-pointer transition-colors duration-200",
                    selectedUserId === advisee.id && "bg-[#660000] text-white"
                  )}
                >
                  <TableCell className="border-b border-gray-200">
                    {advisee.full_name}
                  </TableCell>
                  <TableCell className="border-b border-gray-200">
                    {advisee.department}
                  </TableCell>
                  <TableCell className="border-b border-gray-200">
                    {advisee.program}
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
