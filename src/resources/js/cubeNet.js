/**
 * ルービックキューブ展開図: 回転記号に合わせて状態を更新する
 * 表記: R L U D F B / R' U2 など (WCA表記)
 */

const FACE_NAMES = ['U', 'D', 'F', 'B', 'L', 'R'];

const COLORS = {
  U: '#ffffff',
  D: '#ffd700',
  F: '#13872d',
  B: '#0341df',
  L: '#fc7109',
  R: '#e20017',
};

/** 初期状態: 各面が単色の配列(9要素) */
function createInitialState() {
  const state = {};
  FACE_NAMES.forEach((face) => {
    state[face] = Array(9).fill(COLORS[face]);
  });
  return state;
}

/** 配列をコピー */
function copyFace(face) {
  return face.slice();
}

/** 面を時計回りに90度回転 (0->2, 1->5, 2->8, 3->1, 5->7, 6->0, 7->3, 8->6) */
function rotateFaceClockwise(face) {
  const f = face.slice();
  const map = [6, 3, 0, 7, 4, 1, 8, 5, 2];
  return map.map((i) => f[i]);
}

function rotateFaceCounterClockwise(face) {
  const f = face.slice();
  const map = [2, 5, 8, 1, 4, 7, 0, 3, 6];
  return map.map((i) => f[i]);
}

function moveR(state) {
  const s = { ...state };
  s.R = rotateFaceClockwise(s.R);

  const u = [s.U[2], s.U[5], s.U[8]];
  s.U[2] = s.B[8]; s.U[5] = s.B[5]; s.U[8] = s.B[2];
  s.B[8] = s.D[2]; s.B[5] = s.D[5]; s.B[2] = s.D[8];
  s.D[2] = s.F[2]; s.D[5] = s.F[5]; s.D[8] = s.F[8];
  s.F[2] = u[0]; s.F[5] = u[1]; s.F[8] = u[2];

  return { ...s, U: s.U.slice(), D: s.D.slice(), F: s.F.slice(), B: s.B.slice() };
}

function moveRP(state) {
  const s = { ...state };
  s.R = rotateFaceCounterClockwise(s.R);

  const f = [s.F[2], s.F[5], s.F[8]];
  s.F[2] = s.D[2]; s.F[5] = s.D[5]; s.F[8] = s.D[8];
  s.D[2] = s.B[8]; s.D[5] = s.B[5]; s.D[8] = s.B[2];
  s.B[8] = s.U[2]; s.B[5] = s.U[5]; s.B[2] = s.U[8];
  s.U[2] = f[0]; s.U[5] = f[1]; s.U[8] = f[2];

  return { ...s, U: s.U.slice(), D: s.D.slice(), F: s.F.slice(), B: s.B.slice() };
}

function moveL(state) {
  const s = { ...state };
  s.L = rotateFaceClockwise(s.L);

  const u = [s.U[0], s.U[3], s.U[6]];
  s.U[0] = s.B[6]; s.U[3] = s.B[3]; s.U[6] = s.B[0];
  s.B[6] = s.D[0]; s.B[3] = s.D[3]; s.B[0] = s.D[6];
  s.D[0] = s.F[0]; s.D[3] = s.F[3]; s.D[6] = s.F[6];
  s.F[0] = u[0]; s.F[3] = u[1]; s.F[6] = u[2];

  return { ...s, U: s.U.slice(), D: s.D.slice(), F: s.F.slice(), B: s.B.slice() };
}

function moveLP(state) {
  const s = { ...state };
  s.L = rotateFaceCounterClockwise(s.L);

  const f = [s.F[0], s.F[3], s.F[6]];
  s.F[0] = s.D[0]; s.F[3] = s.D[3]; s.F[6] = s.D[6];
  s.D[0] = s.B[6]; s.D[3] = s.B[3]; s.D[6] = s.B[0];
  s.B[6] = s.U[0]; s.B[3] = s.U[3]; s.B[0] = s.U[6];
  s.U[0] = f[0]; s.U[3] = f[1]; s.U[6] = f[2];

  return { ...s, U: s.U.slice(), D: s.D.slice(), F: s.F.slice(), B: s.B.slice() };
}

