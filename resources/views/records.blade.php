@extends('layouts.app')

@section('content')
    <div class="max-w-7xl mx-auto p-6 lg:p-8">
        <div id="records" class="">
            <div id="single">
                <h2>Single Best</h2>
                <div class="content">
                </div>
            </div>
            <div id="ao5">
                <h2>AO5(average of 5)</h2>
                <div class="content">
                </div>
            </div>
            <div id="ao12">
                <h2>AO12(average of 12)</h2>
                <div class="content">
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js')
    <script src="/js/database.js"></script>
    @vite('resources/js/records.js')
@endsection
