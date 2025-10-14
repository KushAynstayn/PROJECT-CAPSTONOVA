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
import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import KeywordInput from "../ui/keyword-input";
import { apiCall, ApiError } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileUploaderWithProgress } from "./file-uploader-with-progress";

interface ManuscriptUploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

type FormErrors = {
  [key: string]: string[] | undefined;
};

const PlatformTypeInput = ({
  value,
  onValueChange,
  className,
  ...props
}: Omit<InputProps, "value" | "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = React.useState(value);
  const suggestions = ["Mobile", "Web", "IoT", "Desktop"];

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSuggestionClick = (suggestion: string) => {
    onValueChange(suggestion);
    setInputValue(suggestion);
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      s.toLowerCase() !== inputValue.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onValueChange(e.target.value);
        }}
        className={cn(
          "flex-1 bg-transparent outline-none shadow-none focus-visible:ring-0 px-3 py-2 h-auto",
          className
        )}
        {...props}
      />
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Suggestions:</span>
        {(inputValue === "" ? suggestions : filteredSuggestions).map(
          (suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              onMouseDown={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer hover:bg-secondary"
            >
              {suggestion}
            </Badge>
          )
        )}
      </div>
    </div>
  );
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
    panel_member_1: "",
    panel_member_2: "",
    panel_member_3: "",
  });

  const [manuscriptPath, setManuscriptPath] = useState<string | null>(null);
  const [acmPath, setAcmPath] = useState<string | null>(null);
  const [isManuscriptUploading, setIsManuscriptUploading] = useState(false);
  const [isAcmUploading, setIsAcmUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return <p className="text-sm text-red-500 mt-1">{errors[field]?.[0]}</p>;
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
    data.append("panel_member_1", formData.panel_member_1);
    if (formData.panel_member_2) {
      data.append("panel_member_2", formData.panel_member_2);
    }
    if (formData.panel_member_3) {
      data.append("panel_member_3", formData.panel_member_3);
    }
    if (manuscriptPath) {
      data.append("manuscript_path", manuscriptPath);
    }
    if (acmPath) {
      data.append("acm_path", acmPath);
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

  const isSubmitDisabled =
    isLoading ||
    isManuscriptUploading ||
    isAcmUploading ||
    !manuscriptPath ||
    !acmPath;

  return (
    <Dialog
      className="border-1 border-gray-300 rounded-md shadow-md"
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setErrors({});
          setManuscriptPath(null);
          setAcmPath(null);
          setIsManuscriptUploading(false);
          setIsAcmUploading(false);
        }
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
          className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <div className="col-span-3">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <ErrorMessage field="title" />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="abstract" className="text-right pt-2">
              Abstract
            </Label>
            <div className="col-span-3">
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) =>
                  setFormData({ ...formData, abstract: e.target.value })
                }
              />
              <ErrorMessage field="abstract" />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform_type" className="text-right">
              Platform Type
            </Label>
            <div className="col-span-3">
              <PlatformTypeInput
                id="platform_type"
                value={formData.platform_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform_type: value })
                }
              />
              <ErrorMessage field="platform_type" />
            </div>
          </div>

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
              <ErrorMessage field="keywords" />
            </div>
          </div>

          {/* --- MODIFIED MEMBER LABELS --- */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="member_hacker" className="text-right">
              Hacker
            </Label>
            <div className="col-span-3">
              <Input
                id="member_hacker"
                value={formData.member_hacker}
                onChange={(e) =>
                  setFormData({ ...formData, member_hacker: e.target.value })
                }
              />
              <ErrorMessage field="member_hacker" />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="member_hipster1" className="text-right">
              Hipster 1
            </Label>
            <div className="col-span-3">
              <Input
                id="member_hipster1"
                value={formData.member_hipster1}
                onChange={(e) =>
                  setFormData({ ...formData, member_hipster1: e.target.value })
                }
              />
              <ErrorMessage field="member_hipster1" />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="member_hipster2"
              className="text-right whitespace-nowrap text-xs"
            >
              Hipster 2 (Optional)
            </Label>
            <div className="col-span-3">
              <Input
                id="member_hipster2"
                value={formData.member_hipster2}
                onChange={(e) =>
                  setFormData({ ...formData, member_hipster2: e.target.value })
                }
              />
              <ErrorMessage field="member_hipster2" />
            </div>
          </div>

          {/* --- MODIFIED PANEL MEMBER LABELS AND STYLING --- */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="panel_member_1" className="text-right">
              Panel Member 1
            </Label>
            <div className="col-span-3">
              <Input
                id="panel_member_1"
                value={formData.panel_member_1}
                onChange={(e) =>
                  setFormData({ ...formData, panel_member_1: e.target.value })
                }
              />
              <ErrorMessage field="panel_member_1" />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="panel_member_2"
              className="text-right whitespace-nowrap text-xs"
            >
              Panel Member 2 (Optional)
            </Label>
            <div className="col-span-3">
              <Input
                id="panel_member_2"
                value={formData.panel_member_2}
                onChange={(e) =>
                  setFormData({ ...formData, panel_member_2: e.target.value })
                }
              />
              <ErrorMessage field="panel_member_2" />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="panel_member_3"
              className="text-right whitespace-nowrap text-xs"
            >
              Panel Member 3 (Optional)
            </Label>
            <div className="col-span-3">
              <Input
                id="panel_member_3"
                value={formData.panel_member_3}
                onChange={(e) =>
                  setFormData({ ...formData, panel_member_3: e.target.value })
                }
              />
              <ErrorMessage field="panel_member_3" />
            </div>
          </div>

          <div className="space-y-4">
            <FileUploaderWithProgress
              id="manuscript_pdf"
              label="Manuscript (PDF)"
              maxSizeMB={60}
              accept=".pdf"
              onUploadStart={() => {
                setIsManuscriptUploading(true);
                setManuscriptPath(null);
                setErrors((prev) => ({ ...prev, manuscript_path: undefined }));
              }}
              onUploadComplete={(path) => {
                setManuscriptPath(path);
                setIsManuscriptUploading(false);
              }}
              onUploadError={(error) => {
                setErrors((prev) => ({ ...prev, manuscript_path: [error] }));
                setIsManuscriptUploading(false);
              }}
            />
            <ErrorMessage field="manuscript_path" />
          </div>

          <div className="space-y-4">
            <FileUploaderWithProgress
              id="acm_pdf"
              label="ACM (PDF)"
              maxSizeMB={60}
              accept=".pdf"
              onUploadStart={() => {
                setIsAcmUploading(true);
                setAcmPath(null);
                setErrors((prev) => ({ ...prev, acm_path: undefined }));
              }}
              onUploadComplete={(path) => {
                setAcmPath(path);
                setIsAcmUploading(false);
              }}
              onUploadError={(error) => {
                setErrors((prev) => ({ ...prev, acm_path: [error] }));
                setIsAcmUploading(false);
              }}
            />
            <ErrorMessage field="acm_path" />
          </div>
        </form>
        <DialogFooter>
          {errors.general && (
            <p className="text-sm text-red-500">{errors.general[0]}</p>
          )}
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isLoading
              ? "Submitting..."
              : isManuscriptUploading || isAcmUploading
              ? "Uploading Files..."
              : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
