"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface UploadWhitelistConfirmProps {
  onConfirm: () => void;
  disabled?: boolean;
}

const UploadWhitelistConfirm: React.FC<UploadWhitelistConfirmProps> = ({
  onConfirm,
  disabled = false,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleTriggerClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmDialog(false);
    onConfirm();
    // Assuming the parent component will show a success message.
    // If you want a modal confirmation, you can re-enable this.
    // setShowSuccessDialog(true);
  };

  const handleConfirmNo = () => {
    setShowConfirmDialog(false);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
  };

  return (
    <>
      <Button
        onClick={handleTriggerClick}
        disabled={disabled}
        variant="outline"
        size="sm"
      >
        Upload Whitelist
      </Button>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg shadow-gray-700/70 p-6 w-80 text-center border border-gray-300">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Confirm Upload
            </h3>
            <p className="text-sm text-gray-600 mb-6 break-words">
              Are you sure you want to upload this whitelist entry?
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleConfirmYes}
                className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-600 transition-colors"
              >
                Yes
              </Button>
              <Button
                onClick={handleConfirmNo}
                className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog (Optional) */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-lg shadow-gray-700/70 p-6 w-80 text-center border border-gray-300">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Upload Status
            </h3>
            <p className="text-sm text-green-600 font-semibold mb-6">
              Successfully uploaded Whitelist!
            </p>
            <Button
              onClick={handleSuccessDialogClose}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export { UploadWhitelistConfirm };
