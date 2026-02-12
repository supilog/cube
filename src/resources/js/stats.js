/**
 * 統計: IndexedDB の記録から総ソルブ数・最多日・平均タイムなどを表示
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

function getAllRecords() {
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

/** Unix秒 → yyyy/mm/dd */
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

/** 日付キー yyyy-mm-dd（ソルブ日ごとの集計用） */
function dateKey(unixSec) {
  const d = new Date(unixSec * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 今週の月曜 0:00:00 (UTC) の Unix 秒（簡易: クライアントの週） */
function getThisWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return Math.floor(monday.getTime() / 1000);
}

/** 今月1日 0:00:00 の Unix 秒（ローカル） */
function getThisMonthStart() {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

function computeStats(records) {
  const total = records.length;
  if (total === 0) {
    return {
      total: 0,
      firstDate: null,
      lastDate: null,
      avgTimeMsec: null,
      distinctDays: 0,
      bestDay: null,
      bestDayCount: 0,
      thisMonthCount: 0,
      thisWeekCount: 0,
    };
  }

  const byDay = {};
  let sumTime = 0;
  let validTimeCount = 0;
  let minDate = null;
  let maxDate = null;

  for (const r of records) {
    const key = dateKey(r.date);
    byDay[key] = (byDay[key] || 0) + 1;
    if (r.time != null && Number.isFinite(r.time)) {
      sumTime += r.time;
      validTimeCount += 1;
    }
    if (r.date != null) {
      if (minDate == null || r.date < minDate) minDate = r.date;
      if (maxDate == null || r.date > maxDate) maxDate = r.date;
    }
  }

  let bestDayKey = null;
  let bestDayCount = 0;
  for (const [key, count] of Object.entries(byDay)) {
    if (count > bestDayCount) {
      bestDayCount = count;
      bestDayKey = key;
    }
  }
  const bestDay = bestDayKey
    ? (() => {
        const [y, m, d] = bestDayKey.split('-');
        return `${y}/${m}/${d}`;
      })()
    : null;

  const thisMonthStart = getThisMonthStart();
  const thisWeekStart = getThisWeekStart();
  let thisMonthCount = 0;
  let thisWeekCount = 0;
  for (const r of records) {
    if (r.date >= thisMonthStart) thisMonthCount += 1;
    if (r.date >= thisWeekStart) thisWeekCount += 1;
  }

  return {
    total,
    firstDate: minDate,
    lastDate: maxDate,
    avgTimeMsec: validTimeCount > 0 ? sumTime / validTimeCount : null,
    distinctDays: Object.keys(byDay).length,
    bestDay,
    bestDayCount,
    thisMonthCount,
    thisWeekCount,
  };
}

function renderStatRow(label, value, sub = null) {
  const div = document.createElement('div');
  div.className = 'flex flex-wrap items-baseline justify-between gap-2 py-3 border-b border-gray-100 last:border-0';
  const labelEl = document.createElement('span');
  labelEl.className = 'text-gray-600';
  labelEl.textContent = label;
  const valueEl = document.createElement('span');
  valueEl.className = 'font-semibold text-gray-900 font-mono';
  valueEl.textContent = value;
  div.appendChild(labelEl);
  div.appendChild(valueEl);
  if (sub) {
    const subEl = document.createElement('div');
    subEl.className = 'w-full text-sm text-gray-500 mt-0.5';
    subEl.textContent = sub;
    div.appendChild(subEl);
  }
  return div;
}

function renderSection(sectionId, title, description, rows) {
  const section = document.createElement('section');
  section.className = 'mb-10';
  section.setAttribute('aria-labelledby', sectionId);
  const h2 = document.createElement('h2');
  h2.id = sectionId;
  h2.className = 'text-lg font-semibold text-gray-800 mb-2';
  h2.textContent = title;
  const p = document.createElement('p');
  p.className = 'text-sm text-gray-500 mb-4';
  p.textContent = description;
  const card = document.createElement('div');
  card.className = 'bg-gray-50 rounded-lg p-4';
  rows.forEach((row) => card.appendChild(row));
  section.appendChild(h2);
  section.appendChild(p);
  section.appendChild(card);
  return section;
}

export function initStats() {
  const container = document.getElementById('stats-container');
  if (!container) return;

  container.innerHTML = '<p class="text-gray-500 py-8">読み込み中…</p>';

  getAllRecords()
    .then((rows) => {
      const stats = computeStats(rows);
      container.innerHTML = '';

      if (stats.total === 0) {
        container.innerHTML = '<p class="text-gray-500 py-8 text-center">記録がありません。計測を始めるとここに統計が表示されます。</p>';
        return;
      }

      const overviewRows = [
        renderStatRow('総ソルブ数', `${stats.total.toLocaleString()} 回`),
        renderStatRow('記録がある日数', `${stats.distinctDays} 日`),
        renderStatRow('記録開始日', stats.firstDate ? formatDateYmd(stats.firstDate) : '—'),
        renderStatRow('最終記録日', stats.lastDate ? formatDateYmd(stats.lastDate) : '—'),
        renderStatRow('平均タイム', stats.avgTimeMsec != null ? `${formatTimeSec(stats.avgTimeMsec)} 秒` : '—'),
      ];
      container.appendChild(
        renderSection('stats-overview', '概要', '全記録に基づく基本統計', overviewRows)
      );

      const bestDayRows = [
        renderStatRow('最も多くソルブした日', stats.bestDay ?? '—', stats.bestDayCount > 0 ? `${stats.bestDayCount} 回` : null),
      ];
      container.appendChild(
        renderSection('stats-best-day', '最多ソルブ日', '1日あたりのソルブ数が最大だった日', bestDayRows)
      );

      const periodRows = [
        renderStatRow('今週のソルブ数', `${stats.thisWeekCount} 回`, '月曜〜今日'),
        renderStatRow('今月のソルブ数', `${stats.thisMonthCount} 回`),
      ];
      container.appendChild(
        renderSection('stats-period', '期間別', '今週・今月のソルブ数', periodRows)
      );
    })
    .catch((err) => {
      console.error('Stats load error:', err);
      container.innerHTML = '<p class="text-red-600 py-4">記録の読み込みに失敗しました。</p>';
    });
}
