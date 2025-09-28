<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;


use App\Http\Controllers\Api\User\ProfileController;


use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Util\ResourceController;
use App\Http\Controllers\Api\ProjectDetailsController;
use App\Http\Controllers\Api\User\StreamAcmController;



use App\Http\Controllers\Api\Util\CheckManualController;

use App\Http\Controllers\Api\Util\ProjectTypeController;

use App\Http\Controllers\Api\Adviser\ProponentController;
use App\Http\Controllers\API\User\NotificationController;
use App\Http\Controllers\Api\Util\FetchAdviserController;
use App\Http\Controllers\Api\Util\ProjectToolsController;

use App\Http\Controllers\Api\Adviser\SuggestionController;
use App\Http\Controllers\Api\Auth\TwoFactorAuthController;
use App\Http\Controllers\Api\Util\UserManuscriptController;
use App\Http\Controllers\Api\Util\AdviserOverviewController;
use App\Http\Controllers\Api\Util\CheckManuscriptController;
use App\Http\Controllers\Api\Util\CheckSourceCodeController;
use App\Http\Controllers\Api\Admin\CapstoneProjectController;
use App\Http\Controllers\Api\User\StreamManuscriptController;
use App\Http\Controllers\Api\UserManagement\MAdminController;
use App\Http\Controllers\Api\Util\EnvironmentTrendController;

use App\Http\Controllers\Api\Viewer\RequestProjectController;
use App\Http\Controllers\Api\UserManagement\MViewerController;
use App\Http\Controllers\Api\Adviser\AssignedProjectController;
use App\Http\Controllers\Api\User\DownloadSourceCodeController;
use App\Http\Controllers\Api\UserManagement\MAdviserController;
use App\Http\Controllers\Api\Util\AdminDashboardUtilController;
use App\Http\Controllers\Api\SuperAdmin\SystemSettingController;


use App\Http\Controllers\Api\UserManagement\MProponentController;
use App\Http\Controllers\Api\UserManagement\MWhitelistController;
use App\Http\Controllers\Api\Viewer\SuggestionInterestController;
use App\Http\Controllers\Api\Proponent\SubmitSourceCodeController;
use App\Http\Controllers\Api\SuperAdmin\DocumentRequestController;
use App\Http\Controllers\Api\Proponent\ProjectAttachmentController;
use App\Http\Controllers\Api\Util\ViewerReportsAnalyticsController;
use App\Http\Controllers\Api\SuperAdmin\SACapstoneProjectController;
use App\Http\Controllers\Api\Proponent\SubmitDocumentAndDetailController;


// Authentication routes grouped under the 'auth' prefix.
Route::prefix('auth')->group(function () {

    Route::post('/register', RegisterController::class)->name('auth.register');

    Route::post('/login', LoginController::class)->name('auth.login');
    Route::post('/verify-2fa', TwoFactorAuthController::class);

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

    Route::get(
        '/projects/{project}/user-manual',
        [ProjectAttachmentController::class, 'downloadUserManual']
    );
    Route::get(
        '/projects/{project}/usage-guide',
        [ProjectAttachmentController::class, 'downloadUsageGuide']
    );

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

    Route::post('/submit-user-manual', [ProjectAttachmentController::class, 'submitUserManual']);
    Route::post('/submit-usage-guide', [ProjectAttachmentController::class, 'submitUsageGuide']);
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

    // Capstone Project Management
    Route::get('capstone-projects', [CapstoneProjectController::class, 'index'])
        ->name('admin.capstone-projects.index');

    Route::patch('capstone-projects/{project}/archive', [CapstoneProjectController::class, 'archive'])
        ->name('admin.capstone-projects.archive');

    Route::patch('capstone-projects/{project}/unarchive', [CapstoneProjectController::class, 'unarchive'])
        ->name('admin.capstone-projects.unarchive');

    Route::get('capstone-projects/archived', [CapstoneProjectController::class, 'getArchived'])
        ->name('admin.capstone-projects.archived');
});


