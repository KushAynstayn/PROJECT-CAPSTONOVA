<?php

namespace App\Policies;

use App\Models\CapstoneManuscript;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\DB;

class CapstoneManuscriptPolicy
{
    use HandlesAuthorization;

    /**
     * Grant all permissions to Super Admins and Admins before any other checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'Super Admin' || $user->role === 'Admin') {
            return true;
        }
        return null; // Let the other policy methods decide
    }

    /**
     * Determine whether the user can view the manuscript using the DB facade.
     */
    public function view(User $user, CapstoneManuscript $manuscript): bool
    {
        // Get the project_id from the manuscript model instance.
        $projectId = $manuscript->project_id;

        // Rule 1: Check if the user is the project's adviser.
        // We query the capstone_projects table to get the adviser_id for this project.
        $adviserId = DB::table('capstone_projects')->where('id', $projectId)->value('adviser_id');
        if ($user->id === $adviserId) {
            return true;
        }

        // Rule 2: Check if the user is a researcher on the project.
        // We check for a matching record in the project_researchers pivot table.
        $isResearcher = DB::table('project_researchers')
            ->where('project_id', $projectId)
            ->where('user_id', $user->id)
            ->exists();

        if ($isResearcher) {
            return true;
        }

        // Rule 3: Allow users with the 'Viewer' role if they have an approved access record.
        // We check for a matching record in the viewer_accesses table.
        if ($user->role === 'Viewer') {
            return DB::table('viewer_accesses')
                ->where('project_id', $projectId)
                ->where('user_id', $user->id)
                ->exists();
        }

        // If none of the above conditions are met, deny access.
        return false;
    }
}
