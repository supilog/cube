<?php

use App\Http\Controllers\CubesController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CubesController::class, 'index'])->name('index');
Route::get('/list', [CubesController::class, 'list'])->name('list');
Route::get('/graph', [CubesController::class, 'graph'])->name('graph');
Route::get('/records', [CubesController::class, 'records'])->name('records');
Route::get('/stats', [CubesController::class, 'stats'])->name('stats');
