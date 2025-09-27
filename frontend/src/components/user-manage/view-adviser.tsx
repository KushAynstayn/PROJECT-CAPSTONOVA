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

interface Adviser {
  id: number;
  name: string;
  email: string;
  advisees_count: number;
}

interface AdviserViewProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
  filteredUsers: Adviser[];
  onEditUser: (userId: number) => void;
  onViewSuggestions: (adviser: Adviser) => void;
  onDeleteUser: (userId: number) => void;
  onAddUser: () => void;
}

const AdviserView = ({
  searchQuery,
  onSearchChange,
  onClear,
  placeholder,
  filteredUsers,
  onEditUser,
  onViewSuggestions,
  onDeleteUser,
  onAddUser,
}: AdviserViewProps) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

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
      onDeleteUser(userId);
    }
    handleCloseModal();
  };

  const handleViewSuggestions = (e: React.MouseEvent, adviser: Adviser) => {
    e.stopPropagation();
    onViewSuggestions(adviser);
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
        <div className="w-full grow md:max-w-md">
          <InputWithClear
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClear}
          />
        </div>
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

      <div className="relative max-h-[60vh] overflow-y-auto scrollbar-gutter-stable bg-[radial-gradient(farthest-side_at_50%_0,_rgba(0,0,0,0.2),_rgba(0,0,0,0))] bg-no-repeat [background-size:100%_15px] [background-attachment:local]">
        <Table removeWrapper aria-label="Viewer data table" isHeaderSticky>
          <TableHeader>
            <TableColumn className={cn("bg-[#660000] text-left text-white")}>
              NAME
            </TableColumn>
            <TableColumn className={cn("bg-[#660000] text-left text-white")}>
              EMAIL
            </TableColumn>
            <TableColumn className={cn("bg-[#660000] text-left text-white")}>
              ADVISEES COUNT
            </TableColumn>
            <TableColumn className={cn("bg-[#660000] text-left text-white")}>
              SUGGESTIONS
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No users match the current filters."}>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className={cn(
                  "hover:bg-[#660000] hover:text-white cursor-pointer transition-colors duration-200",
                  selectedUserId === user.id && "bg-[#660000] text-white"
                )}
                onClick={(e) => handleRowClick(e, user.id)}
              >
                <TableCell className="border-b border-gray-200">
                  {user.name}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {user.email}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {user.advisees_count}
                </TableCell>
                <TableCell className="border-b border-gray-200 w-10">
                  <Button
                    onClick={(e) => handleViewSuggestions(e, user)}
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
                  <span className="text-sm">Restrict</span>
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

export default AdviserView;
