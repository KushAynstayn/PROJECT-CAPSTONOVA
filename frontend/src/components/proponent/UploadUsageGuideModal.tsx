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

interface UploadUsageGuideModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

type FormErrors = {
  [key: string]: string[] | undefined;
};

export const UploadUsageGuideModal: React.FC<UploadUsageGuideModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  // --- ORIGINAL STATE (Unchanged) ---
  const [usageGuidePath, setUsageGuidePath] = useState<string | null>(null);
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
    if (!usageGuidePath) {
      setErrors({
        usage_guide_path: ["Please upload a file first."],
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    const data = new FormData();
    data.append("usage_guide_path", usageGuidePath);

    try {
      await apiCall("/proponent/submit-usage-guide", "POST", data, true);
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
      console.error("Failed to submit user guide:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ORIGINAL DISABLED LOGIC (Unchanged) ---
  const isSubmitDisabled = isLoading || isUploading || !usageGuidePath;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        // --- ORIGINAL RESET LOGIC (Unchanged) ---
        if (!open) {
          setErrors({});
          setUsageGuidePath(null);
          setIsUploading(false);
        }
      }}
    >
      {/* --- MODIFIED: Larger modal, p-0 --- */}
      <DialogContent className="sm:max-w-lg p-0">
        {/* --- MODIFIED: Styled Header --- */}
        <DialogHeader className="bg-[#800000] text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl">Upload User Guide</DialogTitle>
          <DialogDescription className="text-gray-300">
            Upload the user guide for your project.
          </DialogDescription>
        </DialogHeader>

        {/* --- MODIFIED: Content Padding --- */}
        <div className="p-6">
          <FileUploaderWithProgress
            id="usage_guide"
            label="User Guide (PDF)"
            maxSizeMB={100} // Example size
            accept=".pdf"
            onUploadStart={() => {
              setIsUploading(true);
              setUsageGuidePath(null);
              setErrors((prev) => ({ ...prev, usage_guide_path: undefined }));
            }}
            onUploadComplete={(path) => {
              setUsageGuidePath(path);
              setIsUploading(false);
            }}
            onUploadError={(error) => {
              setErrors((prev) => ({ ...prev, usage_guide_path: [error] }));
              setIsUploading(false);
            }}
          />
          <ErrorMessage field="usage_guide_path" />
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
