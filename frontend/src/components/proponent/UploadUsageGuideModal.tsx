// [NEW FILE]
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall, ApiError } from "../../lib/api";

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
  const [usageGuide, setUsageGuide] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return <p className="text-sm text-red-500 mt-1">{errors[field]?.[0]}</p>;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setErrors((prev) => ({ ...prev, usage_guide: undefined }));

    if (file) {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          usage_guide: ["File must be a PDF."],
        }));
        setUsageGuide(null);
        e.target.value = "";
        return;
      }
    }
    setUsageGuide(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!usageGuide) {
      setErrors({ usage_guide: ["Please select a file to upload."] });
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("usage_guide", usageGuide);

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
      console.error("Failed to submit usage guide:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setErrors({});
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Usage Guide</DialogTitle>
          <DialogDescription>
            Upload the usage guide for your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="usage_guide">Usage Guide (PDF)</Label>
            <Input
              id="usage_guide"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
            />
            <ErrorMessage field="usage_guide" />
            {errors.general && (
              <p className="text-sm text-red-500 mt-1">{errors.general[0]}</p>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
