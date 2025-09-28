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

// Import the AddUser component
import AddAdmin from "./add-admin"; // Adjust this path to the correct location of your AddUser component.

interface User {
  id: number;
  name: string;
  email: string;
}

interface AdminViewProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
  filteredUsers: User[];
  onEditUser: (userId: number) => void;
  onAddUser: () => void;
  onDeleteUser: (userId: number) => void;
}

const AdminView = ({
  searchQuery,
  onSearchChange,
  onClear,
  placeholder,
  filteredUsers,
  onEditUser,
  onAddUser,
  onDeleteUser,
}: AdminViewProps) => {
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null
  );

  // State to manage the visibility of the modal dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false); // New state for fade-out animation

  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleRowClick = (e: React.MouseEvent, userId: number) => {
    setSelectedUserId(userId);
    setIsFadingOut(false); // Reset fade-out state
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFadingOut(true); // Trigger fade-out animation
  };

  // New handler for when the animation ends
  const handleAnimationEnd = () => {
    if (isFadingOut) {
      setIsModalOpen(false); // Close modal after animation
      setIsFadingOut(false);
      setSelectedUserId(null); // Clear selected user
    }
  };

  const handleActionClick = (userId: number, action: "edit" | "delete") => {
    if (action === "edit") {
      onEditUser(userId);
    } else {
      onDeleteUser(userId);
    }
    handleCloseModal();
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
      {/* Search and Date Pickers... (This part remains the same) */}
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

        {/* Add User button with a new click handler */}
        <button
          className="flex items-center justify-center opacity-70 transition-transform duration-200 hover:rounded-[25px] hover:scale-110 hover:opacity-100"
          onClick={onAddUser}
        >
          <img
            src="/images/add-user.png"
            alt="Add User"
            className="h-12 w-12"
          />
        </button>
      </div>

      <div className="relative max-h-[60vh] overflow-y-auto">
        <Table removeWrapper aria-label="Proponent user data table">
          <TableHeader>
            <TableColumn className="bg-[#8B0000] text-white text-left">NAME</TableColumn>
            <TableColumn className="bg-[#8B0000] text-white text-left">EMAIL</TableColumn>
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
                  {user.email}
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
    </div>
  );
};

export default AdminView;
