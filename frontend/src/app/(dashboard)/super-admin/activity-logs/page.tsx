"use client";

import { useEffect, useState } from "react";
import { apiCall, ApiError } from "@/lib/api";
// import { TopLoader } from "@/components/ui/top-loader"; // <-- REMOVED
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface ActionType {
  id: number;
  action_name: string;
}

interface UserLog {
  log_id: number;
  user_id: number;
  action_type_id: number;
  details: string;
  created_at: string;
  updated_at: string;
  user: User | null;
  action_type: ActionType | null;
}

interface PaginatedLogsResponse {
  current_page: number;
  data: UserLog[];
  from: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  to: number;
  total: number;
}

const formatDateTime = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

export default function UserLogsPage() {
  const [logData, setLogData] = useState<PaginatedLogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(currentPage) });
        const response = await apiCall(
          `/super-admin/user-logs?${params}`,
          "GET"
        );
        setLogData(response as PaginatedLogsResponse);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching logs:", err);
        setError(
          err instanceof ApiError
            ? `API Error (${err.status}): ${err.message}`
            : err.message || "Failed to load logs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserLogs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (logData?.last_page || 1)) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* {loading && <TopLoader />} <-- REMOVED */}
      {/* The loading state is handled by the table body below */}

      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-[#5E0B0B]">
          User Activity Logs
        </h1>

        <Card className="shadow-md border-[#E4DCDC] overflow-hidden">
          {/* Clean header flush to top */}
          <CardHeader className="bg-[#5E0B0B] text-white p-5">
            <CardTitle className="text-xl font-semibold">
              User Log Records
            </CardTitle>
            <CardDescription className="text-white/70 text-sm mt-1">
              Tracking system-wide activities and user interactions.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-center">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F2EAEA] text-[#2B2B2B]">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Action Type</TableHead>
                    <TableHead className="font-semibold">Details</TableHead>
                    <TableHead className="text-right font-semibold">
                      Timestamp
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground h-24"
                      >
                        Loading activity logs...
                      </TableCell>
                    </TableRow>
                  ) : !logData || logData.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground h-24"
                      >
                        No activity logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logData.data.map((log) => (
                      <TableRow
                        key={log.log_id}
                        className="hover:bg-[#5E0B0B]/5 transition-colors"
                      >
                        <TableCell className="font-medium text-[#2B2B2B]">
                          {log.user
                            ? `${log.user.first_name} ${log.user.last_name}`
                            : "System"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="bg-[#5E0B0B]/10 text-[#5E0B0B] border-[#5E0B0B]/20 capitalize"
                            variant="outline"
                          >
                            {log.action_type?.action_name ?? "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#2B2B2B]">
                          {log.details}
                        </TableCell>
                        <TableCell className="text-right text-gray-600 text-sm">
                          {formatDateTime(log.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t bg-[#F8F8F8]">
            <div className="text-sm text-gray-600">
              {logData && logData.total > 0
                ? `Showing ${logData.from} to ${logData.to} of ${logData.total} results`
                : "No results"}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-[#5E0B0B]/40 hover:bg-[#5E0B0B]/10"
              >
                <ChevronLeft className="h-4 w-4 text-[#5E0B0B]" />
              </Button>

              <span className="text-sm font-medium text-[#5E0B0B]">
                Page {currentPage} of {logData?.last_page ?? 1}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === (logData?.last_page ?? 1)}
                className="border-[#5E0B0B]/40 hover:bg-[#5E0B0B]/10"
              >
                <ChevronRight className="h-4 w-4 text-[#5E0B0B]" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
