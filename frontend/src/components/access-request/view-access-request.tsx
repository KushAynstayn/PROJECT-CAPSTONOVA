"use client";

import React, { useState, useRef, useEffect } from "react";
// ... other imports remain the same
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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

// Import the new dialog component
import ActionApprovedRequest from "@/components/ui/action-approved-request";

// Define the User interface
interface User {
  id: number;
  name: string;
  idNumber: string;
  dateRequested: string;
  requestedDoc: string;
}

// Define the props interface for this component
interface AccessRequestViewProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
  filteredUsers: User[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onEditUser: (userId: number) => void;
}

const AccessRequestView = ({
  searchQuery,
  onSearchChange,
  onClear,
  placeholder,
  filteredUsers,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onEditUser,
}: AccessRequestViewProps) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isApprovedDialogVisible, setIsApprovedDialogVisible] = useState(false);

  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleRowClick = (userId: number) => {
    setSelectedUserId(userId);
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
      setSelectedUserId(null);
    }
  };

  const handleActionClick = (userId: number, action: "approve" | "decline") => {
    if (action === "approve") {
      setIsModalOpen(false); // Hide the main modal
      setIsApprovedDialogVisible(true); // Show the new dialog
    } else {
      console.log(`Declined user with ID: ${userId}`);
      handleCloseModal();
    }
  };

  const handleApproveConfirm = () => {
    // This is the function that gets called when the user clicks "Yes"
    console.log(
      `Final confirmation to approve user with ID: ${selectedUserId}`
    );
    // Here you would put the final logic to approve the request, like an API call.
    // The ActionApprovedRequest component will then show the success message.
  };

  const handleApproveCancel = () => {
    // This function closes the approval dialog and the main modal
    setIsApprovedDialogVisible(false);
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleMouseEnter = (userId: number) => {
    setHoveredUserId(userId);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsShowingTooltip(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredUserId(null);
    setIsShowingTooltip(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX + 15, y: event.clientY + 15 });
  };

  useEffect(() => {
    if (isShowingTooltip) {
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
      reminderTimeoutRef.current = setTimeout(() => {
        setIsShowingTooltip(false);
      }, 1500);
    }
    return () => {
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
    };
  }, [isShowingTooltip]);

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
        .tooltip-arrow {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #fff; /* Match background color */
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full grow md:max-w-md">
          <InputWithClear
            type="search"
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
          <TableHeader className="min-w-[800px]">
            <TableColumn className="w-32 bg-[#EDB4B4] text-left">
              NAME
            </TableColumn>
            <TableColumn className="w-32 bg-[#EDB4B4] text-left">
              ID NUMBER
            </TableColumn>
            <TableColumn className="w-32 bg-[#EDB4B4] text-left">
              DATE REQUESTED
            </TableColumn>
            <TableColumn className="w-80 bg-[#EDB4B4] text-left">
              REQUESTED DOCUMENT
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No pending access requests."}>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className={cn(
                  "hover:bg-gray-100 cursor-pointer relative",
                  selectedUserId === user.id && "bg-gray-200"
                )}
                onClick={() => handleRowClick(user.id)}
                onMouseEnter={() => handleMouseEnter(user.id)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <TableCell className="w-32 border-b border-gray-200">
                  {user.name}
                </TableCell>
                <TableCell className="w-32 border-b border-gray-200">
                  {user.idNumber}
                </TableCell>
                <TableCell className="w-32 border-b border-gray-200">
                  {user.dateRequested}
                </TableCell>
                <TableCell className="w-80 border-b border-gray-200">
                  {user.requestedDoc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Tooltip outside the table to avoid structural issues */}
      {isShowingTooltip && hoveredUserId !== null && (
        <div
          className="fixed z-50 text-black text-sm px-3 py-1 rounded-md shadow-md bg-white border border-gray-300"
          style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
        >
          Click to approve request
          <div className="tooltip"></div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div
            ref={modalRef}
            onAnimationEnd={handleAnimationEnd}
            className={cn(
              "relative rounded-lg bg-white p-8 shadow-2xl  ml-65",
              isFadingOut ? "animate-fade-out" : "animate-fade-in"
            )}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="font-semibold text-gray-700">Choose an action:</p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    selectedUserId &&
                    handleActionClick(selectedUserId, "approve")
                  }
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
                  onClick={() =>
                    selectedUserId &&
                    handleActionClick(selectedUserId, "decline")
                  }
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md bg-red-500 text-white shadow-md hover:bg-red-600"
                >
                  <img
                    src="/images/cross.png"
                    alt="Decline"
                    className="h-12 w-12"
                  />
                  <span className="text-sm">Decline</span>
                </Button>
              </div>
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

      {isApprovedDialogVisible && (
        <ActionApprovedRequest
          onConfirm={handleApproveConfirm}
          onCancel={handleApproveCancel}
        />
      )}
    </div>
  );
};

export default AccessRequestView;
