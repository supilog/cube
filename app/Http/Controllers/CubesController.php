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
            'left' => 'orange',
            'front' => 'green',
            'right' => 'red',
            'back' => 'blue',
            'down' => 'yellow',
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
        $data = [
        ];
        return view('graph', $data);
    }

    public function records(CubeService $cs) {
        $data = [
        ];
        return view('records', $data);
    }

    public function stats(CubeService $cs) {
        $data = [
        ];
        return view('stats', $data);
    }

    public function test($id){
        return view('test' . $id);
    }
}
