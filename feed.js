/**
 * ==========================================================================
 * MERKUR XTIP — LIVE FEED FETCHING
 * Fetches football and basketball fixtures from the Merkur REST API via the
 * Netlify proxy redirects, falling back to mock data on failure.
 * ==========================================================================
 */

import { MOCK_MATCHES, MOCK_BASKETBALL_PLAYERS } from './state.js';

export async function fetchMerkurFeed() {
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
            .filter(m => m.odds && m.odds['1'] && m.odds['2'] && m.odds['3']);
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

// Points Over/Under odds ids in the SK (basketball players) feed — pair is fixed, order confirmed
// by cross-checking multiple live matches (lower id groups with the "under" column in this UI).
const BASKETBALL_POINTS_UNDER_KEY = '51679';
const BASKETBALL_POINTS_OVER_KEY = '51681';

function mapBasketballFeedToPlayers(esMatches) {
  return esMatches
    .filter(m => m.params && parseFloat(m.params.ouPlPoints) > 0 &&
      m.odds[BASKETBALL_POINTS_UNDER_KEY] != null && m.odds[BASKETBALL_POINTS_OVER_KEY] != null)
    .map(m => {
      const line = parseFloat(m.params.ouPlPoints);
      return {
        id: m.id,
        name: m.home,
        team: m.away,
        match: m.away,
        line,
        oddsOver: m.odds[BASKETBALL_POINTS_OVER_KEY],
        oddsUnder: m.odds[BASKETBALL_POINTS_UNDER_KEY],
        originalLine: line,
        isBoosted: false,
        boostAmount: 0
      };
    });
}

export async function fetchMerkurBasketballFeed() {
  const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.merkurxtip.rs/restapi/offer/sr/sport/SK/mob?annex=0&desktopVersion=2.44.3.18&locale=sr');
  const urls = [
    '/api/merkur-feed-basketball',
    'https://www.merkurxtip.rs/restapi/offer/sr/sport/SK/mob?annex=0&desktopVersion=2.44.3.18&locale=sr',
    proxyUrl
  ];

  for (const url of urls) {
    try {
      console.log(`[Merkur Basketball Feed] Fetching from: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (text.trim().startsWith('<!DOCTYPE') || text.includes('Connection timed out') || text.includes('Server-side requests are not allowed')) {
          console.warn(`[Merkur Basketball Feed] Non-JSON payload from ${url}`);
          continue;
        }
        const data = JSON.parse(text);
        if (data && data.esMatches && data.esMatches.length > 0) {
          const players = mapBasketballFeedToPlayers(data.esMatches);
          if (players.length > 0) {
            console.log(`[Merkur Basketball Feed] Successfully fetched ${players.length} player props from ${url}`);
            return players;
          }
        }
      }
    } catch (e) {
      console.warn(`[Merkur Basketball Feed] Error fetching from ${url}:`, e);
    }
  }

  console.warn('[Merkur Basketball Feed] All endpoints failed. Falling back to mock basketball players.');
  return JSON.parse(JSON.stringify(MOCK_BASKETBALL_PLAYERS));
}
