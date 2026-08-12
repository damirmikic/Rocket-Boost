/**
 * ==========================================================================
 * MERKUR XTIP — MYSTERY BET BOX ENGINE (Nedeljni Paket)
 * ==========================================================================
 */

import { state, t, MOCK_MATCHES } from './state.js';
import { renderBetslip, showToast, toggleBetslipDrawer } from './app.js';

function findBestPickInRange(match, minOdds, maxOdds) {
  const home = match.home || 'Domaćin';
  const away = match.away || 'Gost';
  const o = match.odds || {};

  const candidates = [
    { key: '1',      odds: o['1'],      label: `1 (${home})` },
    { key: '2',      odds: o['2'],      label: `2 (${away})` },
    { key: 'X',      odds: o['3'],      label: 'X (Nerešeno)' },
    { key: 'dc_1x',  odds: o['dc_1x'], label: '1X (Dvoznak)' },
    { key: 'dc_x2',  odds: o['dc_x2'], label: 'X2 (Dvoznak)' },
    { key: 'GG',     odds: o['363'],    label: 'GG (Oba daju gol)' },
    { key: 'ah_15',  odds: o['ah_15'], label: 'AH -1.5 (Hendikep)' },
    { key: '291',    odds: o['291'],    label: '4+ Gola' },
  ];

  const valid = candidates.filter(c => c.odds != null && c.odds >= minOdds && c.odds <= maxOdds);
  if (valid.length === 0) return null;

  // Pick the one closest to the range midpoint for balance
  const mid = (minOdds + maxOdds) / 2;
  valid.sort((a, b) => Math.abs(a.odds - mid) - Math.abs(b.odds - mid));
  return { selectionKey: valid[0].key, odds: valid[0].odds, displayName: valid[0].label };
}

/**
 * Shuffle array in place (Fisher-Yates)
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a picks array of `count` selections from matches where each pick
 * has at least one odds value falling in [minOdds, maxOdds].
 */
function buildPicksList(matches, count, minOdds, maxOdds) {
  const pool = shuffleArray([...matches]);
  const picks = [];
  for (const match of pool) {
    if (picks.length >= count) break;
    const pick = findBestPickInRange(match, minOdds, maxOdds);
    if (!pick) continue;
    picks.push({
      id: Date.now() + Math.random(),
      match: `${match.home} vs ${match.away}`,
      matchId: match.id,
      selection: pick.displayName,
      selectionKey: pick.selectionKey,
      baseOdds: parseFloat(pick.odds.toFixed(2)),
      boostedOdds: parseFloat(pick.odds.toFixed(2)),
      slotBoostPercent: 0,
      isBoosted: false,
      hasCrashed: false,
      isEligible: true,
      marketGroup: '1x2',
      isLowMargin: false,
      sport: 'football',
      league: match.leagueName || ''
    });
  }
  return picks;
}

/**
 * Main generator — creates all 3 ticket types from live feed matches.
 */
function generateMysteryTicketPackage() {
  const matches = (state.allMatches && state.allMatches.length > 0)
    ? state.allMatches
    : MOCK_MATCHES;

  // Sigurica: 3–5 picks, odds 1.15–1.40
  const safeCount = 3 + Math.floor(Math.random() * 3); // 3,4, or 5
  const safePicks = buildPicksList(matches, safeCount, 1.15, 1.40);

  // Srednji rizik: 4–7 picks, odds 1.45–2.00
  const medCount = 4 + Math.floor(Math.random() * 4); // 4–7
  const medPicks = buildPicksList(matches, medCount, 1.45, 2.00);

  // Ludi vikend: 4–6 picks, odds > 2.80
  const crazyCount = 4 + Math.floor(Math.random() * 3); // 4–6
  const crazyPicks = buildPicksList(matches, crazyCount, 2.81, 99);

  return {
    safe:   { type: 'safe',   picks: safePicks },
    medium: { type: 'medium', picks: medPicks },
    crazy:  { type: 'crazy',  picks: crazyPicks }
  };
}

function calcTicketTotalOdds(picks) {
  if (!picks || picks.length === 0) return 1;
  return picks.reduce((acc, p) => acc * p.boostedOdds, 1);
}

// ---- UI Functions ----

