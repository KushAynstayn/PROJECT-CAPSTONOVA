"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiCall, ApiError } from "../../lib/api";
import { FileUploaderWithProgress } from "./file-uploader-with-progress";

interface UploadUserManualModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

type FormErrors = {
  [key: string]: string[] | undefined;
};

export const UploadUserManualModal: React.FC<UploadUserManualModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  // --- ORIGINAL STATE (Unchanged) ---
  const [userManualPath, setUserManualPath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // --- ORIGINAL COMPONENT (Unchanged) ---
  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return <p className="text-sm text-red-500 mt-1">{errors[field]?.[0]}</p>;
  };

  // --- ORIGINAL SUBMIT LOGIC (Unchanged) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userManualPath) {
      setErrors({
        user_manual_path: ["Please upload a file first."],
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    const data = new FormData();
    data.append("user_manual_path", userManualPath);

    try {
      await apiCall("/proponent/submit-user-manual", "POST", data, true);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 422) {
        setErrors(error.details);
      } else {
        setErrors({
          general: [error.message || "An unexpected error occurred."],
        });
      }
      console.error("Failed to submit system manual:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ORIGINAL DISABLED LOGIC (Unchanged) ---
  const isSubmitDisabled = isLoading || isUploading || !userManualPath;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        // --- ORIGINAL RESET LOGIC (Unchanged) ---
        if (!open) {
          setErrors({});
          setUserManualPath(null);
          setIsUploading(false);
        }
      }}
    >
      {/* --- MODIFIED: Larger modal, p-0 --- */}
      <DialogContent className="sm:max-w-lg p-0">
        {/* --- MODIFIED: Styled Header --- */}
        <DialogHeader className="bg-[#800000] text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl">Upload System Manual</DialogTitle>
          <DialogDescription className="text-gray-300">
            Upload the system manual for your project.
          </DialogDescription>
        </DialogHeader>

        {/* --- MODIFIED: Content Padding --- */}
        <div className="p-6">
          <FileUploaderWithProgress
            id="user_manual"
            label="System Manual (PDF)" // --- MODIFIED: Label to match title ---
            maxSizeMB={100} // Example size
            accept=".pdf"
            onUploadStart={() => {
              setIsUploading(true);
              setUserManualPath(null);
              setErrors((prev) => ({ ...prev, user_manual_path: undefined }));
            }}
            onUploadComplete={(path) => {
              setUserManualPath(path);
              setIsUploading(false);
            }}
            onUploadError={(error) => {
              setErrors((prev) => ({ ...prev, user_manual_path: [error] }));
              setIsUploading(false);
            }}
          />
          <ErrorMessage field="user_manual_path" />
        </div>

        {/* --- MODIFIED: Styled Footer --- */}
        <DialogFooter className="flex flex-row justify-between items-center bg-gray-100 border-t p-6 rounded-b-lg">
          <div>
            {errors.general && (
              <p className="text-sm text-red-500">{errors.general[0]}</p>
            )}
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isLoading
              ? "Submitting..."
              : isUploading
              ? "Uploading..."
              : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
