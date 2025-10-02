"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ActionApprovedRequestProps {
  onConfirm: (grantDate: Date, expiryDate: Date) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ActionApprovedRequest: React.FC<ActionApprovedRequestProps> = ({
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const [grantDate, setGrantDate] = useState<Date | undefined>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleConfirm = () => {
    if (!grantDate || !expiryDate) {
      setError("Please select both a grant and an expiry date.");
      return;
    }
    if (expiryDate < grantDate) {
      setError("Expiry date cannot be before the grant date.");
      return;
    }
    setError(null);
    onConfirm(grantDate, expiryDate);
    // Assuming confirmation is successful, show the success dialog
    setShowSuccessDialog(true);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    onCancel(); // Close the main modal after success
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
        <div className="bg-white rounded-md shadow-md p-6 w-96 text-center border border-gray-300 ml-65">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Approve Access Request
          </h3>
          <p className="text-sm text-gray-600 mb-6 break-words">
            Please set the grant and expiry date for the document access.
          </p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Grant Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal shadow-md rounded-md border-gray-300",
                      !grantDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {grantDate ? (
                      format(grantDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-md shadow-md border-gray-300">
                  <Calendar
                    mode="single"
                    selected={grantDate}
                    onSelect={setGrantDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Expiry Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal shadow-md rounded-md border-gray-300",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 " />
                    {expiryDate ? (
                      format(expiryDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-md shadow-md border-gray-300">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    disabled={{ before: grantDate || new Date() }}
                    initialFocus
                    className="rounded-md shadow-md border-gray-300"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-[#660000] hover:bg-[#660000] hover:text-white transition-transform duration-200 ease-in-out hover:scale-105 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Approving..." : "Confirm"}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 bg-gray-300 border-gray-300 hover:bg-[#660000] hover:text-white text-gray-700 transition-transform duration-200 ease-in-out hover:scale-105"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-md shadow-md p-6 w-80 text-center border border-gray-300 ml-65">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Approval Status
            </h3>
            <p className="text-sm text-green-600 font-semibold mb-6">
              Successfully Approved Request!
            </p>
            <Button
              onClick={handleSuccessDialogClose}
              className="w-full bg-[#660000] text-white font-bold py-2 px-4 rounded-md"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionApprovedRequest;
