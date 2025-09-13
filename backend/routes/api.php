<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;


use App\Http\Controllers\Api\User\ProfileController;

use App\Http\Controllers\Api\Admin\AdviserController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Util\ResourceController;
use App\Http\Controllers\Api\ProjectDetailsController;
use App\Http\Controllers\Api\User\StreamAcmController;
use App\Http\Controllers\Api\Admin\WhitelistController;
use App\Http\Controllers\Api\SuperAdmin\UserController;
use App\Http\Controllers\Api\Admin\UserViewerController;
use App\Http\Controllers\Api\Util\ProjectTypeController;
use App\Http\Controllers\Api\Adviser\ProponentController;
use App\Http\Controllers\API\User\NotificationController;

use App\Http\Controllers\Api\Util\FetchAdviserController;
use App\Http\Controllers\Api\Util\ProjectToolsController;
use App\Http\Controllers\Api\Adviser\SuggestionController;
use App\Http\Controllers\Api\Util\UserManuscriptController;
use App\Http\Controllers\Api\Util\AdviserOverviewController;
use App\Http\Controllers\Api\Util\CheckManuscriptController;
use App\Http\Controllers\Api\Util\CheckSourceCodeController;
use App\Http\Controllers\Api\Admin\CapstoneProjectController;
use App\Http\Controllers\Api\User\StreamManuscriptController;
use App\Http\Controllers\Api\Util\EnvironmentTrendController;
use App\Http\Controllers\Api\Viewer\RequestProjectController;
use App\Http\Controllers\Api\Adviser\AssignedProjectController;
use App\Http\Controllers\Api\User\DownloadSourceCodeController;
use App\Http\Controllers\Api\Util\AdminDashboardUtilController;
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

    Route::get('/notifications', [NotificationController::class, 'index']);

    //whitelist routes general purpose
    Route::get('/suggestions', [\App\Http\Controllers\Api\User\SuggestionController::class, 'index']);
    Route::get('/suggestions/{id}', [\App\Http\Controllers\Api\User\SuggestionController::class, 'show']);
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
    // ============================
    // Whitelist Routes (Admin)
    // These routes handle all whitelist-related operations for admins.
    // ============================

    Route::post('whitelist', [WhitelistController::class, 'store'])
        ->name('admin.whitelist.store');

    Route::post('whitelist/upload-excel', [WhitelistController::class, 'uploadExcel'])
        ->name('admin.whitelist.upload-excel');

    // Route to get a list of all whitelist entries
    Route::get('whitelist', [WhitelistController::class, 'index']);

    // Route to get a single, specific whitelist entry
    Route::get('whitelist/{id}', [WhitelistController::class, 'show']);

    // Route to delete a whitelist entry
    Route::delete('whitelist/{whitelist}', [WhitelistController::class, 'destroy']);

    // Route to update a specific whitelist entry
    Route::put('whitelist/{whitelist}', [WhitelistController::class, 'update']);

    // ============================
    // End Whitelist Routes
    // ============================

    Route::get('viewers', [UserViewerController::class, 'index'])->name('viewers.index');
    Route::post('viewers', [UserViewerController::class, 'store'])->name('viewers.store');
    Route::get('viewers/{id}', [UserViewerController::class, 'show'])->name('viewers.show');
    Route::put('viewers/{id}', [UserViewerController::class, 'update'])->name('viewers.update');
    Route::delete('viewers/{id}', [UserViewerController::class, 'destroy'])->name('viewers.destroy');


    // ============================
    // Adviser Routes (Admin)
    // These routes handle all adviser-related operations for admins.
    // ============================

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

Route::prefix('util')->group(function () {

    //Analytics routes
    Route::get('/project-types', ProjectTypeController::class);
    Route::get('/environment-trends', EnvironmentTrendController::class);
    Route::get('/project-tools', ProjectToolsController::class);

    //Admin analytics route
    Route::get('/top-advisers', [AdminDashboardUtilController::class, 'topAdvisers']);
    Route::get(
        '/programming-tools-usage',
        [AdminDashboardUtilController::class, 'programmingToolsUsage']
    );
    Route::get(
        '/projects-by-type',
        [AdminDashboardUtilController::class, 'projectsByType']
    );
    Route::get(
        '/role-distribution',
        [AdminDashboardUtilController::class, 'roleDistribution']
    );
    Route::get(
        '/latest-submission',
        [AdminDashboardUtilController::class, 'latestSubmission']
    );
    Route::get(
        '/latest-suggestion',
        [AdminDashboardUtilController::class, 'latestSuggestionCard']
    );

    //Adviser analytics route
    Route::get('/adviser-overview', AdviserOverviewController::class)->middleware('auth:sanctum');

    //Form routes
    Route::get('/keywords', [ResourceController::class, 'keywords']);
    Route::get('/programming-languages', [ResourceController::class, 'programmingLanguages']);
    Route::get('/advisers', [FetchAdviserController::class, 'index']);

    //Proponent util routes
    Route::post('/check-manuscript', [CheckManuscriptController::class, 'check'])
        ->middleware('auth:sanctum');
    Route::post('/check-source-code', [CheckSourceCodeController::class, 'check'])
        ->middleware('auth:sanctum');
    Route::get('/my-manuscript-id', [UserManuscriptController::class, 'getMyManuscriptId'])
        ->middleware('auth:sanctum');
});
