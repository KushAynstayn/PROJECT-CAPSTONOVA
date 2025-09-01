// components/ui/submit-successfully.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface SubmitSuccessfullyProps {
  onSuccess: () => void; // New prop to notify parent on success
}

const SubmitSucessfully: React.FC<SubmitSuccessfullyProps> = ({ onSuccess }) => {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleSubmitYes = () => {
    setShowSubmitDialog(false);

    // Simulate upload delay
    setTimeout(() => {
      setShowSuccessDialog(true);
    }, 350);
  };

  const handleSubmitNo = () => {
    setShowSubmitDialog(false);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    onSuccess(); // Call the onSuccess function to tell the parent to show the manuscript
  };

  return (
    <>
      {/* Upload Button */}
      <Button
        onClick={handleSubmitClick}
        className="bg-red-800 text-white font-serif rounded-1px shadow-md shadow-gray-500/80
          transition-transform hover:scale-105 hover:bg-[#6b211d] hover:text-white
          active:shadow-lg active:shadow-gray-700/90 w-40 h-12 text-lg"
      >
        SUBMIT
      </Button>

      {/* Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg shadow-gray-700/70 p-6 w-80 text-center border border-gray-300 transform translate-x-30">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Confirm Submission
            </h3>
            <p className="text-sm text-gray-600 mb-6 break-words">
              Are you sure you want to submit?
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleSubmitYes}
                className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-600 transition-colors"
              >
                Yes
              </Button>
              <Button
                onClick={handleSubmitNo}
                className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg shadow-gray-700/70 p-6 w-80 text-center border border-gray-300 transform translate-x-30">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Submission Status
            </h3>
            <p className="text-sm text-green-600 font-semibold mb-6">
              Your files have been successfully submitted.
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

export { SubmitSucessfully };