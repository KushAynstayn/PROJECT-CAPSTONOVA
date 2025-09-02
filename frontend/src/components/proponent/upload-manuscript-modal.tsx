// (MODIFIED)
// Location: frontend/src/components/proponent/upload-manuscript-modal.tsx
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
import CreatableMultiSelect from "../ui/creatable-multi-select";
import { apiCall } from "../../lib/api";

interface ManuscriptUploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      await apiCall("/submit-project", "POST", data, true);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      setError(
        error.message || "Failed to submit manuscript. Please try again."
      );
      console.error("Failed to submit manuscript:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Manuscript</DialogTitle>
          <DialogDescription>
            Fill in the details and upload your manuscript files.
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
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="abstract" className="text-right">
              Abstract
            </Label>
            <Textarea
              id="abstract"
              value={formData.abstract}
              onChange={(e) =>
                setFormData({ ...formData, abstract: e.target.value })
              }
              className="col-span-3"
              required
            />
          </div>
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
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keywords" className="text-right">
              Keywords
            </Label>
            <CreatableMultiSelect
              fetchUrl="/util/keywords"
              value={formData.keywords}
              onValueChange={(values) =>
                setFormData({ ...formData, keywords: values })
              }
              className="col-span-3"
            />
          </div>
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
              required
            />
          </div>
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
              required
            />
          </div>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manuscript_pdf" className="text-right">
              Manuscript (PDF)
            </Label>
            <Input
              id="manuscript_pdf"
              type="file"
              onChange={(e) => setManuscriptPdf(e.target.files?.[0] || null)}
              className="col-span-3"
              accept=".pdf"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="acm_pdf" className="text-right">
              ACM (PDF)
            </Label>
            <Input
              id="acm_pdf"
              type="file"
              onChange={(e) => setAcmPdf(e.target.files?.[0] || null)}
              className="col-span-3"
              accept=".pdf"
              required
            />
          </div>
        </form>
        <DialogFooter>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
