"use client";

import React from "react";
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

// Interface matches the structure from the approvalHistory method
interface ApprovalHistory {
  history_id: number;
  viewer: {
    full_name: string;
  };
  project: {
    title: string;
  };
  approver: {
    full_name: string;
  };
  request_date: string;
  approval_date: string;
  expiry_date: string;
}

interface ApprovalHistoryViewProps {
  history: ApprovalHistory[];
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  isLoading: boolean;
}

const ApprovalHistoryView = ({
  history,
  searchQuery,
  onSearchChange,
  onClear,
  placeholder,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isLoading,
}: ApprovalHistoryViewProps) => {
  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative flex items-center w-full grow md:max-w-md rounded-md border border-gray-300 shadow-md bg-background overflow-hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <InputWithClear
            type="search"
            className={cn(
              "ml-10 w-full rounded-none border-none bg-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  "w-full justify-start text-left font-normal md:w-48 shadow-md rounded-md border-gray-300",
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
                  "w-full justify-start text-left font-normal md:w-48 shadow-md rounded-md border-gray-300",
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
          <TableHeader>
            <TableColumn className="bg-[#660000] text-white text-left">
              REQUESTER
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              PROJECT TITLE
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              APPROVER
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              APPROVAL DATE
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              EXPIRY DATE
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              isLoading ? "Loading..." : "No approval history found."
            }
          >
            {history.map((item) => (
              <TableRow key={item.history_id}>
                <TableCell className="border-b border-gray-200">
                  {item.viewer.full_name}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {item.project.title}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {item.approver.full_name}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {format(new Date(item.approval_date), "PPP")}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {format(new Date(item.expiry_date), "PPP")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApprovalHistoryView;
