"use client";

import React from "react";
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

interface User {
  id: number;
  name: string;
  idNumber: string;
  dateRequested: string;
  requestedDoc: string;
}

interface ApprovalHistoryViewProps {
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

const ApprovalHistoryView = ({
  searchQuery,
  onSearchChange,
  onClear,
  placeholder,
  filteredUsers,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: ApprovalHistoryViewProps) => {

  return (
    <div>
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
        <Table removeWrapper aria-label="Approval history data table">
          <TableHeader className="min-w-[800px]">
           
            <TableColumn className="w-32 bg-[#EDB4B4] text-left">NAME</TableColumn>
            <TableColumn className="w-32 bg-[#EDB4B4] text-left">ID NUMBER</TableColumn>
            <TableColumn className="w-32 bg-[#EDB4B4] text-left">DATE REQUESTED</TableColumn>
            <TableColumn className="w-80 bg-[#EDB4B4] text-left">REQUESTED DOCUMENT</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No approval history found."}>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
              
                <TableCell className="w-32 border-b border-gray-200">{user.name}</TableCell>
                <TableCell className="w-32 border-b border-gray-200">{user.idNumber}</TableCell>
                <TableCell className="w-32 border-b border-gray-200">{user.dateRequested}</TableCell>
                <TableCell className="w-80 border-b border-gray-200">{user.requestedDoc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApprovalHistoryView;
