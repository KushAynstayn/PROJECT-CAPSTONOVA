"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiCall, ApiError } from "../../lib/api";
import { CheckCircle } from "lucide-react";

interface FileUploaderWithProgressProps {
  id: string;
  label: string;
  onUploadComplete: (path: string, originalFilename?: string) => void;
  onUploadStart: () => void;
  onUploadError: (error: string) => void;
  maxSizeMB: number;
  accept?: string;
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export const FileUploaderWithProgress: React.FC<
  FileUploaderWithProgressProps
> = ({
  id,
  label,
  onUploadComplete,
  onUploadStart,
  onUploadError,
  maxSizeMB,
  accept,
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setError(null);
    setUploadProgress(0);
    setFileName(file.name);
    onUploadStart();

    if (file.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = `File must be less than ${maxSizeMB}MB.`;
      setError(errorMsg);
      onUploadError(errorMsg);
      e.target.value = "";
      return;
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const fileType = file.type;

      const isValid = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return type === fileExtension;
        }
        return type === fileType;
      });

      if (!isValid) {
        const errorMsg = `Invalid file type. Please upload: ${accept}`;
        setError(errorMsg);
        onUploadError(errorMsg);
        e.target.value = "";
        return;
      }
    }

    setIsUploading(true);

    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      const startResponse = await apiCall("/proponent/chunk/start", "POST", {
        original_filename: file.name,
        total_chunks: totalChunks,
      });
      const uploadId = startResponse.upload_id;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const chunkFormData = new FormData();
        chunkFormData.append("chunk_file", chunk);
        chunkFormData.append("chunk_number", String(i + 1));

        await apiCall(
          `/proponent/chunk/upload/${uploadId}`,
          "POST",
          chunkFormData,
          true
        );

        setUploadProgress(((i + 1) / totalChunks) * 100);
      }

      const finishResponse = await apiCall(
        `/proponent/chunk/finish/${uploadId}`,
        "POST"
      );

      onUploadComplete(finishResponse.path, file.name);
    } catch (err: any) {
      const errorMsg =
        err instanceof ApiError
          ? err.message
          : "An unexpected error occurred during upload.";
      setError(errorMsg);
      onUploadError(errorMsg);
      console.error(`Failed to upload ${id}:`, err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="file"
        onChange={handleFileChange}
        accept={accept}
        disabled={isUploading}
        // --- MODIFIED: Changed file button text and hover color ---
        className="file:font-medium file:text-[#800000] hover:file:bg-red-50 file:transition-colors"
      />

      {isUploading && (
        <div className="w-full mt-2 space-y-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 truncate pr-4">
              Uploading {fileName}...
            </span>
            {/* --- MODIFIED: Changed percentage text color --- */}
            <span className="text-sm font-medium text-[#800000]">{`${Math.round(
              uploadProgress
            )}%`}</span>
          </div>
          <Progress
            value={uploadProgress}
            // --- MODIFIED: Changed progress bar fill color ---
            className="w-full h-2 [&>div]:bg-[#800000]"
          />
        </div>
      )}

      {uploadProgress === 100 && !isUploading && !error && (
        <div className="flex items-center gap-2 text-sm text-green-600 mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <p className="font-medium">Successfully uploaded {fileName}.</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
