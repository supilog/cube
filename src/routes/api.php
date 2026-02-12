<?php

use App\Http\Controllers\Api\CubesApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| キューブ関連 API（トップ表示・タイマーストップ時共通）
|--------------------------------------------------------------------------
*/
Route::post('/cube/scramble', [CubesApiController::class, 'scramble'])
    ->name('api.cube.scramble');
