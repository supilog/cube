<?php

namespace App\Services;

class CubeService
{
    /** 色名 → 展開図用HEX（cubeNet.js と同一） */
    private const COLOR_TO_HEX = [
        'white' => '#ffffff',
        'orange' => '#fc7109',
        'green' => '#13872d',
        'red' => '#e20017',
        'blue' => '#0341df',
        'yellow' => '#ffd700',
    ];

    /**
     * 回転記号文字列と展開図データをまとめて取得（トップ表示・タイマーストップ時共通）
     *
     * @return array{notation: string, cube_net: array{U: array, D: array, F: array, B: array, L: array, R: array}}
     * @throws \Random\RandomException
     */
    public function getNotationAndCubeNet(): array
    {
        $scrambleData = $this->scramble();
        $notation = implode(' ', $this->scrambleToTextArray($scrambleData));
        $flatColors = $this->scrambleToColorArray($scrambleData);
        $cubeNet = $this->flatColorsToCubeNet($flatColors);

        return [
            'notation' => $notation,
            'cube_net' => $cubeNet,
        ];
    }

    /**
     * スクランブルデータを取得（内部用・数値配列）
     *
     * @return array<int, array{roll: int, times: int}>
     * @throws \Random\RandomException
     */
    public function scramble(): array
    {
        $ret = [];
        $length = 0;
        while ($length < config('cube.scramble.length')) {
            [$nextRoll, $nextTimes] = $this->roll();
            $index = count($ret);
            if ($index > 0 && $ret[$index - 1]['roll'] === $nextRoll) {
                continue;
            }
            if ($index > 1 && (int) floor($ret[$index - 2]['roll'] / 2) === (int) floor($ret[$index - 1]['roll'] / 2) && $ret[$index - 2]['roll'] === $nextRoll) {
                continue;
            }
            $ret[] = ['roll' => $nextRoll, 'times' => $nextTimes];
            $length += $nextTimes === 3 ? 1 : $nextTimes;
        }
        return $ret;
    }

    /**
     * ランダムで回転情報を取得
     * 方向: 0=U, 1=D, 2=F, 3=B, 4=R, 5=L
     * 回数: 1=1回, 2=2(180°), 3=逆方向(')
     *
     * @return array{0: int, 1: int}
     * @throws \Random\RandomException
     */
    public function roll(): array
    {
        $roll = random_int(0, 5);
        $times = random_int(1, 3);
        return [$roll, $times];
    }

    /**
     * スクランブル数値配列を WCA 記号の配列に変換
     *
     * @param array<int, array{roll: int, times: int}> $scramble
     * @return array<int, string>
     */
    public function scrambleToTextArray(array $scramble): array
    {
        $faces = ['U', 'D', 'F', 'B', 'R', 'L'];
        $ret = [];
        foreach ($scramble as $data) {
            $text = $faces[$data['roll']];
            if ($data['times'] === 2) {
                $text .= '2';
            } elseif ($data['times'] === 3) {
                $text .= "'";
            }
            $ret[] = $text;
        }
        return $ret;
    }

    /**
     * スクランブルを適用した 54 要素の色配列（色名）を返す
     * 並び: U(0-8), L(9-17), F(18-26), R(27-35), B(36-44), D(45-53)
     *
     * @param array<int, array{roll: int, times: int}> $scramble
     * @return array<int, string>
     */
    public function scrambleToColorArray(array $scramble): array
    {
        $colors = $this->initColorArray();
        foreach ($scramble as $value) {
            $colors = $this->cubeRotate($colors, $value['roll'], $value['times']);
        }
        return $colors;
    }

    /**
     * 54 要素の平坦な色配列を展開図用 { U, D, F, B, L, R } に変換（各面9要素・HEX）
     *
     * @param array<int, string> $flatColors
     * @return array{U: array<int, string>, D: array<int, string>, F: array<int, string>, B: array<int, string>, L: array<int, string>, R: array<int, string>}
     */
    public function flatColorsToCubeNet(array $flatColors): array
    {
        $toHex = fn (string $name): string => self::COLOR_TO_HEX[$name] ?? '#888888';
        $slice = fn (array $arr, int $from, int $len): array => array_map($toHex, array_slice($arr, $from, $len));

        return [
            'U' => $slice($flatColors, 0, 9),
            'L' => $slice($flatColors, 9, 9),
            'F' => $slice($flatColors, 18, 9),
            'R' => $slice($flatColors, 27, 9),
            'B' => $slice($flatColors, 36, 9),
            'D' => $slice($flatColors, 45, 9),
        ];
    }

    /**
     * 初期状態の 54 色（色名）配列
     *
     * @return array<int, string>
     */
    public function initColorArray(): array
    {
        $colors = ['white', 'orange', 'green', 'red', 'blue', 'yellow'];
        $ret = [];
        foreach ($colors as $color) {
            for ($j = 0; $j < 9; $j++) {
                $ret[] = $color;
            }
        }
        return $ret;
    }

    /**
     * 1記号分の回転を適用
     *
     * @param array<int, string> $colors
     * @param int $roll 0=U, 1=D, 2=F, 3=B, 4=R, 5=L
     * @param int $times 1=90°CW, 2=180°, 3=90°CCW
     * @return array<int, string>
     */
    public function cubeRotate(array $colors, int $roll, int $times): array
    {
        $operation = $this->getRotationOperation($roll);
        $cube = $colors;
        for ($i = 0; $i < $times; $i++) {
            $prev = $cube;
            foreach ($operation as $from => $to) {
                $cube[$to] = $prev[$from];
            }
        }
        return $cube;
    }

    /**
     * 面インデックスに対する移動マップ（1回転分）
     *
     * @param int $roll
     * @return array<int, int>
     */
    private function getRotationOperation(int $roll): array
    {
        $ops = [
            0 => [ 9=>36,10=>37,11=>38, 18=>9,19=>10,20=>11, 27=>18,28=>19,29=>20, 36=>27,37=>28,38=>29, 0=>2,1=>5,2=>8, 5=>7,8=>6,7=>3,6=>0,3=>1 ],
            1 => [ 15=>24,16=>25,17=>26, 24=>33,25=>34,26=>35, 33=>42,34=>43,35=>44, 42=>15,43=>16,44=>17, 45=>47,46=>50,47=>53, 50=>52,53=>51,52=>48,51=>45,48=>46 ],
            2 => [ 6=>27,7=>30,8=>33, 27=>47,30=>46,33=>45, 45=>11,46=>14,47=>17, 11=>8,14=>7,17=>6, 18=>20,19=>23,20=>26, 23=>25,26=>24,25=>21,24=>18,21=>19 ],
            3 => [ 0=>15,1=>12,2=>9, 9=>51,12=>52,15=>53, 51=>35,52=>32,53=>29, 29=>0,32=>1,35=>2, 36=>38,37=>41,38=>44, 41=>43,44=>42,43=>39,42=>36,39=>37 ],
            4 => [ 20=>2,23=>5,26=>8, 2=>42,5=>39,8=>36, 42=>47,39=>50,36=>53, 47=>20,50=>23,53=>26, 27=>29,28=>32,29=>35, 32=>34,35=>33,34=>30,33=>27,30=>28 ],
            5 => [ 0=>18,3=>21,6=>24, 18=>45,21=>48,24=>51, 45=>44,48=>41,51=>38, 38=>6,41=>3,44=>0, 9=>11,10=>14,11=>17, 14=>16,17=>15,16=>12,15=>9,12=>10 ],
        ];
        return $ops[$roll] ?? [];
    }
}
