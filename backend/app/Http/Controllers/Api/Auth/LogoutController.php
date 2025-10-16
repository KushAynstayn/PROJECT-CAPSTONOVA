<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActionType;
use App\Models\UserLog;
use Illuminate\Http\Response; // 👈 Import Response
use Illuminate\Support\Facades\Auth; // 👈 Import Auth

class LogoutController extends Controller
{
    /**
     * Handle user logout requests by invalidating the current session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $actionType = ActionType::firstOrCreate(['action_name' => 'logout']);
        UserLog::create([
            'user_id' => $user->id,
            'action_type_id' => $actionType->id,
            'details' => 'User logged out successfully.'
        ]);

        // **MODIFIED:** Log the user out from the 'web' guard.
        Auth::guard('web')->logout();

        // **MODIFIED:** Invalidate the session data.
        $request->session()->invalidate();

        // **MODIFIED:** Regenerate the CSRF token for security.
        $request->session()->regenerateToken();

        // **MODIFIED:** Return a successful "No Content" response.
        return response()->noContent();
    }
}
