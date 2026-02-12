/**
 * グラフ: IndexedDB 直近200件を取得し、折れ線グラフ表示（縦軸: time msec, 横軸: id）
 */

const DB_NAME = 'cube';
const STORE_NAME = 'times';
const LIMIT = 200;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

function getLastNRecords(n) {
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
        const all = req.result || [];
        const sorted = all.sort((a, b) => (b.id != null ? b.id : 0) - (a.id != null ? a.id : 0));
        resolve(sorted.slice(0, n));
      };
    });
  });
}

function drawLineChart(container, records) {
  if (!container) return;

  const width = container.clientWidth || window.innerWidth || 800;
  const height = 400;
  const padding = { top: 20, right: 20, bottom: 40, left: 56 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxTime = records.length ? Math.max(...records.map((r) => r.time || 0), 1) : 1;
  const n = records.length || 1;

  const scaleY = (msec) => chartHeight - (msec / maxTime) * chartHeight;
  const scaleX = (i) =>
    n <= 1
      ? padding.left + chartWidth / 2
      : padding.left + (i / (n - 1)) * chartWidth;

  let svg =
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="w-full max-w-full" aria-label="タイムの折れ線グラフ">`;
  // Y axis line
  svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}" stroke="#e5e7eb" stroke-width="1"/>`;
  // X axis line
  svg += `<line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${padding.left + chartWidth}" y2="${padding.top + chartHeight}" stroke="#e5e7eb" stroke-width="1"/>`;

  // Y axis labels (time in sec, 5 ticks)
  for (let i = 0; i <= 5; i++) {
    const msec = (maxTime * i) / 5;
    const y = padding.top + scaleY(msec);
    const sec = (msec / 1000).toFixed(2);
    svg += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6b7280">${sec}</text>`;
  }

  // X axis labels: first, last, and a few in between (id values)
  if (records.length > 0) {
    const ids = records.map((r) => r.id);
    const step = Math.max(1, Math.floor(n / 8));
    for (let i = 0; i < n; i += step) {
      const x = scaleX(i);
      const id = ids[i];
      svg += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#6b7280">${id}</text>`;
    }
    if (n - 1 > step && (n - 1) % step !== 0) {
      const x = scaleX(n - 1);
      svg += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#6b7280">${ids[n - 1]}</text>`;
    }
  }

  // Polyline: connect (scaleX(i), padding.top + scaleY(time)) for each record
  const points = records
    .map((r, i) => {
      const t = r.time != null ? r.time : 0;
      const x = scaleX(i);
      const y = padding.top + scaleY(t);
      return `${x},${y}`;
    })
    .join(' ');
  if (points) {
    svg += `<polyline points="${points}" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>`;
    // Optional: small circles at each point
    records.forEach((r, i) => {
      const t = r.time != null ? r.time : 0;
      const x = scaleX(i);
      const y = padding.top + scaleY(t);
      svg += `<circle cx="${x}" cy="${y}" r="2" fill="#3b82f6" aria-label="id ${r.id} ${(t / 1000).toFixed(3)}秒"/>`;
    });
  }

  svg += '</svg>';
  container.innerHTML = svg;
}

export function initGraph() {
  const container = document.getElementById('graph-chart');
  if (!container) return;

  container.innerHTML = '<p class="text-gray-500 py-4">読み込み中…</p>';

  getLastNRecords(LIMIT)
    .then((records) => {
      if (records.length === 0) {
        container.innerHTML = '<p class="text-gray-500 py-4">記録がありません。</p>';
        return;
      }
      // 表示は左が古い・右が新しいにする（取得は新しい順のため反転）
      drawLineChart(container, records.reverse());
    })
    .catch((err) => {
      console.error('Graph load error:', err);
      container.innerHTML = '<p class="text-red-500 py-4">読み込みに失敗しました。</p>';
    });
}
