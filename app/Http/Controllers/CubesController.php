<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CubesController extends Controller
{
    // トップ画面
    public function index()
    {
        $colors = [
            'u' => 'white',
            'd' => 'yellow',
            'b' => 'blue',
            'f' => 'green',
            'l' => 'orange',
            'r' => 'red'
        ];
        $data = [
            'colors' => $colors
        ];
        return view('index', $data);
    }

    // テスト画面
    public function test(string $id)
    {
        return view('test' . $id);
    }
}
