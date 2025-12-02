<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use App\Models\ChunkedUpload;
use App\Models\FileChunk;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use PharData;
use Throwable;

class SystemBackupController extends Controller
{
    /**
     * Helper to get the absolute path of the current active storage disk.
     */
    private function getActiveDiskRoot()
    {
        $diskName = config('filesystems.default');
        return config("filesystems.disks.{$diskName}.root");
    }

    // =========================================================================
    // 1. BACKUP GENERATION (Standard)
    // =========================================================================

    public function backupFiles(Request $request)
    {
        set_time_limit(0);
        ini_set('memory_limit', '-1');

        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $diskName = config('filesystems.default');
        $downloadName = "system_files_backup_{$diskName}_{$timestamp}.tar";

        $sourcePath = $this->getActiveDiskRoot();
        $tempDir = storage_path('app/backups/generated');

        if (!File::exists($tempDir)) File::makeDirectory($tempDir, 0755, true);

        $tempTarPath = $tempDir . DIRECTORY_SEPARATOR . uniqid('backup_files_', true) . '.tar';

        try {
            $phar = new PharData($tempTarPath);
            $phar->buildFromDirectory($sourcePath);
            return response()->download($tempTarPath, $downloadName)->deleteFileAfterSend(true);
        } catch (Throwable $e) {
            Log::error("File Backup Failed: " . $e->getMessage());
            if (File::exists($tempTarPath)) File::delete($tempTarPath);
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function backupDatabase(Request $request)
    {
        set_time_limit(0);
        ini_set('memory_limit', '-1');

        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $downloadName = "database_backup_{$timestamp}.tar";
        $sqlFileName = "database_dump_{$timestamp}.sql";

        $tempDir = storage_path('app/backups/generated');
        if (!File::exists($tempDir)) File::makeDirectory($tempDir, 0755, true);

        $uniqueId = uniqid('backup_db_', true);
        $tempSqlPath = $tempDir . DIRECTORY_SEPARATOR . $uniqueId . '.sql';
        $tempTarPath = $tempDir . DIRECTORY_SEPARATOR . $uniqueId . '.tar';

        $handle = null;

        try {
            $handle = fopen($tempSqlPath, 'w+');
            fwrite($handle, "-- Native PHP SQL Dump\n");
            fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n");
            fwrite($handle, "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n\n");

            $tables = DB::select('SHOW TABLES');

            foreach ($tables as $tableObj) {
                $tableArray = (array)$tableObj;
                $table = reset($tableArray);

                fwrite($handle, "DROP TABLE IF EXISTS `$table`;\n");
                $createRow = DB::select("SHOW CREATE TABLE `$table`");
                $createTableSql = (array)$createRow[0];
                $createStmt = $createTableSql['Create Table'] ?? $createTableSql['CREATE TABLE'];
                fwrite($handle, $createStmt . ";\n\n");

                DB::table($table)->orderBy(DB::raw('1'))->chunk(1000, function ($rows) use ($handle, $table) {
                    foreach ($rows as $row) {
                        $values = [];
                        foreach ((array)$row as $value) {
                            if (is_null($value)) $values[] = "NULL";
                            elseif (is_numeric($value)) $values[] = $value;
                            else $values[] = "'" . str_replace(["\\", "'", "\r", "\n", "\x00", "\x1a"], ["\\\\", "\\'", "\\r", "\\n", "\\0", "\\Z"], $value) . "'";
                        }
                        fwrite($handle, "INSERT INTO `$table` VALUES (" . implode(", ", $values) . ");\n");
                    }
                });
                fwrite($handle, "\n");
            }

            fwrite($handle, "SET FOREIGN_KEY_CHECKS=1;\n");
            fclose($handle);

            $phar = new PharData($tempTarPath);
            $phar->addFile($tempSqlPath, $sqlFileName);
            if (File::exists($tempSqlPath)) File::delete($tempSqlPath);

            return response()->download($tempTarPath, $downloadName)->deleteFileAfterSend(true);
        } catch (Throwable $e) {
            Log::error("Database Backup Failed: " . $e->getMessage());
            if (isset($handle) && is_resource($handle)) fclose($handle);
            if (File::exists($tempSqlPath)) File::delete($tempSqlPath);
            if (File::exists($tempTarPath)) File::delete($tempTarPath);
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // =========================================================================
    // 2. CHUNKED UPLOAD LOGIC (Adapted from your Reference)
    // =========================================================================

    public function startChunkUpload(Request $request)
    {
        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'original_filename' => ['required', 'string', 'max:255'],
            'total_chunks' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        $chunkedUpload = ChunkedUpload::create([
            'uuid' => Str::uuid(),
            'user_id' => $request->user()->id,
            'original_filename' => $validated['original_filename'],
            'total_chunks' => $validated['total_chunks'],
            'status' => 'in_progress',
        ]);

        return response()->json(['upload_id' => $chunkedUpload->uuid], 201);
    }

    public function uploadChunk(Request $request, $uuid)
    {
        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $chunkedUpload = ChunkedUpload::where('uuid', $uuid)->firstOrFail();

        if ($chunkedUpload->user_id !== $request->user()->id) {
            abort(403, 'You do not own this upload process.');
        }

        $validator = Validator::make($request->all(), [
            'chunk_file' => ['required', 'file'],
            'chunk_number' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();
        $file = $request->file('chunk_file');
        $chunkNumber = $validated['chunk_number'];

        // Store in private/chunks/{uuid} as per reference
        $chunkPath = $file->store("private/chunks/{$uuid}");

        FileChunk::create([
            'chunked_upload_id' => $chunkedUpload->id,
            'chunk_number' => $chunkNumber,
            'chunk_path' => $chunkPath,
        ]);

        return response()->json(['status' => "Chunk {$chunkNumber} received"], 200);
    }

    public function finishChunkUpload(Request $request, $uuid)
    {
        set_time_limit(0); // Assembly might take time

        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $upload = ChunkedUpload::with('fileChunks')->where('uuid', $uuid)->firstOrFail();

        if ($upload->user_id !== $request->user()->id) {
            abort(403, 'You do not own this upload process.');
        }

        if ($upload->fileChunks->count() !== $upload->total_chunks) {
            return response()->json(['message' => 'Mismatch in expected number of chunks.'], 400);
        }

        // Final path in private/temp/{user_id}/... as per reference
        $user = $request->user();
        $finalFileName = Str::random(40) . '.' . File::extension($upload->original_filename);
        $finalFilePath = "private/temp/{$user->id}/{$finalFileName}";

        Storage::makeDirectory("private/temp/{$user->id}");

        try {
            $finalFile = fopen(Storage::path($finalFilePath), 'w');

            foreach ($upload->fileChunks->sortBy('chunk_number') as $chunk) {
                // Read from Storage facade
                $chunkStream = Storage::readStream($chunk->chunk_path);
                stream_copy_to_stream($chunkStream, $finalFile);
                fclose($chunkStream);
            }
            fclose($finalFile);

            // Cleanup chunks
            Storage::deleteDirectory("private/chunks/{$uuid}");
        } catch (Throwable $e) {
            Log::error("File assembly failed for UUID {$uuid}: " . $e->getMessage());
            Storage::delete($finalFilePath);
            $upload->update(['status' => 'failed']);
            return response()->json(['message' => 'Failed to assemble the file.'], 500);
        }

        $upload->update([
            'status' => 'complete',
            'final_file_path' => $finalFilePath,
        ]);

        // Return the 'final_file_path' (relative to storage/app)
        return response()->json([
            'message' => 'File uploaded and assembled successfully.',
            'path' => $finalFilePath,
        ], 200);
    }

    // =========================================================================
    // 3. RESTORE LOGIC (Uses the assembled file)
    // =========================================================================

    public function restoreFiles(Request $request)
    {
        set_time_limit(0);
        ignore_user_abort(true);

        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // 'file_path' is the relative path returned by finishChunkUpload
        $request->validate(['file_path' => 'required|string']);

        // Convert relative storage path to absolute system path for Phar/Tar
        if (!Storage::exists($request->file_path)) {
            return response()->json(['message' => 'Restore file not found.'], 404);
        }
        $sourceFile = Storage::path($request->file_path);

        $targetPath = $this->getActiveDiskRoot();

        try {
            // Use Native TAR for Linux (Faster)
            if (function_exists('exec') && stripos(PHP_OS, 'WIN') === false) {
                $command = "tar -xf " . escapeshellarg($sourceFile) . " -C " . escapeshellarg($targetPath) . " --overwrite 2>&1";
                exec($command, $output, $returnVar);

                if ($returnVar !== 0) {
                    throw new \Exception("Native extraction failed: " . implode("\n", $output));
                }
            } else {
                $phar = new PharData($sourceFile);
                $phar->extractTo($targetPath, null, true);
            }

            // Cleanup the merged file
            Storage::delete($request->file_path);

            return response()->json(['message' => 'System files restored successfully.']);
        } catch (Throwable $e) {
            Log::error("File Restore Failed: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Restore failed: ' . $e->getMessage()], 500);
        }
    }

    public function restoreDatabase(Request $request)
    {
        set_time_limit(0);

        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate(['file_path' => 'required|string']);

        // Convert relative path to absolute
        if (!Storage::exists($request->file_path)) {
            return response()->json(['message' => 'Restore file not found.'], 404);
        }
        $sourceFile = Storage::path($request->file_path);

        try {
            $extension = pathinfo($sourceFile, PATHINFO_EXTENSION);
            $isArchive = in_array(strtolower($extension), ['tar', 'gz', 'tgz']);
            $sqlFileToProcess = $sourceFile;

            // Extract if archive
            if ($isArchive) {
                $extractDir = storage_path('app/private/temp/' . uniqid('extract_'));
                File::makeDirectory($extractDir, 0755, true);

                $phar = new PharData($sourceFile);
                $phar->extractTo($extractDir);

                $sqlFiles = glob($extractDir . '/*.sql');
                if (empty($sqlFiles)) {
                    throw new \Exception("No .sql file found inside the archive.");
                }
                $sqlFileToProcess = $sqlFiles[0];
            }

            $sqlContent = file_get_contents($sqlFileToProcess);
            if (!$sqlContent) throw new \Exception("Failed to read SQL content.");

            // EXECUTE RESTORE (No Transactions)
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            DB::unprepared($sqlContent);
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            // Cleanup
            Storage::delete($request->file_path);
            if (isset($extractDir)) File::deleteDirectory($extractDir);

            return response()->json(['message' => 'Database restored successfully.']);
        } catch (Throwable $e) {
            try {
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            } catch (Throwable $ex) {
            }

            Log::error("Database Restore Failed: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Restore failed: ' . $e->getMessage()], 500);
        }
    }
}
