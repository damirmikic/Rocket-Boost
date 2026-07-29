/**
 * ==========================================================================
 * MERKUR XTIP — ROCKET BOOST GAME ENGINE & STATE MANAGER
 * Handles betting slip interactions, Rocket Aviator physics, and Audio
 * ==========================================================================
 */

// Mock Matches Fallback
const MOCK_MATCHES = [
  {
    id: 1,
    home: 'France',
    away: 'Spain',
    kickOffTime: Date.now() + 3600000,
    leagueGroupToken: 'zzz#World Cup#12#16#',
    leagueName: 'World Cup 2026',
    odds: {
      "1": 2.57,
      "2": 3.15,
      "3": 3.05,
      "250": 1.90,
      "214": 1.92,
      "215": 3.45,
      "363": 1.65,
      "291": 4.80,
      "303": 2.17,
      "dc_1x": 1.38,
      "dc_x2": 1.52,
      "ah_15": 4.60
    }
  },
  {
    id: 2,
    home: 'England',
    away: 'Argentina',
    kickOffTime: Date.now() + 7200000,
    leagueGroupToken: 'zzz#World Cup#12#16#',
    leagueName: 'World Cup 2026',
    odds: {
      "1": 2.75,
      "2": 2.90,
      "3": 3.10,
      "250": 1.63,
      "214": 2.27,
      "215": 4.50,
      "363": 1.95,
      "291": 5.60,
      "303": 2.75,
      "dc_1x": 1.42,
      "dc_x2": 1.48,
      "ah_15": 5.10
    }
  },
  {
    id: 3,
    home: 'Brazil',
    away: 'Germany',
    kickOffTime: Date.now() + 10800000,
    leagueGroupToken: 'zzz#World Cup#12#16#',
    leagueName: 'World Cup 2026',
    odds: {
      "1": 2.25,
      "2": 3.30,
      "3": 3.40,
      "250": 1.85,
      "214": 1.95,
      "215": 3.60,
      "363": 1.70,
      "291": 4.90,
      "303": 2.20,
      "dc_1x": 1.32,
      "dc_x2": 1.60,
      "ah_15": 3.90
    }
  },
  {
    id: 4,
    home: 'Italy',
    away: 'Portugal',
    kickOffTime: Date.now() + 14400000,
    leagueGroupToken: 'zzz#World Cup#12#16#',
    leagueName: 'World Cup 2026',
    odds: {
      "1": 2.65,
      "2": 3.10,
      "3": 2.85,
      "250": 1.70,
      "214": 2.15,
      "215": 4.10,
      "363": 1.80,
      "291": 5.20,
      "303": 2.45,
      "dc_1x": 1.40,
      "dc_x2": 1.46,
      "ah_15": 4.80
    }
  }
];

