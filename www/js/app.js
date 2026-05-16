// ═══════════════════════════════════════════════════
// MINDFORGE — app.js  (complete)
// ═══════════════════════════════════════════════════
'use strict';

// ── Constants ────────────────────────────────────────
const STORAGE_KEY   = 'mindforge_v1';
const SESSION_SECS  = 30 * 60;   // 30-minute daily cap
const Q_PER_GAME    = 10;
const Q_TIME        = 30;         // seconds per question

const XP_MAP = { easy: 20, medium: 35, hard: 55, killer: 80 };
const SPEED_BONUS = 10; // extra XP for answering in < 10 s

// XP to reach level N  (index 0 = level 1)
const LVL_THRESHOLDS = [0, 500, 1200, 2200, 3500, 5500, 8000, 11000, 15000, 20000, 27000];

// ── Persistent state ─────────────────────────────────
let S = {
  name: '', avatar: '', xp: 0, level: 1,
  streak: 0, lastPlay: '',
  correctTotal: 0, answeredTotal: 0, sessions: 0,
  pin: '', pinEnabled: false,
  todayDate: '', todayUsed: 0, todayDone: 0,
  onboarded: false
};

// ── Volatile game state ───────────────────────────────
let sesTimer = null, sesStart = null;
let qTimer = null, qLeft = Q_TIME;
let catId = null, questions = [], qIdx = 0;
let pts = 0, wrongs = [], qCorrect = 0, qAnswered = 0;
let qTimes = [], qStart = null, didAnswer = false;
let daylockInterval = null;

// ── Util ──────────────────────────────────────────────
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');

function todayStr() { return new Date().toISOString().slice(0, 10); }

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (_) {}
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) Object.assign(S, JSON.parse(raw));
  } catch (_) {}
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtMSS(sec) { return `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`; }
function fmtHMS(sec) { return `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`; }

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : 'Good evening,';
}

function calcLevel(xp) {
  for (let i = LVL_THRESHOLDS.length - 1; i >= 0; i--)
    if (xp >= LVL_THRESHOLDS[i]) return i + 1;
  return 1;
}

function xpFloor(lvl)   { return LVL_THRESHOLDS[Math.min(lvl - 1, LVL_THRESHOLDS.length - 1)]; }
function xpCeiling(lvl) { return LVL_THRESHOLDS[Math.min(lvl, LVL_THRESHOLDS.length - 1)]; }

// ══════════════════════════════════════════════════════
// SCREEN ROUTING
// ══════════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const scr = $(id);
  if (scr) scr.classList.add('active');

  // Side effects
  if (id === 'screen-profile') _populateProfile();
  if (id === 'screen-home')    _refreshHome();
}

// ══════════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════════
function boot() {
  load();
  _checkDayReset();

  if (S.pinEnabled && S.pin) {
    pinBuf = '';
    _syncDots('dot', 0);
    $('pin-error').textContent = '';
    showScreen('screen-lock');
    return;
  }
  if (!S.onboarded) { showScreen('screen-onboard'); return; }
  if (_isDayLocked()) { _showDayLock(); return; }
  goHome();
}

// ══════════════════════════════════════════════════════
// DAY / SESSION HELPERS
// ══════════════════════════════════════════════════════
function _checkDayReset() {
  const today = todayStr();
  if (S.todayDate === today) return;
  // New day — check streak continuity
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yestStr = yest.toISOString().slice(0, 10);
  if (S.lastPlay && S.lastPlay !== yestStr && S.lastPlay !== today) S.streak = 0;
  S.todayDate  = today;
  S.todayUsed  = 0;
  S.todayDone  = 0;
  save();
}

function _secsLeft() { return Math.max(0, SESSION_SECS - S.todayUsed); }
function _isDayLocked() { return _secsLeft() <= 0; }

