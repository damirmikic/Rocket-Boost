/**
 * ==========================================================================
 * MERKUR XTIP — ROCKET BOOST GAME ENGINE & STATE MANAGER
 * Handles betting slip interactions, Rocket Aviator physics, and Audio
 * ==========================================================================
 */

// Global State
const state = {
  lang: 'sr', // 'sr' | 'en'
  soundEnabled: true,
  currentBet: {
    match: 'France vs Spain',
    selection: '1 (France pobeda)',
    baseOdds: 2.57,
    boostedOdds: 2.57,
    boostPercent: 0,
    stake: 1000, // RSD / EUR
    isBoosted: false,
    matchMargin: 6.5 // Default Standard Hold (6.50%)
  },
  game: {
    isRunning: false,
    currentBoost: 0,
    secretMaxBoost: 15.0,
    startTime: 0,
    animationFrameId: null,
    demoOverride: 'random', // 'random' | '6' | '15' | '38' | 'fast_crash'
    vipTier: 'standard' // 'standard' | 'gold' | 'diamond'
  },
  sim: {
    trials: 10000,
    baseMargin: 6.5,
    dmsEnabled: true, // Automated Dynamic Margin Scaling protection
    vipSegment: 'standard' // 'standard' | 'gold' | 'diamond'
  }
};

