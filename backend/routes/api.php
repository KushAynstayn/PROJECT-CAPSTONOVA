<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/users', function () {
    $users = User::with('userDetail')->get();
    
    return response()->json($users);
});

