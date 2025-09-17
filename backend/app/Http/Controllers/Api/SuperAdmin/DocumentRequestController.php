<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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

        $query = DB::table('document_requests')
            ->join('users as viewer', 'document_requests.viewer_id', '=', 'viewer.id')
            ->join('capstone_projects', 'document_requests.project_id', '=', 'capstone_projects.id');

        // Filter by status
        $query->when($request->query('status'), function ($q, $status) {
            return $q->where('document_requests.status', $status);
        });

        // Filter by document/project title
        $query->when($request->query('project_title'), function ($q, $title) {
            return $q->where('capstone_projects.title', 'like', "%{$title}%");
        });

        // Filter by date range on request_date
        $query->when($request->query('start_date'), function ($q, $date) {
            return $q->whereDate('document_requests.request_date', '>=', $date);
        });
        $query->when($request->query('end_date'), function ($q, $date) {
            return $q->whereDate('document_requests.request_date', '<=', $date);
        });

        $documentRequests = $query
            ->select(
                'document_requests.request_id',
                'viewer.id as viewer_id',
                'viewer.first_name as viewer_first_name',
                'viewer.last_name as viewer_last_name',
                'viewer.email as viewer_email',
                'capstone_projects.id as project_id',
                'capstone_projects.title as project_title',
                'capstone_projects.abstract as project_abstract',
                'capstone_projects.submission_date as project_submission_date',
                'document_requests.request_date',
                'document_requests.status'
            )
            ->paginate(15)
            ->withQueryString()
            ->through(function ($row) {
                return [
                    'request_id' => $row->request_id,
                    'viewer' => [
                        'id' => $row->viewer_id,
                        'full_name' => trim($row->viewer_first_name . ' ' . $row->viewer_last_name),
                        'email' => $row->viewer_email,
                    ],
                    'project' => [
                        'id' => $row->project_id,
                        'title' => $row->project_title,
                        'abstract' => $row->project_abstract,
                        'submission_date' => $row->project_submission_date,
                    ],
                    'request_date' => $row->request_date,
                    'status' => $row->status,
                ];
            });

        return response()->json($documentRequests);
    }

    /**
     * Approve a document request.
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

        $documentRequest = DB::table('document_requests')
            ->where('status', 'pending')
            ->where('request_id', $id)
            ->first();

        if (!$documentRequest) {
            throw new ModelNotFoundException('Document request not found or not in pending state.');
        }

        DB::transaction(function () use ($request, $documentRequest, $validated) {
            DB::table('document_requests')
                ->where('request_id', $documentRequest->request_id)
                ->update(['status' => 'approved']);

            DB::table('viewer_accesses')->insert([
                'user_id' => $documentRequest->viewer_id,
                'project_id' => $documentRequest->project_id,
                'grant_date' => $validated['grant_date'],
                'expiry_date' => $validated['expiry_date'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            DB::table('approval_histories')->insert([
                'viewer_id' => $documentRequest->viewer_id,
                'project_id' => $documentRequest->project_id,
                'request_date' => $documentRequest->request_date,
                'approval_date' => Carbon::now(),
                'expiry_date' => $validated['expiry_date'],
                'approver_id' => $request->user()->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        });

        // Refetch the updated request to return it
        $updatedRequest = DB::table('document_requests')->where('request_id', $id)->first();

        return response()->json($updatedRequest);
    }

    /**
     * Reject a document request.
     */
    public function reject(Request $request, $id)
    {
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }

        $documentRequest = DB::table('document_requests')
            ->where('status', 'pending')
            ->where('request_id', $id)
            ->first();

        if (!$documentRequest) {
            throw new ModelNotFoundException('Document request not found or not in pending state.');
        }

        DB::table('document_requests')
            ->where('request_id', $id)
            ->update(['status' => 'rejected']);

        $updatedRequest = DB::table('document_requests')->where('request_id', $id)->first();

        return response()->json($updatedRequest);
    }

    /**
     * Display a listing of the approval history.
     */
    public function approvalHistory(Request $request)
    {
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }

        $query = DB::table('approval_histories')
            ->join('users as viewer', 'approval_histories.viewer_id', '=', 'viewer.id')
            ->join('users as approver', 'approval_histories.approver_id', '=', 'approver.id')
            ->join('capstone_projects', 'approval_histories.project_id', '=', 'capstone_projects.id');

        // Filter by document/project title
        $query->when($request->query('project_title'), function ($q, $title) {
            return $q->where('capstone_projects.title', 'like', "%{$title}%");
        });

        // Filter by date range on approval_date
        $query->when($request->query('start_date'), function ($q, $date) {
            return $q->whereDate('approval_histories.approval_date', '>=', $date);
        });
        $query->when($request->query('end_date'), function ($q, $date) {
            return $q->whereDate('approval_histories.approval_date', '<=', $date);
        });

        $approvalHistories = $query
            ->select(
                'approval_histories.history_id',
                'viewer.id as viewer_id',
                'viewer.first_name as viewer_first_name',
                'viewer.last_name as viewer_last_name',
                'viewer.email as viewer_email',
                'approver.id as approver_id',
                'approver.first_name as approver_first_name',
                'approver.last_name as approver_last_name',
                'approver.email as approver_email',
                'capstone_projects.id as project_id',
                'capstone_projects.title as project_title',
                'approval_histories.request_date',
                'approval_histories.approval_date',
                'approval_histories.expiry_date'
            )
            ->paginate(15)
            ->withQueryString()
            ->through(function ($row) {
                return [
                    'history_id' => $row->history_id,
                    'viewer' => [
                        'id' => $row->viewer_id,
                        'full_name' => trim($row->viewer_first_name . ' ' . $row->viewer_last_name),
                        'email' => $row->viewer_email,
                    ],
                    'project' => [
                        'id' => $row->project_id,
                        'title' => $row->project_title,
                    ],
                    'approver' => [
                        'id' => $row->approver_id,
                        'full_name' => trim($row->approver_first_name . ' ' . $row->approver_last_name),
                        'email' => $row->approver_email,
                    ],
                    'request_date' => $row->request_date,
                    'approval_date' => $row->approval_date,
                    'expiry_date' => $row->expiry_date,
                ];
            });

        return response()->json($approvalHistories);
    }
}
