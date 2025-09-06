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
  department: string;
  program: string;
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
      return (
        advisee.full_name.toLowerCase().includes(searchLower) ||
        advisee.department.toLowerCase().includes(searchLower) ||
        advisee.program.toLowerCase().includes(searchLower)
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
          <div className="relative flex items-center w-full grow md:max-w-md rounded-md border border-input bg-background overflow-hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <InputWithClear
              type="search"
              placeholder="Search by Name, Department, or Program"
              className={cn(
                "ml-10 w-full border-none bg-none focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleClear}
            />
          </div>
        </div>

        <div className="relative max-h-full overflow-y-auto">
          <Table removeWrapper aria-label="Advisee data table">
            <TableHeader>
              <TableColumn className="sticky top-0 z-10 bg-[#EDB4B4] text-left">
                FULL NAME
              </TableColumn>
              <TableColumn className="sticky top-0 z-10 bg-[#EDB4B4] text-left">
                DEPARTMENT
              </TableColumn>
              <TableColumn className="sticky top-0 z-10 bg-[#EDB4B4] text-left">
                PROGRAM
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
