<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Authentication routes grouped under the 'auth' prefix.
Route::prefix('auth')->group(function () {
    // Handles new user registration for Proponents (Students) and Viewers.
    Route::post('/register', RegisterController::class)->name('auth.register');

    // Handles user login and Sanctum token generation.
    Route::post('/login', LoginController::class)->name('auth.login');

    // Handles user logout and token revocation, protected by Sanctum.
    Route::post('/logout', LogoutController::class)
        ->middleware('auth:sanctum')
        ->name('auth.logout');
});

// Route to fetch personal details of the authenticated user, protected by Sanctum.
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
})->name('user.details');