// Session timer — runs while user is playing/on home
function _startSesTimer() {
  _stopSesTimer();
  sesStart = Date.now();
  sesTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - sesStart) / 1000);
    const remaining = Math.max(0, SESSION_SECS - S.todayUsed - elapsed);

    $('session-display').textContent = fmtMSS(remaining);
    if ($('time-left-big')) $('time-left-big').textContent = Math.ceil(remaining / 60);

    // Update ring on home if visible
    _updateRing(S.todayUsed + elapsed);

    if (remaining <= 0) {
      _commitSesTime();
      _stopSesTimer();
      _showDayLock();
    }
  }, 1000);
}

function _stopSesTimer() {
  if (sesTimer) { clearInterval(sesTimer); sesTimer = null; }
  _commitSesTime();
}

function _commitSesTime() {
  if (sesStart === null) return;
  const elapsed = Math.floor((Date.now() - sesStart) / 1000);
  S.todayUsed = Math.min(SESSION_SECS, S.todayUsed + elapsed);
  sesStart = null;
  save();
}

// ══════════════════════════════════════════════════════
// DAY LOCK SCREEN
// ══════════════════════════════════════════════════════
function _showDayLock() {
  _stopSesTimer();
  _stopQTimer();
  showScreen('screen-daylocked');
  $('daylock-xp').textContent = S.xp;
  _tickDaylock();
  if (daylockInterval) clearInterval(daylockInterval);
  daylockInterval = setInterval(_tickDaylock, 1000);
}

function _tickDaylock() {
  const now = new Date();
  const midnight = new Date(); midnight.setHours(24, 0, 0, 0);
  const secs = Math.max(0, Math.floor((midnight - now) / 1000));
  $('daylock-countdown').textContent = fmtHMS(secs);
  if (secs === 0) { clearInterval(daylockInterval); _checkDayReset(); boot(); }
}

// ══════════════════════════════════════════════════════
// PIN LOCK SCREEN
// ══════════════════════════════════════════════════════
let pinBuf = '';

function pinInput(d) {
  if (pinBuf.length >= 4) return;
  pinBuf += d;
  _syncDots('dot', pinBuf.length);
  if (pinBuf.length === 4) setTimeout(_checkPin, 120);
}

function pinDelete() {
  if (!pinBuf.length) return;
  pinBuf = pinBuf.slice(0, -1);
  _syncDots('dot', pinBuf.length);
}

function _checkPin() {
  if (pinBuf === S.pin) {
    pinBuf = '';
    _syncDots('dot', 0);
    $('pin-error').textContent = '';
    S.onboarded ? goHome() : showScreen('screen-onboard');
  } else {
    $('pin-error').textContent = 'Incorrect PIN';
    const dotsEl = $('pin-dots');
    dotsEl.style.animation = 'shake .4s ease';
    setTimeout(() => {
      dotsEl.style.animation = '';
      pinBuf = '';
      _syncDots('dot', 0);
    }, 500);
  }
}

function _syncDots(prefix, count) {
  for (let i = 0; i < 4; i++)
    $(`${prefix}${i}`)?.classList.toggle('filled', i < count);
}

// ══════════════════════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════════════════════
function handleAvatarUpload(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    S.avatar = ev.target.result;
    $('avatar-preview').src = S.avatar;
    $('avatar-preview').style.display = 'block';
    $('avatar-placeholder').style.display = 'none';
  };
  r.readAsDataURL(f);
}

function startOnboard() {
  const name = $('ob-name').value.trim();
  if (!name) {
    $('ob-name').style.borderColor = 'var(--accent2)';
    $('ob-name').placeholder = 'Enter your name!';
    setTimeout(() => { $('ob-name').style.borderColor = ''; }, 1500);
    return;
  }
  S.name = name;
  S.onboarded = true;
  save();
  goHome();
}

// ══════════════════════════════════════════════════════
// HOME SCREEN
// ══════════════════════════════════════════════════════
function goHome() {
  _checkDayReset();
  if (_isDayLocked()) { _showDayLock(); return; }
  showScreen('screen-home');
  _startSesTimer();
}

