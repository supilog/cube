@extends('layouts.app')

@section('content')
    <div class="w-full h-full mx-auto p-6 lg:p-8">
        <div class="canvas-container">
            <canvas id="myChart"></canvas>
        </div>
    </div>
@endsection

@section('js')
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="/js/database.js"></script>
    @vite('resources/js/graph.js')
@endsection
