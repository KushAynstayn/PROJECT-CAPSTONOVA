"use client";

import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import ActionApprovedRequest from "@/components/ui/action-approved-request";
import { ApiError } from "@/lib/api";

// Interface matches the structure from the DocumentRequestController index method
interface DocumentRequest {
  request_id: number;
  viewer: {
    id: number;
    full_name: string;
    email: string;
  };
  project: {
    id: number;
    title: string;
  };
  request_date: string;
  status: string;
}

interface AccessRequestViewProps {
  requests: DocumentRequest[];
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onApprove: (
    requestId: number,
    grantDate: Date,
    expiryDate: Date
  ) => Promise<void>;
  onDecline: (requestId: number) => Promise<void>;
  isLoading: boolean;
}

const AccessRequestView = ({
  requests,
  searchQuery,
  onSearchChange,
  onClear,
  placeholder,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApprove,
  onDecline,
  isLoading,
}: AccessRequestViewProps) => {
  const [selectedRequest, setSelectedRequest] =
    useState<DocumentRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleRowClick = (request: DocumentRequest) => {
    setSelectedRequest(request);
    setActionError(null);
    setIsFadingOut(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFadingOut(true);
  };

  const handleAnimationEnd = () => {
    if (isFadingOut) {
      setIsModalOpen(false);
      setIsFadingOut(false);
      setSelectedRequest(null);
    }
  };

  const handleApproveClick = () => {
    setIsModalOpen(false);
    setIsApproveModalOpen(true);
  };

  const handleDeclineClick = async () => {
    if (!selectedRequest) return;
    setIsActionLoading(true);
    setActionError(null);
    try {
      await onDecline(selectedRequest.request_id);
      handleCloseModal();
    } catch (err: any) {
      setActionError(err.message || "Failed to decline request.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmApproval = async (grantDate: Date, expiryDate: Date) => {
    if (!selectedRequest) return;
    setIsActionLoading(true);
    setActionError(null);
    try {
      await onApprove(selectedRequest.request_id, grantDate, expiryDate);
      setIsApproveModalOpen(false);
      setSelectedRequest(null);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setActionError(err.message);
      } else {
        setActionError("An unexpected error occurred during approval.");
      }
      // Re-open approve modal on error to show message
      setIsApproveModalOpen(true);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease-out forwards;
        }
        .animate-fade-out {
          animation: fadeOut 0.15s ease-in forwards;
        }
      `}</style>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative flex items-center w-full grow md:max-w-md rounded-md border border-gray-500 bg-background overflow-hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <InputWithClear
            type="search"
            className={cn(
              "ml-10 w-full border-none bg-none focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            placeholder={placeholder}
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClear}
          />
        </div>
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal md:w-48",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, "LLL dd, y")
                ) : (
                  <span>Start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={onStartDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal md:w-48",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "LLL dd, y") : <span>End date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={onEndDateChange}
                disabled={startDate ? { before: startDate } : false}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="relative max-h-[60vh] overflow-y-auto">
        <Table removeWrapper aria-label="Access request data table">
          <TableHeader>
            <TableColumn className="bg-[#660000] text-white text-left">
              NAME
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              EMAIL
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              DATE REQUESTED
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              REQUESTED DOCUMENT
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              isLoading ? "Loading..." : "No pending access requests."
            }
          >
            {requests.map((request) => (
              <TableRow
                key={request.request_id}
                className="hover:bg-[#660000] hover:text-white cursor-pointer transition-colors duration-200"
                onClick={() => handleRowClick(request)}
              >
                <TableCell className="border-b border-gray-200">
                  {request.viewer.full_name}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {request.viewer.email}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {format(new Date(request.request_date), "PPP")}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {request.project.title}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            ref={modalRef}
            onAnimationEnd={handleAnimationEnd}
            className={cn(
              "relative rounded-lg bg-white p-8 shadow-2xl ml-65",
              isFadingOut ? "animate-fade-out" : "animate-fade-in"
            )}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="font-semibold text-gray-700">Choose an action:</p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleApproveClick}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600"
                >
                  <img
                    src="/images/check.png"
                    alt="Approve"
                    className="h-12 w-12"
                  />
                  <span className="text-sm">Approve</span>
                </Button>
                <Button
                  onClick={handleDeclineClick}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md bg-red-500 text-white shadow-md hover:bg-red-600"
                  disabled={isActionLoading}
                >
                  <img
                    src="/images/cross.png"
                    alt="Decline"
                    className="h-12 w-12"
                  />
                  <span className="text-sm">
                    {isActionLoading ? "Declining..." : "Decline"}
                  </span>
                </Button>
              </div>
              {actionError && (
                <p className="text-red-500 text-sm mt-2">{actionError}</p>
              )}
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute right-2 top-2 text-gray-400 transition-transform hover:scale-120 hover:text-gray-600"
            >
              <img src="/images/close.png" alt="Close" className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {isApproveModalOpen && selectedRequest && (
        <ActionApprovedRequest
          onConfirm={(grantDate, expiryDate) =>
            handleConfirmApproval(grantDate, expiryDate)
          }
          onCancel={() => setIsApproveModalOpen(false)}
          isLoading={isActionLoading}
        />
      )}
    </div>
  );
};

export default AccessRequestView;
