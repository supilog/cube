<?php

use App\Http\Controllers\CubesApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/scramble', [CubesApiController::class, 'scramble'])->name('api.scramble');
Route::post('/records', [CubesApiController::class, 'records'])->name('api.records');