export function openMysteryBetBox() {
  const modal = document.getElementById('mystery-bet-box-modal');
  if (!modal) return;

  // Generate fresh ticket package
  state.mysteryBox.generatedPackage = generateMysteryTicketPackage();
  state.mysteryBox.phase = 'pick';
  state.mysteryBox.selectedBoxIndex = null;
  state.mysteryBox.revealedTicket = null;

  // Shuffle which type is in which box position so it's truly random
  const types = ['safe', 'medium', 'crazy'];
  shuffleArray(types);
  state.mysteryBox.boxOrder = types; // e.g. ['crazy', 'safe', 'medium']

  state.mysteryBox.isOpen = true;
  renderMysteryBoxModal();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeMysteryBetBox() {
  const modal = document.getElementById('mystery-bet-box-modal');
  if (modal) modal.classList.remove('active');
  state.mysteryBox.isOpen = false;
  document.body.style.overflow = '';
}

export function refreshMysteryBoxes() {
  state.mysteryBox.generatedPackage = generateMysteryTicketPackage();
  state.mysteryBox.phase = 'pick';
  state.mysteryBox.selectedBoxIndex = null;
  state.mysteryBox.revealedTicket = null;
  const types = ['safe', 'medium', 'crazy'];
  shuffleArray(types);
  state.mysteryBox.boxOrder = types;
  renderMysteryBoxModal();
}

export function pickMysteryBox(boxIndex) {
  if (state.mysteryBox.phase !== 'pick') return;

  const type = state.mysteryBox.boxOrder[boxIndex]; // 'safe' | 'medium' | 'crazy'
  const pkg = state.mysteryBox.generatedPackage;
  if (!pkg) return;

  const ticketData = pkg[type];
  const totalOdds = calcTicketTotalOdds(ticketData.picks);

  const labels = {
    safe:   t('mysteryBoxSafeLabel'),
    medium: t('mysteryBoxMediumLabel'),
    crazy:  t('mysteryBoxCrazyLabel')
  };
  const emojis = { safe: '🛡️', medium: '⚖️', crazy: '💥' };
  const accentColors = { safe: '#2ecc71', medium: '#f39c12', crazy: '#e74c3c' };

  state.mysteryBox.selectedBoxIndex = boxIndex;
  state.mysteryBox.revealedTicket = {
    type,
    label: labels[type],
    emoji: emojis[type],
    accentColor: accentColors[type],
    picks: ticketData.picks,
    totalOdds
  };
  state.mysteryBox.phase = 'reveal';

  // Animate selected box before re-render
  const boxes = document.querySelectorAll('.mbox-chest');
  if (boxes[boxIndex]) {
    boxes[boxIndex].classList.add('mbox-opening');
    setTimeout(() => renderMysteryBoxModal(), 600);
  } else {
    renderMysteryBoxModal();
  }
}

export function addMysteryTicketToSlip() {
  const ticket = state.mysteryBox.revealedTicket;
  if (!ticket || !ticket.picks || ticket.picks.length === 0) return;

  // Mutual exclusion: clear existing boosts
  if (state.slot && state.slot.slotBoostActive) {
    state.slot.slotBoostActive = false;
    state.slot.boostValue = 0;
    state.slot.lastOutcomeMessage = null;
  }
  if (state.basketBoostActive) {
    state.basketBoostActive = false;
    state.basketBoostWinnerId = null;
  }

  // Replace current selections with mystery picks
  state.selections = ticket.picks.map(p => ({ ...p }));
  state.currentBet = state.selections[0] || null;
  state.mysteryBox.isMysteryTicketActive = true;

  closeMysteryBetBox();
  renderBetslip();
  showToast(`🎁 ${ticket.label} tiket dodat na betslip! Ukupna kvota: ${ticket.totalOdds.toFixed(2)}`, 'success');

  // On mobile, open the betslip drawer
  if (window.innerWidth <= 768) {
    setTimeout(() => toggleBetslipDrawer(true), 300);
  }
}

function renderMysteryBoxModal() {
  const body = document.getElementById('mystery-box-modal-body');
  if (!body) return;

  const phase = state.mysteryBox.phase;

  if (phase === 'pick') {
    body.innerHTML = renderMysteryPickPhase();
  } else {
    body.innerHTML = renderMysteryRevealPhase();
  }
}

function renderMysteryPickPhase() {
  return `
    <div class="mbox-prompt">${t('mysteryBoxPickPrompt')}</div>
    <div class="mbox-chests-row">
      ${[0, 1, 2].map(i => `
        <div class="mbox-chest" onclick="pickMysteryBox(${i})" title="Klikni da otvoriš!">
          <div class="mbox-chest-lid"></div>
          <div class="mbox-chest-body">
            <div class="mbox-question-mark">?</div>
          </div>
          <div class="mbox-chest-label">Kutija ${i + 1}</div>
        </div>
      `).join('')}
    </div>
    <div class="mbox-footer-row">
      <button class="mbox-btn mbox-btn-secondary" onclick="refreshMysteryBoxes()">
        ${t('mysteryBoxRefresh')}
      </button>
      <button class="mbox-btn mbox-btn-ghost" onclick="closeMysteryBetBox()">
        ${t('mysteryBoxClose')}
      </button>
    </div>
  `;
}

function renderMysteryRevealPhase() {
  const ticket = state.mysteryBox.revealedTicket;
  if (!ticket) return '';

  const totalOdds = ticket.totalOdds.toFixed(2);
  const picksHTML = ticket.picks.map(p => `
    <div class="mbox-pick-row">
      <div class="mbox-pick-match">${p.match}</div>
      <div class="mbox-pick-right">
        <span class="mbox-pick-sel">${p.selection}</span>
        <span class="mbox-pick-odds" style="color:${ticket.accentColor}">${p.boostedOdds.toFixed(2)}</span>
      </div>
    </div>
  `).join('');

  const warningHTML = `
    <div class="mbox-conflict-note">
      ⚠️ ${t('mysteryBoxConflict')}
    </div>
  `;

  return `
    <div class="mbox-reveal-header">
      <div class="mbox-reveal-icon" style="color:${ticket.accentColor}">${ticket.emoji}</div>
      <div class="mbox-reveal-label" style="color:${ticket.accentColor}">${ticket.label}</div>
    </div>
    <div class="mbox-reveal-odds-banner">
      <span>${t('mysteryBoxTotalOdds')}:</span>
      <strong style="color:${ticket.accentColor}; font-size:1.5rem;">${totalOdds}</strong>
      <span style="color:var(--text-muted); font-size:0.8rem;">(${ticket.picks.length} ${t('mysteryBoxMatches')})</span>
    </div>
    <div class="mbox-picks-list">
      ${picksHTML}
    </div>
    ${warningHTML}
    <div class="mbox-footer-row">
      <button class="mbox-btn mbox-btn-primary" onclick="addMysteryTicketToSlip()">
        ${t('mysteryBoxAddToSlip')}
      </button>
      <button class="mbox-btn mbox-btn-secondary" onclick="refreshMysteryBoxes()">
        ${t('mysteryBoxRefresh')}
      </button>
      <button class="mbox-btn mbox-btn-ghost" onclick="closeMysteryBetBox()">
        ${t('mysteryBoxClose')}
      </button>
    </div>
  `;
}
