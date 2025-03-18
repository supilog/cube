@extends('layouts.app')

@section('content')
    <div class="sm:flex sm:flex-col">
        <div id="scramble" class="sm:flex sm:justify-center text-4xl">&nbsp;</div>
        <div id="timer_wrapper" class="text-center text-9xl roboto-regular">
            <span id="timer" class="text-left">0.00</span>
        </div>
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
@endsection

@section('js')
    <script src="/js/database.js"></script>
    @vite('resources/js/timer.js')
@endsection