function _refreshHome() {
  // Avatar
  const av = $('home-avatar');
  if (S.avatar) {
    av.style.backgroundImage = `url(${S.avatar})`;
    av.textContent = '';
  } else {
    av.style.backgroundImage = '';
    av.style.cssText += ';display:flex;align-items:center;justify-content:center;font-family:var(--head);font-size:18px;font-weight:800;color:var(--accent)';
    av.textContent = S.name ? S.name[0].toUpperCase() : '⚡';
  }

  $('home-greeting').textContent = greeting();
  $('home-name').textContent = S.name || 'Forger';

  const remaining = _secsLeft();
  $('session-display').textContent = fmtMSS(remaining);
  $('time-left-big').textContent = Math.ceil(remaining / 60);
  $('done-count').textContent = S.todayDone;
  $('streak-count').textContent = S.streak;

  const acc = S.answeredTotal > 0 ? Math.round(S.correctTotal / S.answeredTotal * 100) : 0;
  $('stat-xp').textContent = S.xp;
  $('stat-level').textContent = S.level;
  $('stat-correct').textContent = acc + '%';

  _updateRing(S.todayUsed);
  _renderCatGrid();
}

function _updateRing(usedSecs) {
  const pct = Math.min(100, Math.round(usedSecs / SESSION_SECS * 100));
  const circ = 213;
  const fill = $('ring-fill');
  const pctEl = $('ring-pct');
  if (fill) fill.style.strokeDashoffset = circ - circ * pct / 100;
  if (pctEl) pctEl.textContent = pct + '%';
}

function _renderCatGrid() {
  const grid = $('cat-grid');
  grid.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const d = document.createElement('div');
    d.className = 'cat-card';
    d.style.cssText = `border-color:${cat.color}44;--cat-clr:${cat.color}`;
    d.innerHTML =
      `<div class="cat-icon">${cat.icon}</div>
       <div class="cat-name">${cat.name}</div>
       <div class="cat-desc">${cat.desc}</div>
       <div class="cat-xp-tag" style="color:${cat.color}">${cat.questions.length} questions</div>`;
    d.onclick = () => startGame(cat.id);
    grid.appendChild(d);
  });
}

// ══════════════════════════════════════════════════════
// GAME SCREEN
// ══════════════════════════════════════════════════════
function startGame(id) {
  _checkDayReset();
  if (_isDayLocked()) { _showDayLock(); return; }

  const cat = CATEGORIES.find(c => c.id === id);
  if (!cat) return;

  catId      = id;
  questions  = shuffle(cat.questions).slice(0, Q_PER_GAME);
  qIdx       = 0;
  pts        = 0;
  wrongs     = [];
  qCorrect   = 0;
  qAnswered  = 0;
  qTimes     = [];

  $('gm-cat').textContent = `${cat.icon} ${cat.name}`;
  showScreen('screen-game');
  // timer is already running; keep it going
  _loadQuestion();
}

function _loadQuestion() {
  didAnswer = false;
  const q = questions[qIdx];

  $('gm-qnum').textContent  = `${qIdx + 1}/${questions.length}`;
  $('gm-pts').textContent   = `${pts} pts`;
  $('q-type-tag').textContent = q.type || 'QUESTION';
  $('q-diff-tag').textContent = (q.diff || 'medium').toUpperCase();
  $('q-diff-tag').className   = `q-diff-tag diff-${q.diff || 'medium'}`;
  $('q-text').textContent     = q.text;

  const ctx = $('q-context');
  ctx.textContent = q.context || '';
  ctx.style.display = q.context ? 'block' : 'none';

  const code = $('code-block');
  if (q.code) { code.innerHTML = q.code; code.style.display = 'block'; }
  else code.style.display = 'none';

  // Options
  const list = $('options-list');
  list.innerHTML = '';
  ['A','B','C','D'].forEach((ltr, i) => {
    if (i >= q.options.length) return;
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.innerHTML = `<span class="opt-letter">${ltr}</span><span>${q.options[i]}</span>`;
    btn.onclick = () => _selectAnswer(i);
    list.appendChild(btn);
  });

  $('explain-panel').style.display = 'none';
  $('explain-panel').innerHTML = '';
  $('next-q-btn').style.display = 'none';
  $('question-scroll').scrollTop = 0;

  _startQTimer();
  qStart = Date.now();
}

