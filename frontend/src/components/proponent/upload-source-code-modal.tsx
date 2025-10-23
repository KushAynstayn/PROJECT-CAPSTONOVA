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
import KeywordInput from "../ui/keyword-input";
import { apiCall, ApiError } from "../../lib/api";
import { FileUploaderWithProgress } from "./file-uploader-with-progress";
import { Github, Archive } from "lucide-react"; // --- NEW IMPORTS ---
import { cn } from "@/lib/utils"; // --- NEW IMPORT ---

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
  // --- ORIGINAL STATE (Unchanged) ---
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

  // --- ORIGINAL COMPONENT (Unchanged) ---
  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return <p className="text-sm text-red-500 mt-1">{errors[field]?.[0]}</p>;
  };

  // --- ORIGINAL SUBMIT LOGIC (Unchanged) ---
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

  // --- ORIGINAL DISABLED LOGIC (Unchanged) ---
  const isSubmitDisabled =
    isLoading || isTarUploading || (uploadType === "tar" && !sourceCodeTarPath);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        // --- ORIGINAL RESET LOGIC (Unchanged) ---
        if (!open) {
          setErrors({});
          setGithubUrl("");
          setGithubToken("");
          setSourceCodeTarPath(null);
          setIsTarUploading(false);
          setProgrammingLanguages([]);
          setUploadType("github"); // Reset to default
        }
      }}
    >
      {/* --- MODIFIED: Larger modal, p-0 --- */}
      <DialogContent className="sm:max-w-3xl p-0">
        {/* --- MODIFIED: Styled Header --- */}
        <DialogHeader className="bg-[#800000] text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl">Upload Source Code</DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose your upload method and provide the necessary details.
          </DialogDescription>
        </DialogHeader>

        {/* --- NEW: Two-column layout --- */}
        <div className="grid grid-cols-12 min-h-[40vh]">
          {/* --- NEW: Left Menu --- */}
          <div className="col-span-3 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                onClick={() => setUploadType("github")}
                className={cn(
                  "justify-start text-sm",
                  uploadType === "github"
                    ? "bg-gray-200 font-semibold"
                    : "font-normal"
                )}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button
                variant="ghost"
                onClick={() => setUploadType("tar")}
                className={cn(
                  "justify-start text-sm",
                  uploadType === "tar"
                    ? "bg-gray-200 font-semibold"
                    : "font-normal"
                )}
              >
                <Archive className="mr-2 h-4 w-4" />
                .tar file
              </Button>
            </nav>
          </div>

          {/* --- NEW: Right Content Area --- */}
          <div className="col-span-9 p-6 overflow-y-auto">
            {/* --- ORIGINAL: Form with original onSubmit --- */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {uploadType === "github" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="github_url"
                      className="text-right font-normal"
                    >
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
                    maxSizeMB={2048}
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

              {/* --- Common "Languages" input --- */}
              <div className="grid grid-cols-4 items-start gap-4 pt-6 border-t border-gray-200">
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
          </div>
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
              : isTarUploading
              ? "Uploading File..."
              : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
