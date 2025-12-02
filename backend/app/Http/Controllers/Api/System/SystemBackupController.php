<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PharData;
use Throwable;

class SystemBackupController extends Controller
{
    /**
     * Helper to get the absolute path of the current active storage disk.
     * This ensures we target the correct folder (Local vs SSD) defined in .env
     */
    private function getActiveDiskRoot()
    {
        $diskName = config('filesystems.default'); // 'local' or 'ssd'
        return config("filesystems.disks.{$diskName}.root");
    }

    /**
     * Generate a TAR of the Active Storage directory and stream download it.
     */
    public function backupFiles(Request $request)
    {
        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $diskName = config('filesystems.default');
        $downloadName = "system_files_backup_{$diskName}_{$timestamp}.tar";

        // DYNAMIC: Use the root of the currently active disk
        $sourcePath = $this->getActiveDiskRoot();
        $tempDir = storage_path('app/backups/temp');

        if (!is_dir($tempDir)) mkdir($tempDir, 0755, true);
        $tempTarPath = $tempDir . DIRECTORY_SEPARATOR . uniqid() . '.tar';

        try {
            $phar = new PharData($tempTarPath);
            // This captures everything inside the root (preserving 'private/private' if it exists)
            $phar->buildFromDirectory($sourcePath);
            return response()->download($tempTarPath, $downloadName)->deleteFileAfterSend(true);
        } catch (Throwable $e) {
            Log::error("File Backup Failed: " . $e->getMessage());
            if (file_exists($tempTarPath)) unlink($tempTarPath);
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * [NEW METHOD] Restore Files from uploaded TAR.
     * Extracts contents directly to the Active Disk Root.
     */
    public function restoreFiles(Request $request)
    {
        set_time_limit(600); // Allow time for extraction

        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'backup_file' => 'required|file|mimes:tar,gz'
        ]);

        $file = $request->file('backup_file');
        $targetPath = $this->getActiveDiskRoot();

        // Safety check
        if (!$targetPath || $targetPath === '/' || !is_dir($targetPath)) {
            return response()->json(['message' => 'Invalid storage configuration.'], 500);
        }

        try {
            $phar = new PharData($file->getPathname());

            // Extract to the root. If the TAR contains "private/file.txt", 
            // it will be placed correctly inside the target root.
            $phar->extractTo($targetPath, null, true);

            return response()->json(['message' => 'System files restored successfully.']);
        } catch (Throwable $e) {
            Log::error("File Restore Failed: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Restore failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Backup Database using Native PHP (No mysqldump required)
     */
    public function backupDatabase(Request $request)
    {
        set_time_limit(600);
        ini_set('memory_limit', '512M');

        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $downloadName = "database_backup_{$timestamp}.tar";
        $sqlFileName = "database_dump_{$timestamp}.sql";

        $tempDir = storage_path('app/backups/temp');
        if (!is_dir($tempDir)) mkdir($tempDir, 0755, true);

        $uniqueId = uniqid();
        $tempSqlPath = $tempDir . DIRECTORY_SEPARATOR . $uniqueId . '.sql';
        $tempTarPath = $tempDir . DIRECTORY_SEPARATOR . $uniqueId . '.tar';

        $handle = null;

        try {
            $handle = fopen($tempSqlPath, 'w+');

            fwrite($handle, "-- Native PHP SQL Dump\n");
            fwrite($handle, "-- Generated: " . date('Y-m-d H:i:s') . "\n");
            fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n");
            fwrite($handle, "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n\n");

            $tables = DB::select('SHOW TABLES');

            foreach ($tables as $tableObj) {
                $tableArray = (array)$tableObj;
                $table = reset($tableArray);

                fwrite($handle, "-- Table structure for `$table`\n");
                fwrite($handle, "DROP TABLE IF EXISTS `$table`;\n");

                $createRow = DB::select("SHOW CREATE TABLE `$table`");
                $createTableSql = (array)$createRow[0];
                $createStmt = $createTableSql['Create Table'] ?? $createTableSql['CREATE TABLE'];

                fwrite($handle, $createStmt . ";\n\n");

                fwrite($handle, "-- Dumping data for `$table`\n");

                DB::table($table)->orderBy(DB::raw('1'))->chunk(200, function ($rows) use ($handle, $table) {
                    foreach ($rows as $row) {
                        $values = [];
                        foreach ((array)$row as $value) {
                            if (is_null($value)) {
                                $values[] = "NULL";
                            } elseif (is_numeric($value)) {
                                $values[] = $value;
                            } else {
                                $escaped = str_replace(["\\", "'", "\r", "\n", "\x00", "\x1a"], ["\\\\", "\\'", "\\r", "\\n", "\\0", "\\Z"], $value);
                                $values[] = "'$escaped'";
                            }
                        }
                        $valuesString = implode(", ", $values);
                        fwrite($handle, "INSERT INTO `$table` VALUES ($valuesString);\n");
                    }
                });
                fwrite($handle, "\n");
            }

            fwrite($handle, "SET FOREIGN_KEY_CHECKS=1;\n");
            fclose($handle);

            $phar = new PharData($tempTarPath);
            $phar->addFile($tempSqlPath, $sqlFileName);

            if (file_exists($tempSqlPath)) unlink($tempSqlPath);

            return response()->download($tempTarPath, $downloadName)->deleteFileAfterSend(true);
        } catch (Throwable $e) {
            Log::error("Native Database Backup Failed: " . $e->getMessage());
            if (isset($handle) && is_resource($handle)) fclose($handle);
            if (file_exists($tempSqlPath)) unlink($tempSqlPath);
            if (file_exists($tempTarPath)) unlink($tempTarPath);
            return response()->json(['status' => 'error', 'message' => 'Backup generation failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * [NEW METHOD] Restore Database from uploaded SQL or TAR file.
     * Wipes current database and re-creates from dump.
     */
    public function restoreDatabase(Request $request)
    {
        set_time_limit(600);
        ini_set('memory_limit', '1024M'); // Needs high memory for import

        if ($request->user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'backup_file' => 'required|file|mimes:sql,tar,gz'
        ]);

        $file = $request->file('backup_file');
        $tempDir = storage_path('app/backups/restore_temp');
        if (!is_dir($tempDir)) mkdir($tempDir, 0755, true);

        // Store temp file to extract/read
        $uploadedPath = $file->storeAs('backups/restore_temp', $file->getClientOriginalName());
        $fullPath = storage_path("app/{$uploadedPath}");
        $sqlPath = $fullPath;

        try {
            // 1. If TAR, extract it to find the SQL file
            if ($file->getClientOriginalExtension() === 'tar') {
                $phar = new PharData($fullPath);
                $phar->extractTo($tempDir, null, true);

                $files = glob($tempDir . '/*.sql');
                if (empty($files)) {
                    throw new \Exception("No .sql file found inside the TAR archive.");
                }
                $sqlPath = $files[0];
            }

            // 2. Read SQL content
            $sql = file_get_contents($sqlPath);

            // 3. Execute
            DB::beginTransaction();
            DB::unprepared($sql);
            DB::commit();

            // 4. Cleanup
            if (file_exists($fullPath)) unlink($fullPath);
            if (file_exists($sqlPath) && $sqlPath !== $fullPath) unlink($sqlPath);

            return response()->json(['message' => 'Database restored successfully.']);
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error("Database Restore Failed: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Restore failed: ' . $e->getMessage()], 500);
        }
    }
}
