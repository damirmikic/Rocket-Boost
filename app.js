/**
 * ==========================================================================
 * MERKUR XTIP — ROCKET BOOST GAME ENGINE
 * Handles betting slip interactions and Rocket Aviator physics.
 * Global state, i18n, and audio synthesis live in state.js / audio.js.
 * ==========================================================================
 */

import { state, i18n, MOCK_MATCHES, MOCK_BASKETBALL_PLAYERS, t, getSelectionDisplayName } from './state.js';
import { playLaunchSound, playTickSound, playSuccessSound, playCrashSound } from './audio.js';
import { fetchMerkurFeed, fetchMerkurBasketballFeed } from './feed.js';
import { openMysteryBetBox, closeMysteryBetBox, refreshMysteryBoxes, pickMysteryBox, addMysteryTicketToSlip } from './mystery-box.js';
import { switchViewMode, initSwipeDeck, setSwipeCardPick, swipeRight, swipeLeft, swipeUndo } from './swipe.js';
import { selectBasketOdds, selectBasketballPlayersCategory, toggleFootballMenu, renderBasketballPlayers, renderSidebar, updateLanguageUI, resetBasketBoost, runBasketBoostRoulette } from './render-board.js';
import { renderParlaySlotWidget, showParlaySlotPromoModal, closeParlaySlotPromoModal, spinParlaySlot, resetSlotSpins, quickAddThreePairs, updateSlotOverride, removeBet } from './parlay-slot.js';
import { openRocketArena, launchPairTurbo, stopRocket, isTurboAttemptUsed, resetTurboAttempts } from './rocket.js';
import { openProfitabilitySimulator, closeProfitabilitySimulator, setSimTrials, updateMarketMargin, toggleSimDms, updateVipTier, runMonteCarloSimulation } from './simulator.js';
import { checkAuthStateOnInit, handleAuthSubmit, togglePasswordVisibility, handleLogout } from './auth.js';



// ============================================================================
// GLOBAL TOAST NOTIFICATION UTILITY
// ============================================================================
/**
 * Shows a temporary toast notification.
 * @param {string} message - Message to display
 * @param {'success'|'error'|'info'} type - Visual type
 */