// Translations Dictionary
const i18n = {
  sr: {
    login: 'PRIJAVI SE',
    register: 'REGISTRUJ SE',
    betting: 'Klađenje',
    live: 'Uživo',
    ticket: 'TIKET',
    emptyBetslip: 'Odaberi opkladu klikom na željenu kvotu',
    stakeLabel: 'Uplata (RSD):',
    possibleWin: 'Mogući dobitak:',
    placeBetNormal: 'UPLATI OPKLADU',
    launchRocketBtn: 'POKRENI TURBO X',
    eligibilityInfo: '⚡ Čestitamo! Tvoja opklada je kvalifikovana za Turbo X multiplikator!',
    ticketCheck: 'PROVERA TIKETA',
    ticketStatus: 'STATUS EXPRESS TIKETA',
    checkBtn: 'PROVERI',
    cockpitTitle: '⚡ TURBO X MULTIPLIKATOR ARENA',
    baseOddsLabel: 'Osnovna Kvota:',
    liveBoostedLabel: 'Boost Kvota:',
    multiplierTitle: 'TRENUTNI TURBO X BOOST',
    btnLaunch: '🚀 POKRENI TURBO X LET!',
    btnStop: '🛑 ZAKLJUČAJ TURBO X DOBITAK!',
    btnContinue: 'NASTAVI NA TIKET ➔',
    successTitle: '🎉 TURBO X USPEŠNO ZAKLJUČAN!',
    successSub: 'Tvoja kvota je uvećana za',
    crashTitle: '💥 BOOM! RAKETA JE EKSPLODIRALA!',
    crashSubNoBonus: 'Raketa je eksplodirala pre nego što si kliknuo STOP! Srećno sledeći put.',
    crashSubConsolation: 'Raketa je eksplodirala, ali osvajaš utešni Turbo X boost od:',
    placedModalTitle: '✅ TIKET JE USPEŠNO UPLAĆEN!',
    placedModalSub: 'Tvoj Turbo X tiket je primljen i registrovan.',
    simTitle: 'MONTE CARLO SIMULATOR PROFITABILNOSTI',
    simSubTitle: 'Masovno testiranje finansijske održivosti kroz simulirane tikete',
    simTrialsLabel: 'Broj Simuliranih Tiketa:',
    simMarginLabel: 'Osnovna Margin Kladionice (Hold):',
    simVipLabel: 'VIP Status Igrača (Multipliers):',
    simPoolLabel: 'Profil Ponašanja Igrača & Zaštita:',
    btnRunSim: 'POKRENI SIMULACIJU / RUN TEST',
    pitchTitle: 'KAKO PREDSTAVITI MEHANIKU MENADŽMENTU',
    pitchPoint1: 'Skriveni maksimum koristi težinsku verovatnoću (17.5% brzi crash, 36% srednji, 18.8% jackpot). Pošto igrači koji jure visoke kvote (+30%) padaju u 81% slučajeva, stvarni trošak isplate ostaje strogo kontrolisan oko +5.7%, čuvajući preko 55% osnovne margine.',
    pitchPoint2: 'Igrači vide kako multiplikator raste do +30% ili +45%, što pruža psihološko uzbuđenje Aviator igre unutar sportskog tiketa. Korisnik ima osećaj da pobeđuje kladionicu, dok sistem ostaje matematički održiv.',
    pitchPoint3: 'Kada raketa eksplodira na >4%, postoji 35% šanse za utešni boost (0.25 × M). Ova "near-miss" nagrada sprečava frustraciju i održava stopu ponovnog klađenja izuzetno visokom.',
    pitchPoint4: 'EKSKLUZIVNA VIP DOSTUPNOST (CRM DROPS): Mehanika NIJE stalno dostupna svima! Dodeljuje se kvalifikovanim igračima 1x do 4x mesečno kao loyalty bonus u zavisnosti od statusa (Standard, Gold, Diamond). Ovo štiti budžet i stvara ogroman FOMO i želju za depozitom na početku meseca!',
    pitchPoint5: 'AUTOMATSKA ZAŠTITA MARGINE (DMS Engine): Na mečevima sa malom marginom (npr. derbi ili Super Kvota sa 1.5% holda), sistem automatski smanjuje damping faktor i limitira maksimalni boost na +8% umesto +85%, garantujući +EV status kuće.'
  },
  en: {
    login: 'LOG IN',
    register: 'REGISTER',
    betting: 'Sportsbook',
    live: 'Live In-Play',
    ticket: 'BETSLIP',
    emptyBetslip: 'Select a bet by clicking on any odds button',
    stakeLabel: 'Stake Amount (EUR):',
    possibleWin: 'Potential Payout:',
    placeBetNormal: 'PLACE BET',
    launchRocketBtn: 'LAUNCH TURBO X',
    eligibilityInfo: '⚡ Congratulations! Your bet is eligible for the Turbo X multiplier!',
    ticketCheck: 'TICKET CHECK',
    ticketStatus: 'EXPRESS STATUS',
    checkBtn: 'CHECK',
    cockpitTitle: '⚡ TURBO X MULTIPLIER ARENA',
    baseOddsLabel: 'Base Odds:',
    liveBoostedLabel: 'Boosted Odds:',
    multiplierTitle: 'CURRENT TURBO X BOOST',
    btnLaunch: '🚀 LAUNCH TURBO X FLIGHT!',
    btnStop: '🛑 STOP & LOCK IN TURBO X!',
    btnContinue: 'CONTINUE TO BETSLIP ➔',
    successTitle: '🎉 TURBO X SUCCESSFULLY LOCKED!',
    successSub: 'Your odds have been boosted by',
    crashTitle: '💥 BOOM! THE ROCKET CRASHED!',
    crashSubNoBonus: 'The rocket exploded before you pressed STOP! Better luck on your next launch.',
    crashSubConsolation: 'The rocket exploded, but you secured a consolation Turbo X boost of:',
    placedModalTitle: '✅ BET SUCCESSFULLY PLACED!',
    placedModalSub: 'Your Turbo X boosted ticket has been registered.',
    simTitle: 'MONTE CARLO PROFITABILITY SIMULATOR',
    simSubTitle: 'Mass-test financial sustainability across simulated bet lifecycles',
    simTrialsLabel: 'Simulated Tickets:',
    simMarginLabel: 'Base Sportsbook Hold (Overround):',
    simVipLabel: 'Player VIP Segment (Multipliers):',
    simPoolLabel: 'Player Traffic Profile:',
    btnRunSim: 'POKRENI SIMULACIJU / RUN TEST',
    pitchTitle: 'HOW TO PRESENT THIS MECHANIC TO STAKEHOLDERS',
    pitchPoint1: 'The secret maximum ($M$) uses weighted probability ($17.5\%$ fast crash, $36\%$ medium, $18.8\%$ jackpot). Because greedy players ($+30\%$ target) crash over $81\%$ of the time, the effective payout cost remains tightly bounded at ~5.7%, preserving >55% of the base house hold.',
    pitchPoint2: 'Bettors see live multipliers climbing up to +30% or +45%, giving the psychological thrill of an Aviator crash game inside a sportsbook ticket. The user *feels* like they are beating the bookmaker while staying mathematically sustainable.',
    pitchPoint3: 'When a rocket crashes at >4%, there is a 35% chance of a consolation mini-boost ($0.25 \times M$). This "near-miss" reward prevents frustration, keeping retention and re-bet rates extremely high.',
    pitchPoint4: 'VIP EXCLUSIVITY & CRM DROPS: This mechanic is NOT always-on! It is awarded to qualified players strictly 1x to 4x per month as a loyalty drop based on tier (Standard, Gold, Diamond). This protects budget and drives massive FOMO and start-of-month deposit retention!',
    pitchPoint5: 'AUTOMATED MARGIN PROTECTION (DMS Engine): On low-margin fixtures (e.g., derbies or Super Odds with 1.5% hold), the system automatically throttles the damping factor and caps the flight at +8% instead of +85%, guaranteeing positive house EV.'
  }
};

