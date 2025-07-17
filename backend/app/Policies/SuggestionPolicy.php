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
     *
     * A user can create a suggestion if they have the 'Adviser' role.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->role === 'Adviser';
    }

    /**
     * Determine whether the user can update the suggestion.
     *
     * A user can update a suggestion if they are the adviser who created it.
     *
     * @param User $user
     * @param Suggestion $suggestion
     * @return bool
     */
    public function update(User $user, Suggestion $suggestion): bool
    {
        return $user->id === $suggestion->adviser_id;
    }

    /**
     * Determine whether the user can archive the suggestion.
     *
     * A user can archive a suggestion if they are the adviser who created it.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Suggestion  $suggestion
     * @return bool
     */
    public function archive(User $user, Suggestion $suggestion): bool
    {
        return $user->id === $suggestion->adviser_id;
    }
}