function _selectAnswer(idx) {
  if (didAnswer) return;
  didAnswer = true;
  _stopQTimer();

  const q = questions[qIdx];
  const taken = Math.round((Date.now() - qStart) / 1000);
  qTimes.push(taken);
  qAnswered++;
  S.answeredTotal++;

  const correct = idx === q.answer;
  const btns = $('options-list').querySelectorAll('.opt-btn');
  btns.forEach((b, i) => {
    b.classList.add('disabled');
    if (i === q.answer) b.classList.add('correct');
    else if (i === idx) b.classList.add('wrong');
  });

  let earned = 0;
  if (correct) {
    qCorrect++;
    S.correctTotal++;
    earned = XP_MAP[q.diff] || XP_MAP.medium;
    if (taken < 10) earned += SPEED_BONUS;
    pts += earned;
  } else {
    wrongs.push({ q: q.text, correct: q.options[q.answer] });
  }

  const panel = $('explain-panel');
  panel.style.display = 'block';
  panel.innerHTML =
    `<div class="explain-verdict" style="color:${correct ? 'var(--accent4)' : 'var(--accent2)'}">
       ${correct ? '✓ Correct' : '✗ Wrong'}
       ${earned ? `<span style="color:var(--accent);font-size:13px;margin-left:8px">+${earned} XP</span>` : ''}
     </div>
     <div class="explain-body">${q.explain || ''}</div>
     ${q.complexity ? `<div class="explain-complexity">⏱ ${q.complexity}</div>` : ''}`;

  $('gm-pts').textContent = `${pts} pts`;
  $('next-q-btn').style.display = 'block';
}

function nextQuestion() {
  S.todayDone++;
  qIdx++;
  if (qIdx >= questions.length) { _finishGame(); return; }
  _loadQuestion();
  $('question-scroll').scrollTop = 0;
}

function confirmBack() {
  if (confirm('Quit this session? Progress will be lost.')) {
    _stopQTimer();
    goHome();
  }
}

function _finishGame() {
  _stopQTimer();

  const oldLevel = S.level;
  S.xp   += pts;
  S.level  = calcLevel(S.xp);
  S.sessions++;

  // Streak
  const today = todayStr();
  if (S.lastPlay !== today) {
    const yest = new Date(); yest.setDate(yest.getDate() - 1);
    const yStr = yest.toISOString().slice(0, 10);
    S.streak = (S.lastPlay === yStr || S.lastPlay === '') ? S.streak + 1 : 1;
    S.lastPlay = today;
  }
  save();
  _showResults(oldLevel);
}

// ── Question timer ────────────────────────────────────
function _startQTimer() {
  _stopQTimer();
  qLeft = Q_TIME;
  _drawQTimer();
  qTimer = setInterval(() => {
    qLeft--;
    _drawQTimer();
    if (qLeft <= 0) { _stopQTimer(); _timeOut(); }
  }, 1000);
}

function _stopQTimer() {
  if (qTimer) { clearInterval(qTimer); qTimer = null; }
}

function _drawQTimer() {
  $('q-timer-num').textContent = qLeft;
  $('q-timer-fill').style.width = (qLeft / Q_TIME * 100) + '%';
  const clr = qLeft > 15 ? 'var(--accent)' : qLeft > 7 ? 'var(--gold)' : 'var(--accent2)';
  $('q-timer-fill').style.background = clr;
  $('q-timer-num').style.color = clr;
}

