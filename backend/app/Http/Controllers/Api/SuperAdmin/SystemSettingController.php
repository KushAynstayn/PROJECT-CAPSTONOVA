<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SystemSettingController extends Controller
{
    /**
     * Check the status of a specific system setting.
     * This endpoint is public and can be used by the frontend to conditionally show/hide UI elements.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function check(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'setting_name' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $settingName = $request->query('setting_name');

        // Use cache to improve performance for frequent checks.
        $isEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            // If the setting doesn't exist in the DB, it's considered disabled.
            return $setting ? $setting->is_enabled : false;
        });

        return response()->json([
            'setting_name' => $settingName,
            'is_enabled' => (bool) $isEnabled,
        ]);
    }

    /**
     * Toggle a system setting on or off.
     * This is a protected endpoint, accessible only by Super Admins.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function toggle(Request $request): JsonResponse
    {
        // 1. Authorization: Only Super Admins can toggle settings.
        if (Auth::user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized. This action requires Super Admin privileges.'], 403);
        }

        // 2. Validation
        $validator = Validator::make($request->all(), [
            'setting_name' => ['required', 'string', Rule::exists('system_settings', 'setting_name')],
            'is_enabled' => ['required', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();
        $settingName = $validated['setting_name'];
        $isEnabled = $validated['is_enabled'];

        // 3. Update the setting
        $setting = SystemSetting::where('setting_name', $settingName)->first();
        $setting->update(['is_enabled' => $isEnabled]);

        // 4. Important: Clear the specific cache entry for this setting to reflect immediate changes.
        Cache::forget($settingName);

        // 5. Return the updated setting
        return response()->json([
            'message' => 'System setting updated successfully.',
            'data' => $setting,
        ]);
    }
}
