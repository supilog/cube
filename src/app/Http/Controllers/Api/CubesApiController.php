<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CubeService;
use Illuminate\Http\JsonResponse;

/**
 * キューブ関連 API
 * トップページ表示時・タイマーストップ時の「回転記号＋展開図」取得で共通利用
 */
class CubesApiController extends Controller
{
    /**
     * 回転記号文字列とキューブ展開図データを取得
     * POST /api/cube/scramble
     *
     * @return JsonResponse{notation: string, cube_net: object}
     */
    public function scramble(CubeService $cubeService): JsonResponse
    {
        $data = $cubeService->getNotationAndCubeNet();

        return response()->json([
            'notation' => $data['notation'],
            'cube_net' => $data['cube_net'],
        ]);
    }
}
