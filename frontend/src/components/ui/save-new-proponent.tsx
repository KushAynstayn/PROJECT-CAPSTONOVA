"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface SaveConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const SaveConfirm: React.FC<SaveConfirmProps> = ({ onConfirm, onCancel }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // This function is triggered by the "Yes" button in the confirmation dialog.
  const handleConfirmYes = () => {
    setShowConfirmDialog(false); // Hide the initial confirmation dialog
    onConfirm(); // Call the parent's function to perform the save logic
    setShowSuccessDialog(true); // Show the success dialog
  };

  // This function is triggered by the "OK" button in the success dialog.
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false); // Hide the success dialog.
    onCancel(); // Call onCancel from the parent to close the main modal.
  };

  return (
    <>
      {/* Conditional rendering for the initial confirmation dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 ">
          <div className="bg-white rounded-xl shadow-lg shadow-gray-700/70 p-6 w-80 text-center border border-gray-300 ml-65">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Confirm Save
            </h3>
            <p className="text-sm text-gray-600 mb-6 break-words">
              Are you sure you want to save the new proponent?
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleConfirmYes}
                className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-600 transition-colors"
              >
                Yes
              </Button>
              <Button
                onClick={onCancel} // Use the onCancel prop directly to close the dialog.
                className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Conditional rendering for the success dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-lg shadow-gray-700/70 p-6 w-80 text-center border border-gray-300 ml-65">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Save Status
            </h3>
            <p className="text-sm text-green-600 font-semibold mb-6">
              Successfully Saved New Proponent!
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

export { SaveConfirm };