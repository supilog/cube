@extends('layouts.app')

@section('content')
<div class="stats-page max-w-2xl mx-auto">
    <p class="text-sm text-gray-500 mb-8">IndexedDB に保存された記録から集計した統計です。</p>
    <div id="stats-container" aria-live="polite">
        {{-- stats.js で内容を描画 --}}
    </div>
</div>
@endsection
