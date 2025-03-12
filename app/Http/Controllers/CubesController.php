<?php

namespace App\Http\Controllers;

use App\Services\CubeService;
use Illuminate\Http\Request;

class CubesController extends Controller
{
    // トップ画面
    public function index(CubeService $cs)
    {
        $colors = [
            'up' => 'white',
            'down' => 'yellow',
            'back' => 'blue',
            'front' => 'green',
            'left' => 'orange',
            'right' => 'red'
        ];
//        $scramble = $cs->scramble();
//        $scramble_text_array = $cs->scrambleToTextArray($scramble);
//        $scramble_text = implode(' ', $scramble_text_array);
        $data = [
            'colors' => $colors
//            'scramble_text' => $scramble_text
        ];
        return view('index', $data);
    }

}
