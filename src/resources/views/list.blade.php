@extends('layouts.app')

@section('content')
<div class="list-page max-w-2xl mx-auto" data-list-per-page="{{ $per_page }}">
    <div id="list-records" aria-live="polite" data-per-page="{{ $per_page }}">
        <p class="text-gray-500 py-4">読み込み中…</p>
    </div>

    <nav id="list-pagination" class="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="ページネーション"></nav>
</div>

{{-- レコード詳細モーダル --}}
<div id="list-record-modal" class="fixed inset-0 z-50 hidden" aria-hidden="true" aria-modal="true" role="dialog">
    <div id="list-modal-overlay" class="absolute inset-0 bg-black/50 cursor-pointer" aria-hidden="true"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
            <div class="p-6 overflow-y-auto flex-1">
                <dl id="list-modal-body" class="space-y-3 text-sm">
                    {{-- JS で ID / time / notation / 日時 を表示 --}}
                </dl>
            </div>
            <div class="p-4 border-t border-gray-200 flex justify-end">
                <button type="button" id="list-modal-delete" class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" aria-label="この記録を削除">
                    <i class="fa-solid fa-trash text-lg" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</div>
@endsection
