<?php

return [

    'name' => env('CUBE_APP_NAME', 'CUBELOG'),

    'scramble' => [
        'length' => (int) env('CUBE_SCRAMBLE_LENGTH', 20),
    ],

    'colors' => [
        'up' => env('CUBE_COLOR_UP', 'white'),
        'down' => env('CUBE_COLOR_DOWN', 'yellow'),
        'front' => env('CUBE_COLOR_FRONT', 'green'),
        'back' => env('CUBE_COLOR_BACK', 'blue'),
        'left' => env('CUBE_COLOR_LEFT', 'orange'),
        'right' => env('CUBE_COLOR_RIGHT', 'red'),
    ],

    'list' => [
        'per_page' => (int) env('CUBE_LIST_PER_PAGE', 50),
    ],

];
