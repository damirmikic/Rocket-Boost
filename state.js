/**
 * ==========================================================================
 * MERKUR XTIP — GLOBAL STATE, MOCK DATA & I18N
 * Central state object, translation dictionary, and mock fallback data.
 * ==========================================================================
 */

// Mock Matches Fallback
export const MOCK_MATCHES = [
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
      "22": 1.90,
      "24": 1.92,
      "25": 3.45,
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
      "22": 1.63,
      "24": 2.27,
      "25": 4.50,
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
      "22": 1.85,
      "24": 1.95,
      "25": 3.60,
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
      "22": 1.70,
      "24": 2.15,
      "25": 4.10,
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
export const MOCK_BASKETBALL_PLAYERS = [
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
export const state = {
  lang: 'sr', // 'sr' | 'en'
  soundEnabled: true,
  currentBet: null, // Initialized dynamically (for Football / Rocket Boost single bet)
  selections: [],   // Multi-bet / Parlay (Express) ticket selections
  matches: [],      // Store active filtered matches
  allMatches: [],   // Store all loaded matches from Merkur or Fallback
  selectedLeague: null, // Store selected sidebar league key
  sidebarExpanded: {},  // Accordion toggle states for countries
  footballMenuExpanded: false, // Whether the Fudbal sidebar item shows the country/league tree
  currentSport: 'football', // 'football' | 'basketball_players'
  viewMode: 'classic', // 'classic' | 'swipe'
  swipeIndex: 0,
  swipeSelectedPick: {}, // map matchId -> selectionKey
  swipeHistory: [], // history for undo
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
    vipTier: 'standard', // 'standard' | 'gold' | 'diamond'
    marginOverride: null, // null = derive from the fixture's 1X2 odds; number = demo DMS margin (%)
    usedTurboMatches: [] // matches whose single Turbo X attempt has been consumed on this ticket
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
  },
  mysteryBox: {
    isOpen: false,
    phase: 'pick',      // 'pick' | 'reveal'
    selectedBoxIndex: null,  // 0 | 1 | 2
    boxOrder: [0, 1, 2],     // shuffled so player can't tell type from position
    generatedPackage: null,  // { safe: [], medium: [], crazy: [] }
    revealedTicket: null,    // { type, label, emoji, picks, totalOdds }
    isMysteryTicketActive: false // mutual exclusion flag
  }
};



// Translations Dictionary
export const i18n = {
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
    pitchPoint1: 'Skriveni maksimum koristi težinsku verovatnoću (35% brzi crash, 40% srednji, 18% visoki, 7% jackpot). Pošto igrači koji jure visoke kvote (+30%) padaju u većini slučajeva, stvarni trošak isplate ostaje strogo kontrolisan, čuvajući veći deo osnovne margine (proveri tačan procenat kroz Monte Carlo simulator).',
    pitchPoint2: 'Igrači vide kako multiplikator raste do +30% ili +45%, što pruža psihološko uzbuđenje Aviator igre unutar sportskog tiketa. Korisnik ima osećaj da pobeđuje kladionicu, dok sistem ostaje matematički održiv.',
    pitchPoint3: 'Kada raketa eksplodira na >4%, postoji 35% šanse za utešni boost (0.25 × M). Ova "near-miss" nagrada sprečava frustraciju i održava stopu ponovnog klađenja izuzetno visokom.',
    pitchPoint4: 'EKSKLUZIVNA VIP DOSTUPNOST (CRM DROPS): Mehanika NIJE stalno dostupna svima! Dodeljuje se kvalifikovanim igračima 1x do 4x mesečno kao loyalty bonus u zavisnosti od statusa (Standard, Gold, Diamond). Ovo štiti budžet i stvara ogroman FOMO i želju za depozitom na početku meseca!',
    pitchPoint5: 'AUTOMATSKA ZAŠTITA MARGINE (DMS Engine): Na mečevima sa malom marginom (npr. derbi ili Super Kvota sa 1.5% holda), sistem automatski smanjuje damping faktor i limitira maksimalni boost na +8% umesto +85%, garantujući +EV status kuće.',
    basketPlayers: 'Košarka Igrači',
    basketBoostBtn: 'Aktiviraj Basket Boost',
    basketBoostRunning: 'Vrtim Roulette...',
    basketBoostAlreadyRun: 'Tvoj tiket je boosted!',
    currencyCode: 'RSD',
    selDraw: 'X (Nerešeno)',
    sel02Goals: '0-2 Gola',
    sel3PlusGoals: '3+ Gola',
    sel4PlusGoals: '4+ Gola',
    selGG: 'GG (Oba daju gol)',
    sel1X: '1X (Dvoznak)',
    selX2: 'X2 (Dvoznak)',
    selAH15: 'AH -1.5 (Hendikep)',
    winSuffix: 'pobeda',
    matchColHeader: 'Utakmica / Meč',
    playerColHeader: 'Igrač / Meč',
    lineColHeader: 'Granica',
    underColHeader: 'Manje (-)',
    overColHeader: 'Više (+)',
    over: 'Više',
    under: 'Manje',
    basketballPageTitle: 'Košarka Igrači | Merkur XTip',
    topLeagues: 'TOP LIGE',
    otherCountry: 'Ostalo',
    rocketCrashedTitle: 'RAKETA JE PALA!',
    rocketCrashedSub: 'Nisi zaključao boost na vreme.',
    stratConservative: '🛡️ Konzervativci (cilj +5.0%)',
    stratModerate: '⚖️ Umjereni igrači (cilj +10.0%)',
    stratAggressive: '🔥 Agresivni (cilj +18.0%)',
    stratGreedy: '💥 Lovci na jackpot (cilj +30.0%)',
    simAvgSecretMax: 'PROSEČAN TAJNI MAKSIMUM (M)',
    simAvgUserBoost: 'PROSEČNO ISPLAĆEN BOOST KORISNICIMA',
    simConsolationSub: 'Uključujući {pct}% utešnih isplata',
    simNetHold: 'NETO ZADRŽANA MARGINA KLADIONICE',
    simSustainable: '✅ ODRŽIVO & PROFITABILNO (+EV)',
    simThinMargin: '⚠️ TANJA MARGINA — PROMO / VIP LTV HOLD',
    simColArchetype: 'Arhetip Igrača & Strategija',
    simColWinRate: 'Stopa Pobeda (Crash Avoided)',
    simColAvgBoost: 'Prosečno Isplaćeno (+%)',
    simColNetHold: 'Neto Margina Kladionice',
    simColStatus: 'Status Profitabilnosti',
    simProtected: '✅ ZAŠTIĆENO (DMS)',
    simNegativeHold: '❌ GUBITAK HOLD-A',
    swipeModeToggle: 'Swipe to Bet',
    classicModeToggle: 'Tradicionalni Bilten',
    swipeBetTitle: '⚡ SWIPE TO BET ARENA',
    swipeAddTicket: 'DODAJ',
    swipeSkip: 'PRESKOČI',
    swipeUndo: 'Vrati',
    swipePickMarket: 'Izaberi tip (klikni pa prevuci):',
    swipeDeckCompleted: 'Sve kartice su pregledane!',
    swipeAddedCount: 'Dodati mečevi na tiket:',
    swipeRestartDeck: '🔄 Resetuj kartice',
    // Mystery Bet Box
    mysteryBoxPromoLabel: 'MYSTERY\nBOX',
    mysteryBoxTitle: '🎁 MYSTERY BET BOX',
    mysteryBoxSubtitle: 'Izaberi jednu kutiju — unutra je spreman tiket za vikend!',
    mysteryBoxPrice: 'Paket: 1.000 RSD',
    mysteryBoxPickPrompt: 'Klikni na kutiju da otkriješ koji tiket kriješ!',
    mysteryBoxRevealTitle: 'TVOJ TIKET JE OTKRIVEN!',
    mysteryBoxSafeLabel: '🛡️ SIGURICA',
    mysteryBoxMediumLabel: '⚖️ SREDNJI RIZIK',
    mysteryBoxCrazyLabel: '💥 LUDI VIKEND',
    mysteryBoxTotalOdds: 'Ukupna kvota',
    mysteryBoxMatches: 'parova',
    mysteryBoxAddToSlip: '✅ DODAJ NA BETSLIP',
    mysteryBoxRefresh: '🔄 Nova selekcija',
    mysteryBoxClose: 'Zatvori',
    mysteryBoxConflict: '⚠️ Mystery Box tiket nije kompatibilan sa Turbo X, Parlay Slot i Basket Boost benefitima.',
    mysteryBoxActiveWarning: '🎁 Mystery Box tiket je aktivan — Turbo X i Parlay Slot boost su onemogućeni.',
    turboAttemptUsed: '🛡️ Turbo X je već iskorišćen za ovaj meč — dozvoljen je samo jedan pokušaj po paru.',
    turboAttemptUsedLabel: '🔒 Turbo X iskorišćen'
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
    pitchPoint1: 'The secret maximum (M) uses weighted probability (35% fast crash, 40% medium, 18% high, 7% jackpot). Because greedy players (+30% target) crash most of the time, the effective payout cost stays tightly bounded, preserving most of the base house hold (see the Monte Carlo simulator below for the exact live figure).',
    pitchPoint2: 'Bettors see live multipliers climbing up to +30% or +45%, giving the psychological thrill of an Aviator crash game inside a sportsbook ticket. The user *feels* like they are beating the bookmaker while staying mathematically sustainable.',
    pitchPoint3: 'When a rocket crashes at >4%, there is a 35% chance of a consolation mini-boost (0.25 × M). This "near-miss" reward prevents frustration, keeping retention and re-bet rates extremely high.',
    pitchPoint4: 'VIP EXCLUSIVITY & CRM DROPS: This mechanic is NOT always-on! It is awarded to qualified players strictly 1x to 4x per month as a loyalty drop based on tier (Standard, Gold, Diamond). This protects budget and drives massive FOMO and start-of-month deposit retention!',
    pitchPoint5: 'AUTOMATED MARGIN PROTECTION (DMS Engine): On low-margin fixtures (e.g., derbies or Super Odds with 1.5% hold), the system automatically throttles the damping factor and caps the flight at +8% instead of +85%, guaranteeing positive house EV.',
    basketPlayers: 'Basketball Players',
    basketBoostBtn: 'Activate Basket Boost',
    basketBoostRunning: 'Spinning Roulette...',
    basketBoostAlreadyRun: 'Your ticket is boosted!',
    currencyCode: 'EUR',
    selDraw: 'X (Draw)',
    sel02Goals: '0-2 Goals',
    sel3PlusGoals: '3+ Goals',
    sel4PlusGoals: '4+ Goals',
    selGG: 'GG (Both Teams to Score)',
    sel1X: '1X (Double Chance)',
    selX2: 'X2 (Double Chance)',
    selAH15: 'AH -1.5 (Handicap)',
    winSuffix: 'Win',
    matchColHeader: 'Match / Event',
    playerColHeader: 'Player / Match',
    lineColHeader: 'Line',
    underColHeader: 'Under (-)',
    overColHeader: 'Over (+)',
    over: 'Over',
    under: 'Under',
    basketballPageTitle: 'Basketball Players | Merkur XTip',
    topLeagues: 'TOP LEAGUES',
    otherCountry: 'Other',
    rocketCrashedTitle: 'ROCKET CRASHED!',
    rocketCrashedSub: 'You didn\'t lock the boost in time.',
    stratConservative: '🛡️ Conservative (aims +5.0%)',
    stratModerate: '⚖️ Moderate (aims +10.0%)',
    stratAggressive: '🔥 Aggressive (aims +18.0%)',
    stratGreedy: '💥 Greedy / Chasers (aims +30.0%)',
    simAvgSecretMax: 'AVG SECRET MAX BOOST (M)',
    simAvgUserBoost: 'AVG EFFECTIVE USER BOOST PAID',
    simConsolationSub: 'Includes {pct}% consolation crash payouts',
    simNetHold: 'NET RETAINED SPORTSBOOK HOLD',
    simSustainable: '✅ SUSTAINABLE & PROFITABLE (+EV)',
    simThinMargin: '⚠️ THIN MARGIN — PROMO / VIP LTV HOLD',
    simColArchetype: 'Player Strategy Archetype',
    simColWinRate: 'Win Rate (Crash Avoided)',
    simColAvgBoost: 'Avg Effective Boost (+%)',
    simColNetHold: 'Net Retained House Hold',
    simColStatus: 'Profitability Status',
    simProtected: '✅ PROTECTED (DMS)',
    simNegativeHold: '❌ NEGATIVE HOLD',
    swipeModeToggle: 'Swipe to Bet',
    classicModeToggle: 'Classic Bulletin',
    swipeBetTitle: '⚡ SWIPE TO BET ARENA',
    swipeAddTicket: 'ADD',
    swipeSkip: 'SKIP',
    swipeUndo: 'Undo',
    swipePickMarket: 'Select Pick (click or swipe):',
    swipeDeckCompleted: 'All cards reviewed!',
    swipeAddedCount: 'Matches added to slip:',
    swipeRestartDeck: '🔄 Restart Cards',
    // Mystery Bet Box
    mysteryBoxPromoLabel: 'MYSTERY\nBOX',
    mysteryBoxTitle: '🎁 MYSTERY BET BOX',
    mysteryBoxSubtitle: 'Pick one box — a ready-made weekend ticket is inside!',
    mysteryBoxPrice: 'Package: 1,000 RSD',
    mysteryBoxPickPrompt: 'Click a box to reveal which ticket you got!',
    mysteryBoxRevealTitle: 'YOUR TICKET IS REVEALED!',
    mysteryBoxSafeLabel: '🛡️ SAFE BET',
    mysteryBoxMediumLabel: '⚖️ MEDIUM RISK',
    mysteryBoxCrazyLabel: '💥 CRAZY WEEKEND',
    mysteryBoxTotalOdds: 'Total odds',
    mysteryBoxMatches: 'matches',
    mysteryBoxAddToSlip: '✅ ADD TO BETSLIP',
    mysteryBoxRefresh: '🔄 New selection',
    mysteryBoxClose: 'Close',
    mysteryBoxConflict: '⚠️ Mystery Box ticket is not compatible with Turbo X, Parlay Slot, and Basket Boost.',
    mysteryBoxActiveWarning: '🎁 Mystery Box ticket is active — Turbo X and Parlay Slot boosts are disabled.',
    turboAttemptUsed: '🛡️ Turbo X has already been used for this match — only one attempt per selection is allowed.',
    turboAttemptUsedLabel: '🔒 Turbo X used'
  }
};

