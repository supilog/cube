/**
 * リスト: IndexedDB cube/times の記録を降順・ページャー付きで表示
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

function deleteRecord(id) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
      req.onsuccess = () => {
        db.close();
        resolve();
      };
    });
  });
}

export function initList() {
  const container = document.getElementById('list-records');
  const paginationEl = document.getElementById('list-pagination');
  const modalEl = document.getElementById('list-record-modal');
  const modalBody = document.getElementById('list-modal-body');
  const modalOverlay = document.getElementById('list-modal-overlay');
  const modalDeleteBtn = document.getElementById('list-modal-delete');
  if (!container) return;

  const perPage = parseInt(
    document.body.dataset.listPerPage || container.dataset.perPage || '50',
    10
  );
  let currentPage = 1;
  let allRecords = [];
  let modalRecordId = null;

  function openModal(record) {
    if (!modalEl || !modalBody) return;
    modalRecordId = record.id;
    const timeSec = formatTimeSec(record.time);
    const notation = (record.notation || '').trim() || '—';
    const dateTime = formatDateTime(record.date);
    modalBody.innerHTML = `
      <div><dt class="font-medium text-gray-500">ID</dt><dd class="mt-0.5">${escapeHtml(String(record.id))}</dd></div>
      <div><dt class="font-medium text-gray-500">time</dt><dd class="mt-0.5 font-mono">${escapeHtml(timeSec)}</dd></div>
      <div><dt class="font-medium text-gray-500">notation</dt><dd class="mt-0.5 break-all">${escapeHtml(notation)}</dd></div>
      <div><dt class="font-medium text-gray-500">日時</dt><dd class="mt-0.5">${escapeHtml(dateTime)}</dd></div>
    `;
    modalEl.classList.remove('hidden');
    modalEl.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    modalEl.setAttribute('aria-hidden', 'true');
    modalRecordId = null;
  }

  function setupModalListeners() {
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalEl && !modalEl.classList.contains('hidden')) {
        closeModal();
      }
    });
    if (modalDeleteBtn) {
      modalDeleteBtn.addEventListener('click', () => {
        if (modalRecordId == null) return;
        deleteRecord(modalRecordId)
          .then(() => {
            closeModal();
            return getAllRecords();
          })
          .then((rows) => {
            allRecords = rows.sort((a, b) => (b.id != null ? b.id : 0) - (a.id != null ? a.id : 0));
            renderPage();
          })
          .catch((err) => {
            console.error('Delete error:', err);
          });
      });
    }
  }
  setupModalListeners();

  function renderRecord(record) {
    const timeSec = formatTimeSec(record.time);
    const ymd = formatDateYmd(record.date);
    const notation = (record.notation || '').trim() || '—';
    const line2 = `[${ymd}] ${notation}`;

    const item = document.createElement('div');
    item.className = 'list-record py-3 border-b border-gray-200';
    const timeLink = document.createElement('button');
    timeLink.type = 'button';
    timeLink.className = 'text-xl font-mono font-semibold text-gray-900 hover:text-blue-600 hover:underline text-left';
    timeLink.textContent = timeSec;
    timeLink.addEventListener('click', () => openModal(record));
    const line2El = document.createElement('div');
    line2El.className = 'text-sm text-gray-600 mt-0.5 break-all';
    line2El.textContent = line2;
    item.appendChild(timeLink);
    item.appendChild(line2El);
    return item;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderPage() {
    const total = allRecords.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const from = (currentPage - 1) * perPage;
    const to = Math.min(from + perPage, total);
    const pageRecords = allRecords.slice(from, to);

    container.innerHTML = '';
    if (pageRecords.length === 0) {
      container.innerHTML = `
        <p class="text-gray-500 py-8 text-center">記録がありません。</p>
      `;
    } else {
      pageRecords.forEach((record) => {
        container.appendChild(renderRecord(record));
      });
    }

    renderPagination(total, totalPages, from, to);
  }

  function renderPagination(total, totalPages, from, to) {
    if (!paginationEl) return;
    if (totalPages <= 1 && total === 0) {
      paginationEl.innerHTML = '';
      return;
    }

    const prevDisabled = currentPage <= 1;
    const nextDisabled = currentPage >= totalPages;

    let navHtml = '';
    if (total > 0) {
      navHtml = `
        <span class="text-sm text-gray-600">
          ${from + 1}–${to} / ${total}件
        </span>
        <div class="flex items-center gap-2">
          <button type="button" data-page="prev" ${prevDisabled ? 'disabled' : ''}
            class="px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            前へ
          </button>
          <span class="text-sm text-gray-600">${currentPage} / ${totalPages}</span>
          <button type="button" data-page="next" ${nextDisabled ? 'disabled' : ''}
            class="px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            次へ
          </button>
        </div>
      `;
    }
    paginationEl.innerHTML = navHtml;

    paginationEl.querySelectorAll('button[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        if (btn.dataset.page === 'prev') currentPage -= 1;
        else currentPage += 1;
        renderPage();
      });
    });
  }

  getAllRecords()
    .then((rows) => {
      allRecords = rows.sort((a, b) => (b.id != null ? b.id : 0) - (a.id != null ? a.id : 0));
      renderPage();
    })
    .catch((err) => {
      console.error('List load error:', err);
      container.innerHTML = '<p class="text-red-600 py-4">記録の読み込みに失敗しました。</p>';
    });
}
