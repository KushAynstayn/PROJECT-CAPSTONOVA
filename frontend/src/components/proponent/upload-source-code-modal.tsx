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
import { FileUploaderWithProgress } from "./file-uploader-with-progress";

interface SourceCodeUploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

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
  const [sourceCodeTarPath, setSourceCodeTarPath] = useState<string | null>(
    null
  );
  const [isTarUploading, setIsTarUploading] = useState(false);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>(
    []
  );
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
    data.append("upload_type", uploadType);

    if (uploadType === "github") {
      data.append("github_url", githubUrl);
      if (githubToken) {
        data.append("github_token", githubToken);
      }
    } else if (sourceCodeTarPath) {
      data.append("source_code_tar_path", sourceCodeTarPath);
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

  const isSubmitDisabled =
    isLoading || isTarUploading || (uploadType === "tar" && !sourceCodeTarPath);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setErrors({});
          setGithubUrl("");
          setGithubToken("");
          setSourceCodeTarPath(null);
          setIsTarUploading(false);
          setProgrammingLanguages([]);
        }
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
          className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6"
        >
          <div>
            <Label className="font-normal">Upload Type</Label>
            <RadioGroup
              value={uploadType}
              onValueChange={(value) =>
                setUploadType(value as "github" | "tar")
              }
              className="mt-1"
            >
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
          </div>

          {uploadType === "github" && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="github_url" className="text-right font-normal">
                  GitHub URL
                </Label>
                <div className="col-span-3">
                  <Input
                    id="github_url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                  />
                  <ErrorMessage field="github_url" />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="github_token"
                  className="text-right font-normal"
                >
                  Token (Optional)
                </Label>
                <div className="col-span-3">
                  <Input
                    id="github_token"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_..."
                  />
                  <ErrorMessage field="github_token" />
                </div>
              </div>
            </div>
          )}

          {uploadType === "tar" && (
            <div className="space-y-4">
              <FileUploaderWithProgress
                id="source_code_tar"
                label=".tar file"
                maxSizeMB={2048} // Example size, adjust as needed
                accept=".tar"
                onUploadStart={() => {
                  setIsTarUploading(true);
                  setSourceCodeTarPath(null);
                  setErrors((prev) => ({
                    ...prev,
                    source_code_tar_path: undefined,
                  }));
                }}
                onUploadComplete={(path) => {
                  setSourceCodeTarPath(path);
                  setIsTarUploading(false);
                }}
                onUploadError={(error) => {
                  setErrors((prev) => ({
                    ...prev,
                    source_code_tar_path: [error],
                  }));
                  setIsTarUploading(false);
                }}
              />
              <ErrorMessage field="source_code_tar_path" />
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="programming_languages"
              className="text-right pt-2 font-normal"
            >
              Languages
            </Label>
            <div className="col-span-3">
              <KeywordInput
                fetchUrl="/util/programming-languages"
                value={programmingLanguages}
                onValueChange={setProgrammingLanguages}
                placeholder="Type and press Enter or comma..."
              />
              <ErrorMessage field="programming_languages" />
            </div>
          </div>
        </form>
        <DialogFooter>
          {errors.general && (
            <p className="text-sm text-red-500 mr-auto">{errors.general[0]}</p>
          )}
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isLoading
              ? "Submitting..."
              : isTarUploading
              ? "Uploading File..."
              : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
