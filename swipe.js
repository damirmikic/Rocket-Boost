/**
 * ==========================================================================
 * MERKUR XTIP — SWIPE TO BET FEATURE ENGINE
 * ==========================================================================
 */

import { state, getSelectionDisplayName, MOCK_MATCHES } from './state.js';
import { renderBetslip, removeSelectionFromParlay, reapplySlotBoost } from './app.js';
import { selectBasketOdds } from './render-board.js';

export function switchViewMode(mode) {
  state.viewMode = mode;
  const btnClassic = document.getElementById('btn-view-classic');
  const btnSwipe = document.getElementById('btn-view-swipe');
  const boardHeaders = document.getElementById('board-headers');
  const matchesContainer = document.getElementById('matches-list-container');
  const swipeContainer = document.getElementById('swipe-bet-container');

  if (mode === 'swipe') {
    if (btnClassic) btnClassic.classList.remove('active');
    if (btnSwipe) btnSwipe.classList.add('active');
    if (boardHeaders) boardHeaders.style.display = 'none';
    if (matchesContainer) matchesContainer.style.display = 'none';
    if (swipeContainer) swipeContainer.style.display = 'flex';
    
    initSwipeDeck();
  } else {
    if (btnSwipe) btnSwipe.classList.remove('active');
    if (btnClassic) btnClassic.classList.add('active');
    if (boardHeaders) boardHeaders.style.display = 'grid';
    if (matchesContainer) matchesContainer.style.display = 'block';
    if (swipeContainer) swipeContainer.style.display = 'none';
  }
}

function getSwipeItems() {
  if (state.currentSport === 'basketball_players') {
    return state.basketPlayers || [];
  } else {
    return (state.matches && state.matches.length > 0) ? state.matches : MOCK_MATCHES;
  }
}

export function initSwipeDeck() {
  state.swipeIndex = 0;
  state.swipeHistory = [];
  renderSwipeDeck();
}

