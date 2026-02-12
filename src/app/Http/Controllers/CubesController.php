<?php

namespace App\Http\Controllers;

class CubesController extends Controller
{
    /** トップ画面 */
    public function index()
    {
        return view('index');
    }

    public function list()
    {
        return view('list', [
            'per_page' => config('cube.list.per_page'),
        ]);
    }

    public function graph()
    {
        return view('graph');
    }

    public function records()
    {
        return view('records');
    }

    public function stats()
    {
        return view('stats');
    }
}