// Mock Basketball Player Props
const MOCK_BASKETBALL_PLAYERS = [
  { id: 1, name: 'Nikola Jokić', team: 'Denver Nuggets', match: 'Denver Nuggets vs LA Lakers', line: 26.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 26.5, isBoosted: false, boostAmount: 0 },
  { id: 2, name: 'Bogdan Bogdanović', team: 'Atlanta Hawks', match: 'Atlanta Hawks vs Miami Heat', line: 17.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 17.5, isBoosted: false, boostAmount: 0 },
  { id: 3, name: 'Luka Dončić', team: 'Dallas Mavericks', match: 'Dallas Mavericks vs Phoenix Suns', line: 29.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 29.5, isBoosted: false, boostAmount: 0 },
  { id: 4, name: 'Vasilije Micić', team: 'Charlotte Hornets', match: 'Charlotte Hornets vs Brooklyn Nets', line: 11.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 11.5, isBoosted: false, boostAmount: 0 },
  { id: 5, name: 'Nikola Jović', team: 'Miami Heat', match: 'Miami Heat vs Atlanta Hawks', line: 10.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 10.5, isBoosted: false, boostAmount: 0 },
  { id: 6, name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', match: 'Milwaukee Bucks vs Boston Celtics', line: 28.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 28.5, isBoosted: false, boostAmount: 0 },
  { id: 7, name: 'Joel Embiid', team: 'Philadelphia 76ers', match: 'Philadelphia 76ers vs NY Knicks', line: 27.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 27.5, isBoosted: false, boostAmount: 0 },
  { id: 8, name: 'Stephen Curry', team: 'Golden State Warriors', match: 'Golden State Warriors vs Sacramento Kings', line: 25.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 25.5, isBoosted: false, boostAmount: 0 },
  { id: 9, name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', match: 'OKC Thunder vs Minnesota Timberwolves', line: 28.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 28.5, isBoosted: false, boostAmount: 0 },
  { id: 10, name: 'Anthony Edwards', team: 'Minnesota Timberwolves', match: 'Minnesota Timberwolves vs OKC Thunder', line: 24.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 24.5, isBoosted: false, boostAmount: 0 },
  { id: 11, name: 'LeBron James', team: 'LA Lakers', match: 'LA Lakers vs Denver Nuggets', line: 22.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 22.5, isBoosted: false, boostAmount: 0 },
  { id: 12, name: 'Kevin Durant', team: 'Phoenix Suns', match: 'Phoenix Suns vs Dallas Mavericks', line: 24.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 24.5, isBoosted: false, boostAmount: 0 },
  { id: 13, name: 'Jayson Tatum', team: 'Boston Celtics', match: 'Boston Celtics vs Milwaukee Bucks', line: 25.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 25.5, isBoosted: false, boostAmount: 0 },
  { id: 14, name: 'Anthony Davis', team: 'LA Lakers', match: 'LA Lakers vs Denver Nuggets', line: 23.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 23.5, isBoosted: false, boostAmount: 0 },
  { id: 15, name: 'Victor Wembanyama', team: 'San Antonio Spurs', match: 'San Antonio Spurs vs Houston Rockets', line: 21.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 21.5, isBoosted: false, boostAmount: 0 },
  { id: 16, name: 'Tyrese Haliburton', team: 'Indiana Pacers', match: 'Indiana Pacers vs Cleveland Cavaliers', line: 16.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 16.5, isBoosted: false, boostAmount: 0 },
  { id: 17, name: 'Devin Booker', team: 'Phoenix Suns', match: 'Phoenix Suns vs Dallas Mavericks', line: 23.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 23.5, isBoosted: false, boostAmount: 0 },
  { id: 18, name: 'Domantas Sabonis', team: 'Sacramento Kings', match: 'Sacramento Kings vs Golden State Warriors', line: 18.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 18.5, isBoosted: false, boostAmount: 0 },
  { id: 19, name: 'Jalen Brunson', team: 'NY Knicks', match: 'NY Knicks vs Philadelphia 76ers', line: 26.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 26.5, isBoosted: false, boostAmount: 0 },
  { id: 20, name: 'Kyrie Irving', team: 'Dallas Mavericks', match: 'Dallas Mavericks vs Phoenix Suns', line: 22.5, oddsOver: 1.85, oddsUnder: 1.85, originalLine: 22.5, isBoosted: false, boostAmount: 0 }
];

// Global State
const state = {
  lang: 'sr', // 'sr' | 'en'
  soundEnabled: true,
  currentBet: null, // Initialized dynamically (for Football / Rocket Boost single bet)
  selections: [],   // Multi-bet / Parlay (Express) ticket selections
  matches: [],      // Store active filtered matches
  allMatches: [],   // Store all loaded matches from Merkur or Fallback
  selectedLeague: null, // Store selected sidebar league key
  sidebarExpanded: {},  // Accordion toggle states for countries
  currentSport: 'football', // 'football' | 'basketball_players'
  basketPlayers: JSON.parse(JSON.stringify(MOCK_BASKETBALL_PLAYERS)), // Copy of basketball mockup data
  basketSelections: [], // Selected player props in betslip
  basketBoostActive: false, // Whether the roulette boost has been triggered
  basketBoostWinnerId: null, // ID of player whose line was reduced
  game: {
    isRunning: false,
    currentBoost: 0,
    secretMaxBoost: 15.0,
    startTime: 0,
    animationFrameId: null,
    hudTimeouts: [],
    demoOverride: 'random', // 'random' | '6' | '15' | '38' | 'fast_crash'
    vipTier: 'standard' // 'standard' | 'gold' | 'diamond'
  },
  slot: {
    spinsUsedToday: 0,
    maxDailySpins: 3,
    isSpinning: false,
    reels: ['⚽', '🃏', '🏀'],
    slotBoostActive: false,
    boostType: null, // 'football' | 'joker_max' | 'basketball' | 'tennis'
    boostValue: 0,   // e.g. 20 or 40
    lastOutcomeMessage: null,
    demoOverride: 'random' // 'random' | '3_football' | '3_joker' | '3_basketball' | '3_tennis' | 'near_miss'
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
    pitchPoint5: 'AUTOMATSKA ZAŠTITA MARGINE (DMS Engine): Na mečevima sa malom marginom (npr. derbi ili Super Kvota sa 1.5% holda), sistem automatski smanjuje damping faktor i limitira maksimalni boost na +8% umesto +85%, garantujući +EV status kuće.',
    basketPlayers: 'Košarka Igrači',
    basketBoostBtn: 'Aktiviraj Basket Boost',
    basketBoostRunning: 'Vrtim Roulette...',
    basketBoostAlreadyRun: 'Tvoj tiket je boosted!'
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
    pitchPoint3: 'When a rocket crashes at >4%, there is a 35% chance of a consolation mini-boost ($0.25 \\times M$). This "near-miss" reward prevents frustration, keeping retention and re-bet rates extremely high.',
    pitchPoint4: 'VIP EXCLUSIVITY & CRM DROPS: This mechanic is NOT always-on! It is awarded to qualified players strictly 1x to 4x per month as a loyalty drop based on tier (Standard, Gold, Diamond). This protects budget and drives massive FOMO and start-of-month deposit retention!',
    pitchPoint5: 'AUTOMATED MARGIN PROTECTION (DMS Engine): On low-margin fixtures (e.g., derbies or Super Odds with 1.5% hold), the system automatically throttles the damping factor and caps the flight at +8% instead of +85%, guaranteeing positive house EV.',
    basketPlayers: 'Basketball Players',
    basketBoostBtn: 'Activate Basket Boost',
    basketBoostRunning: 'Spinning Roulette...',
    basketBoostAlreadyRun: 'Your ticket is boosted!'
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
function translateCurrentBetSelection() {
  if (!state.currentBet) return;
  const bet = state.currentBet;
  const parts = bet.match.split(' vs ');
  if (parts.length !== 2) return;
  const home = parts[0];
  const away = parts[1];
  const isSR = state.lang === 'sr';
  
  if (bet.selection.startsWith('1 (')) {
    bet.selection = isSR ? `1 (${home} pobeda)` : `1 (${home} Win)`;
  } else if (bet.selection.startsWith('2 (')) {
    bet.selection = isSR ? `2 (${away} pobeda)` : `2 (${away} Win)`;
  } else if (bet.selection.includes('Nerešeno') || bet.selection.includes('Draw')) {
    bet.selection = isSR ? 'X (Nerešeno)' : 'X (Draw)';
  } else if (bet.selection.includes('0-2 Gola') || bet.selection.includes('0-2 Goals')) {
    bet.selection = isSR ? '0-2 Gola' : '0-2 Goals';
  } else if (bet.selection.includes('3+ Gola') || bet.selection.includes('3+ Goals')) {
    bet.selection = isSR ? '3+ Gola' : '3+ Goals';
  } else if (bet.selection.includes('4+ Gola') || bet.selection.includes('4+ Goals')) {
    bet.selection = isSR ? '4+ Gola' : '4+ Goals';
  } else if (bet.selection.includes('Oba daju gol') || bet.selection.includes('Both Teams to Score')) {
    bet.selection = isSR ? 'GG (Oba daju gol)' : 'GG (Both Teams to Score)';
  }
}

async function fetchMerkurFeed() {
  const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.merkurxtip.rs/restapi/offer/sr/sport/S/mob?annex=0&desktopVersion=2.44.3.18&locale=sr');
  const urls = [
    '/api/merkur-feed',
    'https://www.merkurxtip.rs/restapi/offer/sr/sport/S/mob?annex=0&desktopVersion=2.44.3.18&locale=sr',
    proxyUrl
  ];

  for (const url of urls) {
    try {
      console.log(`[Merkur Feed] Fetching from: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const text = await res.text();
        if (text.trim().startsWith('<!DOCTYPE') || text.includes('Connection timed out') || text.includes('Server-side requests are not allowed')) {
          console.warn(`[Merkur Feed] Non-JSON payload from ${url}`);
          continue;
        }
        const data = JSON.parse(text);
        if (data && data.esMatches && data.esMatches.length > 0) {
          console.log(`[Merkur Feed] Successfully fetched ${data.esMatches.length} matches from ${url}`);
          const matches = data.esMatches
            .filter(m => m.odds && m.odds['1'] && m.odds['2'] && m.odds['3'])
            .slice(0, 12);
          if (matches.length > 0) {
            return matches;
          }
        }
      }
    } catch (e) {
      console.warn(`[Merkur Feed] Error fetching from ${url}:`, e);
    }
  }
  
  console.warn('[Merkur Feed] All endpoints failed. Falling back to mock matches.');
  return MOCK_MATCHES;
}

function renderMatches(matches) {
  const container = document.getElementById('matches-list-container');
  if (!container) return;
  
  state.matches = matches;
  container.innerHTML = '';
  
  matches.forEach((m, idx) => {
    const date = new Date(m.kickOffTime);
    const hrs = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    const timeStr = `🕒 ${hrs}:${mins} • ⭐`;
    
    const oddsConfig = [
      { key: '1', selectionKey: '1', marketGroup: 'classic', isLowMargin: false },
      { key: '2', selectionKey: 'X', marketGroup: 'classic', isLowMargin: false },
      { key: '3', selectionKey: '2', marketGroup: 'classic', isLowMargin: false },
      { key: '250', selectionKey: '0-2', marketGroup: 'classic', isLowMargin: false },
      { key: '214', selectionKey: '3+', marketGroup: 'classic', isLowMargin: false },
      { key: '215', selectionKey: '4+', marketGroup: 'classic', isLowMargin: false },
      { key: '363', selectionKey: 'GG', marketGroup: 'classic', isLowMargin: false },
      { key: '291', selectionKey: 'I GG', marketGroup: 'classic', isLowMargin: false },
      { key: '303', selectionKey: 'GG & 3+', marketGroup: 'classic', isLowMargin: false },
      { key: 'dc_1x', selectionKey: '1X (Dvoznak)', marketGroup: 'low_margin', isLowMargin: true },
      { key: 'dc_x2', selectionKey: 'X2 (Dvoznak)', marketGroup: 'low_margin', isLowMargin: true },
      { key: 'ah_15', selectionKey: 'AH -1.5 (Hendikep)', marketGroup: 'low_margin', isLowMargin: true }
    ];
    
    const makeGroupHTML = (label, items, extraGroupClass = '') => {
      let groupHTML = `<div class="odds-group ${extraGroupClass}" data-label="${label}">`;
      items.forEach(item => {
        const oddVal = m.odds[item.key];
        if (oddVal === undefined || oddVal === null) {
          groupHTML += `<div class="odds-btn disabled">—</div>`;
        } else {
          let selectionName = '';
          const home = m.home;
          const away = m.away;
          if (item.selectionKey === '1') {
            selectionName = state.lang === 'sr' ? `1 (${home} pobeda)` : `1 (${home} Win)`;
          } else if (item.selectionKey === 'X') {
            selectionName = state.lang === 'sr' ? 'X (Nerešeno)' : 'X (Draw)';
          } else if (item.selectionKey === '2') {
            selectionName = state.lang === 'sr' ? `2 (${away} pobeda)` : `2 (${away} Win)`;
          } else if (item.selectionKey === '0-2') {
            selectionName = state.lang === 'sr' ? '0-2 Gola' : '0-2 Goals';
          } else if (item.selectionKey === '3+') {
            selectionName = state.lang === 'sr' ? '3+ Gola' : '3+ Goals';
          } else if (item.selectionKey === '4+') {
            selectionName = state.lang === 'sr' ? '4+ Gola' : '4+ Goals';
          } else if (item.selectionKey === 'GG') {
            selectionName = state.lang === 'sr' ? 'GG (Oba daju gol)' : 'GG (Both Teams to Score)';
          } else if (item.selectionKey === 'I GG') {
            selectionName = 'I GG';
          } else if (item.selectionKey === 'GG & 3+') {
            selectionName = 'GG & 3+';
          } else if (item.selectionKey === '1X (Dvoznak)') {
            selectionName = state.lang === 'sr' ? '1X (Dvoznak)' : '1X (Double Chance)';
          } else if (item.selectionKey === 'X2 (Dvoznak)') {
            selectionName = state.lang === 'sr' ? 'X2 (Dvoznak)' : 'X2 (Double Chance)';
          } else if (item.selectionKey === 'AH -1.5 (Hendikep)') {
            selectionName = state.lang === 'sr' ? 'AH -1.5 (Hendikep)' : 'AH -1.5 (Handicap)';
          }
          
          const matchName = `${home} vs ${away}`;
          
          let isSelected = false;
          if (state.selections && state.selections.some(s => s.match === matchName && s.selection === selectionName)) {
            isSelected = true;
          } else if (state.currentBet && 
              state.currentBet.match === matchName && 
              state.currentBet.selection === selectionName && 
              Math.abs(state.currentBet.baseOdds - oddVal) < 0.01) {
            isSelected = true;
          }
          
          const boostBadge = ['1', '2', '3'].includes(item.key) ? ` <span class="odds-boost-badge">⚡</span>` : '';
          const lowMarginClass = item.isLowMargin ? 'low-margin-btn' : '';
          const titleAttr = item.isLowMargin ? 'title="Specijalan market — Standardna kvota"' : '';
          
          groupHTML += `
            <div class="odds-btn ${isSelected ? 'selected' : ''} ${lowMarginClass}" ${titleAttr}
                 onclick="selectOdds(this, '${matchName.replace(/'/g, "\\'")}', '${selectionName.replace(/'/g, "\\'")}', ${oddVal}, '${item.marketGroup}', ${item.isLowMargin}, 'football')">
              ${oddVal.toFixed(2)}${boostBadge}
            </div>`;
        }
      });
      groupHTML += `</div>`;
      return groupHTML;
    };
    
    const rowEl = document.createElement('div');
    rowEl.className = 'match-row';
    rowEl.innerHTML = `
      <div class="match-info">
        <div class="match-time">${timeStr}</div>
        <div class="match-teams">${m.home}<br>${m.away}</div>
      </div>
      
      ${makeGroupHTML('1 X 2', oddsConfig.slice(0, 3))}
      ${makeGroupHTML('Golovi', oddsConfig.slice(3, 6))}
      ${makeGroupHTML('GG', oddsConfig.slice(6, 9))}
      ${makeGroupHTML('Dvoznak / AH', oddsConfig.slice(9, 12), 'low-margin-group')}
      
      <div class="match-extra">+${100 + Math.floor(Math.random() * 800)} »</div>
    `;
    
    container.appendChild(rowEl);
  });
  
  container.querySelectorAll('.odds-btn').forEach(btn => {
    if (!btn.classList.contains('disabled')) {
      btn.dataset.defaultHtml = btn.innerHTML.trim();
    }
  });
}

const COUNTRY_FLAGS = {
  'Serbia': '🇷🇸', 'Srbija': '🇷🇸',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Engleska': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'France': '🇫🇷', 'Francuska': '🇫🇷',
  'Germany': '🇩🇪', 'Nemačka': '🇩🇪',
  'Italy': '🇮🇹', 'Italija': '🇮🇹',
  'Spain': '🇪🇸', 'Španija': '🇪🇸',
  'Australia': '🇦🇺', 'Australija': '🇦🇺',
  'China': '🇨🇳', 'Kina': '🇨🇳',
  'Romania': '🇷🇴', 'Rumunija': '🇷🇴',
  'Bulgaria': '🇧🇬', 'Bugarska': '🇧🇬',
  'Slovenia': '🇸🇮', 'Slovenija': '🇸🇮',
  'Finland': '🇫🇮', 'Finska': '🇫🇮',
  'Sweden': '🇸🇪', 'Švedska': '🇸🇪',
  'Norway': '🇳🇴', 'Norveška': '🇳🇴',
  'Brazil': '🇧🇷', 'Brazil': '🇧🇷',
  'Argentina': '🇦🇷', 'Argentina': '🇦🇷',
  'Ireland': '🇮🇪', 'Irska': '🇮🇪',
  'Peru': '🇵🇪', 'Peru': '🇵🇪',
  'USA': '🇺🇸', 'SAD': '🇺🇸',
  'Uruguay': '🇺🇾', 'Urugvaj': '🇺🇾',
  'Ecuador': '🇪🇨', 'Ekvador': '🇪🇨',
  'Uzbekistan': '🇺🇿', 'Uzbekistan': '🇺🇿',
  'Estonia': '🇪🇪', 'Estonija': '🇪🇪',
  'Canada': '🇨🇦', 'Kanada': '🇨🇦',
  'World Cup': '🏆', 'Svetski Kup': '🏆',
  'Europe': '🇪🇺', 'Evropa': '🇪🇺',
  'International Clubs': '🌎', 'Međunarodni klubovi': '🌎',
  'Other': '⚽', 'Ostalo': '⚽'
};

const TRANSLATED_COUNTRIES = {
  sr: {
    'Serbia': 'Srbija',
    'England': 'Engleska',
    'France': 'Francuska',
    'Germany': 'Nemačka',
    'Italy': 'Italija',
    'Spain': 'Španija',
    'Australia': 'Australija',
    'China': 'Kina',
    'Romania': 'Rumunija',
    'Bulgaria': 'Bugarska',
    'Slovenia': 'Slovenija',
    'Finland': 'Finska',
    'Sweden': 'Švedska',
    'Norway': 'Norveška',
    'Brazil': 'Brazil',
    'Argentina': 'Argentina',
    'Ireland': 'Irska',
    'Peru': 'Peru',
    'USA': 'SAD',
    'Uruguay': 'Urugvaj',
    'Ecuador': 'Ekvador',
    'Uzbekistan': 'Uzbekistan',
    'Estonia': 'Estonija',
    'Canada': 'Kanada',
    'World Cup': 'Svetski Kup',
    'Europe': 'Evropa',
    'International Clubs': 'Međunarodni klubovi',
    'Other': 'Ostalo'
  },
  en: {
    'Serbia': 'Serbia',
    'England': 'England',
    'France': 'France',
    'Germany': 'Germany',
    'Italy': 'Italy',
    'Spain': 'Spain',
    'Australia': 'Australia',
    'China': 'China',
    'Romania': 'Romania',
    'Bulgaria': 'Bulgaria',
    'Slovenia': 'Slovenia',
    'Finland': 'Finland',
    'Sweden': 'Sweden',
    'Norway': 'Norway',
    'Brazil': 'Brazil',
    'Argentina': 'Argentina',
    'Ireland': 'Ireland',
    'Peru': 'Peru',
    'USA': 'USA',
    'Uruguay': 'Uruguay',
    'Ecuador': 'Ecuador',
    'Uzbekistan': 'Uzbekistan',
    'Estonia': 'Estonia',
    'Canada': 'Canada',
    'World Cup': 'World Cup',
    'Europe': 'Europe',
    'International Clubs': 'International Clubs',
    'Other': 'Other'
  }
};

function getHierarchicalLeagues(matches) {
  const groupsMap = {};
  
  matches.forEach(m => {
    const tokenParts = m.leagueGroupToken ? m.leagueGroupToken.split('#') : [];
    let country = tokenParts[1] || 'Other';
    country = country.trim();
    if (!country) country = 'Other';
    
    // Group club friendly matches under International Clubs
    if (m.leagueName && (m.leagueName.includes('Friendly') || m.leagueName.includes('Prijateljske'))) {
      country = 'International Clubs';
    }
    
    const leagueName = m.leagueName ? m.leagueName.trim() : 'Unknown League';
    
    if (!groupsMap[country]) {
      groupsMap[country] = {
        country: country,
        matchCount: 0,
        leagues: {}
      };
    }
    
    groupsMap[country].matchCount++;
    
    if (!groupsMap[country].leagues[leagueName]) {
      groupsMap[country].leagues[leagueName] = {
        leagueName: leagueName,
        matchCount: 0,
        matches: []
      };
    }
    groupsMap[country].leagues[leagueName].matchCount++;
    groupsMap[country].leagues[leagueName].matches.push(m);
  });
  
  const groups = Object.values(groupsMap).map(g => {
    g.leaguesList = Object.values(g.leagues).sort((a, b) => b.matchCount - a.matchCount || a.leagueName.localeCompare(b.leagueName));
    return g;
  });
  
  return groups.sort((a, b) => b.matchCount - a.matchCount || a.country.localeCompare(b.country));
}

function renderFootballHeaders() {
  const headers = document.getElementById('board-headers');
  if (!headers) return;
  const isSR = state.lang === 'sr';
  headers.innerHTML = `
    <div>${isSR ? 'Utakmica / Meč' : 'Match / Event'}</div>
    <div class="odds-header-group"><span>1</span><span>X</span><span>2</span></div>
    <div class="odds-header-group"><span>0-2</span><span>3+</span><span>4+</span></div>
    <div class="odds-header-group"><span>GG</span><span>I GG</span><span>GG&3+</span></div>
    <div></div>
  `;
}

function renderBasketballHeaders() {
  const headers = document.getElementById('board-headers');
  if (!headers) return;
  const isSR = state.lang === 'sr';
  headers.innerHTML = `
    <div>${isSR ? 'Igrač / Meč' : 'Player / Match'}</div>
    <div style="text-align: center;">${isSR ? 'Granica' : 'Line'}</div>
    <div style="text-align: center;">${isSR ? 'Manje (-)' : 'Under (-)'}</div>
    <div style="text-align: center;">${isSR ? 'Više (+)' : 'Over (+)'}</div>
    <div></div>
  `;
}

function selectBasketballPlayersCategory() {
  state.currentSport = 'basketball_players';
  state.selectedLeague = null;
  state.currentBet = null; // Clear football selection
  resetAllOddsToDefault(); // Reset football visual highlights
  
  // Deactivate all sidebar items and activate Basket
  const sidebarItems = document.querySelectorAll('.sidebar-menu > .sidebar-item');
  sidebarItems.forEach(el => {
    if (el.id === 'sidebar-basket-players-btn') {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
  
  const parent = document.getElementById('sidebar-dynamic-leagues');
  if (parent) {
    parent.querySelectorAll('.sidebar-item').forEach(el => {
      el.classList.remove('active');
    });
  }
  
  const titleEl = document.getElementById('league-board-title');
  if (titleEl) {
    titleEl.textContent = state.lang === 'sr' ? 'Košarka Igrači | Merkur XTip' : 'Basketball Players | Merkur XTip';
  }
  
  renderBasketballHeaders();
  renderBasketballPlayers();
  renderBetslip();
}

function renderBasketballPlayers() {
  const container = document.getElementById('matches-list-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  state.basketPlayers.forEach((player) => {
    const isUnderSelected = state.basketSelections.some(sel => sel.playerId === player.id && sel.selectionType === 'under');
    const isOverSelected = state.basketSelections.some(sel => sel.playerId === player.id && sel.selectionType === 'over');
    
    const rowEl = document.createElement('div');
    rowEl.className = 'match-row';
    rowEl.id = `basket-player-row-${player.id}`;
    
    const playerInfoHTML = `
      <div class="match-info">
        <div class="match-time">🏀 NBA • 100% Boost</div>
        <div class="match-teams" style="font-weight: 800; color: #fff; line-height: 1.2;">${player.name}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${player.team}</div>
      </div>
    `;
    
    let limitHTML = '';
    if (player.isBoosted) {
      limitHTML = `
        <div class="player-limit-box boosted" id="player-limit-box-${player.id}">
          <span class="old-limit">${player.originalLine}</span>
          <span class="new-limit">${player.line} ⚡</span>
        </div>
      `;
    } else {
      limitHTML = `
        <div class="player-limit-box" id="player-limit-box-${player.id}">
          <span>${player.line}</span>
        </div>
      `;
    }
    
    const underBtnHTML = `
      <div class="odds-btn ${isUnderSelected ? 'selected' : ''}" 
           id="basket-odds-under-${player.id}"
           onclick="selectBasketOdds(this, ${player.id}, 'under', ${player.oddsUnder})">
        ${player.oddsUnder.toFixed(2)}
      </div>
    `;
    
    const overBtnHTML = `
      <div class="odds-btn ${isOverSelected ? 'selected' : ''}" 
           id="basket-odds-over-${player.id}"
           onclick="selectBasketOdds(this, ${player.id}, 'over', ${player.oddsOver})">
        ${player.oddsOver.toFixed(2)} <span class="odds-boost-badge" style="color: #ff9a00;">⚡</span>
      </div>
    `;
    
    const extraHTML = `
      <div class="match-extra" style="color: #ff6a00; font-weight: 800; font-size: 12px; cursor: pointer;">»</div>
    `;
    
    rowEl.innerHTML = `
      ${playerInfoHTML}
      <div style="display: flex; align-items: center; justify-content: center;">${limitHTML}</div>
      ${underBtnHTML}
      ${overBtnHTML}
      ${extraHTML}
    `;
    
    container.appendChild(rowEl);
  });
}

function selectBasketOdds(btnEl, playerId, selectionType, oddsValue) {
  const player = state.basketPlayers.find(p => p.id === playerId);
  if (!player) return;
  
  const existingIdx = state.basketSelections.findIndex(sel => sel.playerId === playerId);
  
  if (state.basketBoostActive) {
    resetBasketBoost();
  }
  
  if (existingIdx !== -1) {
    const existing = state.basketSelections[existingIdx];
    if (existing.selectionType === selectionType) {
      state.basketSelections.splice(existingIdx, 1);
    } else {
      existing.selectionType = selectionType;
      existing.odds = oddsValue;
    }
  } else {
    state.basketSelections.push({
      playerId: player.id,
      playerName: player.name,
      match: player.match,
      type: 'player_prop',
      selectionType: selectionType,
      odds: oddsValue,
      originalLine: player.originalLine,
      line: player.line,
      isBoosted: false,
      boostAmount: 0
    });
  }
  
  renderBasketballPlayers();
  renderBetslip();
}

function resetBasketBoost() {
  state.basketBoostActive = false;
  state.basketBoostWinnerId = null;
  state.basketPlayers.forEach(p => {
    p.line = p.originalLine;
    p.isBoosted = false;
    p.boostAmount = 0;
  });
  state.basketSelections.forEach(sel => {
    sel.line = sel.originalLine;
    sel.isBoosted = false;
    sel.boostAmount = 0;
  });
}

function triggerBetslipConfetti(cardEl) {
  if (!cardEl) return;
  const rect = cardEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  
  const container = document.body;
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.width = (6 + Math.random() * 8) + 'px';
    p.style.height = (6 + Math.random() * 8) + 'px';
    p.style.backgroundColor = ['#ff6a00', '#ffd700', '#ff3300', '#ffffff', '#2ecc71'][Math.floor(Math.random() * 5)];
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    p.style.zIndex = '9999';
    p.style.pointerEvents = 'none';
    
    container.appendChild(p);
    
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 150;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - (30 + Math.random() * 50);
    
    p.animate([
      { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg) scale(0)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 800,
      easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
    }).onfinish = () => p.remove();
  }
}

function runBasketBoostRoulette() {
  const selections = state.basketSelections;
  const overSelections = selections.filter(sel => sel.selectionType === 'over');
  if (overSelections.length < 4) return;
  
  const triggerBtn = document.getElementById('basket-boost-trigger-btn');
  if (triggerBtn) {
    triggerBtn.disabled = true;
    triggerBtn.innerHTML = `<span>⏳</span> <span>${i18n[state.lang].basketBoostRunning}</span>`;
  }
  
  const stakeInput = document.getElementById('stake-input-field');
  if (stakeInput) stakeInput.disabled = true;
  
  const removes = document.querySelectorAll('.bet-remove');
  removes.forEach(r => r.style.pointerEvents = 'none');
  
  const oddsBtns = document.querySelectorAll('.odds-btn');
  oddsBtns.forEach(b => b.style.pointerEvents = 'none');
  
  const totalSteps = 22 + Math.floor(Math.random() * 8);
  let step = 0;
  
  // ── Calculate Weighted Probability for Basket Boost Winner ──
  // Business Rule: ~68% chance to boost the highest line selection on the betslip.
  // Remaining 32% is distributed proportionally to line values (lowest line gets smallest probability).
  const lineValues = overSelections.map(s => parseFloat(s.originalLine || s.line || 0));
  const maxLine = Math.max(...lineValues);
  const maxIndices = [];
  const nonMaxIndices = [];

  lineValues.forEach((val, idx) => {
    if (val === maxLine) {
      maxIndices.push(idx);
    } else {
      nonMaxIndices.push(idx);
    }
  });

  const probs = new Array(overSelections.length).fill(0);

  if (nonMaxIndices.length === 0) {
    // All selections have equal lines
    const equalProb = 1.0 / overSelections.length;
    probs.fill(equalProb);
  } else {
    // Distribute 0.68 total probability to max line selection(s)
    const maxProbEach = 0.68 / maxIndices.length;
    maxIndices.forEach(idx => probs[idx] = maxProbEach);

    // Distribute remaining 0.32 probability to non-max selections weighted by their line values
    const nonMaxSum = nonMaxIndices.reduce((sum, idx) => sum + lineValues[idx], 0);
    nonMaxIndices.forEach(idx => {
      probs[idx] = 0.32 * (lineValues[idx] / (nonMaxSum || 1));
    });
  }

  // Sample winnerIndex using cumulative probability distribution
  const rand = Math.random();
  let cumulative = 0;
  let winnerIndex = 0;
  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i];
    if (rand <= cumulative) {
      winnerIndex = i;
      break;
    }
  }
  const winner = overSelections[winnerIndex];
  
  const cycleLength = overSelections.length;
  const offset = (winnerIndex - (totalSteps - 1) % cycleLength + cycleLength) % cycleLength;
  
  function playTickAtRate(stepNum) {
    if (!state.soundEnabled) return;
    const pitch = 0.9 + (stepNum / totalSteps) * 0.4;
    playTickSound(pitch);
  }
  
  function nextStep() {
    if (step > 0) {
      const prevIdx = (step - 1 + offset) % cycleLength;
      const prevPlayerId = overSelections[prevIdx].playerId;
      const prevCard = document.getElementById(`basket-bet-card-${prevPlayerId}`);
      if (prevCard) prevCard.classList.remove('roulette-highlight');
      
      const prevLimitBox = document.getElementById(`player-limit-box-${prevPlayerId}`);
      if (prevLimitBox) prevLimitBox.classList.remove('basket-highlight-cell');
    }
    
    if (step < totalSteps) {
      const curIdx = (step + offset) % cycleLength;
      const curPlayerId = overSelections[curIdx].playerId;
      const curCard = document.getElementById(`basket-bet-card-${curPlayerId}`);
      if (curCard) curCard.classList.add('roulette-highlight');
      
      const curLimitBox = document.getElementById(`player-limit-box-${curPlayerId}`);
      if (curLimitBox) curLimitBox.classList.add('basket-highlight-cell');
      
      playTickAtRate(step);
      
      const progress = step / totalSteps;
      const delay = 60 + Math.pow(progress, 2.5) * 550;
      
      step++;
      setTimeout(nextStep, delay);
    } else {
      const winnerPlayerId = winner.playerId;
      const winnerCard = document.getElementById(`basket-bet-card-${winnerPlayerId}`);
      if (winnerCard) {
        winnerCard.classList.remove('roulette-highlight');
        winnerCard.classList.add('roulette-winner');
      }
      
      const winnerLimitBox = document.getElementById(`player-limit-box-${winnerPlayerId}`);
      if (winnerLimitBox) {
        winnerLimitBox.classList.remove('basket-highlight-cell');
        winnerLimitBox.classList.add('basket-winner-cell');
      }
      
      const reduction = getBasketBoostReduction(overSelections.length);
      winner.isBoosted = true;
      winner.boostAmount = reduction;
      winner.line = winner.originalLine - reduction;
      
      const mainPlayer = state.basketPlayers.find(p => p.id === winnerPlayerId);
      if (mainPlayer) {
        mainPlayer.isBoosted = true;
        mainPlayer.boostAmount = reduction;
        mainPlayer.line = mainPlayer.originalLine - reduction;
      }
      
      state.basketBoostActive = true;
      state.basketBoostWinnerId = winnerPlayerId;
      
      playSuccessSound();
      triggerBetslipConfetti(winnerCard);
      
      setTimeout(() => {
        if (winnerCard) winnerCard.classList.remove('roulette-winner');
        if (winnerLimitBox) winnerLimitBox.classList.remove('basket-winner-cell');
        
        if (stakeInput) stakeInput.disabled = false;
        removes.forEach(r => r.style.pointerEvents = '');
        oddsBtns.forEach(b => b.style.pointerEvents = '');
        
        renderBasketballPlayers();
        renderBetslip();
      }, 3000);
    }
  }
  
  nextStep();
}


function selectLeague(leagueKey) {
  state.selectedLeague = leagueKey;
  state.currentSport = 'football';
  state.basketSelections = []; // Clear basketball selections
  resetBasketBoost();
  
  // Deactivate "Košarka Igrači" in sidebar
  const basketBtn = document.getElementById('sidebar-basket-players-btn');
  if (basketBtn) basketBtn.classList.remove('active');
  
  // Make sure Football parent is active
  const sidebarItems = document.querySelectorAll('.sidebar-menu > .sidebar-item');
  sidebarItems.forEach(el => {
    if (el.textContent.includes('Fudbal') || el.innerHTML.includes('⚽')) {
      el.classList.add('active');
    }
  });

  renderFootballHeaders();
  
  const parent = document.getElementById('sidebar-dynamic-leagues');
  if (parent) {
    parent.querySelectorAll('.sidebar-item').forEach(el => {
      if (el.dataset.leagueKey === leagueKey) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }
  
  const filteredMatches = state.allMatches.filter(m => {
    const tokenParts = m.leagueGroupToken ? m.leagueGroupToken.split('#') : [];
    let country = tokenParts[1] || 'Other';
    country = country.trim();
    if (!country) country = 'Other';
    const leagueName = m.leagueName ? m.leagueName.trim() : 'Unknown League';
    const key = `${country} - ${leagueName}`;
    return key === leagueKey;
  });
  
  const titleEl = document.getElementById('league-board-title');
  if (titleEl) {
    const parts = leagueKey.split(' - ');
    if (parts.length === 2) {
      titleEl.textContent = `${parts[1]} | ${parts[0]}`;
    } else {
      titleEl.textContent = leagueKey;
    }
  }
  
  renderMatches(filteredMatches);
}

function toggleCountryExpanded(country) {
  state.sidebarExpanded[country] = !state.sidebarExpanded[country];
  renderSidebar(state.allMatches);
}

function renderSidebar(matches) {
  const parent = document.getElementById('sidebar-dynamic-leagues');
  const badge = document.getElementById('football-total-badge');
  if (!parent) return;
  
  if (badge) {
    badge.textContent = matches.length;
  }
  
  const groups = getHierarchicalLeagues(matches);
  
  // Define TOP LIGE items matching merkurxtip behavior
  const topLeaguesConfig = [
    { country: 'Serbia', leagueName: 'Super Liga' },
    { country: 'Brazil', leagueName: 'Serie A' },
    { country: 'Sweden', leagueName: 'Allsvenskan' },
    { country: 'China', leagueName: 'Super League' },
    { country: 'Romania', leagueName: 'Superliga' }
  ];
  
  const topLeaguesList = [];
  let topLeaguesTotalCount = 0;
  
  topLeaguesConfig.forEach(cfg => {
    const matchingMatches = matches.filter(m => {
      const tokenParts = m.leagueGroupToken ? m.leagueGroupToken.split('#') : [];
      let country = tokenParts[1] || 'Other';
      country = country.trim();
      const leagueName = m.leagueName ? m.leagueName.trim() : '';
      return country === cfg.country && leagueName === cfg.leagueName;
    });
    
    if (matchingMatches.length > 0) {
      topLeaguesList.push({
        leagueName: cfg.leagueName,
        country: cfg.country,
        matchCount: matchingMatches.length,
        matches: matchingMatches
      });
      topLeaguesTotalCount += matchingMatches.length;
    }
  });
  
  topLeaguesList.sort((a, b) => b.matchCount - a.matchCount);
  
  parent.innerHTML = '';
  
  // 1. Render "TOP LIGE" Virtual Accordion
  if (topLeaguesList.length > 0) {
    const topLigeKey = 'TOP_LIGE';
    const isExpanded = !!state.sidebarExpanded[topLigeKey];
    const topLigeTitle = state.lang === 'sr' ? 'TOP LIGE' : 'TOP LEAGUES';
    
    const li = document.createElement('li');
    li.className = 'sidebar-item country-item';
    if (isExpanded) li.classList.add('expanded');
    li.style.paddingLeft = '28px';
    li.onclick = () => toggleCountryExpanded(topLigeKey);
    
    li.innerHTML = `
      <div class="sidebar-item-left">
        <span style="margin-right: 6px; font-size: 14px;">🏆</span>
        <strong style="color: #64b5f6;">${topLigeTitle}</strong>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="sidebar-badge" style="font-size: 10px; padding: 2px 6px; font-weight: 800; background: #233142; color: #64b5f6; border: 1px solid rgba(100,181,246,0.3);">${topLeaguesTotalCount}</span>
        <span style="font-size: 10px; color: #89a;">${isExpanded ? '⌃' : '⌄'}</span>
      </div>
    `;
    parent.appendChild(li);
    
    if (isExpanded) {
      topLeaguesList.forEach(l => {
        const key = `${l.country} - ${l.leagueName}`;
        const isSubActive = state.selectedLeague === key;
        
        const subLi = document.createElement('li');
        subLi.className = 'sidebar-item league-item';
        if (isSubActive) subLi.classList.add('active');
        subLi.style.paddingLeft = '45px';
        subLi.style.fontSize = '12.5px';
        subLi.style.background = '#0e141d';
        subLi.dataset.leagueKey = key;
        subLi.onclick = (e) => {
          e.stopPropagation();
          selectLeague(key);
        };
        
        subLi.innerHTML = `
          <div class="sidebar-item-left" style="color: #8899aa;">
            <span style="margin-right: 6px; font-size: 10px;">★</span>
            <span>${l.leagueName}</span>
          </div>
          <span class="sidebar-badge" style="font-size: 9px; padding: 1px 5px; background: rgba(136,153,170,0.15); color: #8899aa; border: 1px solid rgba(136,153,170,0.25);">${l.matchCount}</span>
        `;
        parent.appendChild(subLi);
      });
    }
  }
  
  // 2. Render Country Accordion items
  groups.forEach(g => {
    const isExpanded = !!state.sidebarExpanded[g.country];
    const flag = COUNTRY_FLAGS[g.country] || COUNTRY_FLAGS[state.lang === 'sr' ? 'Ostalo' : 'Other'] || '⚽';
    const displayName = TRANSLATED_COUNTRIES[state.lang][g.country] || g.country;
    
    const li = document.createElement('li');
    li.className = 'sidebar-item country-item';
    if (isExpanded) li.classList.add('expanded');
    li.style.paddingLeft = '28px';
    li.onclick = () => toggleCountryExpanded(g.country);
    
    li.innerHTML = `
      <div class="sidebar-item-left">
        <span style="margin-right: 6px; font-size: 14px;">${flag}</span>
        <span>${displayName}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="sidebar-badge" style="font-size: 10px; padding: 2px 6px;">${g.matchCount}</span>
        <span style="font-size: 10px; color: #89a;">${isExpanded ? '⌃' : '⌄'}</span>
      </div>
    `;
    parent.appendChild(li);
    
    if (isExpanded) {
      g.leaguesList.forEach(l => {
        const key = `${g.country} - ${l.leagueName}`;
        const isLeagueActive = state.selectedLeague === key;
        
        const subLi = document.createElement('li');
        subLi.className = 'sidebar-item league-item';
        if (isLeagueActive) subLi.classList.add('active');
        subLi.style.paddingLeft = '45px';
        subLi.style.fontSize = '12.5px';
        subLi.style.background = '#0e141d';
        subLi.dataset.leagueKey = key;
        subLi.onclick = (e) => {
          e.stopPropagation();
          selectLeague(key);
        };
        
        subLi.innerHTML = `
          <div class="sidebar-item-left" style="color: #8899aa;">
            <span style="margin-right: 6px; font-size: 10px;">★</span>
            <span>${l.leagueName}</span>
          </div>
          <span class="sidebar-badge" style="font-size: 9px; padding: 1px 5px; background: rgba(136,153,170,0.15); color: #8899aa; border: 1px solid rgba(136,153,170,0.25);">${l.matchCount}</span>
        `;
        parent.appendChild(subLi);
      });
    }
  });
  
  // Set default selection on load or keep existing selection
  if (!state.selectedLeague && groups.length > 0) {
    const firstCountry = groups[0];
    const firstLeague = firstCountry.leaguesList[0];
    const defaultKey = `${firstCountry.country} - ${firstLeague.leagueName}`;
    state.sidebarExpanded[firstCountry.country] = true;
    selectLeague(defaultKey);
  } else if (state.selectedLeague) {
    const parts = state.selectedLeague.split(' - ');
    const country = parts[0];
    if (state.sidebarExpanded[country] === undefined) {
      state.sidebarExpanded[country] = true;
    }
    selectLeague(state.selectedLeague);
  }
}

function updateLanguageUI() {
  const t = i18n[state.lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  
  // Update stake symbol
  const stakeLabel = document.getElementById('stake-label-el');
  if (stakeLabel) stakeLabel.textContent = t.stakeLabel;
  
  translateCurrentBetSelection();
  if (state.allMatches && state.allMatches.length > 0) {
    renderSidebar(state.allMatches);
  }
  
  if (state.currentSport === 'basketball_players') {
    const titleEl = document.getElementById('league-board-title');
    if (titleEl) {
      titleEl.textContent = state.lang === 'sr' ? 'Košarka Igrači | Merkur XTip' : 'Basketball Players | Merkur XTip';
    }
    renderBasketballHeaders();
    renderBasketballPlayers();
  } else {
    renderFootballHeaders();
  }
  
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

function selectOdds(btnEl, matchName, selectionName, oddsValue, marketGroup = 'classic', isLowMargin = false, sport = 'football') {
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
  
  const isEligible = !!btnEl.querySelector('.odds-boost-badge') || (!isLowMargin && marketGroup === 'classic');
  
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
    isEligible: !isLowMargin,
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

function removeSelectionFromParlay(matchName) {
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
  } else {
    state.currentBet = state.selections[0];
  }
  
  if (state.slot && state.slot.slotBoostActive) {
    reapplySlotBoost();
  }
  
  renderBetslip();
}

function reapplySlotBoost() {
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

function getBasketBoostReduction(count) {
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
    const currency = state.lang === 'sr' ? 'RSD' : 'EUR';
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
  const currency = state.lang === 'sr' ? 'RSD' : 'EUR';
  const isSR = state.lang === 'sr';
  
  const totalOdds = state.basketSelections.reduce((sum, sel) => sum * sel.odds, 1);
  const stake = state.basketStake || 1000;
  const totalWin = (stake * totalOdds).toFixed(2);
  
  let details = '';
  state.basketSelections.forEach(sel => {
    const selName = sel.selectionType === 'over' ? (isSR ? 'Više' : 'Over') : (isSR ? 'Manje' : 'Under');
    details += `• ${sel.playerName}: ${selName} [${sel.line}] (@${sel.odds.toFixed(2)})${sel.isBoosted ? ' (BOOSTED! ⚡)' : ''}\n`;
  });
  
  alert(`${t.placedModalTitle}\n\nSelections:\n${details}\nOdds: ${totalOdds.toFixed(2)}\nStake: ${stake} ${currency}\n${t.possibleWin} ${totalWin} ${currency}\n\n${t.placedModalSub}`);
  
  state.basketSelections = [];
  resetBasketBoost();
  renderBasketballPlayers();
  renderBetslip();
}

function renderBetslip() {
  const container = document.getElementById('betslip-content-area');
  if (!container) return;
  
  const t = i18n[state.lang];
  const currency = state.lang === 'sr' ? 'RSD' : 'EUR';
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
    mQuickLaunchBtn.style.display = (selections.length === 1 && selections[0].isEligible) ? 'block' : 'none';
    mQuickLaunchBtn.textContent = '🚀 TURBO X';
    mQuickLaunchBtn.onclick = (e) => {
      e.stopPropagation();
      openRocketArena();
    };
  }
  
  let selectionsHTML = '';
  selections.forEach((sel, idx) => {
    const isPairTurbo = sel.isTurboBoosted;
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

    const pairTurboRowHTML = isSlotApplied ? '' : `
        <div class="bet-pair-turbo-row" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size: 11px; color: ${sel.isTurboBoosted ? '#2ecc71' : '#a0aec0'}; font-weight: ${sel.isTurboBoosted ? '700' : 'normal'};">
            ${sel.isLowMargin ? '🛡️ Specijalna igra (Standard kvota)' : (sel.isTurboBoosted ? '⚡ Turbo na paru zaključan' : '🚀 Pojedinačni Turbo X:')}
          </span>
          ${sel.isLowMargin 
            ? `<button class="btn-pair-turbo disabled" disabled title="Specijalne igre ne mogu koristiti Turbo">🚫 Nije dostupno</button>`
            : sel.isTurboBoosted
              ? `<span style="font-size: 11.5px; font-weight: 800; color: #2ecc71; background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.4); padding: 4px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">⚡ +${(sel.turboPercent || 0).toFixed(1)}%</span>`
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
  if (selections.length >= 3) {
    slotOrPromoHTML = renderParlaySlotWidget();
  }

  container.innerHTML = `
    <div style="max-height: 340px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px;">
      ${selectionsHTML}
    </div>

    ${slotOrPromoHTML}

    ${(selections.length === 1 && selections[0].isEligible && !selections[0].isBoosted && !selections[0].hasCrashed) ? `
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
    const currency = state.lang === 'sr' ? 'RSD' : 'EUR';
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

function hasActiveTurboBoost() {
  if (state.currentBet && state.currentBet.isBoosted && !state.currentBet.hasCrashed && (state.currentBet.boostPercent || 0) > 0) {
    return true;
  }
  if (state.selections && state.selections.length > 0) {
    return state.selections.some(sel => sel.isTurboBoosted && !sel.hasCrashed && (sel.turboPercent || 0) > 0);
  }
  return false;
}

function renderParlaySlotWidget() {
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

function renderParlaySlotPromoWidget(count) {
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

function showParlaySlotPromoModal() {
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

function closeParlaySlotPromoModal() {
  const modal = document.getElementById('parlay-slot-promo-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function spinParlaySlot() {
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

function resetSlotSpins() {
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

function quickAddThreePairs() {
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
      marketGroup: 'classic',
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
      isEligible: true,
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

function updateSlotOverride(val) {
  if (!state.slot) return;
  state.slot.demoOverride = val;
  console.log('[Presentation Control] Parlay slot override set to: ' + val);
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

function launchPairTurbo(index, event) {
  if (event) event.stopPropagation();
  if (!state.selections || !state.selections[index]) return;
  const sel = state.selections[index];
  if (sel.isLowMargin) {
    showToast('🛡️ Specijalna igra (AH, Dvoznak) koristi standardnu kvotu i ne može se uvećavati Turbom.', 'error');
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
    isEligible: !sel.isLowMargin
  };
  
  openRocketArena();
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
  clearRocketTimeouts();
  
  if (state.game.isRunning) return;
  
  state.game.isRunning = true;
  if (state.currentBet) state.currentBet.hasCrashed = false;
  state.game.currentBoost = 0.0;
  state.game.secretMaxBoost = generateSecretMaxBoost();
  state.game.startTime = performance.now();
  
  console.log(`[Demo Engine] Secret Max Boost generated: +${state.game.secretMaxBoost.toFixed(2)}%`);
  
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

function stopRocket(userClickedStop) {
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
          <span class="hud-crash-title">${state.lang === 'sr' ? 'RAKETA JE PALA!' : 'ROCKET CRASHED!'}</span>
          <span class="hud-crash-sub">${state.lang === 'sr' ? 'Nisi zaključao boost na vreme.' : 'You didn\'t lock the boost in time.'}</span>
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


function initSportsbook() {
  fetchMerkurFeed().then(matches => {
    state.allMatches = matches;
    
    // Render the sidebar (which selects the first league by default and calls selectLeague)
    renderSidebar(matches);
    
    // No match pre-selected by default on app opening (`nijedan par ne sme biti selektovan po defaultu`)
    state.currentBet = null;
    
    renderBetslip();
  });
}

function checkAuthStateOnInit() {
  const isAuth = localStorage.getItem('rocket_boost_auth') === 'true';
  const overlay = document.getElementById('auth-overlay');
  
  if (isAuth) {
    if (overlay) overlay.classList.add('hidden');
    initSportsbook();
  } else {
    if (overlay) overlay.classList.remove('hidden');
    
    // Fetch local password config fallback
    fetch('/config.json')
      .then(r => r.json())
      .then(data => {
        state.localPassword = data.access_password || 'rocketboost2026';
      })
      .catch(err => {
        state.localPassword = 'rocketboost2026';
      });
  }
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const passwordInput = document.getElementById('auth-password');
  const errorMsg = document.getElementById('auth-error-msg');
  if (!passwordInput || !errorMsg) return;
  
  const password = passwordInput.value;
  
  // 1. Attempt serverless API verify check
  fetch('/api/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
  .then(res => {
    if (res.status === 404) {
      throw new Error('endpoint_missing');
    }
    return res.json();
  })
  .then(data => {
    if (data.success) {
      handleSuccessfulLogin();
    } else {
      handleFailedLogin();
    }
  })
  .catch(err => {
    // 2. Fallback to local config validation if Netlify endpoint doesn't exist
    const localPass = state.localPassword || 'rocketboost2026';
    if (password === localPass) {
      handleSuccessfulLogin();
    } else {
      handleFailedLogin();
    }
  });
}

function handleSuccessfulLogin() {
  localStorage.setItem('rocket_boost_auth', 'true');
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
  
  const passwordInput = document.getElementById('auth-password');
  if (passwordInput) passwordInput.value = '';
  
  const errorMsg = document.getElementById('auth-error-msg');
  if (errorMsg) errorMsg.classList.remove('shaking');
  
  initSportsbook();
}

function handleFailedLogin() {
  const errorMsg = document.getElementById('auth-error-msg');
  if (errorMsg) {
    errorMsg.classList.remove('shaking');
    void errorMsg.offsetWidth; // trigger reflow
    errorMsg.classList.add('shaking');
  }
  
  const passwordInput = document.getElementById('auth-password');
  if (passwordInput) {
    passwordInput.focus();
    passwordInput.select();
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('auth-password');
  const toggleBtn = document.querySelector('.auth-toggle-visibility');
  if (!passwordInput || !toggleBtn) return;
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.textContent = '🔒';
  } else {
    passwordInput.type = 'password';
    toggleBtn.textContent = '👁️';
  }
}

function handleLogout() {
  localStorage.removeItem('rocket_boost_auth');
  removeBet();
  
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
  }
  
  fetch('/config.json')
    .then(r => r.json())
    .then(data => {
      state.localPassword = data.access_password || 'rocketboost2026';
    })
    .catch(err => {
      state.localPassword = 'rocketboost2026';
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
});