function _timeOut() {
  if (didAnswer) return;
  didAnswer = true;
  qAnswered++;
  S.answeredTotal++;
  qTimes.push(Q_TIME);

  const q = questions[qIdx];
  $('options-list').querySelectorAll('.opt-btn').forEach((b, i) => {
    b.classList.add('disabled');
    if (i === q.answer) b.classList.add('correct');
  });
  wrongs.push({ q: q.text, correct: q.options[q.answer] });

  const panel = $('explain-panel');
  panel.style.display = 'block';
  panel.innerHTML =
    `<div class="explain-verdict" style="color:var(--accent2)">⏱ Time's Up!</div>
     <div class="explain-body">${q.explain || ''}</div>
     ${q.complexity ? `<div class="explain-complexity">⏱ ${q.complexity}</div>` : ''}`;
  $('next-q-btn').style.display = 'block';
}

// ══════════════════════════════════════════════════════
// RESULTS SCREEN
// ══════════════════════════════════════════════════════
function _showResults(oldLevel) {
  const cat  = CATEGORIES.find(c => c.id === catId);
  const tot  = questions.length;
  const acc  = tot > 0 ? Math.round(qCorrect / tot * 100) : 0;
  const avg  = qTimes.length > 0 ? Math.round(qTimes.reduce((a,b) => a+b, 0) / qTimes.length) : 0;

  let icon = '💀', title = 'Keep Grinding';
  if (acc >= 90) { icon = '🏆'; title = 'Legendary!'; }
  else if (acc >= 70) { icon = '🔥'; title = 'Crushing It!'; }
  else if (acc >= 50) { icon = '⚡'; title = 'Making Progress'; }
  if (S.level > oldLevel) { icon = '⬆️'; title = '🎉 Level Up!'; }

  $('res-icon').textContent   = icon;
  $('res-title').textContent  = title;
  $('res-cat').textContent    = cat ? `${cat.icon} ${cat.name}` : '';
  $('res-xp').textContent     = pts;
  $('rb-correct').textContent = `${qCorrect}/${tot}`;
  $('rb-acc').textContent     = acc + '%';
  $('rb-time').textContent    = avg + 's';

  // Level progress bar
  const lvl = S.level;
  const lo  = xpFloor(lvl), hi = xpCeiling(lvl);
  const barPct = hi > lo ? Math.min(100, Math.round((S.xp - lo) / (hi - lo) * 100)) : 100;
  $('xlb-level').textContent  = lvl;
  $('xlb-xp-txt').textContent = `${S.xp}/${hi}`;
  setTimeout(() => { $('xlb-fill').style.width = barPct + '%'; }, 120);

  // Wrong answers review
  const sec = $('res-wrong-section');
  if (wrongs.length) {
    sec.innerHTML = '<div class="wrong-header">REVIEW — MISSED</div>' +
      wrongs.map(w =>
        `<div class="wrong-item">
           <div class="wrong-q">${w.q}</div>
           <div class="wrong-ans">✓ ${w.correct}</div>
         </div>`
      ).join('');
  } else {
    sec.innerHTML = '<div style="text-align:center;color:var(--accent4);font-family:var(--mono);font-size:13px;padding:16px">✓ Perfect score!</div>';
  }

  showScreen('screen-results');
}

function playAgain() {
  if (_isDayLocked()) { _showDayLock(); return; }
  startGame(catId);
}

// ══════════════════════════════════════════════════════
// PROFILE SCREEN
// ══════════════════════════════════════════════════════
function _populateProfile() {
  _stopSesTimer(); // pause time while in profile

  const av = $('profile-avatar');
  if (S.avatar) {
    av.style.backgroundImage = `url(${S.avatar})`;
    av.textContent = '';
  } else {
    av.style.backgroundImage = '';
    av.textContent = S.name ? S.name[0].toUpperCase() : '⚡';
  }

  $('profile-name-input').value = S.name;

  const acc = S.answeredTotal > 0 ? Math.round(S.correctTotal / S.answeredTotal * 100) : 0;
  $('ps-xp').textContent      = S.xp;
  $('ps-level').textContent   = S.level;
  $('ps-streak').textContent  = S.streak;
  $('ps-correct').textContent = S.correctTotal;
  $('ps-acc').textContent     = acc + '%';
  $('ps-sessions').textContent = S.sessions;

  // Auth toggle
  const on = S.pinEnabled && S.pin;
  $('auth-track').classList.toggle('on', on);
  $('pin-setup-section').style.display = on ? 'block' : 'none';
  if (on) {
    $('pin-setup-label').textContent = 'Change your PIN';
    $('remove-pin-btn').style.display = 'block';
  } else {
    $('remove-pin-btn').style.display = 'none';
  }
}

