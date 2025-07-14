<?php

namespace App\Policies;

use App\Models\CapstoneSourceCode;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\DB;

class CapstoneSourceCodePolicy
{
    use HandlesAuthorization;

    /**
     * Grant all permissions to Super Admins and Admins before other checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'Super Admin' || $user->role === 'Admin') {
            return true;
        }
        return null; // Continue to other policy methods
    }

    /**
     * Determine whether the user can view the source code using the DB facade.
     */
    public function view(User $user, CapstoneSourceCode $sourceCode): bool
    {
        // Get the project_id from the source code model instance.
        $projectId = $sourceCode->project_id;

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

        // If neither of the above conditions are met, deny access.
        return false;
    }
}
