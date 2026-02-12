@extends('layouts.app')

@section('content')
<div class="top-page flex flex-col items-center justify-center min-h-[60vh] py-8">
    {{-- 1. 回転記号表示（タイマーの上）＋スクランブル再取得 --}}
    <div class="scramble-area mb-6 flex items-center justify-center gap-2">
        <span class="scramble-notation text-center" aria-label="回転記号"></span>
        <button type="button" id="scramble-refresh" class="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-600 hover:text-gray-800" aria-label="スクランブルを更新">
            <i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i>
        </button>
    </div>

    {{-- 2. タイマー表示（中央） --}}
    <div class="timer-display mb-8" aria-live="polite" aria-label="タイム">
        0.00
    </div>

    {{-- 3. ルービックキューブ展開図（タイマーの下・初期配置） --}}
    <div class="cube-net-wrapper" aria-label="ルービックキューブ展開図">
        <div class="cube-net" data-initial="true">
            {{-- 上面 U (白) --}}
            <div class="cube-face cube-face--u" data-face="U" aria-label="上面">
                @foreach(range(0, 8) as $i)
                <div class="cube-sticker" data-sticker="{{ $i }}" style="--face-color: #ffffff;"></div>
                @endforeach
            </div>
            {{-- 左面 L (オレンジ) / 正面 F (緑) / 右面 R (赤) / 背面 B (青) --}}
            <div class="cube-face cube-face--l" data-face="L" aria-label="左面">
                @foreach(range(0, 8) as $i)
                <div class="cube-sticker" data-sticker="{{ $i }}" style="--face-color: #fc7109;"></div>
                @endforeach
            </div>
            <div class="cube-face cube-face--f" data-face="F" aria-label="正面">
                @foreach(range(0, 8) as $i)
                <div class="cube-sticker" data-sticker="{{ $i }}" style="--face-color: #13872d;"></div>
                @endforeach
            </div>
            <div class="cube-face cube-face--r" data-face="R" aria-label="右面">
                @foreach(range(0, 8) as $i)
                <div class="cube-sticker" data-sticker="{{ $i }}" style="--face-color: #e20017;"></div>
                @endforeach
            </div>
            <div class="cube-face cube-face--b" data-face="B" aria-label="背面">
                @foreach(range(0, 8) as $i)
                <div class="cube-sticker" data-sticker="{{ $i }}" style="--face-color: #0341df;"></div>
                @endforeach
            </div>
            {{-- 下面 D (黄) --}}
            <div class="cube-face cube-face--d" data-face="D" aria-label="下面">
                @foreach(range(0, 8) as $i)
                <div class="cube-sticker" data-sticker="{{ $i }}" style="--face-color: #ffd700;"></div>
                @endforeach
            </div>
        </div>
    </div>
</div>
@endsection
