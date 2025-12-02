"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
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

// Matches the backend API response structure
export interface WhitelistItem {
  id: number;
  faculty_id: string;
  role: "Admin" | "Adviser";
  email: string;
}

interface WhitelistViewProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  items: WhitelistItem[];
  onEdit: (item: WhitelistItem) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  isLoading: boolean;
}

const WhitelistView = ({
  searchQuery,
  onSearchChange,
  onClear,
  items,
  onEdit,
  onDelete,
  onAdd,
  isLoading,
}: WhitelistViewProps) => {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [searchTerm, setSearchTerm] = useState(searchQuery);

  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== searchQuery) {
        onSearchChange(searchTerm);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearchChange, searchQuery]);

  const handleRowClick = (item: WhitelistItem) => {
    setSelectedItemId(item.id);
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
      setSelectedItemId(null);
    }
  };

  const handleActionClick = (action: "edit" | "delete") => {
    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;

    if (action === "edit") {
      onEdit(item);
    } else {
      onDelete(item.id);
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

      {/* Top Bar: Search and Add Button */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative flex items-center w-full grow md:max-w-md rounded-md border border-gray-300 shadow-md bg-background overflow-hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <InputWithClear
            className="ml-10 w-full rounded-none border-none bg-none focus-visible:ring-0 focus-visible:ring-offset-0"
            type="search"
            // ✅ CHANGED: Placeholder now indicates only Faculty ID search
            placeholder="Search by Faculty ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => {
              setSearchTerm("");
              onClear();
            }}
          />
        </div>

        <button
          className="flex items-center justify-center opacity-70 transition-transform duration-200 hover:rounded-[25px] hover:scale-110 hover:opacity-100"
          onClick={onAdd}
        >
          <img
            src="/images/add-user.png"
            alt="Add Whitelist"
            className="h-12 w-12"
          />
        </button>
      </div>

      {/* Table */}
      <div className="relative max-h-[60vh] overflow-y-auto">
        <Table removeWrapper aria-label="Faculty Whitelist Table">
          <TableHeader>
            <TableColumn className="bg-[#660000] text-white text-left">
              FACULTY ID
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              ROLE
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              EMAIL
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              isLoading ? "Loading..." : "No whitelist entries found."
            }
            isLoading={isLoading}
          >
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={cn(
                  "hover:bg-[#660000] hover:text-white cursor-pointer transition-colors duration-200",
                  selectedItemId === item.id && "bg-[#660000] text-white"
                )}
                onClick={() => handleRowClick(item)}
              >
                <TableCell className="border-b border-gray-200">
                  {item.faculty_id}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {item.role}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {item.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Action Modal (Edit/Delete) */}
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
              <p className="font-semibold text-gray-700">
                Manage Whitelist Entry:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleActionClick("edit")}
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
                  onClick={() => handleActionClick("delete")}
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

export default WhitelistView;
