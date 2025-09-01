"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setShowConfirmDialog(true);
    } else {
      setSelectedFile(null);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleConfirmYes = () => {
    setShowConfirmDialog(false);

    if (selectedFile) {
      console.log(`Uploading file: ${selectedFile.name}`);

      setTimeout(() => {
        setShowSuccessDialog(true);
      }, 1000);
    }
  };

  const handleConfirmNo = () => {
    setShowConfirmDialog(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* File Upload Trigger */}
      <Button
        onClick={handleButtonClick}
        className="bg-gray-200 text-gray font-serif rounded-1px shadow-md shadow-gray-500/80
                   transition-transform hover:scale-105 hover:bg-[#6b211d] hover:text-white
                   active:shadow-lg active:shadow-gray-700/90"
      >
        Select File
      </Button>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg shadow-gray-700/70 p-6 w-80 text-center border border-gray-300 transform translate-x-30">


            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Confirm Upload
            </h3>
            <p className="text-sm text-gray-600 mb-6 break-words">
              Are you sure you want to upload{" "}
              <span className="font-semibold text-gray-900">
                {selectedFile.name}
              </span>
              ?
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

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg shadow-gray-700/70 p-6 w-80 text-center border border-gray-300 transform translate-x-30">


            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Upload Status
            </h3>
            <p className="text-sm text-green-600 font-semibold mb-6">
              Successfully uploaded file!
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

export { FileUpload };
