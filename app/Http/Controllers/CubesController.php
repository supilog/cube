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
            'u' => 'white',
            'd' => 'yellow',
            'b' => 'blue',
            'f' => 'green',
            'l' => 'orange',
            'r' => 'red'
        ];
        $scramble = $cs->scramble();
        $scramble_text_array = $cs->scrambleToTextArray($scramble);
        $scramble_text = implode(' ', $scramble_text_array);
        $data = [
            'colors' => $colors,
            'scramble_text' => $scramble_text
        ];
        return view('index', $data);
    }

    // テスト画面
    public function test(string $id)
    {
        return view('test' . $id);
    }
}
