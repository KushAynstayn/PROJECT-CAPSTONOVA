"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiCall, ApiError } from "../../lib/api";

interface FileUploaderWithProgressProps {
  id: string;
  label: string;
  // --- MODIFIED: Made originalFilename optional for backward compatibility ---
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

    // Reset state for new upload
    setError(null);
    setUploadProgress(0);
    setFileName(file.name);
    onUploadStart();

    // --- File Validation ---
    if (file.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = `File must be less than ${maxSizeMB}MB.`;
      setError(errorMsg);
      onUploadError(errorMsg);
      e.target.value = "";
      return;
    }

    // --- MODIFIED: More robust accept check ---
    if (accept) {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const fileType = file.type;

      const isValid = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          // Check extension
          return type === fileExtension;
        }
        // Check MIME type
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

      // 1. Start the chunked upload
      const startResponse = await apiCall("/proponent/chunk/start", "POST", {
        original_filename: file.name,
        total_chunks: totalChunks,
      });
      const uploadId = startResponse.upload_id;

      // 2. Upload each chunk
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

        // Update progress
        setUploadProgress(((i + 1) / totalChunks) * 100);
      }

      // 3. Finish the upload
      const finishResponse = await apiCall(
        `/proponent/chunk/finish/${uploadId}`,
        "POST"
      );

      // --- MODIFIED: Pass back path and original filename ---
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
      />
      {isUploading && (
        <div className="flex items-center gap-2 mt-2">
          <Progress value={uploadProgress} className="w-full" />
          <span className="text-sm text-muted-foreground">{`${Math.round(
            uploadProgress
          )}%`}</span>
        </div>
      )}
      {uploadProgress === 100 && !isUploading && !error && (
        <p className="text-sm text-green-600 mt-1">
          Successfully uploaded {fileName}.
        </p>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
