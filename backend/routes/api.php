<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;

use App\Http\Controllers\Api\Proponent\SubmitDocumentAndDetailController;
use App\Http\Controllers\Api\Proponent\SubmitSourceCodeController;

use App\Http\Controllers\Api\User\DownloadSourceCodeController;
use App\Http\Controllers\Api\User\ProfileController;
use App\Http\Controllers\Api\User\StreamAcmController;
use App\Http\Controllers\Api\User\StreamManuscriptController;


// Authentication routes grouped under the 'auth' prefix.
Route::prefix('auth')->group(function () {

    Route::post('/register', RegisterController::class)->name('auth.register');

    Route::post('/login', LoginController::class)->name('auth.login');

    Route::post('/logout', LogoutController::class)
        ->middleware('auth:sanctum')
        ->name('auth.logout');
});


// User profile routes, protected by Sanctum authentication.
Route::prefix('user')->middleware('auth:sanctum')->group(function () {
    // Profile management routes.
    Route::get('/profile', [ProfileController::class, 'show'])->name('user.profile.show');

    Route::put('/profile', [ProfileController::class, 'update'])->name('user.profile.update');

    //File streaming routes.
    // These routes handle streaming of manuscripts and ACM files.
    // They ensure that the user has permission to view the manuscript or ACM file before streaming.
    Route::get('/stream/manuscript/{manuscript}', StreamManuscriptController::class)
        ->name('user.manuscript.stream');

    Route::get('/stream/acm/{manuscript}', StreamAcmController::class)
        ->name('user.acm.stream');

    Route::get('/download/source-code/{source_code}', DownloadSourceCodeController::class)
        ->name('user.source-code.download');
});



//Proponent routes.
Route::prefix('proponent')->middleware('auth:sanctum')->group(function () {

    Route::post('/submit-project', SubmitDocumentAndDetailController::class)
        ->name('proponent.submitmanuscript');

    Route::post('/submit-source-code', SubmitSourceCodeController::class)
        ->name('source-code.submit');
});
