/**
 * タイマー: スペース長押しで準備 → 離すとスタート、スペースでストップ。記録は IndexedDB に保存。
 */

const DB_NAME = 'cube';
const STORE_NAME = 'times';
const HOLD_THRESHOLD_MS = 400;

const COLOR_INITIAL = '';
const COLOR_RED = '#e20017';
const COLOR_GREEN = '#13872d';

const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

function saveRecord(recordWithoutId) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getKeysReq = store.getAllKeys();
      getKeysReq.onerror = () => reject(getKeysReq.error);
      getKeysReq.onsuccess = () => {
        const keys = getKeysReq.result;
        const nextId = keys.length ? Math.max(...keys) + 1 : 1;
        const record = { ...recordWithoutId, id: nextId };
        const putReq = store.put(record);
        putReq.onerror = () => reject(putReq.error);
        putReq.onsuccess = () => resolve(record);
      };
    });
  });
}

function setTimerDisplayState(el, color) {
  if (!el) return;
  el.style.color = color || '';
}

function formatTime(msec) {
  const sec = msec / 1000;
  return sec.toFixed(2);
}

/**
 * @param {() => void} [onSaveComplete] ストップして保存完了後に呼ぶコールバック（例: スクランブル再取得）
 */
export function initTimer(onSaveComplete) {
  const timerEl = document.querySelector('.timer-display');
  const notationEl = document.querySelector('.scramble-notation');
  if (!timerEl) return;

  // ページ表示時に DB を開いて作成（DevTools で cube → times が表示されるようにする）
  openDB().then(
    (db) => db.close(),
    (err) => console.error('IndexedDB open error:', err)
  );

  let state = 'idle';
  let holdTimeoutId = null;
  let rafId = null;
  let startTime = 0;

  function resetDisplay() {
    state = 'idle';
    if (holdTimeoutId != null) {
      clearTimeout(holdTimeoutId);
      holdTimeoutId = null;
    }
    setTimerDisplayState(timerEl, COLOR_INITIAL);
    timerEl.textContent = '0.00';
  }

  function startStopwatch() {
    state = 'running';
    setTimerDisplayState(timerEl, COLOR_INITIAL);
    startTime = performance.now();
    function tick() {
      if (state !== 'running') return;
      const elapsed = performance.now() - startTime;
      timerEl.textContent = formatTime(elapsed);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopStopwatch() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    const elapsedMs = Math.round(performance.now() - startTime);
    const notation = notationEl ? (notationEl.textContent || '').trim() : '';
    const record = {
      date: Math.floor(Date.now() / 1000),
      notation,
      time: elapsedMs,
    };
    saveRecord(record).then(
      (savedRecord) => {
        if (typeof onSaveComplete === 'function') onSaveComplete(savedRecord);
      },
      (err) => console.error('IndexedDB save error:', err)
    );
    timerEl.textContent = formatTime(elapsedMs);
    state = 'idle';
  }

  function onKeyDown(e) {
    if (e.code !== 'Space' || e.repeat) return;
    e.preventDefault();

    if (state === 'idle') {
      state = 'holding_red';
      setTimerDisplayState(timerEl, COLOR_RED);
      holdTimeoutId = setTimeout(() => {
        holdTimeoutId = null;
        state = 'holding_green';
        setTimerDisplayState(timerEl, COLOR_GREEN);
      }, HOLD_THRESHOLD_MS);
      return;
    }

    if (state === 'running') {
      stopStopwatch();
    }
  }

  function onKeyUp(e) {
    if (e.code !== 'Space' || e.repeat) return;
    e.preventDefault();

    if (state === 'holding_red') {
      clearTimeout(holdTimeoutId);
      holdTimeoutId = null;
      resetDisplay();
      return;
    }

    if (state === 'holding_green') {
      holdTimeoutId = null;
      startStopwatch();
    }
  }

  document.addEventListener('keydown', onKeyDown, { passive: false });
  document.addEventListener('keyup', onKeyUp, { passive: false });
}