function moveU(state) {
  const s = { ...state };
  s.U = rotateFaceClockwise(s.U);

  const f = [s.F[0], s.F[1], s.F[2]];
  s.F[0] = s.R[0]; s.F[1] = s.R[1]; s.F[2] = s.R[2];
  s.R[0] = s.B[0]; s.R[1] = s.B[1]; s.R[2] = s.B[2];
  s.B[0] = s.L[0]; s.B[1] = s.L[1]; s.B[2] = s.L[2];
  s.L[0] = f[0]; s.L[1] = f[1]; s.L[2] = f[2];

  return { ...s, F: s.F.slice(), B: s.B.slice(), L: s.L.slice(), R: s.R.slice() };
}

function moveUP(state) {
  const s = { ...state };
  s.U = rotateFaceCounterClockwise(s.U);

  const f = [s.F[0], s.F[1], s.F[2]];
  s.F[0] = s.L[0]; s.F[1] = s.L[1]; s.F[2] = s.L[2];
  s.L[0] = s.B[0]; s.L[1] = s.B[1]; s.L[2] = s.B[2];
  s.B[0] = s.R[0]; s.B[1] = s.R[1]; s.B[2] = s.R[2];
  s.R[0] = f[0]; s.R[1] = f[1]; s.R[2] = f[2];

  return { ...s, F: s.F.slice(), B: s.B.slice(), L: s.L.slice(), R: s.R.slice() };
}

function moveD(state) {
  const s = { ...state };
  s.D = rotateFaceClockwise(s.D);

  const f = [s.F[6], s.F[7], s.F[8]];
  s.F[6] = s.L[6]; s.F[7] = s.L[7]; s.F[8] = s.L[8];
  s.L[6] = s.B[6]; s.L[7] = s.B[7]; s.L[8] = s.B[8];
  s.B[6] = s.R[6]; s.B[7] = s.R[7]; s.B[8] = s.R[8];
  s.R[6] = f[0]; s.R[7] = f[1]; s.R[8] = f[2];

  return { ...s, F: s.F.slice(), B: s.B.slice(), L: s.L.slice(), R: s.R.slice() };
}

function moveDP(state) {
  const s = { ...state };
  s.D = rotateFaceCounterClockwise(s.D);

  const f = [s.F[6], s.F[7], s.F[8]];
  s.F[6] = s.R[6]; s.F[7] = s.R[7]; s.F[8] = s.R[8];
  s.R[6] = s.B[6]; s.R[7] = s.B[7]; s.R[8] = s.B[8];
  s.B[6] = s.L[6]; s.B[7] = s.L[7]; s.B[8] = s.L[8];
  s.L[6] = f[0]; s.L[7] = f[1]; s.L[8] = f[2];

  return { ...s, F: s.F.slice(), B: s.B.slice(), L: s.L.slice(), R: s.R.slice() };
}

function moveF(state) {
  const s = { ...state };
  s.F = rotateFaceClockwise(s.F);

  const u = [s.U[6], s.U[7], s.U[8]];
  s.U[6] = s.L[8]; s.U[7] = s.L[5]; s.U[8] = s.L[2];
  s.L[2] = s.D[0]; s.L[5] = s.D[1]; s.L[8] = s.D[2];
  s.D[0] = s.R[6]; s.D[1] = s.R[3]; s.D[2] = s.R[0];
  s.R[0] = u[0]; s.R[3] = u[1]; s.R[6] = u[2];

  return { ...s, U: s.U.slice(), D: s.D.slice(), L: s.L.slice(), R: s.R.slice() };
}

function moveFP(state) {
  const s = { ...state };
  s.F = rotateFaceCounterClockwise(s.F);

  const u = [s.U[6], s.U[7], s.U[8]];
  s.U[6] = s.R[0]; s.U[7] = s.R[3]; s.U[8] = s.R[6];
  s.R[0] = s.D[2]; s.R[3] = s.D[1]; s.R[6] = s.D[0];
  s.D[0] = s.L[2]; s.D[1] = s.L[5]; s.D[2] = s.L[8];
  s.L[2] = u[2]; s.L[5] = u[1]; s.L[8] = u[0];

  return { ...s, U: s.U.slice(), D: s.D.slice(), L: s.L.slice(), R: s.R.slice() };
}

