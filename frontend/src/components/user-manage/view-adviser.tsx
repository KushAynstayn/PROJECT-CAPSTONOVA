"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
// Import the AddAdviser component
import AddAdviser from "./add-adviser";

// Adviser interface for type safety
interface Adviser {
  id: number;
  name: string;
  idNumber: string;
  email: string;
  numberOfAdvisees: string;
}

interface AdviserViewProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
  filteredUsers: Adviser[];
  onEditUser: (userId: number) => void;
  onViewSuggestions: (adviser: Adviser) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

const AdviserView = ({
  searchQuery,
  onSearchChange,
  onClear,
  placeholder,
  filteredUsers,
  onEditUser,
  onViewSuggestions,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: AdviserViewProps) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  // State to manage the visibility of the AddAdviser modal
  const [isAddAdviserModalOpen, setIsAddAdviserModalOpen] = useState(false);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleRowClick = (e: React.MouseEvent, userId: number) => {
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

  const handleActionClick = (userId: number, action: "edit" | "delete") => {
    if (action === "edit") {
      onEditUser(userId);
    } else {
      console.log(`Action: ${action} for User ID: ${userId}`);
    }
    handleCloseModal();
  };

  const handleViewSuggestions = (e: React.MouseEvent, userId: number) => {
    e.stopPropagation();
    const adviserToView = filteredUsers.find((user) => user.id === userId);
    if (adviserToView) {
      onViewSuggestions(adviserToView);
    }
  };

  // This function will be called when the Add User button is clicked.
  const handleOpenAddAdviserModal = () => {
    setIsAddAdviserModalOpen(true);
  };

  // This function will be called to close the AddAdviser modal.
  const handleCloseAddAdviserModal = () => {
    setIsAddAdviserModalOpen(false);
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

      {/* Search bar + Add User */}
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

        {/* Add User button, now with the correct onClick handler */}
        <button
          className="flex items-center justify-center opacity-70 transition-transform duration-200 hover:rounded-[25px] hover:scale-110 hover:opacity-100"
          onClick={handleOpenAddAdviserModal} // This now opens the modal
        >
          <img
            src="/images/add-user.png"
            alt="Add User"
            className="h-12 w-12"
          />
        </button>
      </div>

      {/* Table */}
      <div
        ref={scrollContainerRef}
        className="relative max-h-[60vh] overflow-y-auto"
      >
        <Table removeWrapper aria-label="Adviser user data table">
          <TableHeader>
            <TableColumn className="bg-[#EDB4B4] text-left">NAME</TableColumn>
            <TableColumn className="bg-[#EDB4B4] text-left">
              ID NUMBER
            </TableColumn>
            <TableColumn className="bg-[#EDB4B4] text-left">EMAIL</TableColumn>
            <TableColumn className="bg-[#EDB4B4] text-left">
              NUMBER OF ADVISEES
            </TableColumn>
            <TableColumn className="bg-[#EDB4B4] text-left">
              SUGGESTIONS
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No users match the current filters."}>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className={cn(
                  "hover:bg-gray-100 cursor-pointer",
                  selectedUserId === user.id && "bg-gray-200"
                )}
                onClick={(e) => handleRowClick(e, user.id)}
              >
                <TableCell className="border-b border-gray-200">
                  {user.name}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {user.idNumber}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {user.email}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {user.numberOfAdvisees}
                </TableCell>
                <TableCell className="border-b border-gray-200 w-10">
                  <Button
                    onClick={(e) => handleViewSuggestions(e, user.id)}
                    className="bg-[#6b211d] text-white font-serif rounded-1px shadow-md hover:bg-[#8c2d29]"
                  >
                    View Suggestions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Action Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            ref={modalRef}
            onAnimationEnd={handleAnimationEnd}
            className={cn(
              "relative rounded-lg bg-white p-8 shadow-2xl",
              isFadingOut ? "animate-fade-out" : "animate-fade-in"
            )}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="font-semibold text-gray-700">Choose an action:</p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    selectedUserId && handleActionClick(selectedUserId, "edit")
                  }
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md bg-blue-500 text-white shadow-md hover:bg-blue-600"
                >
                  <img
                    src="/images/edit.png"
                    alt="Edit"
                    className="h-12 w-12"
                  />
                  <span className="text-sm">Edit</span>
                </Button>
                <Button
                  onClick={() =>
                    selectedUserId &&
                    handleActionClick(selectedUserId, "delete")
                  }
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md bg-red-500 text-white shadow-md hover:bg-red-600"
                >
                  <img
                    src="/images/trash.png"
                    alt="Delete"
                    className="h-12 w-12"
                  />
                  <span className="text-sm">Delete</span>
                </Button>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute right-2 top-2 text-gray-400 transition-transform hover:scale-110 hover:text-gray-600"
            >
              <img src="/images/close.png" alt="Close" className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Conditionally render the AddAdviser modal */}
      {isAddAdviserModalOpen && (
        <AddAdviser onClose={handleCloseAddAdviserModal} />
      )}
    </div>
  );
};

export default AdviserView;
