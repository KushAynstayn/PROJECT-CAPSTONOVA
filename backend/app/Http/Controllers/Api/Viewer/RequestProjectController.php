<?php

namespace App\Http\Controllers\Api\Viewer;

use App\Http\Controllers\Controller;
use App\Models\CapstoneProject;
use App\Models\DocumentRequest;
use Illuminate\Http\Request;

class RequestProjectController extends Controller
{
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