// ============================================================================
// WEB AUDIO API SYNTHESIZER (No external sound files required!)
// ============================================================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playLaunchSound() {
  if (!state.soundEnabled) return;
  initAudio();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 3);
  
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 3);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 3);
}

function playTickSound(pitchMultiplier = 1) {
  if (!state.soundEnabled) return;
  initAudio();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440 * pitchMultiplier, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function playSuccessSound() {
  if (!state.soundEnabled) return;
  initAudio();
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + i * 0.1);
    osc.stop(audioCtx.currentTime + i * 0.1 + 0.5);
  });
}

function playCrashSound() {
  if (!state.soundEnabled) return;
  initAudio();
  
  // Noise explosion
  const bufferSize = audioCtx.sampleRate * 0.6;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.6);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  noise.start();
}


// ============================================================================
// UI & BETSLIP UPDATE FUNCTIONS
// ============================================================================
function updateLanguageUI() {
  const t = i18n[state.lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  
  // Update stake symbol
  const stakeLabel = document.getElementById('stake-label-el');
  if (stakeLabel) stakeLabel.textContent = t.stakeLabel;
  
  renderBetslip();
}

function resetAllOddsToDefault() {
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

function selectOdds(btnEl, matchName, selectionName, oddsValue) {
  // If clicking the already selected button, toggle/reset flow!
  if (btnEl.classList.contains('selected')) {
    removeBet();
    return;
  }
  
  // First restore all odds buttons on the board back to their un-boosted default
  resetAllOddsToDefault();
  
  btnEl.classList.add('selected');
  
  state.currentBet = {
    match: matchName,
    selection: selectionName,
    baseOdds: parseFloat(oddsValue),
    boostedOdds: parseFloat(oddsValue),
    boostPercent: 0,
    stake: state.currentBet?.stake || 1000,
    isBoosted: false,
    hasCrashed: false,
    matchMargin: state.sim.baseMargin || 6.5
  };
  
  renderBetslip();
}

function renderBetslip() {
  const container = document.getElementById('betslip-content-area');
  if (!container) return;
  
  const t = i18n[state.lang];
  const bet = state.currentBet;
  const currency = state.lang === 'sr' ? 'RSD' : 'EUR';
  
  // Mobile bar elements
  const mobileBar = document.getElementById('mobile-betslip-bar');
  const mOddsEl = document.getElementById('m-betslip-odds');
  const mCountEl = document.getElementById('m-betslip-count');
  
  if (!bet || !bet.match) {
    container.innerHTML = `<div class="betslip-empty">${t.emptyBetslip}</div>`;
    if (mobileBar) {
      mobileBar.classList.remove('active');
    }
    toggleBetslipDrawer(false);
    return;
  }
  
  // Sync values to mobile bottom bar
  if (mobileBar && mOddsEl && mCountEl) {
    mCountEl.textContent = state.lang === 'sr' ? '1 Par' : '1 Selection';
    const oddsText = bet.isBoosted 
      ? `${bet.boostedOdds.toFixed(2)} ⚡` 
      : `${bet.baseOdds.toFixed(2)}`;
    mOddsEl.textContent = `${state.lang === 'sr' ? 'Kvota' : 'Odds'}: ${oddsText}`;
    mobileBar.classList.add('active');
  }
  
  const totalWin = (bet.stake * bet.boostedOdds).toFixed(2);
  const boostBadgeHTML = bet.isBoosted
    ? `<span class="original-odds">${bet.baseOdds.toFixed(2)}</span> <span class="boosted-odds">${bet.boostedOdds.toFixed(2)} ⚡ Turbo X (+${bet.boostPercent.toFixed(1)}%)</span>`
    : `<span class="boosted-odds" style="color:#fff;">${bet.baseOdds.toFixed(2)}</span>`;

  container.innerHTML = `
    <div class="bet-card ${bet.isBoosted ? 'boosted-card' : ''}">
      <div class="bet-card-header">
        <span class="bet-match">${bet.match}</span>
        <span class="bet-remove" onclick="removeBet()">×</span>
      </div>
      <div class="bet-selection">${bet.selection}</div>
      <div class="bet-odds-row">
        <span>Kvota / Odds:</span>
        <div>${boostBadgeHTML}</div>
      </div>
    </div>
    ${!bet.isBoosted && !bet.hasCrashed ? `
    <div class="eligibility-info">
      <i>⚡</i> <span>${t.eligibilityInfo}</span>
    </div>` : ''}

    <div class="stake-input-wrapper">
      <label class="stake-label" id="stake-label-el">${t.stakeLabel}</label>
      <input type="number" class="stake-input" id="stake-input-field" value="${bet.stake}" oninput="updateStake(this.value)" min="100" step="100" />
    </div>
    
    <div class="betslip-summary">
      <div class="summary-row">
        <span>Osnovna Kvota:</span>
        <span>${bet.baseOdds.toFixed(2)}</span>
      </div>
      ${bet.isBoosted ? `
      <div class="summary-row boosted-row">
        <span>⚡ Turbo X Multiplikator:</span>
        <span class="gold-text">✖️ ${bet.boostedOdds.toFixed(2)} (+${bet.boostPercent.toFixed(1)}%)</span>
      </div>` : ''}
      <div class="summary-row total-win">
        <span>${t.possibleWin}</span>
        <span>${totalWin} ${currency}</span>
      </div>
    </div>
    
    <!-- HIGH IMPACT LAUNCH TURBO X BUTTON -->
    <button class="btn-rocket-launch" onclick="openRocketArena()">
      <span class="rocket-icon-pulse">🚀</span>
      <span>${t.launchRocketBtn}</span>
    </button>
    
    <button class="btn-place-normal" onclick="placeBetFinal()">
      ${t.placeBetNormal}
    </button>
  `;
}

function updateStake(val) {
  const num = parseFloat(val);
  if (!isNaN(num) && num >= 0) {
    state.currentBet.stake = num;
    const currency = state.lang === 'sr' ? 'RSD' : 'EUR';
    const totalWinEl = document.querySelector('.summary-row.total-win span:last-child');
    if (totalWinEl) {
      totalWinEl.textContent = `${(num * state.currentBet.boostedOdds).toFixed(2)} ${currency}`;
    }
  }
}

function removeBet() {
  resetAllOddsToDefault();
  state.currentBet = null;
  renderBetslip();
}

function toggleBetslipDrawer(open) {
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


// ============================================================================
// ROCKET BOOST AVIATOR-STYLE GAME ENGINE
// ============================================================================
function openRocketArena() {
  toggleBetslipDrawer(false); // Hide the drawer when launch starts on mobile
  startRocketLaunch();
}

function closeRocketArena() {
  if (state.game.isRunning) {
    triggerCrash();
  }
  const overlay = document.getElementById('odds-flight-overlay');
  if (overlay) overlay.classList.remove('active');
}

function generateSecretMaxBoost(marginOverride, useDms = true, vipOverride) {
  const override = state.game.demoOverride;
  if (override === '6') return 6.2;
  if (override === '15') return 15.4;
  if (override === '38') return 38.7;
  if (override === 'fast_crash') return 2.1;
  
  // 1. Determine Match Margin (Overround) & VIP Tier
  const margin = marginOverride !== undefined ? parseFloat(marginOverride) : (state.currentBet ? (state.currentBet.matchMargin || 6.5) : 6.5);
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
  if (state.game.isRunning) return;
  
  state.game.isRunning = true;
  if (state.currentBet) state.currentBet.hasCrashed = false;
  state.game.currentBoost = 0.0;
  state.game.secretMaxBoost = generateSecretMaxBoost();
  state.game.startTime = performance.now();
  
  console.log(`[Demo Engine] Secret Max Boost generated: +${state.game.secretMaxBoost.toFixed(2)}%`);
  
  const overlay = document.getElementById('odds-flight-overlay');
  if (overlay) overlay.classList.add('active');
  document.body.classList.add('rocket-flying'); // hides mobile betslip bar during flight
  
  // Clear old trails and toasts
  const trailContainer = document.getElementById('flight-trail-container');
  if (trailContainer) trailContainer.innerHTML = '';
  
  const toast = document.getElementById('flight-outcome-toast');
  if (toast) toast.className = 'flight-outcome-toast';
  
  // Find selected odds button on the board to spawn rocket directly from it!
  const selectedBtn = document.querySelector('.odds-btn.selected');
  const cardEl = document.getElementById('main-league-card');
  let startX = 40;
  let startY = 120;
  
  if (selectedBtn && cardEl) {
    const cardRect = cardEl.getBoundingClientRect();
    const btnRect = selectedBtn.getBoundingClientRect();
    // On mobile devices, always start from the left edge of the card to ensure a complete horizontal flight path
    startX = window.innerWidth <= 768 ? 15 : (btnRect.left - cardRect.left);
    startY = btnRect.top - cardRect.top - 15;
  }
  
  state.game.flightStartX = startX;
  state.game.flightStartY = startY;
  
  const rocketEl = document.getElementById('live-board-rocket');
  if (rocketEl) {
    rocketEl.style.transform = `translate(${startX}px, ${startY}px)`;
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
    
    // Move rocket smoothly horizontally across the odds table right where the red arrow points!
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
    
    // Spawn spark dot in trail every 80ms right across the odds row
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

function stopRocket(userClickedStop) {
  if (!state.game.isRunning) return;
  
  state.game.isRunning = false;
  cancelAnimationFrame(state.game.animationFrameId);
  document.body.classList.remove('rocket-flying'); // restore mobile betslip bar
  
  const lockedBoost = state.game.currentBoost;
  const base = state.currentBet.baseOdds;
  const newOdds = base * (1 + lockedBoost / 100);
  
  // Apply to current bet
  state.currentBet.boostPercent = lockedBoost;
  state.currentBet.boostedOdds = newOdds;
  state.currentBet.isBoosted = true;
  state.currentBet.hasCrashed = false;
  
  playSuccessSound();
  
  // Update selected odds button directly on the board with glowing green border!
  const selectedBtn = document.querySelector('.odds-btn.selected');
  if (selectedBtn) {
    selectedBtn.innerHTML = `${newOdds.toFixed(2)} <span class="odds-boost-badge">🚀</span>`;
    selectedBtn.classList.add('boost-locked-in');
  }
  
  // Show Toast
  const toast = document.getElementById('flight-outcome-toast');
  if (toast) {
    toast.className = 'flight-outcome-toast success show';
    toast.innerHTML = `🎉 ${i18n[state.lang].successTitle} <strong style="color:#2ecc71;">+${lockedBoost.toFixed(1)}%</strong>! (Nova Kvota: <strong>${newOdds.toFixed(2)}</strong>)`;
  }
  
  renderBetslip();
  triggerConfetti();
  
  // Auto hide overlay after 4 seconds
  setTimeout(() => {
    const overlay = document.getElementById('odds-flight-overlay');
    if (overlay && !state.game.isRunning) overlay.classList.remove('active');
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
          <span class="hud-crash-title">${state.lang === 'sr' ? 'RAKETA JE PALA!' : 'ROCKET CRASHED!'}</span>
          <span class="hud-crash-sub">${state.lang === 'sr' ? 'Nisi zaključao boost na vreme.' : 'You didn\'t lock the boost in time.'}</span>
        </div>
      </div>`;
    hudPill.classList.add('hud-crashed');
    // Fade out the pill after 2.5s
    setTimeout(() => {
      hudPill.style.opacity = '0';
      hudPill.style.transform = 'translateY(20px)';
      hudPill.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    }, 2500);
    // Restore pill to normal state (it will be hidden by the overlay closing)
    setTimeout(() => {
      hudPill.classList.remove('hud-crashed');
      hudPill.style.opacity = '';
      hudPill.style.transform = '';
      hudPill.style.transition = '';
      hudPill.innerHTML = `
        <div class="hud-left-group">
          <span class="hud-rocket-icon">🚀</span>
          <div class="hud-boost-label">TRENUTNI BOOST:</div>
          <div class="hud-boost-val safe" id="live-multiplier-val">+0.0%</div>
        </div>
        <button class="btn-hud-stop" id="hud-stop-btn" onclick="stopRocket(true)">
          <span>🛑</span> <span class="btn-hud-stop-text">ZAUSTAVI I ZAKLJUČAJ BOOST!</span>
        </button>`;
    }, 4600);
  }
  
  // Spawn explosion at last rocket position
  triggerExplosion(explX, explY);
  
  playCrashSound();
  
  state.currentBet.boostPercent = 0;
  state.currentBet.boostedOdds = state.currentBet.baseOdds;
  state.currentBet.isBoosted = false;
  state.currentBet.hasCrashed = true;
  
  const selectedBtn = document.querySelector('.odds-btn.selected');
  if (selectedBtn && state.currentBet) {
    selectedBtn.innerHTML = `${state.currentBet.baseOdds.toFixed(2)} <span class="odds-boost-badge">⚡</span>`;
    selectedBtn.classList.remove('boost-locked-in');
  }
  
  // Delay toast slightly so explosion is seen first
  const t = i18n[state.lang];
  setTimeout(() => {
    const toast = document.getElementById('flight-outcome-toast');
    if (toast) {
      toast.className = 'flight-outcome-toast crash show';
      toast.innerHTML = `💥 ${t.crashTitle}<br><span style="font-size:14px; color:#fff;">${t.crashSubNoBonus}</span>`;
    }
  }, 320);
  
  renderBetslip();
  
  // Auto hide overlay after 4.5 seconds
  setTimeout(() => {
    const overlay = document.getElementById('odds-flight-overlay');
    if (overlay && !state.game.isRunning) {
      overlay.classList.remove('active');
      if (rocketEl) rocketEl.style.opacity = '1';
    }
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

function triggerConfetti() {
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

function placeBetFinal() {
  if (!state.currentBet) return;
  const t = i18n[state.lang];
  const currency = state.lang === 'sr' ? 'RSD' : 'EUR';
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

// ============================================================================
// MONTE CARLO PROFITABILITY & STATS SIMULATOR ENGINE
// ============================================================================
function openProfitabilitySimulator() {
  const modal = document.getElementById('profitability-simulator-modal');
  if (modal) {
    modal.classList.add('active');
    runMonteCarloSimulation();
  }
}

function closeProfitabilitySimulator() {
  const modal = document.getElementById('profitability-simulator-modal');
  if (modal) modal.classList.remove('active');
}

function setSimTrials(num, btnEl) {
  state.sim.trials = num;
  document.querySelectorAll('.sim-opt-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  runMonteCarloSimulation();
}

function updateBaseMarginDisplay(val) {
  state.sim.baseMargin = parseFloat(val);
  const disp = document.getElementById('sim-margin-val');
  if (disp) disp.textContent = `${parseFloat(val).toFixed(2)}%`;
  runMonteCarloSimulation();
}

function updateMarketMargin(val) {
  const margin = parseFloat(val);
  if (state.currentBet) {
    state.currentBet.matchMargin = margin;
  }
  state.sim.baseMargin = margin;
  const disp = document.getElementById('sim-margin-val');
  if (disp) disp.textContent = `${margin.toFixed(2)}%`;
  const slider = document.getElementById('sim-base-margin');
  if (slider) slider.value = margin;
  renderBetslip();
  console.log(`[DMS Risk Engine] Active Match Margin set to: ${margin.toFixed(2)}%`);
}

function toggleSimDms() {
  state.sim.dmsEnabled = !state.sim.dmsEnabled;
  const btn = document.getElementById('sim-dms-toggle-btn');
  if (btn) {
    btn.className = `sim-opt-btn ${state.sim.dmsEnabled ? 'active' : 'warn'}`;
    btn.innerHTML = state.sim.dmsEnabled ? '🛡️ DMS PROTECTION: ON' : '⚠️ DMS PROTECTION: OFF (FIXED BOOST)';
  }
  runMonteCarloSimulation();
}

function updateVipTier(val) {
  state.game.vipTier = val;
  state.sim.vipSegment = val;
  const simSel = document.getElementById('sim-vip-select');
  if (simSel) simSel.value = val;
  const demoSel = document.getElementById('demo-vip-select');
  if (demoSel) demoSel.value = val;
  runMonteCarloSimulation();
  console.log(`[VIP Risk Engine] Active Player VIP Segment switched to: ${val.toUpperCase()}`);
}

function runMonteCarloSimulation() {
  const numTrials = state.sim.trials || 10000;
  const baseMargin = state.sim.baseMargin || 6.5;
  const useDms = state.sim.dmsEnabled !== false;
  const vipTier = state.sim.vipSegment || 'standard';
  const poolSelect = document.getElementById('sim-pool-select');
  const poolType = poolSelect ? poolSelect.value : 'realistic';

  let totalSecretMax = 0;
  let bucketUnder6 = 0;
  let bucket6to15 = 0;
  let bucket15to30 = 0;
  let bucketOver30 = 0;

  const strats = [
    { key: 'conservative', name: state.lang === 'sr' ? '🛡️ Konzervativci (cilj +5.0%)' : '🛡️ Conservative (aims +5.0%)', target: 5.0, wins: 0, totalPayout: 0 },
    { key: 'moderate', name: state.lang === 'sr' ? '⚖️ Umjereni igrači (cilj +10.0%)' : '⚖️ Moderate (aims +10.0%)', target: 10.0, wins: 0, totalPayout: 0 },
    { key: 'aggressive', name: state.lang === 'sr' ? '🔥 Agresivni (cilj +18.0%)' : '🔥 Aggressive (aims +18.0%)', target: 18.0, wins: 0, totalPayout: 0 },
    { key: 'greedy', name: state.lang === 'sr' ? '💥 Lovci na jackpot (cilj +30.0%)' : '💥 Greedy / Chasers (aims +30.0%)', target: 30.0, wins: 0, totalPayout: 0 }
  ];

  let totalPoolBoost = 0;

  // Determine VIP Consolation Insurance Chance & Multiplier
  let consolationChance = 0.25;
  let consolationFactor = 0.20;
  if (vipTier === 'gold') { consolationChance = 0.35; consolationFactor = 0.25; }
  else if (vipTier === 'diamond') { consolationChance = 0.65; consolationFactor = 0.30; }

  // Run fast Monte Carlo loop right in browser memory using real generateSecretMaxBoost with DMS + VIP Tier!
  for (let i = 0; i < numTrials; i++) {
    const maxBoost = generateSecretMaxBoost(baseMargin, useDms, vipTier);
    totalSecretMax += maxBoost;

    if (maxBoost < 6) bucketUnder6++;
    else if (maxBoost < 15) bucket6to15++;
    else if (maxBoost < 30) bucket15to30++;
    else bucketOver30++;

    // Evaluate individual strategies
    for (let s = 0; s < strats.length; s++) {
      const st = strats[s];
      if (st.target < maxBoost) {
        st.wins++;
        st.totalPayout += st.target;
      } else {
        const hasConsolation = (Math.random() < consolationChance) && (maxBoost > 3);
        if (hasConsolation) {
          st.totalPayout += Math.max(1.5, parseFloat((maxBoost * consolationFactor).toFixed(1)));
        }
      }
    }

    // Evaluate blended traffic profile
    let chosenTarget = 10.0;
    const pr = Math.random();
    if (poolType === 'realistic') {
      if (pr < 0.40) chosenTarget = 5.0;
      else if (pr < 0.75) chosenTarget = 10.0;
      else if (pr < 0.90) chosenTarget = 18.0;
      else chosenTarget = 30.0;
    } else if (poolType === 'conservative') {
      if (pr < 0.80) chosenTarget = 5.0;
      else chosenTarget = 10.0;
    } else if (poolType === 'greedy') {
      if (pr < 0.50) chosenTarget = 18.0;
      else chosenTarget = 30.0;
    }

    if (chosenTarget < maxBoost) {
      totalPoolBoost += chosenTarget;
    } else {
      if ((Math.random() < consolationChance) && (maxBoost > 3)) {
        totalPoolBoost += Math.max(1.5, parseFloat((maxBoost * consolationFactor).toFixed(1)));
      }
    }
  }

  const avgSecretMax = (totalSecretMax / numTrials).toFixed(2);
  const pUnder6 = ((bucketUnder6 / numTrials) * 100).toFixed(1);
  const p6to15 = ((bucket6to15 / numTrials) * 100).toFixed(1);
  const p15to30 = ((bucket15to30 / numTrials) * 100).toFixed(1);
  const pOver30 = ((bucketOver30 / numTrials) * 100).toFixed(1);

  const avgPoolBoost = (totalPoolBoost / numTrials).toFixed(2);
  const netHold = (baseMargin - (avgPoolBoost * 0.50)).toFixed(2);
  const isSustainable = parseFloat(netHold) >= 0.8;

  let vipLabel = state.lang === 'sr' ? '🥉 BRONZE VIP (15% Max)' : '🥉 BRONZE VIP (15% Max)';
  if (vipTier === 'gold') vipLabel = state.lang === 'sr' ? '🥈 GOLD VIP (45% Max)' : '🥈 GOLD VIP (45% Max)';
  else if (vipTier === 'diamond') vipLabel = state.lang === 'sr' ? '💎 DIAMOND WHALE (100% Turbo)' : '💎 DIAMOND WHALE (100% Turbo)';

  // Render HTML Results Dashboard
  const container = document.getElementById('sim-results-content');
  if (!container) return;

  container.innerHTML = `
    <div class="sim-kpi-grid">
      <div class="sim-kpi-card">
        <span class="sim-kpi-label">${state.lang === 'sr' ? 'PROSEČAN TAJNI MAKSIMUM ($M$)' : 'AVG SECRET MAX BOOST ($M$)'} <strong style="color:#64b5f6;">[${vipLabel}]</strong></span>
        <div class="sim-kpi-val gold">+${avgSecretMax}%</div>
        <div class="sim-kpi-sub">
          <span><6%: <strong>${pUnder6}%</strong></span> | <span>6-15%: <strong>${p6to15}%</strong></span> | <span>>30%: <strong>${pOver30}%</strong></span>
        </div>
      </div>

      <div class="sim-kpi-card">
        <span class="sim-kpi-label">${state.lang === 'sr' ? 'PROSEČNO ISPLAĆEN BOOST KORISNICIMA' : 'AVG EFFECTIVE USER BOOST PAID'}</span>
        <div class="sim-kpi-val green">+${avgPoolBoost}%</div>
        <div class="sim-kpi-sub">${state.lang === 'sr' ? `Uključujući ${Math.round(consolationChance*100)}% utešnih isplata` : `Includes ${Math.round(consolationChance*100)}% consolation crash payouts`}</div>
      </div>

      <div class="sim-kpi-card ${isSustainable ? 'border-green' : 'border-warn'}">
        <span class="sim-kpi-label">${state.lang === 'sr' ? 'NETO ZADRŽANA MARGINA KLADIONICE' : 'NET RETAINED SPORTSBOOK HOLD'}</span>
        <div class="sim-kpi-val ${isSustainable ? 'safe' : 'warm'}">${netHold}% <small>(od ${baseMargin.toFixed(2)}%)</small></div>
        <div class="sim-kpi-badge ${isSustainable ? 'badge-safe' : 'badge-warn'}">
          ${isSustainable 
            ? (state.lang === 'sr' ? '✅ ODRŽIVO & PROFITABILNO (+EV)' : '✅ SUSTAINABLE & PROFITABLE (+EV)') 
            : (state.lang === 'sr' ? '⚠️ TANJA MARGINA — PROMO / VIP LTV HOLD' : '⚠️ THIN MARGIN — PROMO / VIP LTV HOLD')}
        </div>
      </div>
    </div>

    <div class="sim-table-wrapper">
      <table class="sim-data-table">
        <thead>
          <tr>
            <th>${state.lang === 'sr' ? 'Arhetip Igrača & Strategija' : 'Player Strategy Archetype'}</th>
            <th>${state.lang === 'sr' ? 'Stopa Pobeda (Crash Avoided)' : 'Win Rate (Crash Avoided)'}</th>
            <th>${state.lang === 'sr' ? 'Prosečno Isplaćeno (+%)' : 'Avg Effective Boost (+%)'}</th>
            <th>${state.lang === 'sr' ? 'Neto Margina Kladionice' : 'Net Retained House Hold'}</th>
            <th>${state.lang === 'sr' ? 'Status Profitabilnosti' : 'Profitability Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${strats.map(st => {
            const winRate = ((st.wins / numTrials) * 100).toFixed(1);
            const avgPaid = (st.totalPayout / numTrials).toFixed(2);
            const stratHold = (baseMargin - (avgPaid * 0.50)).toFixed(2);
            const stratSafe = parseFloat(stratHold) >= 0.5;
            return `
              <tr>
                <td><strong>${st.name}</strong></td>
                <td><span class="pill-rate">${winRate}%</span></td>
                <td><strong style="color: #2ecc71;">+${avgPaid}%</strong></td>
                <td><strong>${stratHold}%</strong></td>
                <td><span class="status-chip ${stratSafe ? 'chip-ok' : 'chip-warn'}">${stratSafe ? (state.lang === 'sr' ? '✅ ZAŠTIĆENO (DMS)' : '✅ PROTECTED (DMS)') : (state.lang === 'sr' ? '❌ GUBITAK HOLD-A' : '❌ NEGATIVE HOLD')}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}


// Initialize when DOM loads
window.addEventListener('DOMContentLoaded', () => {
  // Store original default HTML of every odds button for instant reset flow
  document.querySelectorAll('.odds-btn').forEach(btn => {
    btn.dataset.defaultHtml = btn.innerHTML.trim();
  });
  
  renderBetslip();
  
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
});
