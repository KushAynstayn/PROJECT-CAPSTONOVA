<?php

namespace App\Policies;

use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SuggestionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create suggestions.
     */
    public function create(User $user): bool
    {
        return $user->role === 'Adviser';
    }

    /**
     * Determine whether the user can update the suggestion.
     */
    public function update(User $user, Suggestion $suggestion): bool
    {
        return $user->id === $suggestion->adviser_id;
    }

    /**
     * Determine whether the user can archive the suggestion.
     */
    public function archive(User $user, Suggestion $suggestion): bool
    {
        return $user->id === $suggestion->adviser_id;
    }

    /**
     * Determine whether the user can remove their interest from a suggestion.
     */
    public function removeInterest(User $user, Suggestion $suggestion): bool
    {
        return $user->id === $suggestion->interested_student_id;
    }
}