export function t(key) {
  return (i18n[state.lang] && i18n[state.lang][key]) || key;
}

// 1X2 overround margin in percent. Merkur feed keys: '1' = home, '2' = draw, '3' = away.
export function computeMatchMargin(odds) {
  const o1 = parseFloat(odds?.['1']);
  const oX = parseFloat(odds?.['2']);
  const o2 = parseFloat(odds?.['3']);
  if (!(o1 > 1 && oX > 1 && o2 > 1)) return null;
  return parseFloat(((1 / o1 + 1 / oX + 1 / o2 - 1) * 100).toFixed(2));
}

export function getMatchMarginByName(matchName) {
  const pool = (state.allMatches && state.allMatches.length > 0) ? state.allMatches : MOCK_MATCHES;
  const match = pool.find(m => `${m.home} vs ${m.away}` === matchName);
  return match ? computeMatchMargin(match.odds) : null;
}

export function getSelectionDisplayName(selectionKey, home, away) {
  switch (selectionKey) {
    case '1': return `1 (${home} ${t('winSuffix')})`;
    case 'X': return t('selDraw');
    case '2': return `2 (${away} ${t('winSuffix')})`;
    case '0-2': return t('sel02Goals');
    case '3+': return t('sel3PlusGoals');
    case '4+': return t('sel4PlusGoals');
    case 'GG': return t('selGG');
    case 'I GG': return 'I GG';
    case 'GG & 3+': return 'GG & 3+';
    case '1X (Dvoznak)': return t('sel1X');
    case 'X2 (Dvoznak)': return t('selX2');
    case 'AH -1.5 (Hendikep)': return t('selAH15');
    default: return '';
  }
}
