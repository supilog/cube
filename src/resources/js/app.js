import './bootstrap';
import { renderCubeNet, updateCubeNetFromPage } from './cubeNet.js';
import { initTimer } from './timer.js';
import { initList } from './list.js';
import { initGraph } from './graph.js';
import { initRecords, getAllRecords, checkRankingUpdates } from './records.js';
import { initStats } from './stats.js';

const STORAGE_KEY = 'cubelog_scramble';

function applyScrambleToPage(notationEl, netEl, data) {
  if (data.notation != null) notationEl.textContent = data.notation;
  if (data.cube_net) renderCubeNet(netEl, data.cube_net);
}

function fetchAndApplyScramble(notationEl, netEl) {
  fetch('/api/cube/scramble', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      applyScrambleToPage(notationEl, netEl, data);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          notation: data.notation,
          cube_net: data.cube_net,
        }));
      } catch (_) {}
    })
    .catch((err) => {
      console.error('scramble API error:', err);
      updateCubeNetFromPage();
    });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.list-page')) {
    initList();
    return;
  }
  if (document.querySelector('.graph-page')) {
    initGraph();
    return;
  }
  if (document.querySelector('.records-page')) {
    initRecords();
    return;
  }
  if (document.querySelector('.stats-page')) {
    initStats();
    return;
  }

  const notationEl = document.querySelector('.scramble-notation');
  const netEl = document.querySelector('.cube-net');
  if (!notationEl || !netEl) return;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.notation != null || data.cube_net) {
        applyScrambleToPage(notationEl, netEl, data);
      } else {
        fetchAndApplyScramble(notationEl, netEl);
      }
    } catch (_) {
      fetchAndApplyScramble(notationEl, netEl);
    }
  } else {
    fetchAndApplyScramble(notationEl, netEl);
  }

  const refreshBtn = document.getElementById('scramble-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchAndApplyScramble(notationEl, netEl);
    });
  }

  initTimer((savedRecord) => {
    fetchAndApplyScramble(notationEl, netEl);
    if (savedRecord) {
      showRankingBadges(savedRecord);
    }
  });
});

/**
 * 記録保存時にランキング10位以内に入った場合、バッジを表示
 */
function showRankingBadges(savedRecord) {
  const container = document.getElementById('record-badges');
  if (!container) return;

  getAllRecords()
    .then((allRecords) => {
      const { singleBest, ao5, ao12 } = checkRankingUpdates(allRecords, savedRecord);
      const badges = [];
      if (singleBest != null) badges.push({ label: 'Single Best', rank: singleBest });
      if (ao5 != null) badges.push({ label: 'AO5', rank: ao5 });
      if (ao12 != null) badges.push({ label: 'AO12', rank: ao12 });

      container.innerHTML = '';
      badges.forEach(({ label, rank }) => {
        const badge = document.createElement('span');
        badge.className = 'record-badge';
        badge.textContent = `${label} ${rank}位`;
        container.appendChild(badge);
      });

      if (badges.length > 0) {
        setTimeout(() => {
          container.innerHTML = '';
        }, 60000);
      }
    })
    .catch((err) => console.error('Ranking check error:', err));
}
