<?php

namespace App\Services;

class CubeService
{

    /**
     * スクランブルデータを取得する(数値配列)
     * @return array
     * @throws \Random\RandomException
     */
    public function scramble(): array
    {
        $ret = array();
        $length = 0;
        while ($length < config('cube.scramble.length')) {
            list($next_roll, $next_times) = $this->roll();
            $index = count($ret);
            // 前回と同じ回転方向なら無視
            if (!empty($ret[$index - 1])) {
                if ($ret[$index - 1]['roll'] == $next_roll) {
                    continue;
                }
            }
            // 前々回と前回が向かい合う面の場合、前々回と同じ回転方向なら無視
            if (!empty($ret[$index - 2])) {
                if (floor($ret[$index - 2]['roll'] / 2) == floor($ret[$index - 1]['roll'] / 2)) {
                    if ($ret[$index - 2]['roll'] == $next_roll) {
                        continue;
                    }
                }
            }
            $ret[$index]['roll'] = $next_roll;
            $ret[$index]['times'] = $next_times;
            $length += ($next_times == 3) ? 1 : $next_times;
        }
        return $ret;
    }

    /**
     * ランダムで回転情報(方向,回数)を取得
     * 方向 0:U, 1:D, 2:F, 3:B, 4:R, 5:R
     * 回数 1:順方向1, 2:順方向2(2), 3:逆方向1(')
     * @return array
     * @throws \Random\RandomException
     */
    public function roll(): array
    {
        // 方向(R, U, L, D, F, Bの6パターン)
        $roll = random_int(0, 5);
        // 回数(U, U2, U'の3パターン)
        $times = random_int(1, 3);
        return array($roll, $times);
    }

    /**
     * スクランブルデータ(数値配列)を記号文字の配列にする
     * @param $scramble
     * @return array
     */
    public function scrambleToTextArray($scramble): array
    {
        $ret = array();
        foreach ($scramble as $data) {
            $text = '';
            switch ($data['roll']) {
                case 0:
                    $text = 'U';
                    break;
                case 1:
                    $text = 'D';
                    break;
                case 2:
                    $text = 'F';
                    break;
                case 3:
                    $text = 'B';
                    break;
                case 4:
                    $text = 'R';
                    break;
                case 5:
                    $text = 'L';
                    break;
                default:
                    break;
            }

            switch ($data['times']) {
                case 2:
                    $text .= '2';
                    break;
                case 3:
                    $text .= '\'';
                    break;
                default:
                    break;
            }
            array_push($ret, $text);
        }
        return $ret;
    }

    /**
     * スクランブルデータ(数値配列)をカラー情報の配列にする
     * @param $scramble
     * @return array
     */
    public function scrambleToColorArray($scramble): array
    {
        // 初期状態のカラーリング情報
        $colors_info = $this->initColorArray();

        // R1回分の回転を擬似的に作成
        foreach ($scramble as $value) {
            $colors_info = $this->cubeRotate($colors_info, $value['roll'], $value['times']);
        }

        return $colors_info;
    }

    /**
     * 初期状態のカラー情報を取得
     * @return array
     */
    public function initColorArray(): array
    {
        $ret = array();
        $colors = [
            0 => 'white',
            1 => 'orange',
            2 => 'green',
            3 => 'red',
            4 => 'blue',
            5 => 'yellow'
        ];
        for ($i = 0; $i < 6; $i++) {
            for ($j = 0; $j < 9; $j++) {
                $key = $i * 9 + $j;
                $ret[$key] = $colors[$i];
            }
        }
        return $ret;
    }

    /**
     * カラーの回転処理(1記号分)を処理する
     * @param $colors
     * @param $roll
     * @param $times
     * @return array
     */
    public function cubeRotate($colors, $roll, $times)
    {
        $cube = $colors;
        $operation = array();
        switch ($roll) {
            case 0:
                // U
                $operation = [
                    9 => 36,
                    10 => 37,
                    11 => 38,
                    18 => 9,
                    19 => 10,
                    20 => 11,
                    27 => 18,
                    28 => 19,
                    29 => 20,
                    36 => 27,
                    37 => 28,
                    38 => 29,
                    0 => 2,
                    1 => 5,
                    2 => 8,
                    5 => 7,
                    8 => 6,
                    7 => 3,
                    6 => 0,
                    3 => 1
                ];
                break;
            case 1:
                // D
                $operation = [
                    15 => 24,
                    16 => 25,
                    17 => 26,
                    24 => 33,
                    25 => 34,
                    26 => 35,
                    33 => 42,
                    34 => 43,
                    35 => 44,
                    42 => 15,
                    43 => 16,
                    44 => 17,
                    45 => 47,
                    46 => 50,
                    47 => 53,
                    50 => 52,
                    53 => 51,
                    52 => 48,
                    51 => 45,
                    48 => 46
                ];
                break;
            case 2:
                // F
                $operation = [
                    6 => 27,
                    7 => 30,
                    8 => 33,
                    27 => 47,
                    30 => 46,
                    33 => 45,
                    45 => 11,
                    46 => 14,
                    47 => 17,
                    11 => 8,
                    14 => 7,
                    17 => 6,
                    18 => 20,
                    19 => 23,
                    20 => 26,
                    23 => 25,
                    26 => 24,
                    25 => 21,
                    24 => 18,
                    21 => 19

                ];
                break;
            case 3:
                // B
                $operation = [
                    0 => 15,
                    1 => 12,
                    2 => 9,
                    9 => 51,
                    12 => 52,
                    15 => 53,
                    51 => 35,
                    52 => 32,
                    53 => 29,
                    29 => 0,
                    32 => 1,
                    35 => 2,
                    36 => 38,
                    37 => 41,
                    38 => 44,
                    41 => 43,
                    44 => 42,
                    43 => 39,
                    42 => 36,
                    39 => 37


                ];
                break;
            case 4:
                // R
                $operation = [
                    20 => 2,
                    23 => 5,
                    26 => 8,
                    2 => 42,
                    5 => 39,
                    8 => 36,
                    42 => 47,
                    39 => 50,
                    36 => 53,
                    47 => 20,
                    50 => 23,
                    53 => 26,
                    27 => 29,
                    28 => 32,
                    29 => 35,
                    32 => 34,
                    35 => 33,
                    34 => 30,
                    33 => 27,
                    30 => 28
                ];
                break;
            case 5:
                // L
                $operation = [
                    0 => 18,
                    3 => 21,
                    6 => 24,
                    18 => 45,
                    21 => 48,
                    24 => 51,
                    45 => 44,
                    48 => 41,
                    51 => 38,
                    38 => 6,
                    41 => 3,
                    44 => 0,
                    9 => 11,
                    10 => 14,
                    11 => 17,
                    14 => 16,
                    17 => 15,
                    16 => 12,
                    15 => 9,
                    12 => 10

                ];
                break;
            default:
                break;
        }

        for ($i = 0; $i < $times; $i++) {
            $cube_previous = $cube;
            foreach ($operation as $position_origin => $position_new) {
                $cube[$position_new] = $cube_previous[$position_origin];
            }
        }

        return $cube;
    }
}
