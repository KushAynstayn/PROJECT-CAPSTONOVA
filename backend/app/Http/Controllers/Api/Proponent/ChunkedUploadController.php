<?php

namespace App\Http\Controllers\Api\Proponent;

use App\Http\Controllers\Controller;
use App\Models\ChunkedUpload;
use App\Models\FileChunk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ChunkedUploadController extends Controller
{
    /**
     * Initializes a new chunked upload process.
     * The frontend calls this first to get a unique ID for the upload.
     */
    public function start(Request $request): JsonResponse
    {


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
            'user_id' => Auth::id(),
            'original_filename' => $validated['original_filename'],
            'total_chunks' => $validated['total_chunks'],
            'status' => 'in_progress',
        ]);

        return response()->json(['upload_id' => $chunkedUpload->uuid], 201);
    }

    /**
     * Handles the upload of a single file chunk.
     */
    public function upload(Request $request, $uuid): JsonResponse
    {


        $chunkedUpload = ChunkedUpload::where('uuid', $uuid)->firstOrFail();

        // Ensure the authenticated user owns this upload
        if ($chunkedUpload->user_id !== Auth::id()) {
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

        // Store the chunk in a temporary, unique directory
        $chunkPath = $file->store("private/chunks/{$uuid}");

        FileChunk::create([
            'chunked_upload_id' => $chunkedUpload->id,
            'chunk_number' => $chunkNumber,
            'chunk_path' => $chunkPath,
        ]);

        return response()->json(['status' => "Chunk {$chunkNumber} received"], 200);
    }

    /**
     * Assembles the chunks into a final file once all chunks are uploaded.
     */
    public function finish(Request $request, $uuid): JsonResponse
    {


        $upload = ChunkedUpload::with('fileChunks')->where('uuid', $uuid)->firstOrFail();

        // Ensure the authenticated user owns this upload
        if ($upload->user_id !== Auth::id()) {
            abort(403, 'You do not own this upload process.');
        }

        if ($upload->fileChunks->count() !== $upload->total_chunks) {
            return response()->json(['message' => 'Mismatch in expected number of chunks.'], 400);
        }

        // Define the final path in a temporary directory, similar to your existing logic
        $user = Auth::user();
        $finalFileName = Str::random(40) . '.' . File::extension($upload->original_filename);
        $finalFilePath = "private/temp/{$user->id}/{$finalFileName}";

        // Ensure the temp directory exists
        Storage::makeDirectory("private/temp/{$user->id}");

        // Assemble the file
        try {
            $finalFile = fopen(Storage::path($finalFilePath), 'w');

            foreach ($upload->fileChunks->sortBy('chunk_number') as $chunk) {
                $chunkStream = Storage::readStream($chunk->chunk_path);
                stream_copy_to_stream($chunkStream, $finalFile);
                fclose($chunkStream);
            }
            fclose($finalFile);

            // Cleanup: Delete the individual chunk files and directory
            Storage::deleteDirectory("private/chunks/{$uuid}");
        } catch (\Exception $e) {
            Log::error("File assembly failed for UUID {$uuid}: " . $e->getMessage());
            // Cleanup any partial file
            Storage::delete($finalFilePath);
            $upload->update(['status' => 'failed']);
            return response()->json(['message' => 'Failed to assemble the file.'], 500);
        }

        $upload->update([
            'status' => 'complete',
            'final_file_path' => $finalFilePath,
        ]);

        return response()->json([
            'message' => 'File uploaded and assembled successfully.',
            'path' => $finalFilePath,
        ], 200);
    }
}
