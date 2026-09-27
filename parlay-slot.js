/**
 * ==========================================================================
 * MERKUR XTIP — PARLAY SLOT MACHINE PROMOTION ENGINE
 * Express-ticket slot spin widget, daily spin caps, and promo modal.
 * ==========================================================================
 */

import { state, t } from './state.js';
import { playCrashSound, playSuccessSound, playTickSound } from './audio.js';
import { hasActiveTurboBoost, reapplySlotBoost, renderBetslip, resetAllOddsToDefault, showToast } from './app.js';
import { triggerConfetti, resetTurboAttempts } from './rocket.js';

export function renderParlaySlotWidget() {
  const slot = state.slot || { spinsUsedToday: 0, maxDailySpins: 3, reels: ['⚽','⚽','⚽'] };
  const spinsLeft = slot.maxDailySpins - slot.spinsUsedToday;
  const limitReached = slot.spinsUsedToday >= slot.maxDailySpins;
  const turboActive = hasActiveTurboBoost();

  return `
    <div class="parlay-slot-card" id="parlay-slot-widget">
      <div class="slot-widget-header">
        <div class="slot-title-group">
          <span class="slot-header-icon">🎰</span>
          <div>
            <div class="slot-title">PARLAY MINI SLOT BOOSTER</div>
            <div class="slot-subtitle">Besplatan spin za 3+ para pre uplate!</div>
          </div>
        </div>
        <div class="slot-spins-counter ${limitReached || turboActive ? 'limit-reached' : ''}">
          <span>⚡ Spinova: <strong>${spinsLeft} / ${slot.maxDailySpins}</strong></span>
          <button class="btn-reset-spins-tiny" onclick="resetSlotSpins()" title="Resetuj dnevne spinove (Demo)">🔄</button>
        </div>
      </div>

      <!-- 3 Reels Display -->
      <div class="slot-reels-container" id="slot-reels-container" style="${turboActive ? 'opacity: 0.45; filter: grayscale(0.8);' : ''}">
        <div class="slot-reel ${slot.isSpinning ? 'spinning-reel' : ''}" id="slot-reel-0">
          <div class="slot-symbol">${slot.reels[0] || '⚽'}</div>
        </div>
        <div class="slot-reel ${slot.isSpinning ? 'spinning-reel' : ''}" id="slot-reel-1">
          <div class="slot-symbol">${slot.reels[1] || '⚽'}</div>
        </div>
        <div class="slot-reel ${slot.isSpinning ? 'spinning-reel' : ''}" id="slot-reel-2">
          <div class="slot-symbol">${slot.reels[2] || '⚽'}</div>
        </div>
      </div>

      <!-- Spin Button & Outcome Message -->
      <div class="slot-action-area">
        ${turboActive ? `
          <div class="slot-limit-box" style="background: rgba(255, 0, 85, 0.12); border: 1.5px solid rgba(255, 0, 85, 0.4); color: #ff9a00; padding: 10px; border-radius: 8px; text-align: center;">
            <span style="font-size: 12px; font-weight: 900; display: block; margin-bottom: 4px;">🚀 TURBO X BOOST JE ZAKLJUČAN NA TIKETU</span>
            <span style="font-size: 11px; color: #cbd5e1; line-height: 1.35; display: block;">Parlay Slot spinovi su onemogućeni jer je kvota već uvećana Turbom (uzajamno isključive opcije).</span>
          </div>
        ` : limitReached ? `
          <div class="slot-limit-box">
            <span>🛡️ Dnevni limit od 3 besplatna spina je iskorišćen!</span>
            <button class="btn-reset-spins" onclick="resetSlotSpins()">🔄 RESETUJ SPINOVE (DEMO)</button>
          </div>
        ` : `
          <button class="btn-spin-slot ${slot.isSpinning ? 'spinning' : ''}" onclick="spinParlaySlot()" ${slot.isSpinning ? 'disabled' : ''}>
            <span>🎰</span> <span>${slot.isSpinning ? 'VRTIM REELS...' : 'VRTI BESPLATAN SPIN!'}</span>
          </button>
        `}

        ${(!turboActive && slot.lastOutcomeMessage) ? `
          <div class="slot-outcome-msg ${slot.slotBoostActive ? 'success' : 'info'}">
            ${slot.lastOutcomeMessage}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function renderParlaySlotPromoWidget(count) {
  return `
    <div class="parlay-slot-promo-box">
      <div class="promo-box-left">
        <span class="promo-slot-icon">🎰</span>
      </div>
      <div class="promo-box-right">
        <div class="promo-box-title">BESPLATAN SPIN NA PARLAY SLOTU!</div>
        <div class="promo-box-text">
          Sastavi parlay tiket sa <strong>3 ili više parova</strong> (${count}/3) da otključaš besplatan slot spin pre uplate i osvojiš <strong>+20% na sve fudbalske kvote</strong> ili <strong>Maksimalni Boost na ceo tiket (3x Džoker)</strong>!
        </div>
        <button class="btn-quick-add-pairs" onclick="quickAddThreePairs()">
          ⚡ DODAJ 3 PARA ODMAH (DEMO)
        </button>
      </div>
    </div>
  `;
}

export function showParlaySlotPromoModal() {
  // Mutual exclusion: Mystery Box ticket is incompatible with Parlay Slot
  if (state.mysteryBox && state.mysteryBox.isMysteryTicketActive) {
    showToast(t('mysteryBoxActiveWarning'), 'info');
    return;
  }
  let modal = document.getElementById('parlay-slot-promo-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'parlay-slot-promo-modal';
    modal.className = 'flight-overlay active';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '100000';
    document.body.appendChild(modal);
  }
  const count = state.selections ? state.selections.length : 0;
  modal.innerHTML = `
    <div class="parlay-slot-modal-card" style="background: linear-gradient(135deg, #111823 0%, #1a2434 100%); border: 2px solid #ffd700; border-radius: 16px; padding: 24px; max-width: 480px; width: 90%; position: relative; box-shadow: 0 16px 48px rgba(0,0,0,0.8), 0 0 32px rgba(255,215,0,0.25);">
      <button onclick="closeParlaySlotPromoModal()" style="position:absolute; top:12px; right:16px; background:none; border:none; color:#a0aec0; font-size:24px; cursor:pointer;">×</button>
      <div style="display:flex; gap: 16px; align-items: center;">
        <div style="font-size: 54px; animation: bounceIcon 2s infinite ease-in-out;">🎰</div>
        <div>
          <div style="color: #ffd700; font-weight: 900; font-size: 18px; margin-bottom: 6px;">BESPLATAN SPIN NA PARLAY SLOTU!</div>
          <div style="color: #cbd5e1; font-size: 13px; line-height: 1.4; margin-bottom: 14px;">
            Sastavi parlay tiket sa <strong>3 ili više parova</strong> (${count}/3) da otključaš besplatan slot spin pre uplate i osvojiš <strong>+20% na sve fudbalske kvote</strong> ili <strong>Maksimalni Boost na ceo tiket (3x Džoker)</strong>!
          </div>
          <button class="btn-quick-add-pairs" onclick="closeParlaySlotPromoModal(); quickAddThreePairs();" style="width: 100%; justify-content: center; padding: 10px; font-size: 13px;">
            ⚡ DODAJ 3 PARA ODMAH (DEMO)
          </button>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  modal.style.display = 'flex';
}

export function closeParlaySlotPromoModal() {
  const modal = document.getElementById('parlay-slot-promo-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

export function spinParlaySlot() {
  if (!state.slot) return;
  if (hasActiveTurboBoost()) {
    showToast('🛡️ Turbo X boost je već zaključen na tiketu — Parlay Slot spinovi nisu dozvoljeni.', 'error');
    return;
  }
  if (state.slot.isSpinning || state.slot.spinsUsedToday >= state.slot.maxDailySpins) return;

  state.slot.isSpinning = true;
  state.slot.spinsUsedToday++;
  renderBetslip();

  const symbols = ['⚽', '🏀', '🎾', '🃏'];
  
  // Determine final outcome based on override or weights
  let outcome = ['⚽', '⚽', '⚽'];
  const override = state.slot.demoOverride || 'random';
  if (override === '3_football') {
    outcome = ['⚽', '⚽', '⚽'];
  } else if (override === '3_joker') {
    outcome = ['🃏', '🃏', '🃏'];
  } else if (override === '3_basketball') {
    outcome = ['🏀', '🏀', '🏀'];
  } else if (override === '3_tennis') {
    outcome = ['🎾', '🎾', '🎾'];
  } else if (override === 'near_miss') {
    outcome = ['⚽', '⚽', '🃏'];
  } else {
    // Risk Mitigation & Excitement Curve:
    // On the very first spin of the day/ticket (spinsUsedToday === 1), strongly favor exciting near-misses (~88%)
    // so the user experiences the thrill and utilizes all 3 daily attempts instead of winning instantly.
    if (state.slot && state.slot.spinsUsedToday === 1 && Math.random() < 0.88) {
      const firstSpinMisses = [
        ['⚽', '⚽', '🃏'], // dramatic near miss football
        ['⚽', '⚽', '🏀'],
        ['🃏', '🃏', '⚽'], // dramatic near miss joker
        ['⚽', '🏀', '🎾'],
        ['🎾', '🎾', '⚽'],
        ['🏀', '🏀', '🃏'],
        ['⚽', '🃏', '🎾']
      ];
      outcome = firstSpinMisses[Math.floor(Math.random() * firstSpinMisses.length)];
    } else {
      // Standard distribution on subsequent spins (or ~12% lucky first spin)
      const r = Math.random();
      if (r < 0.24) outcome = ['⚽', '⚽', '⚽'];
      else if (r < 0.33) outcome = ['🃏', '🃏', '🃏'];
      else if (r < 0.38) outcome = ['🏀', '🏀', '🏀'];
      else if (r < 0.42) outcome = ['🎾', '🎾', '🎾'];
      else {
        const misses = [
          ['⚽', '⚽', '🃏'],
          ['🃏', '🃏', '⚽'],
          ['⚽', '⚽', '🏀'],
          ['🏀', '🏀', '⚽'],
          ['⚽', '🏀', '🎾'],
          ['🎾', '⚽', '🃏'],
          ['⚽', '🃏', '🎾'],
          ['🏀', '🎾', '⚽']
        ];
        outcome = misses[Math.floor(Math.random() * misses.length)];
      }
    }
  }

  // Animation interval cycling symbols
  const reel0El = document.querySelector('#slot-reel-0 .slot-symbol');
  const reel1El = document.querySelector('#slot-reel-1 .slot-symbol');
  const reel2El = document.querySelector('#slot-reel-2 .slot-symbol');

  let ticks = 0;
  const animInterval = setInterval(() => {
    ticks++;
    if (reel0El && ticks < 10) reel0El.textContent = symbols[ticks % symbols.length];
    if (reel1El && ticks < 18) reel1El.textContent = symbols[(ticks + 1) % symbols.length];
    if (reel2El && ticks < 26) reel2El.textContent = symbols[(ticks + 2) % symbols.length];
    if (ticks % 3 === 0) playTickSound(1.2 + ticks * 0.02);
  }, 65);

  setTimeout(() => {
    state.slot.reels[0] = outcome[0];
    if (reel0El) reel0El.textContent = outcome[0];
    playTickSound(1.4);
  }, 650);

  setTimeout(() => {
    state.slot.reels[1] = outcome[1];
    if (reel1El) reel1El.textContent = outcome[1];
    playTickSound(1.6);
  }, 1170);

  setTimeout(() => {
    clearInterval(animInterval);
    state.slot.reels[2] = outcome[2];
    if (reel2El) reel2El.textContent = outcome[2];
    playTickSound(1.8);

    state.slot.isSpinning = false;

    // Evaluate Win
    if (outcome[0] === outcome[1] && outcome[1] === outcome[2]) {
      if (outcome[0] === '⚽') {
        state.slot.slotBoostActive = true;
        state.slot.boostType = 'football';
        state.slot.boostValue = 20;
        state.slot.lastOutcomeMessage = '🎉 <strong>3x FUDBALSKA LOPTA!</strong> Osvojen <strong>+20% BOOST na UKUPNU KVOTU tiketa</strong>!';
        playSuccessSound(); triggerConfetti();
      } else if (outcome[0] === '🃏') {
        state.slot.slotBoostActive = true;
        state.slot.boostType = 'joker_max';
        state.slot.boostValue = 40; // Max boost across ticket
        state.slot.lastOutcomeMessage = '🔥 <strong>3x DŽOKER JACKPOT!</strong> Osvojen <strong>MAKSIMALNI BOOST (+40%) na UKUPNU KVOTU tiketa</strong>!';
        playSuccessSound(); triggerConfetti();
      } else if (outcome[0] === '🏀') {
        state.slot.slotBoostActive = true;
        state.slot.boostType = 'basketball';
        state.slot.boostValue = 20;
        state.slot.lastOutcomeMessage = '🎉 <strong>3x KOŠARKA!</strong> Osvojen <strong>+20% BOOST na UKUPNU KVOTU tiketa</strong>!';
        playSuccessSound(); triggerConfetti();
      } else if (outcome[0] === '🎾') {
        state.slot.slotBoostActive = true;
        state.slot.boostType = 'tennis';
        state.slot.boostValue = 20;
        state.slot.lastOutcomeMessage = '🎉 <strong>3x TENIS!</strong> Osvojen <strong>+20% BOOST na UKUPNU KVOTU tiketa</strong>!';
        playSuccessSound(); triggerConfetti();
      }
    } else {
      state.slot.slotBoostActive = false;
      state.slot.boostType = null;
      state.slot.boostValue = 0;
      state.slot.lastOutcomeMessage = 'ℹ️ <strong>Nema 3 ista simbola.</strong> Pokušaj ponovo! Preostalo besplatnih spinova: <strong>' + (state.slot.maxDailySpins - state.slot.spinsUsedToday) + '</strong>.';
      playCrashSound();
    }

    reapplySlotBoost();
    renderBetslip();
  }, 1690);
}

export function resetSlotSpins() {
  if (!state.slot) return;
  state.slot.spinsUsedToday = 0;
  state.slot.slotBoostActive = false;
  state.slot.boostType = null;
  state.slot.boostValue = 0;
  state.slot.lastOutcomeMessage = null;
  reapplySlotBoost();
  renderBetslip();
  console.log('[Parlay Slot] Daily spins reset (Demo mode)');
}

export function quickAddThreePairs() {
  state.selections = [
    {
      id: 1001,
      match: 'France vs Spain',
      selection: '1 (France pobeda)',
      baseOdds: 2.57,
      boostedOdds: 2.57,
      slotBoostPercent: 0,
      isBoosted: false,
      hasCrashed: false,
      isEligible: true,
      marketGroup: '1x2',
      isLowMargin: false,
      sport: 'football'
    },
    {
      id: 1002,
      match: 'England vs Argentina',
      selection: '3+ Gola',
      baseOdds: 2.27,
      boostedOdds: 2.27,
      slotBoostPercent: 0,
      isBoosted: false,
      hasCrashed: false,
      isEligible: false,
      marketGroup: 'classic',
      isLowMargin: false,
      sport: 'football'
    },
    {
      id: 1003,
      match: 'Brazil vs Germany',
      selection: '1X (Dvoznak)',
      baseOdds: 1.32,
      boostedOdds: 1.32,
      slotBoostPercent: 0,
      isBoosted: false,
      hasCrashed: false,
      isEligible: false,
      marketGroup: 'low_margin',
      isLowMargin: true,
      sport: 'football'
    }
  ];
  state.currentBet = state.selections[0];
  
  // Highlight buttons on the odds board if matches are displayed
  document.querySelectorAll('.match-row').forEach(row => {
    const teams = row.querySelector('.match-teams')?.textContent.replace(/\s+/g, ' ') || '';
    if (teams.includes('France') && teams.includes('Spain')) {
      row.querySelectorAll('.odds-btn').forEach(b => { if (b.textContent.includes('2.57')) b.classList.add('selected'); });
    }
    if (teams.includes('England') && teams.includes('Argentina')) {
      row.querySelectorAll('.odds-btn').forEach(b => { if (b.textContent.includes('2.27')) b.classList.add('selected'); });
    }
    if (teams.includes('Brazil') && teams.includes('Germany')) {
      row.querySelectorAll('.odds-btn').forEach(b => { if (b.textContent.includes('1.32')) b.classList.add('selected'); });
    }
  });

  if (state.slot && state.slot.slotBoostActive) {
    reapplySlotBoost();
  }
  
  renderBetslip();
}

export function updateSlotOverride(val) {
  if (!state.slot) return;
  state.slot.demoOverride = val;
  console.log('[Presentation Control] Parlay slot override set to: ' + val);
}

export function removeBet() {
  resetAllOddsToDefault();
  resetTurboAttempts(); // bet placed or session reset → next ticket gets fresh attempts
  state.currentBet = null;
  renderBetslip();
}
