"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { apiCall, ApiError } from "@/lib/api";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface for the user data received from the API
interface RestrictedUser {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  encrypted_email: string;
  role: "Super Admin" | "Admin" | "Adviser" | "Proponent" | "Viewer";
}

// Interface for the API's pagination structure
interface PaginatedResponse {
  data: RestrictedUser[];
  current_page: number;
  last_page: number;
  total: number;
}

const RestrictedAccounts = () => {
  const [users, setUsers] = useState<RestrictedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // State for multi-select functionality
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Fetch restricted users from the API
  const fetchRestrictedUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
      });
      if (debouncedSearchQuery) {
        params.append("search", debouncedSearchQuery);
      }
      // MODIFIED: Only append role if it's not the placeholder "all" value
      if (roleFilter && roleFilter !== "all") {
        params.append("role", roleFilter);
      }

      const response: PaginatedResponse = await apiCall(
        `/user-mgt/restricted-users?${params.toString()}`
      );

      setUsers(response.data);
      setTotalPages(response.last_page);
    } catch (err: any) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to fetch restricted users."
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, roleFilter]);

  useEffect(() => {
    fetchRestrictedUsers();
  }, [fetchRestrictedUsers]);

  // Handle restoring selected users
  const handleRestoreUsers = async () => {
    if (selectedUserIds.length === 0) return;

    setIsLoading(true);
    try {
      await apiCall("/user-mgt/restricted-users/restore", "POST", {
        user_ids: selectedUserIds,
      });
      setSelectedUserIds([]); // Clear selection
      await fetchRestrictedUsers(); // Refresh the list
    } catch (err: any) {
      setError(
        err instanceof ApiError ? err.message : "Failed to restore users."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "select all" checkbox change
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(users.map((user) => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  // Handle individual row checkbox change
  const handleSelectOne = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, userId]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  // Memoize values for the "select all" checkbox
  const isAllSelected = useMemo(
    () => users.length > 0 && selectedUserIds.length === users.length,
    [selectedUserIds, users]
  );

  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Search Input */}
        <div className="relative flex items-center w-full grow md:max-w-md rounded-md border border-gray-300 shadow-md bg-background overflow-hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <InputWithClear
            type="search"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className={cn(
              "ml-10 w-full rounded-none border-none bg-none focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          {/* Role Filter Dropdown */}
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-[180px] border-gray-300 shadow-md">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              {/* FIXED: Changed value from "" to "all" */}
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Adviser">Adviser</SelectItem>
              <SelectItem value="Proponent">Proponent</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          {/* Restore Button */}
          <Button
            onClick={handleRestoreUsers}
            disabled={selectedUserIds.length === 0 || isLoading}
            className="w-full md:w-auto bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Restore Selected ({selectedUserIds.length})
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="relative max-h-[60vh] overflow-y-auto scrollbar-gutter-stable bg-[radial-gradient(farthest-side_at_50%_0,_rgba(0,0,0,0.2),_rgba(0,0,0,0))] bg-no-repeat [background-size:100%_15px] [background-attachment:local]">
        <Table
          removeWrapper
          aria-label="Restricted accounts table"
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn className="bg-[#660000] text-white text-left w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all rows"
              />
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              NAME
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              EMAIL
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              ROLE
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              isLoading ? "Loading..." : "No restricted users found."
            }
          >
            {users.map((user) => {
              const fullName = [
                user.first_name,
                user.middle_name,
                user.last_name,
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <TableRow key={user.id} className="hover:bg-gray-100">
                  <TableCell className="border-b border-gray-200">
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(user.id, !!checked)
                      }
                      aria-label={`Select row for ${fullName}`}
                    />
                  </TableCell>
                  <TableCell className="border-b border-gray-200">
                    {fullName}
                  </TableCell>
                  <TableCell className="border-b border-gray-200">
                    {user.encrypted_email}
                  </TableCell>
                  <TableCell className="border-b border-gray-200">
                    {user.role}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default RestrictedAccounts;