function moveB(state) {
  const s = { ...state };
  s.B = rotateFaceClockwise(s.B);

  const u = [s.U[0], s.U[1], s.U[2]];
  s.U[0] = s.L[6]; s.U[1] = s.L[3]; s.U[2] = s.L[0];
  s.L[0] = s.D[6]; s.L[3] = s.D[7]; s.L[6] = s.D[8];
  s.D[6] = s.R[8]; s.D[7] = s.R[5]; s.D[8] = s.R[2];
  s.R[2] = u[0]; s.R[5] = u[1]; s.R[8] = u[2];

  return { ...s, U: s.U.slice(), D: s.D.slice(), L: s.L.slice(), R: s.R.slice() };
}

function moveBP(state) {
  const s = { ...state };
  s.B = rotateFaceCounterClockwise(s.B);

  const u = [s.U[0], s.U[1], s.U[2]];
  s.U[0] = s.R[2]; s.U[1] = s.R[5]; s.U[2] = s.R[8];
  s.R[2] = s.D[8]; s.R[5] = s.D[7]; s.R[8] = s.D[6];
  s.D[6] = s.L[0]; s.D[7] = s.L[3]; s.D[8] = s.L[6];
  s.L[0] = u[2]; s.L[3] = u[1]; s.L[6] = u[0];

  return { ...s, U: s.U.slice(), D: s.D.slice(), L: s.L.slice(), R: s.R.slice() };
}

const MOVES = {
  R: moveR, "R'": moveRP,
  L: moveL, "L'": moveLP,
  U: moveU, "U'": moveUP,
  D: moveD, "D'": moveDP,
  F: moveF, "F'": moveFP,
  B: moveB, "B'": moveBP,
};

function applyMove(state, key) {
  const fn = MOVES[key];
  if (!fn) return state;
  const copy = {
    U: state.U.slice(), D: state.D.slice(), F: state.F.slice(),
    B: state.B.slice(), L: state.L.slice(), R: state.R.slice(),
  };
  return fn(copy);
}

/** 回転記号文字列をパース (R U R' U' R2 など)。R' は R' または R′ の両方に対応 */
function parseScramble(str) {
  if (!str || typeof str !== 'string') return [];
  const tokens = str.trim().split(/\s+/).filter(Boolean);
  const result = [];
  for (const t of tokens) {
    const match = t.match(/^([RULDFB])(['′'ʼ]|2)?$/i);
    if (!match) continue;
    const face = match[1].toUpperCase();
    const suffix = (match[2] || '').replace(/′|ʼ/, "'");
    if (suffix === '2') {
      result.push(face, face);
    } else if (suffix === "'") {
      result.push(face + "'");
    } else {
      result.push(face);
    }
  }
  return result;
}

/** スクランブルを適用した状態を返す */
function applyScramble(scrambleStr) {
  const moves = parseScramble(scrambleStr);
  let state = createInitialState();
  for (const move of moves) {
    state = applyMove(state, move);
  }
  return state;
}

/** DOM の展開図を state で更新 */
function renderCubeNet(netEl, state) {
  if (!netEl || !state) return;
  FACE_NAMES.forEach((face) => {
    const faceEl = netEl.querySelector(`[data-face="${face}"]`);
    if (!faceEl) return;
    const stickers = faceEl.querySelectorAll('.cube-sticker');
    const colors = state[face];
    stickers.forEach((sticker, i) => {
      if (colors[i]) sticker.style.setProperty('--face-color', colors[i]);
    });
  });
  netEl.removeAttribute('data-initial');
}

/** ページ内の回転記号と展開図を取得し、展開図を更新 */
function updateCubeNetFromPage() {
  const notationEl = document.querySelector('.scramble-notation');
  const netEl = document.querySelector('.cube-net');
  if (!notationEl || !netEl) return;

  const text = notationEl.textContent || '';
  const state = applyScramble(text);
  renderCubeNet(netEl, state);
}

export { createInitialState, applyScramble, parseScramble, renderCubeNet, updateCubeNetFromPage };
