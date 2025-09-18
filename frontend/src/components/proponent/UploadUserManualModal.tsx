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
  const [userManual, setUserManual] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return <p className="text-sm text-red-500 mt-1">{errors[field]?.[0]}</p>;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setErrors((prev) => ({ ...prev, user_manual: undefined }));

    if (file) {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          user_manual: ["File must be a PDF."],
        }));
        setUserManual(null);
        e.target.value = "";
        return;
      }
    }
    setUserManual(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!userManual) {
      setErrors({ user_manual: ["Please select a file to upload."] });
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("user_manual", userManual);

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
      console.error("Failed to submit user manual:", error);
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
          <DialogTitle>Upload User Manual</DialogTitle>
          <DialogDescription>
            Upload the user manual for your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="user_manual">User Manual (PDF)</Label>
            <Input
              id="user_manual"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
            />
            <ErrorMessage field="user_manual" />
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