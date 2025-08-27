"use client";

import React, { useState, useEffect } from "react";
import { isWithinInterval, parseISO } from "date-fns";
import PendingRequestNavbar, {
  PendingRequestRole,
} from "@/components/ui/pending-request-navbar";
import AccessRequestView from "../../../../components/access-request/view-access-request";
import ApprovalHistoryView from "../../../../components/access-request/view-approval-history";

// Data from access-request.json to be passed to the view component
import accessRequestsData from "@/data/pending-request.json";
import approvalHistoryData from "@/data/approval-history.json";

// Define the type for a single request object
interface User {
  id: number;
  name: string;
  idNumber: string;
  dateRequested: string;
  requestedDoc: string;
}

const PendingAccessRequestsPage = () => {
  const [activeRole, setActiveRole] = useState<PendingRequestRole>("Access Request");

  // States for search and date filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // This state will hold the data that is currently filtered and displayed
  const [filteredRequests, setFilteredRequests] = useState<User[]>(accessRequestsData as User[]);

  const handleSelectRole = (role: PendingRequestRole) => {
    setActiveRole(role);
  };

  // Handler for search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handler to clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Handler for editing (you can implement this logic later)
  const handleEditRequest = (id: number) => {
    console.log(`Editing request with ID: ${id}`);
  };

  // useEffect to re-filter data whenever search, startDate, or endDate changes
  useEffect(() => {
    // Select the correct data source based on the active role
    let dataSource = activeRole === "Access Request" ? accessRequestsData : approvalHistoryData;
    let newFilteredData = dataSource as User[];

    // Filter by search query first
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      newFilteredData = newFilteredData.filter(
        (request) =>
          request.name.toLowerCase().includes(lowerCaseQuery) ||
          request.idNumber.toLowerCase().includes(lowerCaseQuery) ||
          request.dateRequested.toLowerCase().includes(lowerCaseQuery) ||
          request.requestedDoc.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Then filter by date range
    if (startDate && endDate) {
      newFilteredData = newFilteredData.filter((request) => {
        try {
          // Parse the dateRequested string into a Date object for comparison
          const requestDate = parseISO(request.dateRequested);
          return isWithinInterval(requestDate, { start: startDate, end: endDate });
        } catch (error) {
          console.error("Invalid date format in data:", request.dateRequested);
          return false;
        }
      });
    }

    setFilteredRequests(newFilteredData);
  }, [searchQuery, startDate, endDate, activeRole]);

  const componentMap = {
    "Access Request": (
      <AccessRequestView
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClear={handleClearSearch}
        placeholder="Search by name or document..."
        filteredUsers={filteredRequests}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onEditUser={handleEditRequest}
      />
    ),
    "Approval History": (
      <ApprovalHistoryView
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClear={handleClearSearch}
        placeholder="Search by name or document..."
        filteredUsers={filteredRequests}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onEditUser={handleEditRequest}
      />
    ),
  };

  return (
    <>
      <main className="mt-4">
        <PendingRequestNavbar
          activeRole={activeRole}
          onSelectRole={handleSelectRole}
        />
        <div className="mt-6 p-1">
          {componentMap[activeRole]}
        </div>
      </main>
    </>
  );
};

export default PendingAccessRequestsPage;