export function renderSwipeDeck() {
  const deckArea = document.getElementById('swipe-deck-area');
  const counterEl = document.getElementById('swipe-card-counter');
  const leagueTagEl = document.getElementById('swipe-league-tag');
  const undoBtn = document.getElementById('btn-swipe-undo');
  
  if (!deckArea) return;
  
  const items = getSwipeItems();
  const totalItems = items.length;
  const isBasketball = state.currentSport === 'basketball_players';

  if (counterEl) {
    if (state.swipeIndex < totalItems) {
      counterEl.textContent = `KARTICA ${state.swipeIndex + 1} OD ${totalItems}`;
    } else {
      counterEl.textContent = `KRAJ ŠPILA (${totalItems}/${totalItems})`;
    }
  }

  if (leagueTagEl) {
    if (isBasketball) {
      leagueTagEl.textContent = '🏀 NBA Igrači';
    } else {
      const currentLeague = state.selectedLeague ? state.selectedLeague.replace(/^.*#/, '') : (items[0]?.leagueName || 'World Cup 2026');
      leagueTagEl.textContent = currentLeague;
    }
  }

  if (undoBtn) {
    undoBtn.disabled = state.swipeHistory.length === 0;
    undoBtn.style.opacity = state.swipeHistory.length === 0 ? '0.4' : '1';
  }

  deckArea.innerHTML = '';

  // Empty deck state
  if (state.swipeIndex >= totalItems) {
    const addedCount = isBasketball ? (state.basketSelections ? state.basketSelections.length : 0) : (state.selections ? state.selections.length : 0);
    let totalOdds = 1.0;
    if (isBasketball) {
      if (state.basketSelections && state.basketSelections.length > 0) {
        totalOdds = state.basketSelections.reduce((acc, s) => acc * s.odds, 1.0);
      }
    } else {
      if (state.selections && state.selections.length > 0) {
        totalOdds = state.selections.reduce((acc, s) => acc * (s.boostedOdds || s.baseOdds), 1.0);
      }
    }
    
    deckArea.innerHTML = `
      <div class="swipe-empty-deck">
        <div class="swipe-empty-icon">🎉</div>
        <div class="swipe-empty-title" data-i18n="swipeDeckCompleted">Sve kartice su pregledane!</div>
        <div class="swipe-empty-desc">
          Dodato je <strong style="color: var(--accent-gold);">${addedCount}</strong> ${isBasketball ? 'igrača' : 'mečeva'} na tiket.<br>
          Ukupna kvota tiketa: <strong style="color: #2ecc71;">${totalOdds.toFixed(2)}</strong>
        </div>
        <div class="swipe-empty-actions">
          <button class="swipe-empty-btn primary" onclick="initSwipeDeck()">🔄 Resetuj kartice</button>
          <button class="swipe-empty-btn secondary" onclick="switchViewMode('classic')">📋 Bilten prikaz</button>
        </div>
      </div>
    `;
    return;
  }

  // Next card (background card)
  if (state.swipeIndex + 1 < totalItems) {
    const nextItem = items[state.swipeIndex + 1];
    const nextCardHTML = isBasketball 
      ? createSwipeCardHTMLBasketball(nextItem, state.swipeIndex + 1, true)
      : createSwipeCardHTML(nextItem, state.swipeIndex + 1, true);
    deckArea.insertAdjacentHTML('beforeend', nextCardHTML);
  }

  // Top Active Card
  const activeItem = items[state.swipeIndex];
  const activeCardHTML = isBasketball
    ? createSwipeCardHTMLBasketball(activeItem, state.swipeIndex, false)
    : createSwipeCardHTML(activeItem, state.swipeIndex, false);
  deckArea.insertAdjacentHTML('beforeend', activeCardHTML);

  // Attach drag listeners
  const topCard = deckArea.querySelector('.swipe-card:not(.next-card)');
  if (topCard) {
    attachCardDragListeners(topCard, activeItem);
  }
}

function createSwipeCardHTML(m, matchIdx, isNext) {
  const date = new Date(m.kickOffTime || Date.now());
  const hrs = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  const timeStr = `🕒 ${hrs}:${mins}`;
  
  const home = m.home || 'Domaćin';
  const away = m.away || 'Gost';
  const homeInit = home.substring(0, 3);
  const awayInit = away.substring(0, 3);

  if (!state.swipeSelectedPick) state.swipeSelectedPick = {};
  const selectedPickKey = state.swipeSelectedPick[m.id] || '1';

  const o1 = m.odds['1'] || 2.50;
  const oX = m.odds['2'] || 3.10;
  const o2 = m.odds['3'] || 3.00;

  const isHomeSelected = selectedPickKey === '1';
  const isDrawSelected = selectedPickKey === 'X';
  const isAwaySelected = selectedPickKey === '2';

  const nextClass = isNext ? 'next-card' : '';

  return `
    <div class="swipe-card ${nextClass}" data-match-id="${m.id}" data-match-idx="${matchIdx}">
      <div class="swipe-stamp like">DODAJ 💚</div>
      <div class="swipe-stamp skip">PRESKOČI ❌</div>

      <div class="card-top-info">
        <div class="card-league-name">
          <span>⚽</span> <span>${m.leagueName || 'Top Liga'}</span>
        </div>
        <div class="card-kickoff">${timeStr}</div>
        <div class="card-turbo-badge">⚡ Turbo X</div>
      </div>

      <div class="card-teams-box">
        <div class="card-team-item">
          <div class="team-logo-circle">${homeInit}</div>
          <div class="team-name" title="${home}">${home}</div>
        </div>
        <div class="card-vs-divider">VS</div>
        <div class="card-team-item">
          <div class="team-logo-circle" style="border-color: #60a5fa;">${awayInit}</div>
          <div class="team-name" title="${away}">${away}</div>
        </div>
      </div>

      <div class="card-market-section">
        <div class="card-market-label">Izaberi tip (klikni pa prevuci):</div>
        <div class="card-odds-grid">
          <div class="card-odds-btn ${isHomeSelected ? 'selected' : ''}" onclick="setSwipeCardPick(${m.id}, '1')">
            <span class="card-odds-name">1 (${homeInit})</span>
            <span class="card-odds-val">${o1.toFixed(2)}</span>
          </div>
          <div class="card-odds-btn ${isDrawSelected ? 'selected' : ''}" onclick="setSwipeCardPick(${m.id}, 'X')">
            <span class="card-odds-name">X (Nerešeno)</span>
            <span class="card-odds-val">${oX.toFixed(2)}</span>
          </div>
          <div class="card-odds-btn ${isAwaySelected ? 'selected' : ''}" onclick="setSwipeCardPick(${m.id}, '2')">
            <span class="card-odds-name">2 (${awayInit})</span>
            <span class="card-odds-val">${o2.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createSwipeCardHTMLBasketball(p, itemIdx, isNext) {
  const name = p.name || 'Igrač';
  const team = p.team || 'NBA';
  const match = p.match || 'NBA Match';
  const line = p.line || 20.5;
  const oUnder = p.oddsUnder || 1.85;
  const oOver = p.oddsOver || 1.85;
  const isBoosted = p.isBoosted;

  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);

  if (!state.swipeSelectedPick) state.swipeSelectedPick = {};
  const selectedPickKey = state.swipeSelectedPick[p.id] || 'over';

  const isUnderSelected = selectedPickKey === 'under';
  const isOverSelected = selectedPickKey === 'over';

  const nextClass = isNext ? 'next-card' : '';

  return `
    <div class="swipe-card ${nextClass}" data-player-id="${p.id}" data-item-idx="${itemIdx}">
      <div class="swipe-stamp like">DODAJ 💚</div>
      <div class="swipe-stamp skip">PRESKOČI ❌</div>

      <div class="card-top-info">
        <div class="card-league-name">
          <span>🏀</span> <span>NBA Player Props</span>
        </div>
        <div class="card-kickoff">${team}</div>
        <div class="card-turbo-badge" style="${isBoosted ? 'background: rgba(46,204,113,0.2); border-color:#2ecc71; color:#2ecc71;' : ''}">
          ${isBoosted ? '⚡ BOOSTED LINE' : '🏀 100% Boost'}
        </div>
      </div>

      <div class="card-teams-box" style="flex-direction: column; gap: 8px; padding: 14px 10px;">
        <div style="display: flex; align-items: center; gap: 14px; width: 100%; justify-content: center;">
          <div class="team-logo-circle" style="width: 54px; height: 54px; font-size: 20px; border-color: var(--accent-gold); background: linear-gradient(135deg, #2c3c50 0%, #151e29 100%);">
            ${initials}
          </div>
          <div style="text-align: left;">
            <div class="team-name" style="font-size: 16px; max-width: 220px;" title="${name}">${name}</div>
            <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">${team}</div>
          </div>
        </div>
        <div style="font-size: 11px; color: var(--accent-gold); font-weight: 700; background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 10px;">
          📌 ${match}
        </div>
      </div>

      <div class="card-market-section">
        <div class="card-market-label">Granica poena: <strong style="color:#fff; font-size: 13px;">${line}</strong></div>
        <div class="card-odds-grid" style="grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="card-odds-btn ${isUnderSelected ? 'selected' : ''}" onclick="setSwipeCardPick(${p.id}, 'under')">
            <span class="card-odds-name">Manje (-)</span>
            <span class="card-odds-val">${oUnder.toFixed(2)}</span>
          </div>
          <div class="card-odds-btn ${isOverSelected ? 'selected' : ''}" onclick="setSwipeCardPick(${p.id}, 'over')">
            <span class="card-odds-name">Više (+)</span>
            <span class="card-odds-val">${oOver.toFixed(2)} ⚡</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function setSwipeCardPick(itemId, pickKey) {
  if (!state.swipeSelectedPick) state.swipeSelectedPick = {};
  state.swipeSelectedPick[itemId] = pickKey;
  
  const topCard = document.querySelector('.swipe-card:not(.next-card)');
  if (topCard) {
    const btns = topCard.querySelectorAll('.card-odds-btn');
    btns.forEach(btn => btn.classList.remove('selected'));
    if (state.currentSport === 'basketball_players') {
      if (pickKey === 'under' && btns[0]) btns[0].classList.add('selected');
      if (pickKey === 'over' && btns[1]) btns[1].classList.add('selected');
    } else {
      if (pickKey === '1' && btns[0]) btns[0].classList.add('selected');
      if (pickKey === 'X' && btns[1]) btns[1].classList.add('selected');
      if (pickKey === '2' && btns[2]) btns[2].classList.add('selected');
    }
  }
}

function attachCardDragListeners(cardEl, itemData) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  const likeStamp = cardEl.querySelector('.swipe-stamp.like');
  const skipStamp = cardEl.querySelector('.swipe-stamp.skip');

  const onStart = (e) => {
    isDragging = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
    cardEl.style.transition = 'none';
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    currentX = clientX - startX;
    currentY = clientY - startY;

    const rotation = currentX * 0.07;
    cardEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotation}deg)`;

    const ratio = Math.min(Math.abs(currentX) / 100, 1);
    if (currentX > 15) {
      if (likeStamp) likeStamp.style.opacity = ratio;
      if (skipStamp) skipStamp.style.opacity = '0';
      cardEl.classList.add('swiping-right');
      cardEl.classList.remove('swiping-left');
    } else if (currentX < -15) {
      if (skipStamp) skipStamp.style.opacity = ratio;
      if (likeStamp) likeStamp.style.opacity = '0';
      cardEl.classList.add('swiping-left');
      cardEl.classList.remove('swiping-right');
    } else {
      if (likeStamp) likeStamp.style.opacity = '0';
      if (skipStamp) skipStamp.style.opacity = '0';
      cardEl.classList.remove('swiping-right', 'swiping-left');
    }
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    cardEl.style.transition = 'transform 0.25s ease, opacity 0.25s ease';

    const threshold = 85;
    if (currentX > threshold) {
      executeSwipeRight(cardEl, itemData);
    } else if (currentX < -threshold) {
      executeSwipeLeft(cardEl, itemData);
    } else {
      cardEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      if (likeStamp) likeStamp.style.opacity = '0';
      if (skipStamp) skipStamp.style.opacity = '0';
      cardEl.classList.remove('swiping-right', 'swiping-left');
    }
    currentX = 0;
    currentY = 0;
  };

  cardEl.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  cardEl.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);
}

function executeSwipeRight(cardEl, itemData) {
  const isBasketball = state.currentSport === 'basketball_players';
  const items = getSwipeItems();

  if (!itemData) {
    itemData = items[state.swipeIndex];
  }
  if (!itemData) return;

  const card = cardEl || document.querySelector('.swipe-card:not(.next-card)');
  if (card) {
    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    card.style.transform = 'translate3d(800px, 40px, 0) rotate(35deg)';
    card.style.opacity = '0';
  }

  if (isBasketball) {
    const pickKey = (state.swipeSelectedPick && state.swipeSelectedPick[itemData.id]) || 'over';
    const oddVal = (pickKey === 'under') ? itemData.oddsUnder : itemData.oddsOver;

    selectBasketOdds(null, itemData.id, pickKey, oddVal);

    if (state.soundEnabled && typeof playRocketSound === 'function') {
      try { playRocketSound(800, 0.08, 'sine'); } catch(e) {}
    }

    state.swipeHistory.push({
      matchIndex: state.swipeIndex,
      itemId: itemData.id,
      itemName: itemData.name,
      action: 'basket_bet',
      pickKey: pickKey
    });
  } else {
    const pickKey = (state.swipeSelectedPick && state.swipeSelectedPick[itemData.id]) || '1';
    const home = itemData.home;
    const away = itemData.away;
    const matchName = `${home} vs ${away}`;

    // Pick keys are '1' | 'X' | '2'; Merkur feed odds keys are '1' = home, '2' = draw, '3' = away.
    // Defaults mirror the ones shown on the card (createSwipeCardHTML).
    const FEED_KEY = { '1': '1', 'X': '2', '2': '3' };
    const DEFAULT_ODDS = { '1': 2.50, 'X': 3.10, '2': 3.00 };
    let selectionKey = FEED_KEY[pickKey] ? pickKey : '1';
    let oddVal = itemData.odds[FEED_KEY[selectionKey]] || DEFAULT_ODDS[selectionKey];
    let selectionDisplayName = getSelectionDisplayName(selectionKey, home, away);

    addSwipeSelectionToTicket(matchName, selectionDisplayName, oddVal);

    if (state.soundEnabled && typeof playRocketSound === 'function') {
      try { playRocketSound(800, 0.08, 'sine'); } catch(e) {}
    }

    state.swipeHistory.push({
      matchIndex: state.swipeIndex,
      matchId: itemData.id,
      matchName: matchName,
      action: 'bet',
      selectionName: selectionDisplayName
    });
  }

  state.swipeIndex++;
  setTimeout(() => {
    renderSwipeDeck();
  }, 220);
}

function executeSwipeLeft(cardEl, itemData) {
  const isBasketball = state.currentSport === 'basketball_players';
  const items = getSwipeItems();

  if (!itemData) {
    itemData = items[state.swipeIndex];
  }
  if (!itemData) return;

  const card = cardEl || document.querySelector('.swipe-card:not(.next-card)');
  if (card) {
    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    card.style.transform = 'translate3d(-800px, 40px, 0) rotate(-35deg)';
    card.style.opacity = '0';
  }

  if (state.soundEnabled && typeof playRocketSound === 'function') {
    try { playRocketSound(250, 0.05, 'triangle'); } catch(e) {}
  }

  state.swipeHistory.push({
    matchIndex: state.swipeIndex,
    itemId: itemData.id,
    itemName: isBasketball ? itemData.name : `${itemData.home} vs ${itemData.away}`,
    action: 'skip'
  });

  state.swipeIndex++;
  setTimeout(() => {
    renderSwipeDeck();
  }, 220);
}

export function swipeRight() {
  const items = getSwipeItems();
  const itemData = items[state.swipeIndex];
  const topCard = document.querySelector('.swipe-card:not(.next-card)');
  executeSwipeRight(topCard, itemData);
}

export function swipeLeft() {
  const items = getSwipeItems();
  const itemData = items[state.swipeIndex];
  const topCard = document.querySelector('.swipe-card:not(.next-card)');
  executeSwipeLeft(topCard, itemData);
}

export function swipeUndo() {
  if (!state.swipeHistory || state.swipeHistory.length === 0) return;
  const lastAction = state.swipeHistory.pop();
  
  if (lastAction.action === 'bet' && lastAction.matchName) {
    removeSelectionFromParlay(lastAction.matchName);
    renderBetslip();
  } else if (lastAction.action === 'basket_bet' && lastAction.itemId) {
    const idx = state.basketSelections.findIndex(sel => sel.playerId === lastAction.itemId);
    if (idx !== -1) {
      state.basketSelections.splice(idx, 1);
      renderBetslip();
    }
  }

  state.swipeIndex = lastAction.matchIndex;
  renderSwipeDeck();
}

function addSwipeSelectionToTicket(matchName, selectionName, oddsValue) {
  if (!state.selections) state.selections = [];
  
  const existingIdx = state.selections.findIndex(s => s.match === matchName);
  if (existingIdx !== -1) {
    state.selections.splice(existingIdx, 1);
  }

  const newSel = {
    id: Date.now() + Math.random(),
    match: matchName,
    selection: selectionName,
    baseOdds: parseFloat(oddsValue),
    boostedOdds: parseFloat(oddsValue),
    slotBoostPercent: 0,
    isBoosted: false,
    hasCrashed: false,
    isEligible: true,
    marketGroup: '1x2',
    isLowMargin: false,
    sport: 'football'
  };

  state.selections.push(newSel);

  if (state.selections.length > 0) {
    state.currentBet = state.selections[0];
  }

  if (state.slot && state.slot.slotBoostActive) {
    reapplySlotBoost();
  }

  renderBetslip();
}

// Global Keyboard Navigation for Swipe Mode
window.addEventListener('keydown', (e) => {
  if (state.viewMode !== 'swipe') return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    swipeLeft();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    swipeRight();
  } else if (e.key === 'Backspace' || e.key === 'z' || e.key === 'Z') {
    e.preventDefault();
    swipeUndo();
  } else {
    const items = getSwipeItems();
    const currentItem = items[state.swipeIndex];
    if (currentItem) {
      if (state.currentSport === 'basketball_players') {
        if (['1', 'u', 'U', 'm', 'M'].includes(e.key)) {
          setSwipeCardPick(currentItem.id, 'under');
        } else if (['2', 'o', 'O', 'v', 'V'].includes(e.key)) {
          setSwipeCardPick(currentItem.id, 'over');
        }
      } else {
        if (['1', '2'].includes(e.key) || e.key.toLowerCase() === 'x') {
          const pickKey = e.key.toLowerCase() === 'x' ? 'X' : e.key;
          setSwipeCardPick(currentItem.id, pickKey);
        }
      }
    }
  }
});
