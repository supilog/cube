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
            $length += ($next_times == 1) ? 2 : 1;
        }
        return $ret;
    }

    /**
     * ランダムで回転情報(方向,回数)を取得
     * 方向 0:U, 1:D, 2:F, 3:B, 4:R, 5:R
     * 回数 0:順方向1, 1:順方向2(2), 2:逆方向1(')
     * @return array
     * @throws \Random\RandomException
     */
    public function roll()
    {
        // 方向(R, U, L, D, F, Bの6パターン)
        $roll = random_int(0, 5);
        // 回数(U, U2, U'の3パターン)
        $times = random_int(0, 2);
        return array($roll, $times);
    }

    /**
     * スクランブルデータ(数値配列)を記号文字の配列にする
     * @param $scramble
     * @return array
     */
    public function scrambleToTextArray($scramble)
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
                case 1:
                    $text .= '2';
                    break;
                case 2:
                    $text .= '\'';
                    break;
                default:
                    break;
            }
            array_push($ret, $text);
        }
        return $ret;
    }
}
