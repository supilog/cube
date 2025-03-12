const cubelog_timer = {
    // ステータス
    currentStatus: '',
    // ステータス値
    status: {
        neutral: 0,
        wait: 1,
        ready: 2,
        timer: 3
    },
    // タイマーオブジェクト
    cubeTimer: '',
    // タイマー表示インターバル
    cubeTimerInterval: 37,
    // 開始時間
    startTime: 0,
    // 長押しタイマー
    longPushTimer: '',
    // 長押し判定値
    longPushWaitTime: 600,
    // キーコード
    keys: {
        Space: 32,
    },

    init: function () {
        this.currentStatus = this.status.neutral;
        window.addEventListener('keydown', (event) => {
            this.keyDown(event);
        });
        window.addEventListener('keyup', (event) => {
            this.keyUp(event);
        });
        // スクランブル情報の取得
        this.scramble();
    },
    keyDown: function (event) {
        if (event.keyCode !== this.keys.Space) {
            return false;
        }

        // 長押し開始時
        if (this.currentStatus === this.status.neutral) {
            document.getElementById('timer').classList.add('wait');
            this.currentStatus = this.status.wait;
            this.longPushTimer = setTimeout(function () {
                this.ready();
            }.bind(this), this.longPushWaitTime);
        }

        // タイマー終了時
        if (this.currentStatus === this.status.timer) {
            // タイマー停止
            clearTimeout(this.cubeTimer);
            // 最終タイマー表示
            this.timerView();
            // データ保存処理
            this.timerStore();
            // 初期化処理
            this.currentStatus = this.status.neutral;
        }

    },
    keyUp: function (event) {
        if (event.keyCode !== this.keys.Space) {
            return false;
        }

        // 共通処理
        clearTimeout(this.longPushTimer);
        document.getElementById('timer').classList.remove('wait');
        // 長押し完了前の処理
        if (this.currentStatus === this.status.wait) {
            this.currentStatus = this.status.neutral;
        }
        // 長押し完了後の処理
        if (this.currentStatus === this.status.ready) {
            this.currentStatus = this.status.timer;
            this.startTime = Date.now();
            this.timer();
        }
    },
    ready: function () {
        if (this.currentStatus !== this.status.wait) {
            return false;
        }
        // 長押し完了処理
        this.currentStatus = this.status.ready;
        document.getElementById('timer').textContent = '0.00';
        document.getElementById('timer').classList.remove('wait');
        document.getElementById('timer').classList.add('ready');
    },
    timer: function () {
        document.getElementById('timer').classList.remove('wait');
        document.getElementById('timer').classList.remove('ready');
        // タイマー表示処理
        this.cubeTimer = setInterval(function () {
            this.timerView();
        }.bind(this), this.cubeTimerInterval);
    },
    timerView: function () {
        const elapsedTime = Date.now() - this.startTime;
        const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const milliseconds = Math.floor((elapsedTime % 1000) / 10);
        if (minutes > 0) {
            document.getElementById('timer').textContent = String(minutes) + ':' + String(seconds).padStart(2, '0') + '.' + String(milliseconds).padStart(2, '0');
        } else {
            document.getElementById('timer').textContent = String(seconds) + '.' + String(milliseconds).padStart(2, '0');
        }
    },
    timerStore: function () {

    },
    scramble: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/scramble');
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const json = JSON.parse(xhr.responseText);
                    document.getElementById('scramble').textContent = json.scramble.text;
                }
            }
        }
    }
};

cubelog_timer.init();
