@extends('layouts.app')

@section('content')
    <div class="max-w-7xl mx-auto p-6 lg:p-8">
        <div class="sm:flex sm:flex-col">
            <div id="scramble" class="sm:flex sm:justify-center text-4xl">&nbsp;</div>
            <div id="timer_wrapper" class="text-center text-9xl roboto-regular">
                <span id="timer" class="text-left">0.00</span>
            </div>
            <div id="cubeview" class="">
                <?php $key = 0; ?>
                @foreach(array_keys($colors) as $face)
                    <div class="surface {{$face}}">
                        <div class="wrapper">
                            @for($i = 1; $i < 10; $i++)
                                <div id="cubeview-cell-{{$key}}" class="cube cube-{{$i}}"></div>
                                    <?php $key++; ?>
                            @endfor
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
@endsection

@section('js')
    <script src="/js/database.js"></script>
    @vite('resources/js/timer.js')
@endsection
