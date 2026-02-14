/**
 * 記録: Single Best / AO5 / AO12 のベスト10を表示
 */

const DB_NAME = 'cube';
const STORE_NAME = 'times';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

export function getAllRecords() {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
      req.onsuccess = () => {
        db.close();
        resolve(req.result || []);
      };
    });
  });
}

/** Unix秒 → yyyymmdd */
function formatDateYmd(unixSec) {
  const d = new Date(unixSec * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

/** msec → 秒表示（小数3桁） */
function formatTimeSec(msec) {
  return (msec / 1000).toFixed(3);
}

/** Unix秒 → 日時表示（yyyy/mm/dd HH:mm:ss） */
function formatDateTime(unixSec) {
  const d = new Date(unixSec * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const sec = String(d.getSeconds()).padStart(2, '0');
  return `${y}/${m}/${day} ${h}:${min}:${sec}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Single Best: タイムが最もはやいベスト10 */
function computeSingleBest(records) {
  const sorted = [...records].sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
  return sorted.slice(0, 10);
}

/** AO5: 連続5回のうち最速・最遅を除いた3回の平均。id 昇順で連続とする */
function computeAO5List(records) {
  const byId = [...records].sort((a, b) => (a.id != null ? a.id : 0) - (b.id != null ? b.id : 0));
  const list = [];
  for (let i = 0; i + 5 <= byId.length; i++) {
    const slice = byId.slice(i, i + 5);
    const five = slice.map((r) => r.time);
    const valid = five.filter((t) => t != null && Number.isFinite(t));
    if (valid.length !== 5) continue;
    const sorted = [...valid].sort((a, b) => a - b);
    const dropMinMax = sorted.slice(1, 4);
    const sum = dropMinMax.reduce((s, t) => s + t, 0);
    const ao5 = sum / 3;
    list.push({ ao5, endRecord: byId[i + 4], records: slice });
  }
  list.sort((a, b) => a.ao5 - b.ao5);
  return list.slice(0, 10);
}

/** AO12: 連続12回のうち最速・最遅を除いた10回の平均 */
function computeAO12List(records) {
  const byId = [...records].sort((a, b) => (a.id != null ? a.id : 0) - (b.id != null ? b.id : 0));
  const list = [];
  for (let i = 0; i + 12 <= byId.length; i++) {
    const slice = byId.slice(i, i + 12);
    const twelve = slice.map((r) => r.time);
    const valid = twelve.filter((t) => t != null && Number.isFinite(t));
    if (valid.length !== 12) continue;
    const sorted = [...valid].sort((a, b) => a - b);
    const dropMinMax = sorted.slice(1, 11);
    const sum = dropMinMax.reduce((s, t) => s + t, 0);
    const ao12 = sum / 10;
    list.push({ ao12, endRecord: byId[i + 11], records: slice });
  }
  list.sort((a, b) => a.ao12 - b.ao12);
  return list.slice(0, 10);
}

/**
 * 保存直後の記録がランキング10位以内に入っているかチェック
 * @param {Array} allRecords 全記録（保存済みの新記録を含む）
 * @param {{ id: number, time: number }} savedRecord 今保存した記録
 * @returns {{ singleBest: number|null, ao5: number|null, ao12: number|null }} 各ランキングの順位（10位以内なら1-10、入っていなければnull）
 */
export function checkRankingUpdates(allRecords, savedRecord) {
  const result = { singleBest: null, ao5: null, ao12: null };
  if (!savedRecord || savedRecord.id == null) return result;

  const singleBest = computeSingleBest(allRecords);
  const singleRank = singleBest.findIndex((r) => r.id === savedRecord.id);
  if (singleRank >= 0) result.singleBest = singleRank + 1;

  const byId = [...allRecords].sort((a, b) => (a.id != null ? a.id : 0) - (b.id != null ? b.id : 0));
  const lastIdx = byId.findIndex((r) => r.id === savedRecord.id);
  if (lastIdx < 0) return result;

  if (lastIdx >= 4) {
    const slice5 = byId.slice(lastIdx - 4, lastIdx + 1);
    const five = slice5.map((r) => r.time);
    const valid = five.filter((t) => t != null && Number.isFinite(t));
    if (valid.length === 5) {
      const sorted = [...valid].sort((a, b) => a - b);
      const dropMinMax = sorted.slice(1, 4);
      const ao5 = dropMinMax.reduce((s, t) => s + t, 0) / 3;
      const ao5List = computeAO5List(allRecords);
      const ao5Rank = ao5List.findIndex((item) => item.endRecord.id === savedRecord.id);
      if (ao5Rank >= 0) result.ao5 = ao5Rank + 1;
    }
  }

  if (lastIdx >= 11) {
    const slice12 = byId.slice(lastIdx - 11, lastIdx + 1);
    const twelve = slice12.map((r) => r.time);
    const valid = twelve.filter((t) => t != null && Number.isFinite(t));
    if (valid.length === 12) {
      const ao12List = computeAO12List(allRecords);
      const ao12Rank = ao12List.findIndex((item) => item.endRecord.id === savedRecord.id);
      if (ao12Rank >= 0) result.ao12 = ao12Rank + 1;
    }
  }

  return result;
}

/** 1件の表示（list と同様のスタイル: タイム + [ymd] notation） */
function renderRecordRow(record, options = {}) {
  const { showRank, rank, timeMsec, ymd, notation, onTimeClick } = options;
  const timeSec = formatTimeSec(timeMsec ?? record.time);
  const ymdVal = ymd ?? formatDateYmd(record.date);
  const notationVal = (notation ?? (record.notation || '')).trim() || '—';
  const line2 = `[${ymdVal}] ${notationVal}`;

  const item = document.createElement('div');
  item.className = 'list-record py-3 border-b border-gray-200';
  const left = document.createElement('div');
  left.className = 'flex items-baseline gap-3';
  if (showRank && rank != null) {
    const rankEl = document.createElement('span');
    rankEl.className = 'text-gray-500 text-sm w-6';
    rankEl.textContent = `${rank}.`;
    left.appendChild(rankEl);
  }
  const timeEl = document.createElement(onTimeClick ? 'button' : 'span');
  timeEl.className = 'text-xl font-mono font-semibold text-gray-900' + (onTimeClick ? ' hover:text-blue-600 hover:underline text-left' : '');
  if (onTimeClick) {
    timeEl.type = 'button';
    timeEl.addEventListener('click', onTimeClick);
  }
  timeEl.textContent = timeSec;
  left.appendChild(timeEl);
  item.appendChild(left);
  const line2El = document.createElement('div');
  line2El.className = 'text-sm text-gray-600 mt-0.5 break-all';
  line2El.textContent = line2;
  item.appendChild(line2El);
  return item;
}

function renderSingleBest(container, list) {
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p class="text-gray-500 py-8 text-center">記録がありません。</p>';
    return;
  }
  list.forEach((record, i) => {
    container.appendChild(
      renderRecordRow(record, { showRank: true, rank: i + 1 })
    );
  });
}

function renderAO5(container, list, openAvgModal) {
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p class="text-gray-500 py-8 text-center">記録がありません（5回以上の連続記録が必要です）。</p>';
    return;
  }
  list.forEach((item, i) => {
    const row = renderRecordRow(item.endRecord, {
      showRank: true,
      rank: i + 1,
      timeMsec: item.ao5,
      notation: '',
      onTimeClick: () => openAvgModal(item.records, 'AO5', item.ao5),
    });
    const line2 = row.querySelector('.text-sm.text-gray-600');
    if (line2) line2.textContent = `[${formatDateYmd(item.endRecord.date)}] AO5`;
    container.appendChild(row);
  });
}

function renderAO12(container, list, openAvgModal) {
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p class="text-gray-500 py-8 text-center">記録がありません（12回以上の連続記録が必要です）。</p>';
    return;
  }
  list.forEach((item, i) => {
    const row = renderRecordRow(item.endRecord, {
      showRank: true,
      rank: i + 1,
      timeMsec: item.ao12,
      notation: '',
      onTimeClick: () => openAvgModal(item.records, 'AO12', item.ao12),
    });
    const line2 = row.querySelector('.text-sm.text-gray-600');
    if (line2) line2.textContent = `[${formatDateYmd(item.endRecord.date)}] AO12`;
    container.appendChild(row);
  });
}

export function initRecords() {
  const singleEl = document.getElementById('records-single');
  const ao5El = document.getElementById('records-ao5');
  const ao12El = document.getElementById('records-ao12');
  const modalEl = document.getElementById('records-avg-modal');
  const modalTitle = document.getElementById('records-modal-title');
  const modalAvg = document.getElementById('records-modal-avg');
  const modalBody = document.getElementById('records-modal-body');
  const modalOverlay = document.getElementById('records-modal-overlay');
  if (!singleEl || !ao5El || !ao12El) return;

  function openAvgModal(records, type, avgMsec) {
    if (!modalEl || !modalTitle || !modalAvg || !modalBody) return;
    const label = type === 'AO5' ? 'AO5 (average of 5)' : 'AO12 (average of 12)';
    modalTitle.textContent = label;
    modalAvg.textContent = `平均: ${formatTimeSec(avgMsec)}`;
    modalBody.innerHTML = records
      .map((r, idx) => {
        const timeSec = formatTimeSec(r.time);
        const dateTime = formatDateTime(r.date);
        const notation = (r.notation || '').trim() || '—';
        return `<li class="py-2 border-b border-gray-100 last:border-0">
          <span class="font-medium text-gray-500 w-6 inline-block">${idx + 1}.</span>
          <span class="font-mono">${escapeHtml(timeSec)}</span>
          <span class="text-gray-500 ml-2">${escapeHtml(dateTime)}</span>
          <div class="ml-7 mt-0.5 text-gray-600 break-all">${escapeHtml(notation)}</div>
        </li>`;
      })
      .join('');
    modalEl.classList.remove('hidden');
    modalEl.setAttribute('aria-hidden', 'false');
  }

  function closeAvgModal() {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    modalEl.setAttribute('aria-hidden', 'true');
  }

  if (modalOverlay) modalOverlay.addEventListener('click', closeAvgModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && !modalEl.classList.contains('hidden')) closeAvgModal();
  });

  getAllRecords()
    .then((rows) => {
      const singleBest = computeSingleBest(rows);
      renderSingleBest(singleEl, singleBest);

      if (rows.length < 5) {
        ao5El.innerHTML = '<p class="text-gray-500 py-8 text-center">データなし</p>';
      } else {
        const ao5List = computeAO5List(rows);
        renderAO5(ao5El, ao5List, openAvgModal);
      }

      if (rows.length < 12) {
        ao12El.innerHTML = '<p class="text-gray-500 py-8 text-center">データなし</p>';
      } else {
        const ao12List = computeAO12List(rows);
        renderAO12(ao12El, ao12List, openAvgModal);
      }
    })
    .catch((err) => {
      console.error('Records load error:', err);
      singleEl.innerHTML = '<p class="text-red-600 py-4">記録の読み込みに失敗しました。</p>';
      ao5El.innerHTML = '';
      ao12El.innerHTML = '';
    });
}
