/**
 * ==========================================================================
 * MERKUR XTIP — TURBO X ROCKET FLIGHT ENGINE
 * Rocket arena lifecycle, secret max boost generation, animated flight loop,
 * crash/lock-in outcomes, and celebratory FX.
 * ==========================================================================
 */

import { state, i18n, t, getMatchMarginByName } from './state.js';
import { playLaunchSound, playTickSound, playSuccessSound, playCrashSound } from './audio.js';
import { renderBetslip, showToast, toggleBetslipDrawer } from './app.js';

// One Turbo X attempt per match on the ticket. Keyed on the match rather than the
// selection object so removing and re-adding the pick cannot grant a fresh attempt.
export function isTurboAttemptUsed(sel) {
  return !!(sel && sel.match && state.game.usedTurboMatches.includes(sel.match));
}

export function resetTurboAttempts() {
  state.game.usedTurboMatches = [];
}

function consumeTurboAttempt(sel) {
  if (sel && sel.match && !state.game.usedTurboMatches.includes(sel.match)) {
    state.game.usedTurboMatches.push(sel.match);
  }
}

export function openRocketArena() {
  // Mutual exclusion: Mystery Box ticket is incompatible with Turbo X
  if (state.mysteryBox && state.mysteryBox.isMysteryTicketActive) {
    state.game.turboTarget = null;
    showToast(t('mysteryBoxActiveWarning'), 'info');
    return;
  }
  if (!state.game.turboTarget && isTurboAttemptUsed(state.currentBet)) {
    showToast(t('turboAttemptUsed'), 'error');
    return;
  }
  toggleBetslipDrawer(false); // Hide the drawer when launch starts on mobile
  startRocketLaunch();
}

function clearRocketTimeouts() {
  if (!state.game.hudTimeouts) {
    state.game.hudTimeouts = [];
  }
  state.game.hudTimeouts.forEach(id => clearTimeout(id));
  state.game.hudTimeouts = [];
}

function registerRocketTimeout(fn, delayMs) {
  if (!state.game.hudTimeouts) {
    state.game.hudTimeouts = [];
  }
  const id = setTimeout(() => {
    state.game.hudTimeouts = state.game.hudTimeouts.filter(tId => tId !== id);
    fn();
  }, delayMs);
  state.game.hudTimeouts.push(id);
  return id;
}

function hideRocketOverlay() {
  const overlay = document.getElementById('odds-flight-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    overlay.style.opacity = '0';
  }
  const rocketEl = document.getElementById('live-board-rocket');
  if (rocketEl) {
    rocketEl.style.display = 'none';
    rocketEl.style.opacity = '0';
  }
  const hudPill = document.getElementById('flight-hud-pill');
  if (hudPill) {
    hudPill.style.display = 'none';
    hudPill.style.opacity = '0';
  }
}

function closeRocketArena() {
  clearRocketTimeouts();
  if (state.game.isRunning) {
    triggerCrash();
  }
  hideRocketOverlay();
}

export function launchPairTurbo(index, event) {
  if (event) event.stopPropagation();
  if (!state.selections || !state.selections[index]) return;
  const sel = state.selections[index];
  if (!sel.isEligible) {
    showToast('🛡️ Turbo X je dostupan samo na 1X2 marketu.', 'error');
    return;
  }
  if (isTurboAttemptUsed(sel)) {
    showToast(t('turboAttemptUsed'), 'error');
    return;
  }
  
  // Mutually exclusive rule with Parlay Slot Spins:
  // "Turbo moze da se odigra i na akumulatorima, ali onda ne vaze spinovi i obrnuto."
  if (state.slot && state.slot.slotBoostActive) {
    state.slot.slotBoostActive = false;
    state.slot.boostValue = 0;
    state.slot.lastOutcomeMessage = 'ℹ️ Turbo je aktiviran za par — Parlay Slot spinovi/boost su onemogućeni (uzajamno isključivo sa Turbom).';
  }
  
  state.game.turboTarget = { type: 'pair', index: index };
  
  state.currentBet = {
    match: sel.match,
    selection: sel.selection,
    baseOdds: sel.baseOdds,
    boostedOdds: sel.boostedOdds || sel.baseOdds,
    boostPercent: sel.turboPercent || 0,
    isBoosted: sel.isTurboBoosted || false,
    hasCrashed: false,
    isEligible: sel.isEligible
  };
  
  openRocketArena();
}

