<?php

namespace App\Providers;

use App\Models\CapstoneManuscript;
use App\Models\CapstoneSourceCode;
use App\Models\User;
use App\Policies\CapstoneManuscriptPolicy;
use App\Policies\CapstoneSourceCodePolicy;
use Illuminate\Support\Facades\Gate;
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
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // --- ROLE-BASED GATES ---

        /**
         * Gate for Super Admin role.
         * Usage: Gate::allows('isSuperAdmin') or @can('isSuperAdmin')
         */
        Gate::define('isSuperAdmin', function (User $user) {
            return $user->role === 'Super Admin';
        });

        /**
         * Gate for Admin role.
         * This allows both Admins and Super Admins.
         */
        Gate::define('isAdmin', function (User $user) {
            return in_array($user->role, ['Admin', 'Super Admin']);
        });

        /**
         * Gate for Adviser role.
         */
        Gate::define('isAdviser', function (User $user) {
            return $user->role === 'Adviser';
        });

        /**
         * Gate for Proponent role.
         */
        Gate::define('isProponent', function (User $user) {
            return $user->role === 'Proponent';
        });

        /**
         * Gate for Viewer role.
         */
        Gate::define('isViewer', function (User $user) {
            return $user->role === 'Viewer';
        });
    }
}
