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
import CreatableMultiSelect from "../ui/creatable-multi-select";
import { apiCall } from "../../lib/api";

interface SourceCodeUploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      await apiCall("/submit-source-code", "POST", data, true);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      setError(
        error.message || "Failed to submit source code. Please try again."
      );
      console.error("Failed to submit source code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                  required={uploadType === "github"}
                  placeholder="https://github.com/user/repo"
                />
              </div>
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
            </>
          )}

          {uploadType === "tar" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source_code_tar" className="text-right">
                .tar file
              </Label>
              <Input
                id="source_code_tar"
                type="file"
                onChange={(e) => setSourceCodeTar(e.target.files?.[0] || null)}
                className="col-span-3"
                accept=".tar"
                required={uploadType === "tar"}
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="programming_languages" className="text-right">
              Languages
            </Label>
            <CreatableMultiSelect
              fetchUrl="/util/programming-languages"
              value={programmingLanguages}
              onValueChange={setProgrammingLanguages}
              className="col-span-3"
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
