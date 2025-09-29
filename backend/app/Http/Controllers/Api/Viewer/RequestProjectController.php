<?php

namespace App\Http\Controllers\Api\Viewer;

use App\Models\ViewerAccess;
use Illuminate\Http\Request;
use App\Models\CapstoneProject;
use App\Models\DocumentRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class RequestProjectController extends Controller
{

    /**
     * Display a listing of the capstone projects the viewer has access to.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * Display a listing of the capstone projects the viewer has access to.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $viewerId = Auth::id();

        // Retrieve the viewer's accessed projects, filtering for active grants.
        $accessedProjects = ViewerAccess::where('user_id', $viewerId)
            // NEW LOGIC: This block ensures that only non-expired projects are returned.
            ->where(function ($query) {
                $query->where('expiry_date', '>', now()) // The expiry date is in the future.
                    ->orWhereNull('expiry_date');      // Or there is no expiry date (permanent access).
            })
            ->with([
                'project.adviser',
                'project.projectResearcher.user.userDetail',
                'project.manuscript'
            ])
            ->get();

        // Transform the data to create a clean and structured response.
        $formattedProjects = $accessedProjects->map(function ($access) {
            $project = $access->project;
            $researcherInfo = $project->projectResearcher;
            $mainProponent = $researcherInfo->user;

            $authors = collect([
                $researcherInfo->member_hacker,
                $researcherInfo->member_hipster1,
                $researcherInfo->member_hipster2
            ])->filter()->all();

            return [
                'access_id' => $access->access_id,
                'project_id' => $project->id,
                'project_title' => $project->title,
                'submission_year' => $project->submission_year,
                'adviser_name' => $project->adviser ? $project->adviser->first_name . ' ' . $project->adviser->last_name : 'N/A',
                'project_authors' => $authors,
                'department' => $mainProponent->userDetail->department ?? 'N/A',
                'program' => $mainProponent->userDetail->program ?? 'N/A',
                'manuscript_id' => $project->manuscript->manuscript_id ?? null,
                'grant_date' => $access->grant_date,
                'expiry_date' => $access->expiry_date,
            ];
        });

        return response()->json($formattedProjects);
    }

    /**
     * Store a newly created document request in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $project_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $project_id)
    {

        $project = CapstoneProject::findOrFail($project_id);


        $existingRequest = DocumentRequest::where('viewer_id', $request->user()->id)
            ->where('project_id', $project->id)
            ->first();

        if ($existingRequest) {
            return response()->json(['message' => 'You have already requested access to this project.'], 409);
        }

        $documentRequest = DocumentRequest::create([
            'viewer_id' => $request->user()->id,
            'project_id' => $project->id,
            'request_date' => now(),
            'status' => 'pending',
        ]);

        return response()->json($documentRequest, 201);
    }
}
