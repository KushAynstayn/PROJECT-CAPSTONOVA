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
    public function index(Request $request)
    {
        $viewerId = Auth::id();

        // Retrieve the viewer's accessed projects with all related data eager-loaded.
        $accessedProjects = ViewerAccess::where('user_id', $viewerId)
            ->with([
                'project.adviser', // Gets the adviser's details.
                'project.projectResearcher.user.userDetail', // Gets researcher details like department and program.
                'project.manuscript' // Gets the manuscript to extract its ID.
            ])
            ->get();

        // Transform the data to create a clean and structured response.
        $formattedProjects = $accessedProjects->map(function ($access) {
            $project = $access->project;
            $researcherInfo = $project->projectResearcher;
            $mainProponent = $researcherInfo->user;

            // Combine all project authors into a single array.
            $authors = collect([
                $researcherInfo->member_hacker,
                $researcherInfo->member_hipster1,
                $researcherInfo->member_hipster2
            ])->filter()->all(); // filter() removes any null or empty values.

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
