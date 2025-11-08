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
use Illuminate\Support\Str;

class SystemSettingController extends Controller
{
    /**
     * 
     * Accessible only by Super Admins.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function all(Request $request): JsonResponse
    {
        // 1. Authorization: Only Super Admins can see all settings.
        if (Auth::user()->role !== 'Super Admin') {
            return response()->json(['message' => 'Unauthorized. This action requires Super Admin privileges.'], 403);
        }

        // 2. Use a single cache key for all settings
        $cacheKey = 'settings:all';

        // 3. Get all settings, caching forever (or until toggled)
        $settings = Cache::rememberForever($cacheKey, function () {
            return SystemSetting::all()
                ->pluck('is_enabled', 'setting_name');
        });

        return response()->json($settings);
    }

    /**
     * Check the status of a specific system setting.
     * (This is the public-facing route for gate-keeping)
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

        $settingName = $request->input('setting_name');

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
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function toggle(Request $request): JsonResponse
    {
        // 1. Authorization
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

        // 4. Important: Clear BOTH cache entries.

        // (a) Clear the individual setting cache (from your 'check' method)
        Cache::forget($settingName);

        // (b) CRITICAL: Clear the new 'settings:all' cache
        Cache::forget('settings:all');

        // 5. Return the updated setting
        return response()->json([
            'message' => 'System setting updated successfully.',
            'data' => $setting,
        ]);
    }
}
