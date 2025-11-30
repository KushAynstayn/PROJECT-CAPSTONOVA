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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    setErrors({}); // Clear old errors
    let stepErrors: FormErrors = {};

    // Validate current step before proceeding
    switch (currentStep) {
      case 1: // Project Details
        if (!formData.title) stepErrors.title = ["Title is required."];
        if (!formData.abstract) stepErrors.abstract = ["Abstract is required."];
        if (!formData.platform_type)
          stepErrors.platform_type = ["Platform type is required."];
        if (formData.keywords.length === 0)
          stepErrors.keywords = ["At least one keyword is required."];
        break;
      case 2: // Team Members
        if (!formData.member_hacker)
          stepErrors.member_hacker = ["Hacker is required."];
        if (!formData.member_hipster1)
          stepErrors.member_hipster1 = ["Hipster 1 is required."];
        break;
      case 3: // Panel Members
        if (!formData.panel_member_1)
          stepErrors.panel_member_1 = ["Panel Member 1 is required."];
        break;
      // No validation for step 4, as it's the file upload step
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setErrors({});
          setManuscriptPath(null);
          setAcmPath(null);
          setIsManuscriptUploading(false);
          setIsAcmUploading(false);
          setCurrentStep(1); // Reset to first step on close
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl p-0">
        {/* --- MODIFIED: Header color changed to maroon-like --- */}
        <DialogHeader className="bg-[#800000] text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl">Upload Manuscript</DialogTitle>
          <DialogDescription className="text-gray-300">
            Fill in the details and upload your manuscript files.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {["Details", "Team", "Panel", "Uploads"].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                      currentStep > index + 1
                        ? "bg-green-600 text-white"
                        : currentStep === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {currentStep > index + 1 ? "✓" : index + 1}
                  </div>
                  <p
                    className={cn(
                      "text-sm mt-1",
                      currentStep === index + 1
                        ? "font-bold text-blue-600"
                        : "text-gray-500"
                    )}
                  >
                    {step}
                  </p>
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-2",
                      currentStep > index + 1 ? "bg-green-600" : "bg-gray-200"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="space-y-4 p-6 max-h-[60vh] overflow-y-auto">
            {/* --- STEP 1: Project Details --- */}
            {currentStep === 1 && (
              <div className="space-y-4">
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
                      rows={5}
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
              </div>
            )}

            {/* --- STEP 2: Team Members --- */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  {/* --- MODIFIED: Label text size standardized --- */}
                  <Label htmlFor="member_hacker" className="text-right text-sm">
                    Hacker
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="member_hacker"
                      value={formData.member_hacker}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          member_hacker: e.target.value,
                        })
                      }
                    />
                    <ErrorMessage field="member_hacker" />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  {/* --- MODIFIED: Label text size standardized --- */}
                  <Label
                    htmlFor="member_hipster1"
                    className="text-right text-sm"
                  >
                    Hipster 1
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="member_hipster1"
                      value={formData.member_hipster1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          member_hipster1: e.target.value,
                        })
                      }
                    />
                    <ErrorMessage field="member_hipster1" />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  {/* --- MODIFIED: Label text size standardized, Optional kept --- */}
                  <Label
                    htmlFor="member_hipster2"
                    className="text-right whitespace-nowrap text-sm"
                  >
                    Hipster 2 (Optional)
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="member_hipster2"
                      value={formData.member_hipster2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          member_hipster2: e.target.value,
                        })
                      }
                    />
                    <ErrorMessage field="member_hipster2" />
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 3: Panel Members --- */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  {/* --- MODIFIED: Label text size standardized, Optional removed --- */}
                  <Label
                    htmlFor="panel_member_1"
                    className="text-right text-sm"
                  >
                    Panel Member 1
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="panel_member_1"
                      value={formData.panel_member_1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          panel_member_1: e.target.value,
                        })
                      }
                    />
                    <ErrorMessage field="panel_member_1" />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  {/* --- MODIFIED: Label text size standardized, Optional kept --- */}
                  <Label
                    htmlFor="panel_member_2"
                    className="text-right whitespace-nowrap text-sm"
                  >
                    Panel Member 2
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="panel_member_2"
                      value={formData.panel_member_2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          panel_member_2: e.target.value,
                        })
                      }
                    />
                    <ErrorMessage field="panel_member_2" />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  {/* --- MODIFIED: Label text size standardized, Optional kept --- */}
                  <Label
                    htmlFor="panel_member_3"
                    className="text-right whitespace-nowrap text-sm"
                  >
                    Panel Member 3
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="panel_member_3"
                      value={formData.panel_member_3}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          panel_member_3: e.target.value,
                        })
                      }
                    />
                    <ErrorMessage field="panel_member_3" />
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 4: File Uploads --- */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <FileUploaderWithProgress
                    id="manuscript_pdf"
                    label="Manuscript (PDF)"
                    maxSizeMB={150}
                    accept=".pdf"
                    onUploadStart={() => {
                      setIsManuscriptUploading(true);
                      setManuscriptPath(null);
                      setErrors((prev) => ({
                        ...prev,
                        manuscript_path: undefined,
                      }));
                    }}
                    onUploadComplete={(path) => {
                      setManuscriptPath(path);
                      setIsManuscriptUploading(false);
                    }}
                    onUploadError={(error) => {
                      setErrors((prev) => ({
                        ...prev,
                        manuscript_path: [error],
                      }));
                      setIsManuscriptUploading(false);
                    }}
                  />
                  <ErrorMessage field="manuscript_path" />
                </div>

                <div className="space-y-2">
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
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="flex flex-row justify-between items-center bg-gray-100 border-t p-6 rounded-b-lg">
          <div>
            {errors.general && (
              <p className="text-sm text-red-500">{errors.general[0]}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className={currentStep === 1 ? "hidden" : ""}
            >
              Previous
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className={currentStep === totalSteps ? "hidden" : ""}
            >
              Next
            </Button>

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className={currentStep !== totalSteps ? "hidden" : ""}
            >
              {isLoading
                ? "Submitting..."
                : isManuscriptUploading || isAcmUploading
                ? "Uploading Files..."
                : "Submit"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
