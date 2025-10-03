<?php

namespace App\Http\Controllers\Api\Proponent;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessUsageGuide;
use App\Jobs\ProcessUserManual;
use App\Models\CapstoneProject;
use App\Models\ProjectAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProjectAttachmentController extends Controller
{
    /**
     * Handle the incoming request to submit a user manual.
     */
    public function submitUserManual(Request $request): JsonResponse
    {
        $user = Auth::user();

        // --- MODIFIED VALIDATION ---
        // Expects 'user_manual_path' (a string) instead of a file upload.
        $validator = Validator::make($request->all(), [
            'user_manual_path' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        $projectId = DB::table('project_researchers')
            ->where('user_id', $user->id)
            ->value('project_id');

        if (!$projectId) {
            return response()->json(['message' => 'You do not have a capstone project associated with your account.'], 404);
        }

        // --- MODIFIED FILE HANDLING ---
        // Get the path from the request and verify the file's existence.
        $tempPath = $validated['user_manual_path'];
        if (!Storage::exists($tempPath)) {
            return response()->json(['message' => 'The provided user manual file path is invalid.'], 404);
        }

        ProcessUserManual::dispatch($user, $projectId, $tempPath);

        return response()->json(['status' => 'queued', 'message' => 'User manual upload is being processed.'], 202);
    }

    /**
     * Handle the incoming request to submit a usage guide.
     */
    public function submitUsageGuide(Request $request): JsonResponse
    {
        $user = Auth::user();

        // --- MODIFIED VALIDATION ---
        // Expects 'usage_guide_path' (a string) instead of a file upload.
        $validator = Validator::make($request->all(), [
            'usage_guide_path' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        $projectId = DB::table('project_researchers')
            ->where('user_id', $user->id)
            ->value('project_id');

        if (!$projectId) {
            return response()->json(['message' => 'You do not have a capstone project associated with your account.'], 404);
        }

        // --- MODIFIED FILE HANDLING ---
        // Get the path from the request and verify the file's existence.
        $tempPath = $validated['usage_guide_path'];
        if (!Storage::exists($tempPath)) {
            return response()->json(['message' => 'The provided usage guide file path is invalid.'], 404);
        }

        ProcessUsageGuide::dispatch($user, $projectId, $tempPath);

        return response()->json(['status' => 'queued', 'message' => 'Usage guide upload is being processed.'], 202);
    }

    /**
     * Download the user manual for a specific project.
     * --- NO CHANGES NEEDED ---
     */
    public function downloadUserManual(CapstoneProject $project): StreamedResponse|JsonResponse
    {
        $this->authorizeDownload($project);

        $attachment = ProjectAttachment::where('project_id', $project->id)->first();

        if (!$attachment || !$attachment->user_manual_path || !Storage::exists($attachment->user_manual_path)) {
            return response()->json(['message' => 'User manual not found.'], 404);
        }

        return $this->streamDecryptedFile($attachment->user_manual_path);
    }

    /**
     * Download the usage guide for a specific project.
     * --- NO CHANGES NEEDED ---
     */
    public function downloadUsageGuide(CapstoneProject $project): StreamedResponse|JsonResponse
    {
        $this->authorizeDownload($project);

        $attachment = ProjectAttachment::where('project_id', $project->id)->first();

        if (!$attachment || !$attachment->usage_guide_path || !Storage::exists($attachment->usage_guide_path)) {
            return response()->json(['message' => 'Usage guide not found.'], 404);
        }

        return $this->streamDecryptedFile($attachment->usage_guide_path);
    }

    /**
     * Authorize if the current user can download attachments for the project.
     * --- NO CHANGES NEEDED ---
     */
    private function authorizeDownload(CapstoneProject $project): void
    {
        $user = Auth::user();
        $isProponent = $project->projectResearcher && $project->projectResearcher->user_id === $user->id;
        $isAdviser = $project->adviser_id === $user->id;
        $isAdmin = in_array($user->role, ['Admin', 'Super Admin']);

        if (!$isProponent && !$isAdviser && !$isAdmin) {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Streams a decrypted file to the browser.
     * --- NO CHANGES NEEDED ---
     */
    private function streamDecryptedFile(string $path): StreamedResponse
    {
        $filename = basename(str_replace('.enc', '', $path));

        return response()->streamDownload(function () use ($path) {
            $key = base64_decode(substr(Config::get('app.key'), 7));
            $encryptedStream = Storage::readStream($path);
            $outputStream = fopen('php://output', 'wb');

            while (!feof($encryptedStream)) {
                $lengthHeader = fread($encryptedStream, 4);
                if (!$lengthHeader) break;
                $chunkLength = unpack('N', $lengthHeader)[1];

                $nonce = fread($encryptedStream, SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                if (!$nonce) break;

                $encryptedChunk = fread($encryptedStream, $chunkLength);
                if (!$encryptedChunk) break;

                $decryptedChunk = sodium_crypto_aead_xchacha20poly1305_ietf_decrypt($encryptedChunk, '', $nonce, $key);
                fwrite($outputStream, $decryptedChunk);
            }

            fclose($encryptedStream);
            fclose($outputStream);
        }, $filename);
    }
}
