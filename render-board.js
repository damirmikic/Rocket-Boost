/**
 * ==========================================================================
 * MERKUR XTIP — MATCH BOARD & SIDEBAR RENDERING
 * Football/basketball match list rendering, hierarchical league sidebar,
 * and language-driven UI refresh.
 * ==========================================================================
 */

import { state, i18n, t, getSelectionDisplayName } from './state.js';
import { playSuccessSound, playTickSound } from './audio.js';
import { initSwipeDeck, renderSwipeDeck } from './swipe.js';
import { renderBetslip, selectOdds, resetAllOddsToDefault, getBasketBoostReduction, toggleSidebarDrawer, translateCurrentBetSelection } from './app.js';

export function renderMatches(matches) {
  const container = document.getElementById('matches-list-container');
  if (!container) return;
  
  state.matches = matches;

  if (state.viewMode === 'swipe') {
    renderSwipeDeck();
  }

  container.innerHTML = '';
  
  matches.forEach((m, idx) => {
    const date = new Date(m.kickOffTime);
    const hrs = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    const timeStr = `🕒 ${hrs}:${mins} • ⭐`;
    
    const oddsConfig = [
      { key: '1', selectionKey: '1', marketGroup: '1x2', isLowMargin: false },
      { key: '2', selectionKey: 'X', marketGroup: '1x2', isLowMargin: false },
      { key: '3', selectionKey: '2', marketGroup: '1x2', isLowMargin: false },
      { key: '22', selectionKey: '0-2', marketGroup: 'classic', isLowMargin: false },
      { key: '24', selectionKey: '3+', marketGroup: 'classic', isLowMargin: false },
      { key: '25', selectionKey: '4+', marketGroup: 'classic', isLowMargin: false },
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
          const home = m.home;
          const away = m.away;
          let selectionName = getSelectionDisplayName(item.selectionKey, home, away);
          
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

export function getHierarchicalLeagues(matches) {
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

export function renderFootballHeaders() {
  const headers = document.getElementById('board-headers');
  if (!headers) return;
  headers.innerHTML = `
    <div>${t('matchColHeader')}</div>
    <div class="odds-header-group"><span>1</span><span>X</span><span>2</span></div>
    <div class="odds-header-group"><span>0-2</span><span>3+</span><span>4+</span></div>
    <div class="odds-header-group"><span>GG</span><span>I GG</span><span>GG&3+</span></div>
    <div></div>
  `;
}

export function renderBasketballHeaders() {
  const headers = document.getElementById('board-headers');
  if (!headers) return;
  headers.innerHTML = `
    <div>${t('playerColHeader')}</div>
    <div style="text-align: center;">${t('lineColHeader')}</div>
    <div style="text-align: center;">${t('underColHeader')}</div>
    <div style="text-align: center;">${t('overColHeader')}</div>
    <div></div>
  `;
}

export function selectBasketballPlayersCategory() {
  state.currentSport = 'basketball_players';
  state.selectedLeague = null;
  state.currentBet = null; // Clear football selection
  state.footballMenuExpanded = false; // Collapse the football league tree
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

  renderSidebar(state.allMatches); // Re-render to collapse the football league tree

  const chevron = document.getElementById('football-menu-chevron');
  if (chevron) chevron.textContent = '⌄';

  const titleEl = document.getElementById('league-board-title');
  if (titleEl) {
    titleEl.textContent = t('basketballPageTitle');
  }

  renderBasketballHeaders();
  if (state.viewMode === 'swipe') {
    initSwipeDeck();
  }
  renderBasketballPlayers();
  renderBetslip();
  toggleSidebarDrawer(false);
}

export function renderBasketballPlayers() {
  const container = document.getElementById('matches-list-container');
  if (!container) return;
  
  if (state.viewMode === 'swipe') {
    renderSwipeDeck();
  }

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

export function selectBasketOdds(btnEl, playerId, selectionType, oddsValue) {
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

export function resetBasketBoost() {
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

export function runBasketBoostRoulette() {
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


export function toggleFootballMenu() {
  const switchingFromOtherSport = state.currentSport !== 'football';
  state.currentSport = 'football';

  if (switchingFromOtherSport) {
    state.footballMenuExpanded = true;
    state.basketSelections = [];
    resetBasketBoost();
  } else {
    state.footballMenuExpanded = !state.footballMenuExpanded;
  }

  renderSidebar(state.allMatches); // Also re-selects/re-renders the football board via its tail logic

  const chevron = document.getElementById('football-menu-chevron');
  if (chevron) chevron.textContent = state.footballMenuExpanded ? '⌃' : '⌄';
}

export function selectLeague(leagueKey) {
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
  
  if (state.viewMode === 'swipe') {
    initSwipeDeck();
  }
  renderMatches(filteredMatches);
  toggleSidebarDrawer(false);
}

export function toggleCountryExpanded(country) {
  state.sidebarExpanded[country] = !state.sidebarExpanded[country];
  renderSidebar(state.allMatches);
}

export function renderSidebar(matches) {
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

  // The country/league tree only renders once "Fudbal" is expanded — see toggleFootballMenu()
  if (state.footballMenuExpanded) {

  // 1. Render "TOP LIGE" Virtual Accordion
  if (topLeaguesList.length > 0) {
    const topLigeKey = 'TOP_LIGE';
    const isExpanded = !!state.sidebarExpanded[topLigeKey];
    const topLigeTitle = t('topLeagues');
    
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
    const flag = COUNTRY_FLAGS[g.country] || COUNTRY_FLAGS[t('otherCountry')] || '⚽';
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

  } // end state.footballMenuExpanded

  // Set default selection on load or keep existing selection (only while viewing football —
  // don't hijack the board back to football when this re-render was triggered from basketball)
  if (state.currentSport !== 'football') return;

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

export function updateLanguageUI() {
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
      titleEl.textContent = t.basketballPageTitle;
    }
    renderBasketballHeaders();
    renderBasketballPlayers();
  } else {
    renderFootballHeaders();
  }
  
  renderBetslip();
}
