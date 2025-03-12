<?php

namespace App\Http\Controllers;

use App\Services\CubeService;
use Illuminate\Http\Request;

class CubesApiController extends Controller
{
    /**
     * [API] スクランブル情報を取得
     * @param CubeService $cs
     * @return array[]
     * @throws \Random\RandomException
     */
    public function scramble(CubeService $cs): array
    {
        $scramble_text = implode(' ', $cs->scrambleToTextArray($cs->scramble()));
        $scramble_colors = array();
        return [
            'scramble' => [
                'text' => $scramble_text,
                'colors' => $scramble_colors
            ]
        ];
    }

    public function store(): array
    {
        return [

        ];
    }
}
