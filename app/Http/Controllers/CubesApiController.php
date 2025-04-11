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
        $scramble_info = $cs->scramble();
        $scramble_text = implode(' ', $cs->scrambleToTextArray($scramble_info));
        $scramble_colors = $cs->scrambleToColorArray($scramble_info);
        return [
            'scramble' => [
                'text' => $scramble_text,
                'colors' => $scramble_colors,
            ]
        ];
    }

    public function records(CubeService $cs, Request $request): array
    {
        $records = array();
        try{
            $results = json_decode($request->getContent());
            $records = $cs->getRecords($results->results);
        }catch(Exception $e){

        }
        return [
            'records' => $records
        ];
    }
}
