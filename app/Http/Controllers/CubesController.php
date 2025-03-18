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
        $data = [
            'colors' => $colors
        ];
        return view('index', $data);
    }

    public function list() {
        $data = [];
        return view('list', $data);
    }

    public function graph() {
        $data = [];
        return view('graph', $data);
    }

    public function test($id){
        return view('test' . $id);
    }
}
