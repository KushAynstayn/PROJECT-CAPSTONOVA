// (MODIFIED)
// Location: frontend/src/components/proponent/upload-source-code-modal.tsx
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import KeywordInput from "../ui/keyword-input";
import { apiCall, ApiError } from "../../lib/api";

interface SourceCodeUploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

// Define a type for the error state object
type FormErrors = {
  [key: string]: string[] | undefined;
};

export const SourceCodeUploadModal: React.FC<SourceCodeUploadModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [uploadType, setUploadType] = useState<"github" | "tar">("github");
  const [githubUrl, setGithubUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [sourceCodeTar, setSourceCodeTar] = useState<File | null>(null);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Helper component to display errors for a specific field
  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <div className="col-start-2 col-span-3">
        <p className="text-sm text-red-500 mt-1">{errors[field]?.[0]}</p>
      </div>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setErrors((prev) => ({ ...prev, source_code_tar: undefined })); // Clear previous error

    if (file) {
      if (!file.name.endsWith(".tar")) {
        setErrors((prev) => ({
          ...prev,
          source_code_tar: ["File must be a .tar archive."],
        }));
        setSourceCodeTar(null);
        e.target.value = "";
        return;
      }
    }
    setSourceCodeTar(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const data = new FormData();
    data.append("upload_type", uploadType);
    if (uploadType === "github") {
      data.append("github_url", githubUrl);
      if (githubToken) {
        data.append("github_token", githubToken);
      }
    } else if (sourceCodeTar) {
      data.append("source_code_tar", sourceCodeTar);
    }
    programmingLanguages.forEach((lang) =>
      data.append("programming_languages[]", lang)
    );

    try {
      await apiCall("/proponent/submit-source-code", "POST", data, true);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 422) {
        setErrors(error.details);
      } else if (error instanceof ApiError && error.status === 404) {
        setErrors({ general: [error.details.message || "Project not found."] });
      } else {
        setErrors({
          general: [error.message || "An unexpected error occurred."],
        });
      }
      console.error("Failed to submit source code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setErrors({}); // Clear errors when closing the modal
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Source Code</DialogTitle>
          <DialogDescription>
            Choose your upload method and provide the necessary details.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6"
        >
          <RadioGroup
            value={uploadType}
            onValueChange={(value) => setUploadType(value as "github" | "tar")}
            className="mb-4"
          >
            <Label>Upload Type</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="github" id="github" />
                <Label htmlFor="github">GitHub</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tar" id="tar" />
                <Label htmlFor="tar">.tar file</Label>
              </div>
            </div>
          </RadioGroup>
          <ErrorMessage field="upload_type" />

          {uploadType === "github" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="github_url" className="text-right">
                  GitHub URL
                </Label>
                <Input
                  id="github_url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="col-span-3"
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <ErrorMessage field="github_url" />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="github_token" className="text-right">
                  Token (Optional)
                </Label>
                <Input
                  id="github_token"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="col-span-3"
                  placeholder="ghp_..."
                />
              </div>
              <ErrorMessage field="github_token" />
            </>
          )}

          {uploadType === "tar" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source_code_tar" className="text-right">
                  .tar file
                </Label>
                <Input
                  id="source_code_tar"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3"
                  accept=".tar"
                />
              </div>
              <ErrorMessage field="source_code_tar" />
            </>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="programming_languages" className="text-right pt-2">
              Languages
            </Label>
            <div className="col-span-3">
              <KeywordInput
                fetchUrl="/util/programming-languages"
                value={programmingLanguages}
                onValueChange={setProgrammingLanguages}
                placeholder="Type and press Enter or comma..."
              />
            </div>
          </div>
          <ErrorMessage field="programming_languages" />
        </form>
        <DialogFooter>
          {errors.general && (
            <p className="text-sm text-red-500 mr-auto">{errors.general[0]}</p>
          )}
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