export function showToast(message, type = 'info') {
  // Remove any existing toast
  const existing = document.getElementById('global-toast-notification');
  if (existing) existing.remove();

  const colors = {
    success: { bg: 'rgba(46, 204, 113, 0.15)', border: 'rgba(46, 204, 113, 0.5)', text: '#2ecc71' },
    error:   { bg: 'rgba(231, 76, 60, 0.15)', border: 'rgba(231, 76, 60, 0.5)', text: '#e74c3c' },
    info:    { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.5)', text: '#d8b4fe' }
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.id = 'global-toast-notification';
  toast.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${c.bg}; border: 1px solid ${c.border}; color: ${c.text};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    padding: 12px 22px; border-radius: 10px; font-size: 0.85rem; font-weight: 700;
    z-index: 999999; max-width: 90vw; text-align: center; line-height: 1.4;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    transition: opacity 0.3s ease, transform 0.3s ease; opacity: 0;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Auto-dismiss after 3.5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// ============================================================================
// UI & BETSLIP UPDATE FUNCTIONS
// ============================================================================
export function translateCurrentBetSelection() {
  if (!state.currentBet) return;
  const bet = state.currentBet;
  const parts = bet.match.split(' vs ');
  if (parts.length !== 2) return;
  const home = parts[0];
  const away = parts[1];

  let selectionKey = null;
  if (bet.selection.startsWith('1 (')) selectionKey = '1';
  else if (bet.selection.startsWith('2 (')) selectionKey = '2';
  else if (bet.selection.includes('Nerešeno') || bet.selection.includes('Draw')) selectionKey = 'X';
  else if (bet.selection.includes('0-2 Gola') || bet.selection.includes('0-2 Goals')) selectionKey = '0-2';
  else if (bet.selection.includes('3+ Gola') || bet.selection.includes('3+ Goals')) selectionKey = '3+';
  else if (bet.selection.includes('4+ Gola') || bet.selection.includes('4+ Goals')) selectionKey = '4+';
  else if (bet.selection.includes('Oba daju gol') || bet.selection.includes('Both Teams to Score')) selectionKey = 'GG';

  if (selectionKey) bet.selection = getSelectionDisplayName(selectionKey, home, away);
}






export function resetAllOddsToDefault() {
  document.querySelectorAll('.odds-btn').forEach(btn => {
    if (btn.dataset.defaultHtml) {
      btn.innerHTML = btn.dataset.defaultHtml;
    }
    btn.classList.remove('selected', 'boost-locked-in');
  });
  
  if (state.game.isRunning) {
    state.game.isRunning = false;
    cancelAnimationFrame(state.game.animationFrameId);
  }
  const overlay = document.getElementById('odds-flight-overlay');
  if (overlay) overlay.classList.remove('active');
  
  const toast = document.getElementById('flight-outcome-toast');
  if (toast) toast.className = 'flight-outcome-toast';
}

export function selectOdds(btnEl, matchName, selectionName, oddsValue, marketGroup = 'classic', isLowMargin = false, sport = 'football') {
  // If clicking the already selected button, toggle/reset selection
  if (btnEl.classList.contains('selected')) {
    btnEl.classList.remove('selected');
    removeSelectionFromParlay(matchName);
    return;
  }
  
  // Find all buttons for this exact match row and unselect them (since 1 selection per match on a parlay)
  const matchRow = btnEl.closest('.match-row');
  if (matchRow) {
    matchRow.querySelectorAll('.odds-btn.selected').forEach(b => b.classList.remove('selected'));
  }
  btnEl.classList.add('selected');
  
  // Remove existing selection for this match if already present
  if (!state.selections) state.selections = [];
  const existingIdx = state.selections.findIndex(s => s.match === matchName);
  if (existingIdx !== -1) {
    state.selections.splice(existingIdx, 1);
  }
  
  // Add new selection
  const newSel = {
    id: Date.now() + Math.random(),
    match: matchName,
    selection: selectionName,
    baseOdds: parseFloat(oddsValue),
    boostedOdds: parseFloat(oddsValue),
    slotBoostPercent: 0,
    isBoosted: false,
    hasCrashed: false,
    isEligible: !isLowMargin && marketGroup === '1x2',
    marketGroup: marketGroup || 'classic',
    isLowMargin: !!isLowMargin,
    sport: sport || state.currentSport || 'football'
  };
  
  state.selections.push(newSel);
  
  // Maintain state.currentBet pointing to the first selection for backwards compatibility with single bet Turbo X
  if (state.selections.length > 0) {
    state.currentBet = state.selections[0];
  } else {
    state.currentBet = null;
  }
  
  // Reapply slot boost if active
  if (state.slot && state.slot.slotBoostActive) {
    reapplySlotBoost();
  }
  
  renderBetslip();
}

export function removeSelectionFromParlay(matchName) {
  if (!state.selections) return;
  const idx = state.selections.findIndex(s => s.match === matchName);
  if (idx !== -1) {
    state.selections.splice(idx, 1);
  }
  
  // Unselect button on the board
  document.querySelectorAll('.match-row').forEach(row => {
    const titleEl = row.querySelector('.match-teams');
    if (titleEl && titleEl.textContent.replace(/\s+/g, ' ').includes(matchName.replace(' vs ', ' '))) {
      row.querySelectorAll('.odds-btn.selected').forEach(b => b.classList.remove('selected'));
    }
  });
  
  if (state.selections.length === 0) {
    state.currentBet = null;
    resetAllOddsToDefault();
    // Reset Mystery Box active flag when betslip is cleared
    if (state.mysteryBox) state.mysteryBox.isMysteryTicketActive = false;
  } else {
    state.currentBet = state.selections[0];
  }
  
  if (state.slot && state.slot.slotBoostActive) {
    reapplySlotBoost();
  }
  
  renderBetslip();
}

export function reapplySlotBoost() {
  if (!state.selections || !state.slot) return;
  
  if (!state.slot.slotBoostActive || state.slot.boostValue <= 0) {
    state.selections.forEach(sel => {
      if (!sel.hasCrashed && (sel.isTurboBoosted || state.parlayTurboActive) && !sel.isLowMargin) {
        sel.isBoosted = true;
        const p = sel.turboPercent || state.parlayTurboPercent || 0;
        sel.boostedOdds = parseFloat((sel.baseOdds * (1 + p / 100)).toFixed(2));
      } else if (!sel.hasCrashed && !sel.isBoostedByRocket) {
        sel.isBoosted = false;
        sel.boostedOdds = sel.baseOdds;
        sel.slotBoostPercent = 0;
      }
    });
    return;
  }

  const boostVal = state.slot.boostValue;
  const boostType = state.slot.boostType;

  state.selections.forEach(sel => {
    // CRITICAL RISK MITIGATION RULE:
    // Isključiti markete sa niskim marginama (azijski hendikepi, dvoznaci) iz ove promocije.
    if (sel.isLowMargin) {
      sel.isSlotEligible = false;
      sel.slotBoostPercent = 0;
      if (!sel.isTurboBoosted) {
        sel.isBoosted = false;
        sel.boostedOdds = sel.baseOdds;
      }
      return;
    }

    let applies = false;
    if (boostType === 'joker_max') {
      applies = true; // Tri džokera daju maksimalni boost na ceo tiket (na sve klasične markete)
    } else if (boostType === 'football' && sel.sport === 'football') {
      applies = true;
    } else if (boostType === 'basketball' && sel.sport === 'basketball_players') {
      applies = true;
    } else if (boostType === 'tennis' && sel.sport === 'tennis') {
      applies = true;
    }

    sel.isSlotEligible = applies;
    sel.slotBoostPercent = applies ? boostVal : 0;

    // Parlay Slot Boost applies to TOTAL TICKET ODDS, not individual pair odds.
    // Individual odds remain baseOdds unless Pair Turbo is active.
    if (sel.isTurboBoosted && !sel.isLowMargin) {
      sel.isBoosted = true;
      const p = sel.turboPercent || 0;
      sel.boostedOdds = parseFloat((sel.baseOdds * (1 + p / 100)).toFixed(2));
    } else {
      sel.isBoosted = false;
      sel.boostedOdds = sel.baseOdds;
    }
  });
}

export function getBasketBoostReduction(count) {
  if (count >= 12) return 4;
  if (count >= 8) return 3;
  if (count >= 6) return 2;
  if (count >= 4) return 1;
  return 0;
}

function updateBasketStake(val) {
  const num = parseFloat(val);
  if (!isNaN(num) && num >= 0) {
    state.basketStake = num;
    const currency = t('currencyCode');
    const totalWinEl = document.querySelector('.summary-row.total-win span:last-child');
    if (totalWinEl) {
      const selections = state.basketSelections;
      const totalOdds = selections.reduce((sum, sel) => sum * sel.odds, 1);
      totalWinEl.textContent = `${(num * totalOdds).toFixed(2)} ${currency}`;
    }
  }
}

function removeBasketSelection(playerId) {
  const idx = state.basketSelections.findIndex(sel => sel.playerId === playerId);
  if (idx !== -1) {
    state.basketSelections.splice(idx, 1);
    if (state.basketBoostActive) {
      resetBasketBoost();
    }
    renderBasketballPlayers();
    renderBetslip();
  }
}

function placeBasketBetFinal() {
  if (state.basketSelections.length === 0) return;
  const t = i18n[state.lang];
  const currency = t.currencyCode;

  const totalOdds = state.basketSelections.reduce((sum, sel) => sum * sel.odds, 1);
  const stake = state.basketStake || 1000;
  const totalWin = (stake * totalOdds).toFixed(2);

  let details = '';
  state.basketSelections.forEach(sel => {
    const selName = sel.selectionType === 'over' ? t.over : t.under;
    details += `• ${sel.playerName}: ${selName} [${sel.line}] (@${sel.odds.toFixed(2)})${sel.isBoosted ? ' (BOOSTED! ⚡)' : ''}\n`;
  });
  
  alert(`${t.placedModalTitle}\n\nSelections:\n${details}\nOdds: ${totalOdds.toFixed(2)}\nStake: ${stake} ${currency}\n${t.possibleWin} ${totalWin} ${currency}\n\n${t.placedModalSub}`);
  
  state.basketSelections = [];
  resetBasketBoost();
  renderBasketballPlayers();
  renderBetslip();
}

export function renderBetslip() {
  const container = document.getElementById('betslip-content-area');
  if (!container) return;
  
  const t = i18n[state.lang];
  const currency = t.currencyCode;
  const isSR = state.lang === 'sr';

  // Mobile bar elements
  const mobileBar = document.getElementById('mobile-betslip-bar');
  const mOddsEl = document.getElementById('m-betslip-odds');
  const mCountEl = document.getElementById('m-betslip-count');
  const mQuickLaunchBtn = document.getElementById('m-quick-launch-btn');
  
  // -------------------------------------------------------------
  // SPORT: BASKETBALL PLAYER PROPS
  // -------------------------------------------------------------
  if (state.currentSport === 'basketball_players') {
    const selections = state.basketSelections;
    
    if (selections.length === 0) {
      container.innerHTML = `<div class="betslip-empty">${t.emptyBetslip}</div>`;
      if (mobileBar) {
        mobileBar.classList.remove('active');
      }
      toggleBetslipDrawer(false);
      return;
    }
    
    const totalOdds = selections.reduce((sum, sel) => sum * sel.odds, 1);
    const stake = state.basketStake || 1000;
    const totalWin = (stake * totalOdds).toFixed(2);
    const overCount = selections.filter(sel => sel.selectionType === 'over').length;
    const pointsReduction = getBasketBoostReduction(overCount);
    
    // Sync values to mobile bottom bar
    if (mobileBar && mOddsEl && mCountEl) {
      const countText = selections.length === 1 
        ? (isSR ? '1 Par' : '1 Selection')
        : (isSR ? `${selections.length} Para` : `${selections.length} Selections`);
      mCountEl.textContent = countText;
      mOddsEl.textContent = `${isSR ? 'Kvota' : 'Odds'}: ${totalOdds.toFixed(2)}`;
      mobileBar.classList.add('active');
    }
    
    if (mQuickLaunchBtn) {
      mQuickLaunchBtn.style.display = (overCount >= 4 && !state.basketBoostActive) ? 'block' : 'none';
      mQuickLaunchBtn.textContent = '⚡ BOOST';
      mQuickLaunchBtn.onclick = (e) => {
        e.stopPropagation();
        toggleBetslipDrawer(true);
        runBasketBoostRoulette();
      };
    }
    
    let selectionsHTML = '';
    selections.forEach(sel => {
      const selNameTranslated = sel.selectionType === 'over' 
        ? (isSR ? 'Više' : 'Over') 
        : (isSR ? 'Manje' : 'Under');
      
      let lineDisplay = '';
      if (sel.isBoosted) {
        lineDisplay = `<span class="basket-original-limit">${sel.originalLine}</span> <span class="basket-boosted-limit">${sel.line} ⚡</span>`;
      } else {
        lineDisplay = `<span>${sel.line}</span>`;
      }
      
      selectionsHTML += `
        <div class="bet-card ${sel.isBoosted ? 'boosted-card' : ''}" id="basket-bet-card-${sel.playerId}">
          <div class="bet-card-header">
            <span class="bet-match" style="font-weight: 800; color: #fff;">${sel.playerName}</span>
            <span class="bet-remove" onclick="removeBasketSelection(${sel.playerId})">×</span>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">${sel.match}</div>
          <div class="bet-selection" style="display: flex; justify-content: space-between; align-items: center;">
            <span>${selNameTranslated} [${lineDisplay}]</span>
            <span style="color: var(--accent-gold); font-weight: 800;">${sel.odds.toFixed(2)}</span>
          </div>
        </div>
      `;
    });
    
    let eligibilityHTML = '';
    if (overCount >= 4) {
      if (state.basketBoostActive) {
        const winner = selections.find(sel => sel.playerId === state.basketBoostWinnerId);
        const name = winner ? winner.playerName : '';
        eligibilityHTML = `
          <div class="basket-boost-info success">
            <i>🎉</i>
            <span>${isSR 
              ? `Basket Boost uspešno aktiviran! Granica za <strong>${name}</strong> je smanjena za <strong>${pointsReduction} poen/a</strong>!` 
              : `Basket Boost successfully activated! Line for <strong>${name}</strong> reduced by <strong>${pointsReduction} point(s)</strong>!`}
            </span>
          </div>
        `;
      } else {
        eligibilityHTML = `
          <div class="basket-boost-info">
            <i>⚡</i>
            <span>${isSR 
              ? `Sjajno! Tiket je kvalifikovan za Basket Boost. Dobićeš <strong>-${pointsReduction} poen/a</strong> na nasumičnu "Over" granicu!` 
              : `Awesome! Ticket is qualified for Basket Boost. You will get <strong>-${pointsReduction} point(s)</strong> on a random "Over" boundary!`}
            </span>
          </div>
        `;
      }
    } else {
      eligibilityHTML = `
        <div class="basket-boost-info" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: var(--text-muted);">
          <i>ℹ️</i>
          <span>${isSR 
            ? `Dodaj još <strong>${4 - overCount}</strong> "Više" (Over) selekcije za aktivaciju Basket Boosta (smanjenje granice).` 
            : `Add <strong>${4 - overCount}</strong> more "Over" selections to activate the Basket Boost limit reduction.`}
          </span>
        </div>
      `;
    }
    
    let boostBtnHTML = '';
    if (overCount >= 4) {
      if (state.basketBoostActive) {
        boostBtnHTML = `
          <button class="btn-basket-boost" disabled>
            <span>✅</span> <span>${t.basketBoostAlreadyRun}</span>
          </button>
        `;
      } else {
        boostBtnHTML = `
          <button class="btn-basket-boost" id="basket-boost-trigger-btn" onclick="runBasketBoostRoulette()">
            <span>⚡</span> <span>${t.basketBoostBtn} (-${pointsReduction} poen/a)</span>
          </button>
        `;
      }
    }
    
    container.innerHTML = `
      <div style="max-height: 380px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px;">
        ${selectionsHTML}
      </div>
      
      ${eligibilityHTML}
      
      <div class="stake-input-wrapper">
        <label class="stake-label" id="stake-label-el">${t.stakeLabel}</label>
        <input type="number" class="stake-input" id="stake-input-field" value="${stake}" oninput="updateBasketStake(this.value)" min="100" step="100" />
      </div>
      
      <div class="betslip-summary">
        <div class="summary-row">
          <span>${isSR ? 'Ukupna Kvota:' : 'Total Odds:'}</span>
          <span>${totalOdds.toFixed(2)}</span>
        </div>
        ${state.basketBoostActive ? `
        <div class="summary-row boosted-row">
          <span>⚡ Basket Boost:</span>
          <span class="gold-text">${isSR ? 'AKTIVAN (Smanjena granica)' : 'ACTIVE (Line Reduced)'}</span>
        </div>` : ''}
        <div class="summary-row total-win">
          <span>${t.possibleWin}</span>
          <span>${totalWin} ${currency}</span>
        </div>
      </div>
      
      ${boostBtnHTML}
      
      <button class="btn-place-normal" onclick="placeBasketBetFinal()">
        ${t.placeBetNormal}
      </button>
    `;
    return;
  }
  
  // -------------------------------------------------------------
  // SPORT: FOOTBALL / PARLAY (Express Tiketi)
  // -------------------------------------------------------------
  const selections = (state.selections && state.selections.length > 0) 
    ? state.selections 
    : (state.currentBet && state.currentBet.match ? [state.currentBet] : []);

  if (selections.length === 0) {
    container.innerHTML = `<div class="betslip-empty">${t.emptyBetslip}</div>`;
    if (mobileBar) {
      mobileBar.classList.remove('active');
    }
    toggleBetslipDrawer(false);
    return;
  }
  
  const totalBaseOdds = selections.reduce((sum, s) => sum * (s.baseOdds || 1), 1);
  const pairProduct = selections.reduce((sum, s) => sum * (s.boostedOdds || s.baseOdds || 1), 1);
  
  let totalBoostedOdds = pairProduct;
  let isSlotApplied = false;
  let slotBoostVal = 0;

  if (state.slot && state.slot.slotBoostActive && state.slot.boostValue > 0) {
    slotBoostVal = state.slot.boostValue;
    const eligibleProd = selections.filter(s => s.isSlotEligible !== false && !s.isLowMargin)
                                       .reduce((sum, s) => sum * (s.boostedOdds || s.baseOdds || 1), 1);
    const nonEligibleProd = selections.filter(s => s.isSlotEligible === false || s.isLowMargin)
                                          .reduce((sum, s) => sum * (s.boostedOdds || s.baseOdds || 1), 1);
    if (eligibleProd > 1) {
      totalBoostedOdds = (eligibleProd * (1 + slotBoostVal / 100)) * nonEligibleProd;
      isSlotApplied = true;
    }
  }

  const stake = state.currentBet?.stake || state.parlayStake || 1000;
  const totalWin = (stake * totalBoostedOdds).toFixed(2);
  
  // Sync values to mobile bottom bar
  if (mobileBar && mOddsEl && mCountEl) {
    const countText = selections.length === 1 
      ? (isSR ? '1 Par' : '1 Selection') 
      : (isSR ? `${selections.length} Para` : `${selections.length} Selections`);
    mCountEl.textContent = countText;
    mOddsEl.textContent = `${isSR ? 'Kvota' : 'Odds'}: ${totalBoostedOdds.toFixed(2)}`;
    mobileBar.classList.add('active');
  }
  
  if (mQuickLaunchBtn) {
    const mysteryActive = state.mysteryBox && state.mysteryBox.isMysteryTicketActive;
    const showTurboBtn = !mysteryActive && selections.length === 1 && selections[0].isEligible && !isTurboAttemptUsed(selections[0]);
    mQuickLaunchBtn.style.display = showTurboBtn ? 'block' : 'none';
    mQuickLaunchBtn.textContent = '🚀 TURBO X';
    mQuickLaunchBtn.onclick = (e) => {
      e.stopPropagation();
      openRocketArena();
    };
  }
  
  let selectionsHTML = '';
  selections.forEach((sel, idx) => {
    const isPairTurbo = sel.isTurboBoosted;
    const turboUsed = !sel.isTurboBoosted && isTurboAttemptUsed(sel);
    const isSlotEligible = sel.isSlotEligible && isSlotApplied;
    
    let boostBadgeHTML = `<span class="boosted-odds" style="color:#fff; font-weight:800;">${sel.baseOdds.toFixed(2)}</span>`;
    if (isPairTurbo) {
      boostBadgeHTML = `<span class="original-odds">${sel.baseOdds.toFixed(2)}</span> <span class="boosted-odds gold-text">${sel.boostedOdds.toFixed(2)} ⚡ (+${sel.turboPercent.toFixed(1)}%)</span>`;
    } else if (isSlotEligible) {
      boostBadgeHTML = `<span class="boosted-odds" style="color:#ffd700; font-weight:800;" title="Kvalifikovan za Parlay Slot Boost (+${slotBoostVal}% na ukupnu kvotu)">${sel.baseOdds.toFixed(2)} 🎰</span>`;
    }

    const marginTagHTML = sel.isLowMargin
      ? `<span class="badge-low-margin" title="Specijalan market — Standardna kvota">🎯 Specijal (Standard)</span>`
      : `<span class="badge-classic-market">${isSlotEligible ? '🎰 Slot Boost (+' + slotBoostVal + '% Tiket)' : '⚽ Promo Market'}</span>`;

    const mysteryActive = state.mysteryBox && state.mysteryBox.isMysteryTicketActive;
    const pairTurboRowHTML = (isSlotApplied || mysteryActive) ? '' : `
        <div class="bet-pair-turbo-row" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size: 11px; color: ${sel.isTurboBoosted ? '#2ecc71' : '#a0aec0'}; font-weight: ${sel.isTurboBoosted ? '700' : 'normal'};">
            ${!sel.isEligible ? '🛡️ Turbo X dostupan samo na 1X2' : (sel.isTurboBoosted ? '⚡ Turbo na paru zaključan' : (turboUsed ? '💥 Turbo X pokušaj iskorišćen' : '🚀 Pojedinačni Turbo X:'))}
          </span>
          ${!sel.isEligible
            ? `<button class="btn-pair-turbo disabled" disabled title="Turbo X je dostupan samo na 1X2 marketu">🚫 Nije dostupno</button>`
            : sel.isTurboBoosted
              ? `<span style="font-size: 11.5px; font-weight: 800; color: #2ecc71; background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.4); padding: 4px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">⚡ +${(sel.turboPercent || 0).toFixed(1)}%</span>`
              : turboUsed
                ? `<button class="btn-pair-turbo disabled" disabled title="${t.turboAttemptUsed}">${t.turboAttemptUsedLabel}</button>`
                : `<button class="btn-pair-turbo" onclick="launchPairTurbo(${idx}, event)" title="Pokreni Turbo X za ovaj par!">🚀 POKRENI TURBO</button>`
          }
        </div>
    `;

    selectionsHTML += `
      <div class="bet-card ${isPairTurbo ? 'boosted-card' : ''} ${sel.isLowMargin ? 'low-margin-card' : ''}">
        <div class="bet-card-header">
          <span class="bet-match">${sel.match}</span>
          <span class="bet-remove" onclick="removeSelectionFromParlay('${sel.match.replace(/'/g, "\\'")}')">×</span>
        </div>
        <div class="bet-selection" style="display:flex; justify-content:space-between; align-items:center; margin-top: 4px;">
          <span>${sel.selection}</span>
          ${marginTagHTML}
        </div>
        <div class="bet-odds-row" style="margin-top: 6px;">
          <span>Kvota / Odds:</span>
          <div>${boostBadgeHTML}</div>
        </div>
        ${pairTurboRowHTML}
      </div>
    `;
  });

  let slotOrPromoHTML = '';
  const isMysteryActive = state.mysteryBox && state.mysteryBox.isMysteryTicketActive;
  if (selections.length >= 3 && !isMysteryActive) {
    slotOrPromoHTML = renderParlaySlotWidget();
  } else if (isMysteryActive) {
    slotOrPromoHTML = `
      <div style="background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.3); border-radius: 10px; padding: 10px 14px; font-size: 0.78rem; color: #d8b4fe; display: flex; align-items: center; gap: 8px;">
        📦 <span><strong>Mystery Bet Box tiket</strong> — Turbo X i Parlay Slot su onemogućeni za ovaj paket.</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="max-height: 340px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px;">
      ${selectionsHTML}
    </div>

    ${slotOrPromoHTML}

    ${(!isMysteryActive && selections.length === 1 && selections[0].isEligible && !selections[0].isBoosted && !selections[0].hasCrashed && !isTurboAttemptUsed(selections[0])) ? `
    <div class="eligibility-info">
      <i>⚡</i> <span>${t.eligibilityInfo}</span>
    </div>` : ''}

    <div class="stake-input-wrapper">
      <label class="stake-label" id="stake-label-el">${t.stakeLabel}</label>
      <input type="number" class="stake-input" id="stake-input-field" value="${stake}" oninput="updateStake(this.value)" min="100" step="100" />
    </div>
    
    <div class="betslip-summary">
      <div class="summary-row">
        <span>Osnovna Kvota:</span>
        <span>${totalBaseOdds.toFixed(2)}</span>
      </div>
      ${(totalBoostedOdds > totalBaseOdds + 0.001) ? `
      <div class="summary-row boosted-row">
        <span>${isSlotApplied ? `🎰 Parlay Slot Boost (+${slotBoostVal}% na ukupnu kvotu):` : '⚡ Boost Multiplikator:'}</span>
        <span class="gold-text">✖️ ${totalBoostedOdds.toFixed(2)} (+${((totalBoostedOdds / totalBaseOdds - 1) * 100).toFixed(1)}%)</span>
      </div>` : ''}
      <div class="summary-row total-win">
        <span>${t.possibleWin}</span>
        <span>${totalWin} ${currency}</span>
      </div>
    </div>
    
    <button class="btn-place-normal" onclick="placeBetFinal()">
      ${t.placeBetNormal}
    </button>
  `;

}

function updateStake(val) {
  const num = parseFloat(val);
  if (!isNaN(num) && num >= 0) {
    state.parlayStake = num;
    if (state.currentBet) state.currentBet.stake = num;
    const currency = t('currencyCode');
    const totalWinEl = document.querySelector('.summary-row.total-win span:last-child');
    if (totalWinEl && state.selections && state.selections.length > 0) {
      const pairProduct = state.selections.reduce((sum, s) => sum * (s.boostedOdds || s.baseOdds || 1), 1);
      let totalBoosted = pairProduct;
      if (state.slot && state.slot.slotBoostActive && state.slot.boostValue > 0) {
        const boostVal = state.slot.boostValue;
        const eligibleProd = state.selections.filter(s => s.isSlotEligible !== false && !s.isLowMargin)
                                             .reduce((sum, s) => sum * (s.boostedOdds || s.baseOdds || 1), 1);
        const nonEligibleProd = state.selections.filter(s => s.isSlotEligible === false || s.isLowMargin)
                                                .reduce((sum, s) => sum * (s.boostedOdds || s.baseOdds || 1), 1);
        if (eligibleProd > 1) {
          totalBoosted = (eligibleProd * (1 + boostVal / 100)) * nonEligibleProd;
        }
      }
      totalWinEl.textContent = `${(num * totalBoosted).toFixed(2)} ${currency}`;
    } else if (totalWinEl && state.currentBet) {
      totalWinEl.textContent = `${(num * state.currentBet.boostedOdds).toFixed(2)} ${currency}`;
    }
  }
}

export function hasActiveTurboBoost() {
  if (state.currentBet && state.currentBet.isBoosted && !state.currentBet.hasCrashed && (state.currentBet.boostPercent || 0) > 0) {
    return true;
  }
  if (state.selections && state.selections.length > 0) {
    return state.selections.some(sel => sel.isTurboBoosted && !sel.hasCrashed && (sel.turboPercent || 0) > 0);
  }
  return false;
}


export function toggleSidebarDrawer(open) {
  const drawer = document.querySelector('.sidebar-left');
  const backdrop = document.getElementById('sidebar-drawer-backdrop');
  if (!drawer) return;

  // Only operate as a drawer on mobile viewports
  if (window.innerWidth > 768) return;

  if (open === undefined) {
    open = !drawer.classList.contains('open');
  }

  if (open) {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

export function toggleBetslipDrawer(open) {
  const drawer = document.querySelector('.sidebar-right');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer) return;
  
  // Only operate as a drawer on mobile viewports
  if (window.innerWidth > 768) return;
  
  if (open === undefined) {
    open = !drawer.classList.contains('open');
  }
  
  if (open) {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll on mobile
    // Always scroll betslip content back to the top so bet card is visible first
    const body = document.getElementById('betslip-content-area');
    if (body) setTimeout(() => body.parentElement.scrollTop = 0, 50);
    const betslipBody = drawer.querySelector('.betslip-body');
    if (betslipBody) setTimeout(() => betslipBody.scrollTop = 0, 50);
  } else {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}


function placeBetFinal() {
  if (!state.currentBet) return;
  const t = i18n[state.lang];
  const currency = t.currencyCode;
  const totalWin = (state.currentBet.stake * state.currentBet.boostedOdds).toFixed(2);
  
  alert(`${t.placedModalTitle}\n\nMatch: ${state.currentBet.match}\nSelection: ${state.currentBet.selection}\nOdds: ${state.currentBet.boostedOdds.toFixed(2)} ${state.currentBet.isBoosted ? '(ROCKET BOOSTED!)' : ''}\nStake: ${state.currentBet.stake} ${currency}\n${t.possibleWin} ${totalWin} ${currency}\n\n${t.placedModalSub}`);
  
  removeBet();
}


// ============================================================================
// PRESENTATION CONTROLS (DEMO BAR)
// ============================================================================
function toggleLang() {
  state.lang = state.lang === 'sr' ? 'en' : 'sr';
  document.getElementById('demo-lang-btn').textContent = state.lang.toUpperCase();
  updateLanguageUI();
}

function updateDemoMax(val) {
  state.game.demoOverride = val;
  console.log(`[Presentation Control] Override set to: ${val}`);
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  document.getElementById('demo-sound-btn').textContent = state.soundEnabled ? '🔊 ON' : '🔇 MUTE';
}

function resetDemoFlow() {
  resetAllOddsToDefault();
  resetTurboAttempts();
  
  state.currentBet = {
    match: 'France vs Spain',
    selection: '1 (France pobeda)',
    baseOdds: 2.57,
    boostedOdds: 2.57,
    boostPercent: 0,
    stake: 1000,
    isBoosted: false,
    hasCrashed: false
  };
  
  const firstBtn = document.querySelector('.odds-btn');
  if (firstBtn) firstBtn.classList.add('selected');
  
  renderBetslip();
  console.log('[Presentation Control] Flow reset.');
}

function toggleDemoBar() {
  const bar = document.getElementById('demo-control-bar');
  bar.classList.toggle('collapsed');
}



export function initSportsbook() {
  fetchMerkurFeed().then(matches => {
    state.allMatches = matches;

    // Render the sidebar (which selects the first league by default and calls selectLeague)
    renderSidebar(matches);

    // No match pre-selected by default on app opening (`nijedan par ne sme biti selektovan po defaultu`)
    state.currentBet = null;

    renderBetslip();
  });

  fetchMerkurBasketballFeed().then(players => {
    state.basketPlayers = players;
    if (state.currentSport === 'basketball_players') {
      renderBasketballPlayers();
    }
  });
}


// Initialize when DOM loads
window.addEventListener('DOMContentLoaded', () => {
  checkAuthStateOnInit();
  
  // Create stars in background
  const starsContainer = document.getElementById('arena-stars-container');
  if (starsContainer) {
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.style.width = (1 + Math.random() * 3) + 'px';
      s.style.height = s.style.width;
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.setProperty('--duration', (1.5 + Math.random() * 3) + 's');
      starsContainer.appendChild(s);
    }
  }
  
  // Create speed lines
  const speedContainer = document.getElementById('speed-lines-container');
  if (speedContainer) {
    for (let i = 0; i < 20; i++) {
      const l = document.createElement('div');
      l.className = 'speed-line';
      l.style.left = Math.random() * 100 + '%';
      l.style.animationDelay = (Math.random() * 0.4) + 's';
      speedContainer.appendChild(l);
    }
  }
  // Auto-collapse demo presentation bar on mobile
  if (window.innerWidth <= 768) {
    const bar = document.getElementById('demo-control-bar');
    if (bar && !bar.classList.contains('collapsed')) {
      bar.classList.add('collapsed');
    }
  }
  
  // Close drawer and clean up if user resizes back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const drawer = document.querySelector('.sidebar-right');
      const backdrop = document.getElementById('drawer-backdrop');
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Initialize Trending Bets Widget
  initTrendingBetsWidget();
});

/* ==========================================================================
   TRENDING BETS WIDGET LOGIC
   ========================================================================== */
function initTrendingBetsWidget() {
  // Show first toast after a short delay
  setTimeout(() => {
    showTrendingBet();
  }, 5000);

  // Then show a new trending bet randomly every 15 to 30 seconds
  setInterval(() => {
    showTrendingBet();
  }, Math.random() * 15000 + 15000);
}

function showTrendingBet() {
  const widget = document.getElementById('trending-bets-widget');
  const textEl = document.getElementById('trending-text');
  
  if (!widget || !textEl) return;
  
  const TRENDING_MARKETS = [
    "Gol u Prvom Poluvremenu",
    "Konačan Ishod 1",
    "Konačan Ishod 2",
    "3+ Gola na meču",
    "GG (Oba daju gol)",
    "Tačan Rezultat 2:1",
    "Dvoznak 1X",
    "Više od 9.5 Kornera",
    "Prvi daje gol"
  ];

  // Pick random real match from state or fallback to MOCK_MATCHES
  const allMatches = (state.allMatches && state.allMatches.length > 0)
    ? state.allMatches
    : MOCK_MATCHES;

  // Only show matches kicking off today (Hot Right Now = today's matches)
  const now = new Date();
  const matches = allMatches.filter(m => {
    const d = new Date(m.kickOffTime);
    return d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
  });

  if (!matches || matches.length === 0) return;

  const randomMatch = matches[Math.floor(Math.random() * matches.length)];
  const matchName = `${randomMatch.home} vs ${randomMatch.away}`;
  
  // Pick random market
  const randomMarket = TRENDING_MARKETS[Math.floor(Math.random() * TRENDING_MARKETS.length)];
  
  // Random players and time
  const randomPlayers = Math.floor(Math.random() * 4000) + 1200; // 1,200 to 5,200
  const formattedPlayers = randomPlayers.toLocaleString('de-DE'); // dot separator
  const randomMinutes = Math.floor(Math.random() * 15) + 3; // 3 to 17 minutes
  
  // Format text: "1.200 igrača je uplatilo na Gol u Prvom Poluvremenu na utakmici Arsenal vs Chelsea u poslednjih 10 minuta"
  textEl.innerHTML = `<span>${formattedPlayers}</span> igrača je uplatilo na <span>${randomMarket}</span> na utakmici <span>${matchName}</span> u poslednjih ${randomMinutes} minuta.`;
  
  widget.classList.add('show');

  // Hide after 6 seconds
  setTimeout(() => {
    widget.classList.remove('show');
  }, 6000);
}

// ============================================================================
// GLOBAL WINDOW ATTACHMENT
// index.html calls these directly via inline onclick/oninput/onchange/onsubmit
// handlers, so they must be reachable on window (ES modules do not leak to
// global scope on their own).
// ============================================================================
window.addMysteryTicketToSlip = addMysteryTicketToSlip;
window.closeMysteryBetBox = closeMysteryBetBox;
window.closeParlaySlotPromoModal = closeParlaySlotPromoModal;
window.closeProfitabilitySimulator = closeProfitabilitySimulator;
window.handleAuthSubmit = handleAuthSubmit;
window.handleLogout = handleLogout;
window.initSwipeDeck = initSwipeDeck;
window.launchPairTurbo = launchPairTurbo;
window.openMysteryBetBox = openMysteryBetBox;
window.openProfitabilitySimulator = openProfitabilitySimulator;
window.openRocketArena = openRocketArena;
window.pickMysteryBox = pickMysteryBox;
window.placeBasketBetFinal = placeBasketBetFinal;
window.placeBetFinal = placeBetFinal;
window.quickAddThreePairs = quickAddThreePairs;
window.refreshMysteryBoxes = refreshMysteryBoxes;
window.removeBasketSelection = removeBasketSelection;
window.removeSelectionFromParlay = removeSelectionFromParlay;
window.resetDemoFlow = resetDemoFlow;
window.resetSlotSpins = resetSlotSpins;
window.runBasketBoostRoulette = runBasketBoostRoulette;
window.runMonteCarloSimulation = runMonteCarloSimulation;
window.selectBasketOdds = selectBasketOdds;
window.selectBasketballPlayersCategory = selectBasketballPlayersCategory;
window.selectOdds = selectOdds;
window.setSimTrials = setSimTrials;
window.setSwipeCardPick = setSwipeCardPick;
window.showParlaySlotPromoModal = showParlaySlotPromoModal;
window.spinParlaySlot = spinParlaySlot;
window.stopRocket = stopRocket;
window.swipeLeft = swipeLeft;
window.swipeRight = swipeRight;
window.swipeUndo = swipeUndo;
window.switchViewMode = switchViewMode;
window.toggleBetslipDrawer = toggleBetslipDrawer;
window.toggleDemoBar = toggleDemoBar;
window.toggleFootballMenu = toggleFootballMenu;
window.toggleLang = toggleLang;
window.togglePasswordVisibility = togglePasswordVisibility;
window.toggleSidebarDrawer = toggleSidebarDrawer;
window.toggleSimDms = toggleSimDms;
window.toggleSound = toggleSound;
window.updateDemoMax = updateDemoMax;
window.updateMarketMargin = updateMarketMargin;
window.updateSlotOverride = updateSlotOverride;
window.updateVipTier = updateVipTier;

