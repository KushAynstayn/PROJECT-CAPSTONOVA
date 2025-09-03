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
import { Textarea } from "../ui/textarea";
import KeywordInput from "../ui/keyword-input";
import { apiCall, ApiError } from "../../lib/api";

interface ManuscriptUploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

// Define a type for the error state
type FormErrors = {
  [key: string]: string[] | undefined;
};

export const ManuscriptUploadModal: React.FC<ManuscriptUploadModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    platform_type: "",
    keywords: [] as string[],
    member_hacker: "",
    member_hipster1: "",
    member_hipster2: "",
  });
  const [manuscriptPdf, setManuscriptPdf] = useState<File | null>(null);
  const [acmPdf, setAcmPdf] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Helper component to display errors
  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <p className="text-sm text-red-500 mt-1 col-start-2 col-span-3">
        {errors[field]?.[0]}
      </p>
    );
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    fieldName: "manuscript_pdf" | "acm_pdf",
    maxSizeMB: number
  ) => {
    const file = e.target.files?.[0] || null;
    setErrors((prev) => ({ ...prev, [fieldName]: undefined })); // Clear previous error

    if (file) {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: ["File must be a PDF."],
        }));
        setFile(null);
        e.target.value = ""; // Clear the input
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: [`File must be less than ${maxSizeMB}MB.`],
        }));
        setFile(null);
        e.target.value = ""; // Clear the input
        return;
      }
    }
    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const data = new FormData();
    data.append("title", formData.title);
    data.append("abstract", formData.abstract);
    data.append("platform_type", formData.platform_type);
    formData.keywords.forEach((keyword) => data.append("keywords[]", keyword));
    data.append("member_hacker", formData.member_hacker);
    data.append("member_hipster1", formData.member_hipster1);
    if (formData.member_hipster2) {
      data.append("member_hipster2", formData.member_hipster2);
    }
    if (manuscriptPdf) {
      data.append("manuscript_pdf", manuscriptPdf);
    }
    if (acmPdf) {
      data.append("acm_pdf", acmPdf);
    }

    try {
      await apiCall("/proponent/submit-project", "POST", data, true);
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
      console.error("Failed to submit manuscript:", error);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Manuscript</DialogTitle>
          <DialogDescription>
            Fill in the details and upload your manuscript files. All fields are
            required unless marked optional.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <ErrorMessage field="title" />

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="abstract" className="text-right pt-2">
              Abstract
            </Label>
            <Textarea
              id="abstract"
              value={formData.abstract}
              onChange={(e) =>
                setFormData({ ...formData, abstract: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <ErrorMessage field="abstract" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform_type" className="text-right">
              Platform Type
            </Label>
            <Input
              id="platform_type"
              value={formData.platform_type}
              onChange={(e) =>
                setFormData({ ...formData, platform_type: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <ErrorMessage field="platform_type" />

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="keywords" className="text-right pt-2">
              Keywords
            </Label>
            <div className="col-span-3">
              <KeywordInput
                fetchUrl="/util/keywords"
                value={formData.keywords}
                onValueChange={(values) =>
                  setFormData({ ...formData, keywords: values })
                }
                placeholder="Type and press Enter or comma..."
              />
            </div>
          </div>
          <ErrorMessage field="keywords" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="member_hacker" className="text-right">
              Member 1
            </Label>
            <Input
              id="member_hacker"
              value={formData.member_hacker}
              onChange={(e) =>
                setFormData({ ...formData, member_hacker: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <ErrorMessage field="member_hacker" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="member_hipster1" className="text-right">
              Member 2
            </Label>
            <Input
              id="member_hipster1"
              value={formData.member_hipster1}
              onChange={(e) =>
                setFormData({ ...formData, member_hipster1: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <ErrorMessage field="member_hipster1" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="member_hipster2" className="text-right">
              Member 3 (Optional)
            </Label>
            <Input
              id="member_hipster2"
              value={formData.member_hipster2}
              onChange={(e) =>
                setFormData({ ...formData, member_hipster2: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <ErrorMessage field="member_hipster2" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manuscript_pdf" className="text-right">
              Manuscript (PDF)
            </Label>
            <Input
              id="manuscript_pdf"
              type="file"
              onChange={(e) =>
                handleFileChange(e, setManuscriptPdf, "manuscript_pdf", 30)
              }
              className="col-span-3"
              accept=".pdf"
            />
          </div>
          <ErrorMessage field="manuscript_pdf" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="acm_pdf" className="text-right">
              ACM (PDF)
            </Label>
            <Input
              id="acm_pdf"
              type="file"
              onChange={(e) => handleFileChange(e, setAcmPdf, "acm_pdf", 15)}
              className="col-span-3"
              accept=".pdf"
            />
          </div>
          <ErrorMessage field="acm_pdf" />
        </form>
        <DialogFooter>
          {errors.general && (
            <p className="text-sm text-red-500">{errors.general[0]}</p>
          )}
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
