<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cubelog</title>
    <!-- Styles -->
    <script src="https://cdn.tailwindcss.com"></script>
    @vite('resources/scss/app.scss')
    <!-- icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet">
</head>
<body class="antialiased h-screen w-screen flex flex-col">
<header class="flex items-center">
    <div id="menu" class="pt-1.5 pl-3 cursor-pointer">
        <div class="material-icons">menu</div>
    </div>
    <div class="grow">
        <a href="{{ route('index') }}">
            <h1 class="text-stroke kablammo-regular text-center text-4xl"><span class="text-cube-green">c</span><span
                    class="text-cube-red">u</span><span
                    class="text-cube-white drop-shadow-xl">b</span>e<span class="text-cube-blue">l</span><span
                    class="text-cube-orange">o</span><span class="text-cube-yellow">g</span></h1>
        </a>
    </div>
</header>
<div id="main" class="relative grow sm:flex sm:justify-center sm:items-center sm:flex-col">
    <nav class="nav pt-1.5 pl-3">
        <ul class="nav-list">
            <li><a href="{{ route('index') }}" class="material-icons">home</a></li>
            <li><a href="{{ route('list') }}" class="material-icons">list_alt</a></li>
            <li><a href="{{ route('graph') }}" class="material-icons">bar_chart</a></li>
        </ul>
    </nav>
    <div class="max-w-7xl mx-auto p-6 lg:p-8">
        @yield('content')
    </div>
</div>
<footer>
    <div class="copyright text-center text-xs">©2021-2025 supilog</div>
</footer>
@yield('js')
@vite('resources/js/menu.js')
</body>
</html>
