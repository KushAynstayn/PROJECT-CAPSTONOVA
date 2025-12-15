"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiCall } from "@/lib/api";

interface ImportWhitelistModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ImportWhitelistModal = ({
  onClose,
  onSuccess,
}: ImportWhitelistModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    processed_count: number;
  } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadStats(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Use apiCall
      // 2. Pass 'true' as the 4th argument to indicate this is a FormData request
      //    (This ensures Content-Type is handled correctly by the browser)
      const data = await apiCall(
        "/user-mgt/faculty-whitelist/import",
        "POST",
        formData,
        true
      );

      // Adjust based on your actual API response structure (e.g., data.data.processed_count)
      const processedCount =
        data.data?.processed_count ?? data.processed_count ?? 0;

      setUploadStats({ processed_count: processedCount });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      // Handle ApiError structure
      if (err.status === 422 && err.details?.data?.errors) {
        // Flatten Laravel validation errors
        const errorMessages = Object.values(err.details.data.errors)
          .flat()
          .join(", ");
        setError(errorMessages);
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {" "}
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-fade-in"
      >
        {" "}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          {" "}
          ✕{" "}
        </button>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Import Faculty Whitelist
        </h2>
        {uploadStats ? (
          <div className="flex flex-col items-center justify-center py-6 text-green-600">
            <svg
              className="h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-lg font-semibold">Upload Successful!</p>
            <p className="text-sm">
              Processed {uploadStats.processed_count} entries.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-md bg-blue-50 p-4 text-sm text-blue-700">
              <p className="font-semibold mb-1">📝 Note on Column Names:</p>
              <p>
                Your Excel file (.xlsx, .xls, .csv) must contain the following
                headers:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>
                  <code>faculty_id</code> (Required)
                </li>
                <li>
                  <code>email</code> (Required)
                </li>
                <li>
                  <code>role</code> (e.g., Admin, Adviser)
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Excel File
              </label>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="bg-[#660000] text-white hover:bg-[#4d0000]"
              >
                {isLoading ? "Uploading..." : "Upload Excel"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImportWhitelistModal;