export function generateSecretMaxBoost(marginOverride, useDms = true, vipOverride) {
  const override = state.game.demoOverride;
  if (override === '6') return 6.2;
  if (override === '15') return 15.4;
  if (override === '38') return 38.7;
  if (override === 'fast_crash') return 2.1;
  
  // 1. Determine Match Margin (Overround) & VIP Tier
  // Priority: explicit argument (simulator) → demo override → fixture's 1X2 overround → 6.5% default
  let margin;
  if (marginOverride !== undefined) {
    margin = parseFloat(marginOverride);
  } else if (state.game.marginOverride != null) {
    margin = state.game.marginOverride;
  } else {
    const bet = state.currentBet;
    margin = (bet && (bet.matchMargin ?? getMatchMarginByName(bet.match))) ?? 6.5;
  }
  const vip = vipOverride !== undefined ? vipOverride : (state.game.vipTier || 'standard');
  
  // 2. Calculate DMS Damping Factor (alpha) and Max Cap if DMS is active
  let alpha = 1.0;
  let dmsCap = 85.0;
  
  if (useDms) {
    if (margin >= 6.0) {
      // Tier 1: Standard / High Margin -> Full power
      alpha = 1.0;
      dmsCap = 85.0;
    } else if (margin >= 3.0) {
      // Tier 2: Medium / Derby Margin -> Throttled (max ~25%)
      alpha = margin / 6.5;
      dmsCap = 25.0;
    } else {
      // Tier 3: Low / Zero Margin (<3.0% Super Promo) -> Micro-Boost (max ~8%)
      alpha = Math.max(0.18, margin / 6.5);
      dmsCap = 8.0;
    }
  }

  // 3. Calculate VIP Tier Scaling (beta & vipCap)
  let beta = 1.0;
  let vipCap = 85.0;
  if (vip === 'standard') {
    beta = 0.45; vipCap = 15.0;
  } else if (vip === 'gold') {
    beta = 0.85; vipCap = 45.0;
  } else if (vip === 'diamond') {
    beta = 1.25; vipCap = 100.0;
  }

  // Combined Cap is the minimum of dmsCap and vipCap (unless diamond on Tier 1, which unlocks up to 100%!)
  const effectiveCap = useDms ? Math.min(dmsCap, vipCap) : vipCap;

  // 4. Generate base weighted random distribution (Aviator curve)
  const rand = Math.random();
  let rawBoost = 0;
  if (rand < 0.35) {
    rawBoost = 3 + Math.random() * 6;
  } else if (rand < 0.75) {
    rawBoost = 9 + Math.random() * 13;
  } else if (rand < 0.93) {
    rawBoost = 22 + Math.random() * 23;
  } else {
    rawBoost = 45 + Math.random() * 40;
  }

  // 5. Apply Combined Throttling
  const scaledBoost = Math.min(effectiveCap, rawBoost * alpha * beta);
  return parseFloat(scaledBoost.toFixed(2));
}

