<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Models\ViewerAccess;
use Illuminate\Http\Request;
use App\Models\ApprovalHistory;
use App\Models\DocumentRequest;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class DocumentRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }


        $query = DocumentRequest::query()->with([
            'viewer:id,first_name,last_name,email',
            'project:id,title,abstract,submission_date'
        ]);

        // Optional Filters
        $query->when($request->query('status'), function ($q, $status) {
            return $q->where('status', $status);
        });

        $query->when($request->query('viewer_id'), function ($q, $viewerId) {
            return $q->where('viewer_id', $viewerId);
        });

        $query->when($request->query('project_id'), function ($q, $projectId) {
            return $q->where('project_id', $projectId);
        });

        $documentRequests = $query
            ->select('request_id', 'viewer_id', 'project_id', 'request_date', 'status')
            ->paginate()
            ->through(function ($request) {
                return [
                    'request_id' => $request->request_id,
                    'viewer' => [
                        'id' => $request->viewer->id,
                        'full_name' => trim($request->viewer->first_name . ' ' . $request->viewer->last_name),
                        'email' => $request->viewer->email,
                    ],
                    'project' => [
                        'id' => $request->project->id,
                        'title' => $request->project->title,
                        'abstract' => $request->project->abstract,
                        'submission_date' => $request->project->submission_date,
                    ],
                    'request_date' => $request->request_date,
                    'status' => $request->status,
                ];
            });

        return response()->json($documentRequests);
    }

    /**
     * Approve a document request.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve(Request $request, $id)
    {
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }

        $validator = Validator::make($request->all(), [
            'grant_date' => 'required|date_format:Y-m-d',
            'expiry_date' => 'required|date_format:Y-m-d|after_or_equal:grant_date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();
        $documentRequest = DocumentRequest::where('status', 'pending')->findOrFail($id);

        $updatedRequest = DB::transaction(function () use ($request, $documentRequest, $validated) {

            $documentRequest->status = 'approved';
            $documentRequest->save();


            ViewerAccess::create([
                'user_id' => $documentRequest->viewer_id,
                'project_id' => $documentRequest->project_id,
                'grant_date' => $validated['grant_date'],
                'expiry_date' => $validated['expiry_date'],
            ]);


            ApprovalHistory::create([
                'viewer_id' => $documentRequest->viewer_id,
                'project_id' => $documentRequest->project_id,
                'request_date' => $documentRequest->request_date,
                'approval_date' => now(),
                'expiry_date' => $validated['expiry_date'],
                'approver_id' => $request->user()->id,
            ]);

            return $documentRequest;
        });

        return response()->json($updatedRequest);
    }

    /**
     * Reject a document request.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject(Request $request, $id)
    {

        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }

        $documentRequest = DocumentRequest::where('status', 'pending')->findOrFail($id);

        $documentRequest->status = 'rejected';
        $documentRequest->save();

        return response()->json($documentRequest);
    }
}
