@extends('layouts.app')

@section('content')
    <div id="records" class="">
    </div>
    <div id="show" class="modal">
        <div class="modal-container">
            <div class="modal-close">×</div>
            <div class="modal-content">
                <div>ID : <span class="id"></span></div>
                <div><span class="time"></span></div>
                <div><span class="scramble"></span></div>
                <div><span class="date"></span></div>
                <div class="text-right">
                    <span class="show-delete material-icons cursor-pointer" cubeid="">delete</span>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js')
    <script src="/js/database.js"></script>
    @vite('resources/js/list.js')
@endsection
