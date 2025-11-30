// src/components/proponent/upload-source-code-modal.tsx
// [MODIFIED FILE]
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
import { Github, Archive, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TarTutorialModal } from "./tar-tutorial-modal";

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
  const [uploadType, setUploadType] = useState<"github" | "tar" | "compressed">(
    "github"
  );
  const [githubUrl, setGithubUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [sourceCodeTarPath, setSourceCodeTarPath] = useState<string | null>(
    null
  );
  const [isTarUploading, setIsTarUploading] = useState(false);

  // New State for Tutorial Modal
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const [sourceCodeCompressedPath, setSourceCodeCompressedPath] = useState<
    string | null
  >(null);
  const [originalCompressedFilename, setOriginalCompressedFilename] = useState<
    string | null
  >(null);
  const [isCompressedUploading, setIsCompressedUploading] = useState(false);

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
    } else if (uploadType === "tar" && sourceCodeTarPath) {
      data.append("source_code_tar_path", sourceCodeTarPath);
    } else if (
      uploadType === "compressed" &&
      sourceCodeCompressedPath &&
      originalCompressedFilename
    ) {
      data.append("source_code_compressed_path", sourceCodeCompressedPath);
      data.append("original_filename", originalCompressedFilename);
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
    isLoading ||
    isTarUploading ||
    isCompressedUploading ||
    (uploadType === "tar" && !sourceCodeTarPath) ||
    (uploadType === "compressed" && !sourceCodeCompressedPath);

  return (
    <>
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
            setSourceCodeCompressedPath(null);
            setOriginalCompressedFilename(null);
            setIsCompressedUploading(false);
            setProgrammingLanguages([]);
            setUploadType("github");
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl p-0">
          <DialogHeader className="bg-[#800000] text-white p-6 rounded-t-lg">
            <DialogTitle className="text-2xl">Upload Source Code</DialogTitle>
            <DialogDescription className="text-gray-300">
              Choose your upload method and provide the necessary details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-12 min-h-[40vh]">
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
                <Button
                  variant="ghost"
                  onClick={() => setUploadType("compressed")}
                  className={cn(
                    "justify-start text-sm",
                    uploadType === "compressed"
                      ? "bg-gray-200 font-semibold"
                      : "font-normal"
                  )}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Compressed file
                </Button>
              </nav>
            </div>

            <div className="col-span-9 p-6 overflow-y-auto">
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
                    {/* New Tutorial Trigger Button */}
                    <div className="flex justify-end mb-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-[#800000] hover:bg-red-50 hover:text-red-900 gap-1 text-xs"
                        onClick={() => setIsTutorialOpen(true)}
                      >
                        <HelpCircle className="h-4 w-4" />
                        How to create a .tar file?
                      </Button>
                    </div>

                    <FileUploaderWithProgress
                      id="source_code_tar"
                      label=".tar file"
                      maxSizeMB={2048} // 2GB
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

                {uploadType === "compressed" && (
                  <div className="space-y-4">
                    <FileUploaderWithProgress
                      id="source_code_compressed"
                      label="Compressed file (.zip, .rar, .7z)"
                      maxSizeMB={2048} // 2GB
                      accept=".zip,.rar,.7z"
                      onUploadStart={() => {
                        setIsCompressedUploading(true);
                        setSourceCodeCompressedPath(null);
                        setOriginalCompressedFilename(null);
                        setErrors((prev) => ({
                          ...prev,
                          source_code_compressed_path: undefined,
                        }));
                      }}
                      onUploadComplete={(path, originalFilename) => {
                        setSourceCodeCompressedPath(path);
                        setOriginalCompressedFilename(originalFilename || null);
                        setIsCompressedUploading(false);
                      }}
                      onUploadError={(error) => {
                        setErrors((prev) => ({
                          ...prev,
                          source_code_compressed_path: [error],
                        }));
                        setIsCompressedUploading(false);
                      }}
                    />
                    <ErrorMessage field="source_code_compressed_path" />
                  </div>
                )}

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
                : isTarUploading || isCompressedUploading
                ? "Uploading File..."
                : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Render the Tutorial Modal */}
      <TarTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </>
  );
};