Route::prefix('super-admin')->middleware('auth:sanctum')->group(function () {

    Route::get('capstone-projects', [SACapstoneProjectController::class, 'index'])
        ->name('admin.capstone-projects.index');

    Route::patch('capstone-projects/{project}/archive', [SACapstoneProjectController::class, 'archive'])
        ->name('admin.capstone-projects.archive');

    Route::patch('capstone-projects/{project}/unarchive', [SACapstoneProjectController::class, 'unarchive'])
        ->name('admin.capstone-projects.unarchive');

    Route::get('capstone-projects/archived', [SACapstoneProjectController::class, 'getArchived'])
        ->name('admin.capstone-projects.archived');


    Route::get('document-requests', [DocumentRequestController::class, 'index']);

    Route::post('document-requests/{id}/approve', [DocumentRequestController::class, 'approve']);

    Route::post('document-requests/{id}/reject', [DocumentRequestController::class, 'reject']);

    Route::get('document-requests/approval-history', [DocumentRequestController::class, 'approvalHistory']);

    Route::apiResource('system-settings', SystemSettingController::class);
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
    //Super Admin analytics route

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
    Route::get(
        '/advisory-load',
        [AdminDashboardUtilController::class, 'advisoryLoad']
    )->name('util.advisory-load');
    Route::get(
        '/submissions-by-course',
        [AdminDashboardUtilController::class, 'submissionsByCourse']
    )->name('util.submissions-by-course');
    Route::get(
        '/user-role-counts',
        [AdminDashboardUtilController::class, 'userRoleCounts']
    )->name('util.user-role-counts');

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
    Route::get('/check-user-manual', [CheckManualController::class, 'checkUserManual'])
        ->middleware('auth:sanctum');
    Route::get('/check-usage-guide', [CheckManualController::class, 'checkUsageGuide'])
        ->middleware('auth:sanctum');


    //Viewer util routes
    Route::get(
        'viewer-reports-analytics/programming-language-trends',
        [ViewerReportsAnalyticsController::class, 'programmingLanguageTrends']
    );

    Route::get(
        'viewer-reports-analytics/archived-projects-by-department',
        [ViewerReportsAnalyticsController::class, 'archivedProjectsByDepartment']
    );
});



Route::prefix('user-mgt')->middleware('auth:sanctum')->group(function () {

    // ============================

    // These routes handle all whitelist-related operations for admins.
    // ============================

    Route::post('whitelist', [MWhitelistController::class, 'store'])
        ->name('admin.whitelist.store');

    Route::post('whitelist/upload-excel', [MWhitelistController::class, 'uploadExcel'])
        ->name('admin.whitelist.upload-excel');

    // Route to get a list of all whitelist entries
    Route::get('whitelist', [MWhitelistController::class, 'index']);

    // Route to get a single, specific whitelist entry
    Route::get('whitelist/{id}', [MWhitelistController::class, 'show']);

    // Route to delete a whitelist entry
    Route::delete('whitelist/{whitelist}', [MWhitelistController::class, 'destroy']);

    // Route to update a specific whitelist entry
    Route::put('whitelist/{whitelist}', [MWhitelistController::class, 'update']);

    // ============================
    // End Whitelist Routes
    // ============================

    // ============================
    // Viewer Management Routes (Admin)
    // These routes allow admins to manage viewers.
    // ============================
    Route::get('viewers', [MViewerController::class, 'index'])->name('viewers.index');
    Route::post('viewers', [MViewerController::class, 'store'])->name('viewers.store');
    Route::get('viewers/{id}', [MViewerController::class, 'show'])->name('viewers.show');
    Route::put('viewers/{id}', [MViewerController::class, 'update'])->name('viewers.update');
    Route::delete('viewers/{id}', [MViewerController::class, 'destroy'])->name('viewers.destroy');
    // ============================
    // End Viewer Management Routes
    // ============================

    //Proponents
    Route::get('proponents', [MProponentController::class, 'index'])->name('proponents.index');
    Route::post('proponents', [MProponentController::class, 'store'])->name('proponents.store');
    Route::get('proponents/{id}', [MProponentController::class, 'show'])->name('proponents.show');
    Route::put('proponents/{id}', [MProponentController::class, 'update'])->name('proponents.update');
    Route::delete('proponents/{id}', [MProponentController::class, 'destroy'])->name('proponents.destroy');
    //End proponents


    //Advisers route
    // Adviser Management Routes
    Route::get('/advisers', [MAdviserController::class, 'index'])->name('advisers.index');
    Route::post('/advisers', [MAdviserController::class, 'store'])->name('advisers.store');
    Route::get('/advisers/{id}', [MAdviserController::class, 'show'])->name('advisers.show');
    Route::put('/advisers/{id}', [MAdviserController::class, 'update'])->name('advisers.update');
    Route::delete(
        '/advisers/{id}',
        [MAdviserController::class, 'destroy']
    )->name('advisers.destroy');

    // Adviser Suggestions Route
    Route::get(
        '/advisers/{id}/suggestions',
        [MAdviserController::class, 'adviserSuggestions']
    )->name('advisers.suggestions');
    Route::get(
        '/suggestions',
        [MAdviserController::class, 'allSuggestions']
    )->name('suggestions.index');
    //End advisers route


    // ============================
    // Admin Management Routes (Admin)
    // These routes allow admins to manage other admins.
    // ============================
    Route::get('admin/', [MAdminController::class, 'index'])->name('admins.index');
    Route::post('admin/', [MAdminController::class, 'store'])->name('admins.store');
    Route::get('admin/{admin}', [MAdminController::class, 'show'])->name('admins.show');
    Route::put('admin/{admin}', [MAdminController::class, 'update'])->name('admins.update');
    Route::patch(
        'admin/{admin}/restrict',
        [MAdminController::class, 'setStatusToRestricted']
    )->name('admins.restrict');
    // ============================
    // End Admin Management Routes
    // ============================

});
