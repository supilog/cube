<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cubelog</title>
    <!-- Styles -->
    <script src="https://cdn.tailwindcss.com"></script>
    @vite('resources/scss/app.scss')
</head>
<body class="antialiased h-screen w-screen flex flex-col">
<header>
    <h1 class="text-stroke kablammo-regular text-center text-4xl"><span class="text-cube-green">c</span><span class="text-cube-red">u</span><span
            class="text-cube-white drop-shadow-xl">b</span>e<span class="text-cube-blue">l</span><span
            class="text-cube-orange">o</span><span class="text-cube-yellow">g</span></h1>
</header>
<div class="relative grow sm:flex sm:justify-center sm:items-center sm:flex-col">
    <div class="max-w-7xl mx-auto p-6 lg:p-8">
        <div class="sm:flex sm:flex-col">
            <div id="scramble" class="sm:flex sm:justify-center text-4xl">{{ $scramble_text }}</div>
            <div id="timer" class="sm:flex sm:justify-center text-9xl">0.00</div>
            <div id="cubeview" class="">
                @foreach(array_keys($colors) as $face)
                    <div class="surface {{$face}}">
                        <div class="wrapper">
                            @for($i = 1; $i < 10; $i++)
                                <div class="cube cube-{{$i}} cube-{{$colors[$face]}}"></div>
                            @endfor
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</div>
<footer>
    <div class="copyright text-center text-xs">©2021-2025 supilog</div>
</footer>
@vite('resources/js/timer.js')
</body>
</html>
