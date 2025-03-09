<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel</title>
    <!-- Styles -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="h-screen w-screen flex flex-col">
<header>
    <div class="title">cube</div>
</header>
<div class="relative grow sm:flex sm:justify-center sm:items-center sm:flex-col min-h-screen">
    <div class="max-w-7xl mx-auto p-6 lg:p-8">
        <div class="sm:flex sm:flex-col">
            <div id="scramble" class="sm:flex sm:justify-center">U2 B D2 B' R2 F2 U2 R2 B' R2 D2 U2 L B' D R' U2 B F
                D'
            </div>
            <div id="timer" class="sm:flex sm:justify-center">0.00</div>
            <div id="view" class="sm:flex sm:justify-center">
                <div id="right" class="surface u">
                    <div class="parent">
                        <div class="p1 part"></div>
                        <div class="p2 part"></div>
                        <div class="p3 part"></div>
                        <div class="p4 part"></div>
                        <div class="p5 part"></div>
                        <div class="p6 part"></div>
                        <div class="p7 part"></div>
                        <div class="p8 part"></div>
                        <div class="p9 part"></div>
                    </div>
                </div>
                <div id="down" class="surface d">
                    <div class="parent">
                        <div class="p1 part"></div>
                        <div class="p2 part"></div>
                        <div class="p3 part"></div>
                        <div class="p4 part"></div>
                        <div class="p5 part"></div>
                        <div class="p6 part"></div>
                        <div class="p7 part"></div>
                        <div class="p8 part"></div>
                        <div class="p9 part"></div>
                    </div>
                </div>
                <div id="back" class="surface b">
                    <div class="parent">
                        <div class="p1 part"></div>
                        <div class="p2 part"></div>
                        <div class="p3 part"></div>
                        <div class="p4 part"></div>
                        <div class="p5 part"></div>
                        <div class="p6 part"></div>
                        <div class="p7 part"></div>
                        <div class="p8 part"></div>
                        <div class="p9 part"></div>
                    </div>
                </div>
                <div id="front" class="surface f">
                    <div class="parent">
                        <div class="p1 part"></div>
                        <div class="p2 part"></div>
                        <div class="p3 part"></div>
                        <div class="p4 part"></div>
                        <div class="p5 part"></div>
                        <div class="p6 part"></div>
                        <div class="p7 part"></div>
                        <div class="p8 part"></div>
                        <div class="p9 part"></div>
                    </div>
                </div>
                <div id="left" class="surface l">
                    <div class="parent">
                        <div class="p1 part"></div>
                        <div class="p2 part"></div>
                        <div class="p3 part"></div>
                        <div class="p4 part"></div>
                        <div class="p5 part"></div>
                        <div class="p6 part"></div>
                        <div class="p7 part"></div>
                        <div class="p8 part"></div>
                        <div class="p9 part"></div>
                    </div>
                </div>
                <div id="right" class="surface r">
                    <div class="parent">
                        <div class="p1 part"></div>
                        <div class="p2 part"></div>
                        <div class="p3 part"></div>
                        <div class="p4 part"></div>
                        <div class="p5 part"></div>
                        <div class="p6 part"></div>
                        <div class="p7 part"></div>
                        <div class="p8 part"></div>
                        <div class="p9 part"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<footer>
    <div class="copyright">supilog</div>
</footer>
</body>
</html>
