<?php

use App\Http\Controllers\CubesController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CubesController::class, 'index'])->name('index');

// test
Route::get('/test/{id}', [CubesController::class, 'test'])->name('test');

