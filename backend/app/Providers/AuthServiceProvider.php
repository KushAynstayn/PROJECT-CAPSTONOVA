<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Suggestion;
use App\Models\CapstoneManuscript;
use App\Models\CapstoneSourceCode;
use App\Policies\SuggestionPolicy;
use Illuminate\Support\Facades\Gate;
use App\Policies\CapstoneManuscriptPolicy;
use App\Policies\CapstoneSourceCodePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        CapstoneManuscript::class => CapstoneManuscriptPolicy::class,
        CapstoneSourceCode::class => CapstoneSourceCodePolicy::class,
        Suggestion::class => SuggestionPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // --- ROLE-BASED GATES ---


        Gate::define('isSuperAdmin', function (User $user) {
            return $user->role === 'Super Admin';
        });


        Gate::define('isAdmin', function (User $user) {
            return in_array($user->role, ['Admin', 'Super Admin']);
        });


        Gate::define('isAdviser', function (User $user) {
            return $user->role === 'Adviser';
        });


        Gate::define('isProponent', function (User $user) {
            return $user->role === 'Proponent';
        });


        Gate::define('isViewer', function (User $user) {
            return $user->role === 'Viewer';
        });
    }
}
