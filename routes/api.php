<?php

use App\Http\Controllers\CubesApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/scramble', [CubesApiController::class, 'scramble'])->name('api.scramble');
Route::post('/store', [CubesApiController::class, 'store'])->name('api.store');
