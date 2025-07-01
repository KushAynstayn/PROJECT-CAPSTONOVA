<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/awa', function () {
    return '
        <h1>Welcome to AWA</h1>
        <p>This is a simple Laravel applicationsddasdw123.</p>
        tesadw tae 123xd';
});