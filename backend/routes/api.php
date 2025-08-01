<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;

use App\Http\Controllers\Api\User\ProfileController;
use App\Http\Controllers\Api\Admin\AdviserController;

use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\ProjectDetailsController;
use App\Http\Controllers\Api\User\StreamAcmController;
use App\Http\Controllers\Api\Admin\WhitelistController;
use App\Http\Controllers\Api\SuperAdmin\UserController;
use App\Http\Controllers\Api\Adviser\ProponentController;
use App\Http\Controllers\Api\Adviser\SuggestionController;
use App\Http\Controllers\Api\Admin\CapstoneProjectController;
use App\Http\Controllers\Api\User\StreamManuscriptController;
use App\Http\Controllers\Api\Viewer\RequestProjectController;
use App\Http\Controllers\Api\Adviser\AssignedProjectController;
use App\Http\Controllers\Api\User\DownloadSourceCodeController;
use App\Http\Controllers\Api\Viewer\SuggestionInterestController;
use App\Http\Controllers\Api\Proponent\SubmitSourceCodeController;
use App\Http\Controllers\Api\SuperAdmin\DocumentRequestController;
use App\Http\Controllers\Api\SuperAdmin\SuperAdminWhitelistController;
use App\Http\Controllers\Api\Proponent\SubmitDocumentAndDetailController;


// Authentication routes grouped under the 'auth' prefix.
Route::prefix('auth')->group(function () {

    Route::post('/register', RegisterController::class)->name('auth.register');

    Route::post('/login', LoginController::class)->name('auth.login');

    Route::post('/logout', LogoutController::class)
        ->middleware('auth:sanctum')
        ->name('auth.logout');
});


// User routes, protected by Sanctum authentication.
Route::prefix('user')->middleware('auth:sanctum')->group(function () {
    // Profile management routes.
    Route::get('/profile', [ProfileController::class, 'show'])->name('user.profile.show');

    Route::put('/profile', [ProfileController::class, 'update'])->name('user.profile.update');

    //File streaming routes
    // These routes handle streaming of manuscripts and ACM files.
    // They ensure that the user has permission to view the manuscript or ACM file before streaming.
    Route::get('/stream/manuscript/{manuscript}', StreamManuscriptController::class)
        ->name('user.manuscript.stream');

    Route::get('/stream/acm/{manuscript}', StreamAcmController::class)
        ->name('user.acm.stream');

    Route::get('/download/source-code/{source_code}', DownloadSourceCodeController::class)
        ->name('user.source-code.download');
});


// Public routes, no middleware.
Route::prefix('public')->group(function () {

    Route::get('project/{id}', [ProjectDetailsController::class, 'show'])
        ->name('project.show');

    Route::get('search', [SearchController::class, 'search'])
        ->name('search');
});


//Proponent routes.
Route::prefix('proponent')->middleware('auth:sanctum')->group(function () {

    Route::post('/submit-project', SubmitDocumentAndDetailController::class)
        ->name('proponent.submitmanuscript');

    Route::post('/submit-source-code', SubmitSourceCodeController::class)
        ->name('source-code.submit');
});


// Adviser routes, protected by Sanctum authentication.
Route::middleware('auth:sanctum')->prefix('adviser')->group(function () {
    // Suggestion Routes
    Route::get('suggestions', [SuggestionController::class, 'index'])
        ->name('suggestions.index');

    Route::post('suggestions', [SuggestionController::class, 'store'])
        ->name('suggestions.store');

    Route::put('suggestions/{suggestion}', [SuggestionController::class, 'update'])
        ->name('suggestions.update');

    Route::patch('suggestions/{suggestion}/archive', [SuggestionController::class, 'archive'])
        ->name('suggestions.archive');

    // Assigned Project Routes
    Route::get('assigned-projects', [AssignedProjectController::class, 'index'])
        ->name('assigned-projects.index');

    // Proponent Routes
    Route::get('proponents', [ProponentController::class, 'index'])
        ->name('proponents.index');
});

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    //Whitelist Routes
    Route::post('whitelist', [WhitelistController::class, 'store'])
        ->name('admin.whitelist.store');

    Route::post('whitelist/upload-excel', [WhitelistController::class, 'uploadExcel'])
        ->name('admin.whitelist.upload-excel');
    //adviser Routes
    Route::post('advisers', [AdviserController::class, 'store'])
        ->name('admin.advisers.store');

    Route::patch('advisers/{user}/restrict', [AdviserController::class, 'restrict'])
        ->name('admin.advisers.restrict');

    Route::get('advisers', [AdviserController::class, 'index'])
        ->name('admin.advisers.index');

    // Capstone Project Routes
    Route::patch('capstone-projects/{project}/archive', [CapstoneProjectController::class, 'archive'])
        ->name('admin.capstone-projects.archive');

    Route::patch('capstone-projects/{project}/unarchive', [CapstoneProjectController::class, 'unarchive'])
        ->name('admin.capstone-projects.unarchive');

    Route::get('capstone-projects/archived', [CapstoneProjectController::class, 'getArchived'])
        ->name('admin.capstone-projects.archived');
});


Route::prefix('super-admin')->middleware('auth:sanctum')->group(function () {

    Route::apiResource('users', UserController::class)
        ->names('super-admin.users');

    Route::apiResource('whitelist', SuperAdminWhitelistController::class)
        ->names('super-admin.whitelist');

    Route::get('document-requests', [DocumentRequestController::class, 'index']);

    Route::post('document-requests/{id}/approve', [DocumentRequestController::class, 'approve']);

    Route::post('document-requests/{id}/reject', [DocumentRequestController::class, 'reject']);
});


Route::prefix('viewer')->middleware('auth:sanctum')->group(function () {

    Route::post('request-project/{project_id}', [RequestProjectController::class, 'store']);

    Route::post('suggestions/{id}/interest', [SuggestionInterestController::class, 'expressInterest']);

    Route::delete('suggestions/{id}/interest', [SuggestionInterestController::class, 'removeInterest']);
});
