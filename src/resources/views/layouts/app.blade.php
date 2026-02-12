<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CUBELOG</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kablammo&family=Roboto:wght@400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
    @vite(['resources/css/app.css', 'resources/scss/app.scss', 'resources/js/app.js'])
</head>
<body class="antialiased min-h-screen flex flex-col">
    <header>
        <div class="container mx-auto px-4 flex items-center">
            <div class="w-10 flex justify-start">
                <button type="button" id="menu-toggle" class="p-2 -ml-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-label="メニューを開く" aria-expanded="false" aria-controls="nav-drawer">
                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <div class="flex-1 flex justify-center">
                <a href="{{ route('index') }}" class="text-[2.25rem] font-semibold cubelog-title">
                    <span>C</span><span>U</span><span>B</span><span>E</span><span>L</span><span>O</span><span>G</span>
                </a>
            </div>
            <div class="w-10"></div>
        </div>
    </header>

    {{-- オーバーレイ（メニュー外タップで閉じる） --}}
    <div id="menu-overlay" class="fixed inset-0 bg-black/30 z-40 opacity-0 pointer-events-none transition-opacity duration-200" aria-hidden="true"></div>

    {{-- ハンバーガーメニュー（左からスライド・アイコンのみ） --}}
    <nav id="nav-drawer" class="fixed top-0 left-0 h-full w-14 bg-white shadow-xl z-50 -translate-x-full transition-transform duration-200 flex flex-col pt-16 pb-6 px-0 items-center" aria-label="メインメニュー">
        <a href="{{ route('index') }}" class="nav-link w-full py-3 flex items-center justify-center border-b border-gray-100 text-gray-800 hover:bg-gray-50 text-lg" aria-label="トップ">
            <i class="fa-solid fa-house" aria-hidden="true"></i>
        </a>
        <a href="{{ route('list') }}" class="nav-link w-full py-3 flex items-center justify-center border-b border-gray-100 text-gray-800 hover:bg-gray-50 text-lg" aria-label="リスト">
            <i class="fa-solid fa-list" aria-hidden="true"></i>
        </a>
        <a href="{{ route('graph') }}" class="nav-link w-full py-3 flex items-center justify-center border-b border-gray-100 text-gray-800 hover:bg-gray-50 text-lg" aria-label="グラフ">
            <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
        </a>
        <a href="{{ route('records') }}" class="nav-link w-full py-3 flex items-center justify-center border-b border-gray-100 text-gray-800 hover:bg-gray-50 text-lg" aria-label="記録">
            <i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i>
        </a>
        <a href="{{ route('stats') }}" class="nav-link w-full py-3 flex items-center justify-center border-b border-gray-100 text-gray-800 hover:bg-gray-50 text-lg" aria-label="統計">
            <i class="fa-solid fa-chart-pie" aria-hidden="true"></i>
        </a>
    </nav>

    <script>
        (function() {
            var toggle = document.getElementById('menu-toggle');
            var drawer = document.getElementById('nav-drawer');
            var overlay = document.getElementById('menu-overlay');
            var links = document.querySelectorAll('.nav-link');

            function openMenu() {
                drawer.classList.remove('-translate-x-full');
                overlay.classList.remove('opacity-0', 'pointer-events-none');
                overlay.classList.add('opacity-100');
                toggle.setAttribute('aria-expanded', 'true');
                overlay.setAttribute('aria-hidden', 'false');
            }

            function closeMenu() {
                drawer.classList.add('-translate-x-full');
                overlay.classList.remove('opacity-100');
                overlay.classList.add('opacity-0', 'pointer-events-none');
                toggle.setAttribute('aria-expanded', 'false');
                overlay.setAttribute('aria-hidden', 'true');
            }

            toggle.addEventListener('click', function() {
                if (toggle.getAttribute('aria-expanded') === 'true') {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            overlay.addEventListener('click', closeMenu);
            links.forEach(function(link) { link.addEventListener('click', closeMenu); });
        })();
    </script>
    <main class="flex-1 container mx-auto px-4 py-8">
        @yield('content')
    </main>
    <footer class="py-4 text-center text-sm text-gray-500">
        © CUBELOG
    </footer>
</body>
</html>
