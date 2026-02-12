@extends('layouts.app')

@section('content')
<div class="records-page max-w-2xl mx-auto">
    <section class="mb-10" aria-labelledby="records-single-heading">
        <h2 id="records-single-heading" class="text-lg font-semibold text-gray-800 mb-3">Single Best</h2>
        <p class="text-sm text-gray-500 mb-2">タイムが最もはやい記録ベスト10</p>
        <div id="records-single" aria-live="polite">
            <p class="text-gray-500 py-4">読み込み中…</p>
        </div>
    </section>

    <section class="mb-10" aria-labelledby="records-ao5-heading">
        <h2 id="records-ao5-heading" class="text-lg font-semibold text-gray-800 mb-3">AO5 (average of 5)</h2>
        <p class="text-sm text-gray-500 mb-2">連続5回のうち最速・最遅を除いた3回の平均のベスト10</p>
        <div id="records-ao5" aria-live="polite">
            <p class="text-gray-500 py-4">読み込み中…</p>
        </div>
    </section>

    <section class="mb-10" aria-labelledby="records-ao12-heading">
        <h2 id="records-ao12-heading" class="text-lg font-semibold text-gray-800 mb-3">AO12 (average of 12)</h2>
        <p class="text-sm text-gray-500 mb-2">連続12回のうち最速・最遅を除いた10回の平均のベスト10</p>
        <div id="records-ao12" aria-live="polite">
            <p class="text-gray-500 py-4">読み込み中…</p>
        </div>
    </section>
</div>

{{-- AO5/AO12 構成記録モーダル --}}
<div id="records-avg-modal" class="fixed inset-0 z-50 hidden" aria-hidden="true" aria-modal="true" role="dialog">
    <div id="records-modal-overlay" class="absolute inset-0 bg-black/50 cursor-pointer" aria-hidden="true"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
            <div class="p-6 overflow-y-auto flex-1">
                <h3 id="records-modal-title" class="text-lg font-semibold text-gray-900 mb-2"></h3>
                <p id="records-modal-avg" class="text-sm text-gray-600 mb-4 font-mono"></p>
                <ul id="records-modal-body" class="space-y-2 text-sm">
                    {{-- JS で 各記録の 番号 / タイム / 日時 / notation を表示 --}}
                </ul>
            </div>
        </div>
    </div>
</div>
@endsection
