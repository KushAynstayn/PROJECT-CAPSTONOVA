"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Database,
  FolderArchive,
  Download,
  Loader2,
  AlertCircle,
  Upload,
  RotateCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { apiCall, apiCallForBlob } from "@/lib/api";

const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB chunks

const SystemBackupPage = () => {
  const [loadingType, setLoadingType] = useState<
    "database" | "files" | "restore_db" | "restore_files" | null
  >(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Refs for hidden file inputs
  const dbInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  // --- HELPER: Chunked Upload & Restore Logic ---
  const performChunkedRestore = async (file: File, restoreEndpoint: string) => {
    try {
      setUploadProgress(0);
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      // 1. Start Session
      // FIXED: parameter name must be 'original_filename' to match backend validator
      const startResponse = await apiCall(
        "/super-admin/backup/chunk/start",
        "POST",
        {
          original_filename: file.name,
          total_chunks: totalChunks,
        }
      );

      const { upload_id } = startResponse; // Backend returns 'upload_id' (uuid)
      if (!upload_id) throw new Error("Failed to initialize upload session.");

      // 2. Upload Chunks
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("chunk_file", chunk); // Backend expects 'chunk_file'
        formData.append("chunk_number", (i + 1).toString()); // Backend expects 1-based index

        await apiCall(
          `/super-admin/backup/chunk/${upload_id}`,
          "POST",
          formData,
          true // isForm = true
        );

        // Update Progress
        const percent = Math.round(((i + 1) / totalChunks) * 100);
        setUploadProgress(percent);
      }

      // 3. Finish Assembly
      // This assembles the file and returns the temporary path
      const finishResponse = await apiCall(
        `/super-admin/backup/chunk/${upload_id}/finish`,
        "POST",
        {}
      );

      const assembledPath = finishResponse.path;
      if (!assembledPath)
        throw new Error("File assembly failed, no path returned.");

      // 4. Trigger Actual Restoration
      // We pass the path of the assembled file to the specific restore endpoint
      await apiCall(restoreEndpoint, "POST", {
        file_path: assembledPath,
      });

      return true;
    } catch (err) {
      throw err;
    } finally {
      setUploadProgress(0);
    }
  };

  // --- 1. BACKUP DATABASE ---
  const handleBackupDatabase = async () => {
    setLoadingType("database");
    setError(null);
    setSuccess(null);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      const blob = await apiCallForBlob("/super-admin/backup/database", "POST");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `database_backup_${timestamp}.tar`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess("Database backup downloaded successfully.");
    } catch (err: any) {
      console.error("Database backup failed", err);
      setError(err.message || "Failed to download database backup.");
    } finally {
      setLoadingType(null);
    }
  };

  // --- 2. BACKUP FILES ---
  const handleBackupFiles = async () => {
    setLoadingType("files");
    setError(null);
    setSuccess(null);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      const blob = await apiCallForBlob("/super-admin/backup/files", "POST");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `system_files_backup_${timestamp}.tar`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess("System files backup downloaded successfully.");
    } catch (err: any) {
      console.error("File backup failed", err);
      setError(err.message || "Failed to download file backup.");
    } finally {
      setLoadingType(null);
    }
  };

  // --- 3. RESTORE DATABASE (Chunked) ---
  const handleRestoreDatabase = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = ""; // Reset input

    if (
      !window.confirm(
        "WARNING: This will completely WIPE the current database and replace it with the backup. This action cannot be undone. Are you sure?"
      )
    ) {
      return;
    }

    setLoadingType("restore_db");
    setError(null);
    setSuccess(null);

    try {
      // Pass the specific endpoint for database restoration
      await performChunkedRestore(file, "/super-admin/backup/restore-database");
      setSuccess("Database restored successfully.");
    } catch (err: any) {
      console.error("Database restore failed", err);
      setError(err.message || "Failed to restore database.");
    } finally {
      setLoadingType(null);
    }
  };

  // --- 4. RESTORE FILES (Chunked) ---
  const handleRestoreFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = ""; // Reset input

    if (
      !window.confirm(
        "This will overwrite existing system files with those in the backup. Are you sure you want to proceed?"
      )
    ) {
      return;
    }

    setLoadingType("restore_files");
    setError(null);
    setSuccess(null);

    try {
      // Pass the specific endpoint for file restoration
      await performChunkedRestore(file, "/super-admin/backup/restore-files");
      setSuccess("System files restored successfully.");
    } catch (err: any) {
      console.error("File restore failed", err);
      setError(err.message || "Failed to restore files.");
    } finally {
      setLoadingType(null);
    }
  };

  const isRestoring =
    loadingType === "restore_db" || loadingType === "restore_files";

  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          System Backup & Recovery
        </h2>
        <p className="text-gray-500 mt-2">
          Generate snapshots for safekeeping or restore the system from previous
          backups.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive border border-destructive/50 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <h5 className="font-medium leading-none tracking-tight">
              Operation Failed
            </h5>
            <div className="text-sm opacity-90">{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-100 p-4 text-green-700 border border-green-200 flex items-start gap-3">
          <RotateCw className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <h5 className="font-medium leading-none tracking-tight">Success</h5>
            <div className="text-sm opacity-90">{success}</div>
          </div>
        </div>
      )}

      {/* Progress Bar for Restoration */}
      {isRestoring && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span>Uploading & Restoring...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2 w-full" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Card */}
        <Card className="shadow-md border-t-4 border-t-blue-600 hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Database</CardTitle>
                <CardDescription>SQL Dump & Restoration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Backup:</strong> Creates a .tar archive of the MySQL
              database structure and data.
              <br />
              <strong>Restore:</strong> Accepts a .tar, .gz, or .sql file to
              completely replace the current database.
            </p>
          </CardContent>
          <CardFooter className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleBackupDatabase}
              disabled={loadingType !== null}
            >
              {loadingType === "database" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Backup
                </>
              )}
            </Button>

            <input
              type="file"
              ref={dbInputRef}
              className="hidden"
              accept=".tar,.gz,.sql"
              onChange={handleRestoreDatabase}
            />
            <Button
              variant="outline"
              className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-700"
              onClick={() => dbInputRef.current?.click()}
              disabled={loadingType !== null}
            >
              {loadingType === "restore_db" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Restore
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* File System Card */}
        <Card className="shadow-md border-t-4 border-t-amber-600 hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <FolderArchive className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-xl">System Files</CardTitle>
                <CardDescription>Storage Archive & Restoration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Backup:</strong> Archives the `storage/app/private`
              directory (manuscripts, docs).
              <br />
              <strong>Restore:</strong> Extracts a .tar or .gz archive to the
              storage root.
            </p>
          </CardContent>
          <CardFooter className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleBackupFiles}
              disabled={loadingType !== null}
            >
              {loadingType === "files" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Archiving...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Backup
                </>
              )}
            </Button>

            <input
              type="file"
              ref={filesInputRef}
              className="hidden"
              accept=".tar,.gz"
              onChange={handleRestoreFiles}
            />
            <Button
              variant="outline"
              className="flex-1 border-amber-200 hover:bg-amber-50 text-amber-700"
              onClick={() => filesInputRef.current?.click()}
              disabled={loadingType !== null}
            >
              {loadingType === "restore_files" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Restore
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-500">
        <strong>Note:</strong> Generating backups or restoring large files can
        take several minutes. Do not close this page until the operation
        completes.
      </div>
    </main>
  );
};

export default SystemBackupPage;