function handleProfileAvatarUpload(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    S.avatar = ev.target.result;
    const av = $('profile-avatar');
    av.style.backgroundImage = `url(${S.avatar})`;
    av.textContent = '';
    save();
  };
  r.readAsDataURL(f);
}

function saveName() {
  const name = $('profile-name-input').value.trim();
  if (!name) return;
  S.name = name;
  save();
  const btn = document.querySelector('.profile-save-name');
  btn.textContent = '✓ Saved';
  setTimeout(() => { btn.textContent = 'Save'; }, 1500);
}

function resetData() {
  if (!confirm('Reset ALL progress? Cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  S = {
    name:'', avatar:'', xp:0, level:1,
    streak:0, lastPlay:'', correctTotal:0, answeredTotal:0, sessions:0,
    pin:'', pinEnabled:false,
    todayDate:'', todayUsed:0, todayDone:0, onboarded:false
  };
  _stopSesTimer(); _stopQTimer();
  boot();
}

// ── PIN Setup (profile) ───────────────────────────────
let setupBuf = '', setupStep = 'first', setupFirst = '';

function toggleAuth() {
  if (S.pinEnabled && S.pin) {
    S.pinEnabled = false; S.pin = '';
    save();
    $('auth-track').classList.remove('on');
    $('pin-setup-section').style.display = 'none';
  } else {
    $('auth-track').classList.add('on');
    $('pin-setup-section').style.display = 'block';
    $('remove-pin-btn').style.display = 'none';
    _resetSetup();
  }
}

function _resetSetup() {
  setupBuf = ''; setupStep = 'first'; setupFirst = '';
  _syncDots('sd', 0);
  $('pin-setup-label').textContent  = 'Set a 4-digit PIN';
  $('pin-setup-status').textContent = '';
}

function setupPinInput(d) {
  if (setupBuf.length >= 4) return;
  setupBuf += d;
  _syncDots('sd', setupBuf.length);
  if (setupBuf.length < 4) return;

  setTimeout(() => {
    if (setupStep === 'first') {
      setupFirst = setupBuf; setupBuf = ''; setupStep = 'confirm';
      _syncDots('sd', 0);
      $('pin-setup-label').textContent  = 'Confirm your PIN';
      $('pin-setup-status').textContent = '';
    } else {
      if (setupBuf === setupFirst) {
        S.pin = setupBuf; S.pinEnabled = true; save();
        $('pin-setup-status').style.color = 'var(--accent4)';
        $('pin-setup-status').textContent = '✓ PIN set!';
        $('pin-setup-label').textContent  = 'PIN active';
        $('remove-pin-btn').style.display = 'block';
        _syncDots('sd', 4);
      } else {
        $('pin-setup-status').style.color = 'var(--accent2)';
        $('pin-setup-status').textContent = "PINs don't match. Try again.";
        _resetSetup();
      }
    }
  }, 120);
}

function setupPinDelete() {
  if (!setupBuf.length) return;
  setupBuf = setupBuf.slice(0, -1);
  _syncDots('sd', setupBuf.length);
}

function removePin() {
  if (!confirm('Remove PIN lock?')) return;
  S.pin = ''; S.pinEnabled = false; save();
  $('auth-track').classList.remove('on');
  $('pin-setup-section').style.display = 'none';
}

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', boot);

// Cordova device-ready hook (no-op in browser)
document.addEventListener('deviceready', () => {
  if (window.StatusBar) {
    StatusBar.backgroundColorByHexString('#0a0a0f');
    StatusBar.styleLightContent();
  }
}, false);