function startRocketLaunch() {
  clearRocketTimeouts();
  
  if (state.game.isRunning) return;
  
  state.game.isRunning = true;
  const target = (state.game.turboTarget && state.game.turboTarget.type === 'pair')
    ? state.selections[state.game.turboTarget.index]
    : state.currentBet;
  consumeTurboAttempt(target);
  if (state.currentBet) state.currentBet.hasCrashed = false;
  state.game.currentBoost = 0.0;
  state.game.secretMaxBoost = generateSecretMaxBoost();
  state.game.startTime = performance.now();
  
  const overlay = document.getElementById('odds-flight-overlay');
  if (overlay) {
    overlay.style.display = 'block';
    overlay.style.opacity = '1';
    overlay.classList.add('active');
  }
  document.body.classList.add('rocket-flying'); // hides mobile betslip bar + settings during flight
  
  // Smoothly scroll main league card into viewport if user is scrolled away
  const cardEl = document.getElementById('main-league-card');
  if (cardEl) {
    const cardRect = cardEl.getBoundingClientRect();
    if (cardRect.bottom < 0 || cardRect.top > window.innerHeight) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Reset rocket element visibility & position clean state
  const rocketEl = document.getElementById('live-board-rocket');
  if (rocketEl) {
    rocketEl.style.display = 'block';
    rocketEl.style.opacity = '1';
    rocketEl.style.transition = 'none'; // Avoid teleport animation at start
  }

  // Reset HUD pill state & ensure standard innerHTML containing #live-multiplier-val is present
  const hudPill = document.getElementById('flight-hud-pill');
  if (hudPill) {
    hudPill.classList.remove('hud-crashed');
    hudPill.style.display = 'flex';
    hudPill.style.opacity = '1';
    hudPill.style.transform = 'none';
    hudPill.style.transition = 'none';

    if (!document.getElementById('live-multiplier-val')) {
      const btnText = i18n[state.lang]?.btnStop || 'ZAUSTAVI I ZAKLJUČAJ BOOST!';
      const boostLabel = i18n[state.lang]?.multiplierTitle || 'TRENUTNI BOOST:';
      hudPill.innerHTML = `
        <div class="hud-left-group">
          <span class="hud-rocket-icon">🚀</span>
          <div class="hud-boost-label" data-i18n="multiplierTitle">${boostLabel}</div>
          <div class="hud-boost-val safe" id="live-multiplier-val">+0.0%</div>
        </div>
        <button class="btn-hud-stop" id="hud-stop-btn" onclick="stopRocket(true)">
          <span>🛑</span> <span data-i18n="btnStop" class="btn-hud-stop-text">${btnText}</span>
        </button>`;
    }
  }

  // Auto-collapse settings panel if it was open so it doesn't overlap the HUD pill
  const demoBar = document.getElementById('demo-control-bar');
  if (demoBar && !demoBar.classList.contains('collapsed')) {
    demoBar.classList.add('collapsed');
  }
  
  // Clear old trails and toasts
  const trailContainer = document.getElementById('flight-trail-container');
  if (trailContainer) trailContainer.innerHTML = '';
  
  const toast = document.getElementById('flight-outcome-toast');
  if (toast) toast.className = 'flight-outcome-toast';
  
  // Find selected odds button on the board to spawn rocket directly from it!
  let selectedBtn = null;
  if (state.game.turboTarget && state.game.turboTarget.type === 'pair') {
    const selIdx = state.game.turboTarget.index;
    const sel = state.selections && state.selections[selIdx];
    if (sel) {
      const allSelectedBtns = document.querySelectorAll('.odds-btn.selected');
      for (const btn of allSelectedBtns) {
        if (btn.innerText.includes(sel.baseOdds.toFixed(2))) {
          selectedBtn = btn;
          break;
        }
      }
    }
  }
  if (!selectedBtn) {
    selectedBtn = document.querySelector('.odds-btn.selected');
  }

  let startX = 40;
  let startY = 120;
  
  if (selectedBtn && cardEl) {
    const cardRect = cardEl.getBoundingClientRect();
    const btnRect = selectedBtn.getBoundingClientRect();
    // On mobile devices, start from left edge of card to ensure full horizontal flight
    startX = window.innerWidth <= 768 ? 15 : (btnRect.left - cardRect.left);
    startY = btnRect.top - cardRect.top - 15;
  }
  
  state.game.flightStartX = startX;
  state.game.flightStartY = startY;
  
  if (rocketEl) {
    rocketEl.style.transform = `translate(${startX}px, ${startY}px)`;
    requestAnimationFrame(() => {
      if (rocketEl) rocketEl.style.transition = 'transform 0.08s linear';
    });
  }
  
  // Update betslip button to STOP & LOCK IN while rocket is flying
  const launchBtn = document.querySelector('.btn-rocket-launch');
  if (launchBtn) {
    launchBtn.style.background = 'linear-gradient(135deg, #ff0044 0%, #ff6a00 100%)';
    launchBtn.style.borderColor = '#ffde00';
    launchBtn.innerHTML = `<span>🛑</span> <span>${i18n[state.lang].btnStop}</span>`;
    launchBtn.onclick = () => stopRocket(true);
  }
  
  playLaunchSound();
  
  let lastTickTime = 0;
  let lastSparkTime = 0;
  
  function frame(timestamp) {
    if (!state.game.isRunning) return;
    
    const elapsedSec = (timestamp - state.game.startTime) / 1000;
    
    // Exponential growth formula: slow at first, rising faster
    state.game.currentBoost = 1.8 * elapsedSec + 0.45 * Math.pow(elapsedSec, 2);
    
    // Play tick sound periodically
    if (timestamp - lastTickTime > 250 && state.game.currentBoost > 0.5) {
      const pitch = 1 + (state.game.currentBoost / 40);
      playTickSound(pitch);
      lastTickTime = timestamp;
    }
    
    // Check if we reached/passed the secret max boost -> CRASH!
    if (state.game.currentBoost >= state.game.secretMaxBoost) {
      triggerCrash();
      return;
    }
    
    updateDisplayValues(state.game.currentBoost);
    
    // Move rocket smoothly horizontally across the odds table
    const cardRect = cardEl ? cardEl.getBoundingClientRect() : { width: 800 };
    const maxTravel = cardRect.width - state.game.flightStartX - 110;
    const travelDist = Math.min(maxTravel > 50 ? maxTravel : 600, elapsedSec * 140);
    const curX = state.game.flightStartX + travelDist;
    const curY = state.game.flightStartY - Math.min(60, elapsedSec * 15) + Math.sin(elapsedSec * 6) * 8;
    
    // Track live position so triggerCrash knows where to spawn the explosion
    state.game.lastRocketX = curX;
    state.game.lastRocketY = curY;
    
    if (rocketEl) {
      rocketEl.style.transform = `translate(${curX}px, ${curY}px)`;
    }
    
    // Spawn spark dot in trail every 80ms
    if (timestamp - lastSparkTime > 80 && trailContainer) {
      const dot = document.createElement('div');
      dot.className = 'flight-spark-dot';
      dot.style.left = `${curX + 12}px`;
      dot.style.top = `${curY + 22}px`;
      dot.style.width = `${6 + Math.random() * 6}px`;
      dot.style.height = dot.style.width;
      dot.style.backgroundColor = ['#ff9a00', '#ffd700', '#ff3300', '#ffffff'][Math.floor(Math.random() * 4)];
      trailContainer.appendChild(dot);
      
      setTimeout(() => dot.remove(), 600);
      lastSparkTime = timestamp;
    }
    
    state.game.animationFrameId = requestAnimationFrame(frame);
  }
  
  state.game.animationFrameId = requestAnimationFrame(frame);
}

function updateDisplayValues(boostVal) {
  const multEl = document.getElementById('live-multiplier-val');
  if (multEl) {
    multEl.textContent = `+${boostVal.toFixed(1)}%`;
    if (boostVal < 10) multEl.className = 'hud-boost-val safe';
    else if (boostVal < 25) multEl.className = 'hud-boost-val warm';
    else if (boostVal < 40) multEl.className = 'hud-boost-val hot';
    else multEl.className = 'hud-boost-val critical';
  }
}

export function stopRocket(userClickedStop) {
  if (!state.game.isRunning) return;
  
  state.game.isRunning = false;
  cancelAnimationFrame(state.game.animationFrameId);
  document.body.classList.remove('rocket-flying'); // restore mobile betslip bar
  
  const lockedBoost = state.game.currentBoost;
  let newOdds = 1.00;
  
  // Apply to current single bet if exists and no specific pair target is set
  if (state.currentBet && !state.game.turboTarget) {
    const base = state.currentBet.baseOdds;
    newOdds = base * (1 + lockedBoost / 100);
    state.currentBet.boostPercent = lockedBoost;
    state.currentBet.boostedOdds = newOdds;
    state.currentBet.isBoosted = true;
    state.currentBet.isTurboBoosted = true;
    state.currentBet.turboPercent = lockedBoost;
    state.currentBet.hasCrashed = false;
  }

  if (state.game.turboTarget) {
    if (state.game.turboTarget.type === 'pair') {
      const idx = state.game.turboTarget.index;
      if (state.selections && state.selections[idx]) {
        const sel = state.selections[idx];
        sel.isTurboBoosted = true;
        sel.turboPercent = lockedBoost;
        newOdds = parseFloat((sel.baseOdds * (1 + lockedBoost / 100)).toFixed(2));
        sel.boostedOdds = newOdds;
        sel.isBoosted = true;
        sel.hasCrashed = false;
      }
    }
    state.game.turboTarget = null;
  }
  
  playSuccessSound();
  
  // ── Immediately hide the HUD pill — boost is locked ──
  const hudPill = document.getElementById('flight-hud-pill');
  if (hudPill) {
    hudPill.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    hudPill.style.opacity = '0';
    hudPill.style.transform = 'translateY(16px)';
  }
  
  // Update selected odds button directly on the board with glowing green border!
  const selectedBtn = document.querySelector('.odds-btn.selected');
  if (selectedBtn && newOdds > 1.00) {
    selectedBtn.innerHTML = `${newOdds.toFixed(2)} <span class="odds-boost-badge">🚀</span>`;
    selectedBtn.classList.add('boost-locked-in');
  }
  
  // Show Toast
  const toast = document.getElementById('flight-outcome-toast');
  if (toast && newOdds > 1.00) {
    toast.className = 'flight-outcome-toast success show';
    toast.innerHTML = `🎉 ${i18n[state.lang].successTitle} <strong style="color:#2ecc71;">+${lockedBoost.toFixed(1)}%</strong>! (Nova Kvota: <strong>${newOdds.toFixed(2)}</strong>)`;
    toast.onclick = () => { toast.className = 'flight-outcome-toast'; };
    
    registerRocketTimeout(() => {
      if (toast) toast.className = 'flight-outcome-toast';
    }, 3800);
  }
  
  renderBetslip();
  triggerConfetti();
  
  // Auto hide overlay after 4.2 seconds
  registerRocketTimeout(() => {
    if (!state.game.isRunning) {
      hideRocketOverlay();
    }
    const toast = document.getElementById('flight-outcome-toast');
    if (toast) toast.className = 'flight-outcome-toast';
  }, 4200);
}

function triggerCrash() {
  state.game.isRunning = false;
  cancelAnimationFrame(state.game.animationFrameId);
  document.body.classList.remove('rocket-flying'); // restore mobile betslip bar
  
  // Capture last known rocket position before hiding it
  const explX = (state.game.lastRocketX ?? state.game.flightStartX) + 45;
  const explY = (state.game.lastRocketY ?? state.game.flightStartY) + 19;
  
  // Hide rocket immediately
  const rocketEl = document.getElementById('live-board-rocket');
  if (rocketEl) rocketEl.style.opacity = '0';
  
  // ── IMMEDIATELY update HUD pill to show crash message ───────────────────────
  const hudPill = document.getElementById('flight-hud-pill');
  if (hudPill) {
    const t = i18n[state.lang];
    hudPill.innerHTML = `
      <div class="hud-crash-message">
        <span class="hud-crash-icon">💥</span>
        <div class="hud-crash-text">
          <span class="hud-crash-title">${t.rocketCrashedTitle}</span>
          <span class="hud-crash-sub">${t.rocketCrashedSub}</span>
        </div>
      </div>`;
    hudPill.classList.add('hud-crashed');
    // Fade out the pill after 2.5s
    registerRocketTimeout(() => {
      if (!state.game.isRunning && hudPill) {
        hudPill.style.opacity = '0';
        hudPill.style.transform = 'translateY(20px)';
        hudPill.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      }
    }, 2500);
  }
  
  // Spawn explosion at last rocket position
  triggerExplosion(explX, explY);
  
  playCrashSound();
  
  if (state.currentBet && !state.game.turboTarget) {
    state.currentBet.boostPercent = 0;
    state.currentBet.boostedOdds = state.currentBet.baseOdds;
    state.currentBet.isBoosted = false;
    state.currentBet.isTurboBoosted = false;
    state.currentBet.turboPercent = 0;
    state.currentBet.hasCrashed = true;
  }

  if (state.game.turboTarget) {
    if (state.game.turboTarget.type === 'pair') {
      const idx = state.game.turboTarget.index;
      if (state.selections && state.selections[idx]) {
        const sel = state.selections[idx];
        sel.isTurboBoosted = false;
        sel.turboPercent = 0;
        sel.boostedOdds = sel.baseOdds;
        sel.isBoosted = false;
        sel.hasCrashed = true;
      }
    }
    state.game.turboTarget = null;
  }
  
  const selectedBtn = document.querySelector('.odds-btn.selected');
  if (selectedBtn) {
    selectedBtn.classList.remove('boost-locked-in');
    if (state.currentBet) {
      selectedBtn.innerHTML = `${state.currentBet.baseOdds.toFixed(2)} <span class="odds-boost-badge">⚡</span>`;
    }
  }
  
  // Delay toast slightly so explosion is seen first
  const t = i18n[state.lang];
  registerRocketTimeout(() => {
    const toast = document.getElementById('flight-outcome-toast');
    if (toast && !state.game.isRunning) {
      toast.className = 'flight-outcome-toast crash show';
      toast.innerHTML = `💥 ${t.crashTitle}<br><span style="font-size:14px; color:#fff;">${t.crashSubNoBonus}</span>`;
      toast.onclick = () => { toast.className = 'flight-outcome-toast'; };
      
      registerRocketTimeout(() => {
        if (toast) toast.className = 'flight-outcome-toast';
      }, 3500);
    }
  }, 320);
  
  renderBetslip();
  
  // Auto hide overlay & all flight elements after 4.5 seconds
  registerRocketTimeout(() => {
    if (!state.game.isRunning) {
      hideRocketOverlay();
    }
    const toast = document.getElementById('flight-outcome-toast');
    if (toast) toast.className = 'flight-outcome-toast';
  }, 4500);
}

// ============================================================================
// ROCKET EXPLOSION ANIMATION ENGINE
// Pure-DOM particle system: shockwave + flash + debris + smoke + screen shake
// ============================================================================
function triggerExplosion(cx, cy) {
  const overlay = document.getElementById('odds-flight-overlay');
  if (!overlay) return;

  // ── 1. SCREEN SHAKE ─────────────────────────────────────────────────────────
  const card = document.getElementById('main-league-card');
  if (card) {
    card.classList.add('explosion-shake');
    setTimeout(() => card.classList.remove('explosion-shake'), 600);
  }

  // ── 2. INSTANTANEOUS WHITE FLASH ────────────────────────────────────────────
  const flash = document.createElement('div');
  flash.className = 'expl-flash';
  flash.style.left = `${cx}px`;
  flash.style.top  = `${cy}px`;
  overlay.appendChild(flash);
  setTimeout(() => flash.remove(), 350);

  // ── 3. SHOCKWAVE RING (expands outward) ─────────────────────────────────────
  for (let r = 0; r < 3; r++) {
    const ring = document.createElement('div');
    ring.className = 'expl-ring';
    ring.style.left = `${cx}px`;
    ring.style.top  = `${cy}px`;
    ring.style.animationDelay = `${r * 80}ms`;
    ring.style.borderColor = ['#ff6a00', '#ff0044', '#ffd700'][r];
    overlay.appendChild(ring);
    setTimeout(() => ring.remove(), 900 + r * 80);
  }

  // ── 4. FIREBALL CORE (glowing orb that expands then fades) ──────────────────
  const fireball = document.createElement('div');
  fireball.className = 'expl-fireball';
  fireball.style.left = `${cx}px`;
  fireball.style.top  = `${cy}px`;
  overlay.appendChild(fireball);
  setTimeout(() => fireball.remove(), 700);

  // ── 5. DEBRIS SHARDS ────────────────────────────────────────────────────────
  const debrisColors = ['#ff9a00','#ff3300','#ffd700','#ff0044','#ffffff','#ff6a00','#ffde00'];
  const debrisCount  = 65;

  for (let i = 0; i < debrisCount; i++) {
    const el = document.createElement('div');
    const isLong = Math.random() > 0.5;
    el.className = 'expl-debris';

    // Shape: mix of dots, tiny rects, and elongated shards
    const sz = 3 + Math.random() * 9;
    el.style.width  = isLong ? `${sz * (1.5 + Math.random() * 2)}px` : `${sz}px`;
    el.style.height = `${sz}px`;
    el.style.borderRadius = isLong ? '2px' : '50%';
    el.style.background = debrisColors[Math.floor(Math.random() * debrisColors.length)];
    el.style.left = `${cx}px`;
    el.style.top  = `${cy}px`;
    el.style.boxShadow = `0 0 ${4 + Math.random() * 6}px ${el.style.background}`;

    // Random trajectory
    const angle    = Math.random() * Math.PI * 2;
    const speed    = 60 + Math.random() * 220;
    const tx       = Math.cos(angle) * speed;
    const ty       = Math.sin(angle) * speed;
    const rotate   = (Math.random() - 0.5) * 720;
    const duration = 500 + Math.random() * 700;
    const delay    = Math.random() * 60;

    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.setProperty('--rot', `${rotate}deg`);
    el.style.animationDuration = `${duration}ms`;
    el.style.animationDelay    = `${delay}ms`;

    overlay.appendChild(el);
    setTimeout(() => el.remove(), duration + delay + 100);
  }

  // ── 6. SMOKE PUFFS ──────────────────────────────────────────────────────────
  const smokeCount = 10;
  for (let i = 0; i < smokeCount; i++) {
    const puff = document.createElement('div');
    puff.className = 'expl-smoke';
    const angle = Math.random() * Math.PI * 2;
    const dist  = 20 + Math.random() * 55;
    puff.style.left = `${cx + Math.cos(angle) * dist * 0.3}px`;
    puff.style.top  = `${cy + Math.sin(angle) * dist * 0.3}px`;
    const sz = 18 + Math.random() * 32;
    puff.style.width  = `${sz}px`;
    puff.style.height = `${sz}px`;
    puff.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}px`);
    puff.style.setProperty('--ty', `${-(20 + Math.random() * 60)}px`);
    puff.style.animationDelay = `${80 + i * 40}ms`;
    puff.style.animationDuration = `${900 + Math.random() * 500}ms`;
    overlay.appendChild(puff);
    setTimeout(() => puff.remove(), 1600 + i * 40);
  }

  // ── 7. SECONDARY MINI-EXPLOSIONS ────────────────────────────────────────────
  const miniCount = 5;
  for (let m = 0; m < miniCount; m++) {
    setTimeout(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 25 + Math.random() * 70;
      const mx = cx + Math.cos(angle) * dist;
      const my = cy + Math.sin(angle) * dist;
      // Mini flash
      const mf = document.createElement('div');
      mf.className = 'expl-mini-flash';
      mf.style.left = `${mx}px`;
      mf.style.top  = `${my}px`;
      mf.style.background = ['#ff9a00','#ffd700','#ff0044'][Math.floor(Math.random() * 3)];
      overlay.appendChild(mf);
      setTimeout(() => mf.remove(), 300);
    }, 80 + m * 100);
  }
}

export function triggerConfetti() {
  const overlay = document.getElementById('odds-flight-overlay');
  if (!overlay) return;
  
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.width = (6 + Math.random() * 6) + 'px';
    p.style.height = (6 + Math.random() * 6) + 'px';
    p.style.backgroundColor = ['#ffd700', '#2ecc71', '#ff9a00', '#ffffff', '#ff0055'][Math.floor(Math.random() * 5)];
    p.style.left = `${state.game.flightStartX + 100}px`;
    p.style.top = `${state.game.flightStartY}px`;
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    p.style.zIndex = '200';
    p.style.pointerEvents = 'none';
    
    overlay.appendChild(p);
    
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 180;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    
    p.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
      duration: 800 + Math.random() * 600,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }).onfinish = () => p.remove();
  }
}

