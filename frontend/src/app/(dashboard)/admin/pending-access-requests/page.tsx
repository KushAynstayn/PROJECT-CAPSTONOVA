"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PendingRequestNavbar, {
  PendingRequestRole,
} from "@/components/ui/pending-request-navbar";
import AccessRequestView from "../../../../components/access-request/view-access-request";
import ApprovalHistoryView from "../../../../components/access-request/view-approval-history";
import { apiCall } from "@/lib/api";

// Interface for the pending requests from the 'index' method
interface DocumentRequest {
  request_id: number;
  viewer: { id: number; full_name: string; email: string };
  project: { id: number; title: string };
  request_date: string;
  status: string;
}

// Interface for the history data from the 'approvalHistory' method
interface ApprovalHistory {
  history_id: number;
  viewer: { full_name: string };
  project: { title: string };
  approver: { full_name: string };
  request_date: string;
  approval_date: string;
  expiry_date: string;
}

const AdminPendingAccessRequestsPage = () => {
  const [activeRole, setActiveRole] =
    useState<PendingRequestRole>("Access Request");

  const [pendingRequests, setPendingRequests] = useState<DocumentRequest[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydration fix: Ensure we only render client-specific UI after mount
  const [isMounted, setIsMounted] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const fetchAndSetData = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: String(page) });
      if (searchQuery) params.append("project_title", searchQuery);
      if (startDate)
        params.append("start_date", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("end_date", format(endDate, "yyyy-MM-dd"));

      try {
        if (activeRole === "Access Request") {
          params.append("status", "pending");
          // UPDATED: Endpoint changed to /admin/
          const response = await apiCall(
            `/super-admin/document-requests?${params.toString()}`
          );

          setPendingRequests(response.data || []);
          setPagination({
            currentPage: response.current_page,
            totalPages: response.last_page,
          });
        } else if (activeRole === "Approval History") {
          // UPDATED: Endpoint changed to /admin/
          const response = await apiCall(
            `/super-admin/document-requests/approval-history?${params.toString()}`
          );

          setApprovalHistory(response.data || []);
          setPagination({
            currentPage: response.current_page,
            totalPages: response.last_page,
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data.");
        setPendingRequests([]);
        setApprovalHistory([]);
        setPagination({ currentPage: 1, totalPages: 1 });
      } finally {
        setIsLoading(false);
      }
    },
    [activeRole, searchQuery, startDate, endDate]
  );

  useEffect(() => {
    setIsMounted(true); // Mark as mounted to allow client-only rendering
    const debounce = setTimeout(() => {
      fetchAndSetData(1);
    }, 500);
    return () => clearTimeout(debounce);
  }, [fetchAndSetData]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAndSetData(newPage);
    }
  };

  const handleApprove = async (
    requestId: number,
    grantDate: Date,
    expiryDate: Date
  ) => {
    try {
      // UPDATED: Endpoint changed to /admin/
      await apiCall(
        `/super-admin/document-requests/${requestId}/approve`,
        "POST",
        {
          grant_date: format(grantDate, "yyyy-MM-dd"),
          expiry_date: format(expiryDate, "yyyy-MM-dd"),
        }
      );
      fetchAndSetData(pagination.currentPage);
    } catch (error) {
      throw error;
    }
  };

  const handleDecline = async (requestId: number) => {
    try {
      // UPDATED: Endpoint changed to /admin/
      await apiCall(
        `/super-admin/document-requests/${requestId}/reject`,
        "POST"
      );
      fetchAndSetData(pagination.currentPage);
    } catch (error) {
      throw error;
    }
  };

  const renderContent = () => {
    if (activeRole === "Access Request") {
      return (
        <AccessRequestView
          requests={pendingRequests}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder="Search by project title..."
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApprove={handleApprove}
          onDecline={handleDecline}
          isLoading={isLoading}
        />
      );
    }

    if (activeRole === "Approval History") {
      return (
        <ApprovalHistoryView
          history={approvalHistory}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder="Search history by project title..."
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          isLoading={isLoading}
        />
      );
    }
    return null;
  };

  return (
    <main className="mt-0">
      <PendingRequestNavbar
        activeRole={activeRole}
        onSelectRole={(role) => {
          setActiveRole(role);
          setSearchQuery("");
          setStartDate(undefined);
          setEndDate(undefined);
        }}
      />
      <div className="mt-6 p-1">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {renderContent()}

        {/* HYDRATION FIX: Use isMounted to ensure this only renders on client */}
        {isMounted && !isLoading && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm font-medium text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPendingAccessRequestsPage;
