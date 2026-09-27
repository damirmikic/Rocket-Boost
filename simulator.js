/**
 * ==========================================================================
 * MERKUR XTIP — MONTE CARLO PROFITABILITY & STATS SIMULATOR
 * Mass-simulates the boost/crash math to validate house margin retention
 * under different player behavior profiles, VIP segments, and DMS on/off.
 * ==========================================================================
 */

import { state, t } from './state.js';
import { generateSecretMaxBoost } from './rocket.js';
import { renderBetslip } from './app.js';

// ============================================================================
// MONTE CARLO PROFITABILITY & STATS SIMULATOR ENGINE
// ============================================================================
export function openProfitabilitySimulator() {
  const modal = document.getElementById('profitability-simulator-modal');
  if (modal) {
    modal.classList.add('active');
    runMonteCarloSimulation();
  }
}

export function closeProfitabilitySimulator() {
  const modal = document.getElementById('profitability-simulator-modal');
  if (modal) modal.classList.remove('active');
}

export function setSimTrials(num, btnEl) {
  state.sim.trials = num;
  document.querySelectorAll('.sim-opt-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  runMonteCarloSimulation();
}

export function updateBaseMarginDisplay(val) {
  state.sim.baseMargin = parseFloat(val);
  const disp = document.getElementById('sim-margin-val');
  if (disp) disp.textContent = `${parseFloat(val).toFixed(2)}%`;
  runMonteCarloSimulation();
}

export function updateMarketMargin(val) {
  const demoSel = document.getElementById('demo-margin-select');
  if (val === 'auto') {
    // Live flights derive the margin from each fixture's 1X2 odds again
    state.game.marginOverride = null;
    if (demoSel) demoSel.value = 'auto';
    renderBetslip();
    console.log('[DMS Risk Engine] Match margin: auto (from fixture 1X2 overround)');
    return;
  }
  const margin = parseFloat(val);
  state.game.marginOverride = margin;
  if (demoSel) {
    const hasOption = Array.from(demoSel.options).some(o => o.value === String(val));
    if (hasOption) demoSel.value = String(val);
  }
  state.sim.baseMargin = margin;
  const disp = document.getElementById('sim-margin-val');
  if (disp) disp.textContent = `${margin.toFixed(2)}%`;
  const slider = document.getElementById('sim-base-margin');
  if (slider) slider.value = margin;
  renderBetslip();
  console.log(`[DMS Risk Engine] Active Match Margin set to: ${margin.toFixed(2)}%`);
}

export function toggleSimDms() {
  state.sim.dmsEnabled = !state.sim.dmsEnabled;
  const btn = document.getElementById('sim-dms-toggle-btn');
  if (btn) {
    btn.className = `sim-opt-btn ${state.sim.dmsEnabled ? 'active' : 'warn'}`;
    btn.innerHTML = state.sim.dmsEnabled ? '🛡️ DMS PROTECTION: ON' : '⚠️ DMS PROTECTION: OFF (FIXED BOOST)';
  }
  runMonteCarloSimulation();
}

export function updateVipTier(val) {
  state.game.vipTier = val;
  state.sim.vipSegment = val;
  const simSel = document.getElementById('sim-vip-select');
  if (simSel) simSel.value = val;
  const demoSel = document.getElementById('demo-vip-select');
  if (demoSel) demoSel.value = val;
  runMonteCarloSimulation();
  console.log(`[VIP Risk Engine] Active Player VIP Segment switched to: ${val.toUpperCase()}`);
}

// House hold (%) after paying an average odds boost. A boost of b% multiplies every
// winning payout by (1 + b), so return-to-player becomes (1 + b) / (1 + m).
// avgBoost must average over ALL launches (crashes without consolation count as 0).
function holdAfterBoost(marginPct, avgBoostPct) {
  return 100 * (1 - (1 + avgBoostPct / 100) / (1 + marginPct / 100));
}

export function runMonteCarloSimulation() {
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
    { key: 'conservative', name: t('stratConservative'), target: 5.0, wins: 0, totalPayout: 0 },
    { key: 'moderate', name: t('stratModerate'), target: 10.0, wins: 0, totalPayout: 0 },
    { key: 'aggressive', name: t('stratAggressive'), target: 18.0, wins: 0, totalPayout: 0 },
    { key: 'greedy', name: t('stratGreedy'), target: 30.0, wins: 0, totalPayout: 0 }
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
  const netHold = holdAfterBoost(baseMargin, avgPoolBoost).toFixed(2);
  const isSustainable = parseFloat(netHold) >= 0.8;

  let vipLabel = '🥉 BRONZE VIP (15% Max)';
  if (vipTier === 'gold') vipLabel = '🥈 GOLD VIP (45% Max)';
  else if (vipTier === 'diamond') vipLabel = '💎 DIAMOND WHALE (100% Turbo)';

  // Render HTML Results Dashboard
  const container = document.getElementById('sim-results-content');
  if (!container) return;

  container.innerHTML = `
    <div class="sim-kpi-grid">
      <div class="sim-kpi-card">
        <span class="sim-kpi-label">${t('simAvgSecretMax')} <strong style="color:#64b5f6;">[${vipLabel}]</strong></span>
        <div class="sim-kpi-val gold">+${avgSecretMax}%</div>
        <div class="sim-kpi-sub">
          <span><6%: <strong>${pUnder6}%</strong></span> | <span>6-15%: <strong>${p6to15}%</strong></span> | <span>>30%: <strong>${pOver30}%</strong></span>
        </div>
      </div>

      <div class="sim-kpi-card">
        <span class="sim-kpi-label">${t('simAvgUserBoost')}</span>
        <div class="sim-kpi-val green">+${avgPoolBoost}%</div>
        <div class="sim-kpi-sub">${t('simConsolationSub').replace('{pct}', Math.round(consolationChance * 100))}</div>
      </div>

      <div class="sim-kpi-card ${isSustainable ? 'border-green' : 'border-warn'}">
        <span class="sim-kpi-label">${t('simNetHold')}</span>
        <div class="sim-kpi-val ${isSustainable ? 'safe' : 'warm'}">${netHold}% <small>(od ${baseMargin.toFixed(2)}%)</small></div>
        <div class="sim-kpi-badge ${isSustainable ? 'badge-safe' : 'badge-warn'}">
          ${isSustainable ? t('simSustainable') : t('simThinMargin')}
        </div>
      </div>
    </div>

    <div class="sim-table-wrapper">
      <table class="sim-data-table">
        <thead>
          <tr>
            <th>${t('simColArchetype')}</th>
            <th>${t('simColWinRate')}</th>
            <th>${t('simColAvgBoost')}</th>
            <th>${t('simColNetHold')}</th>
            <th>${t('simColStatus')}</th>
          </tr>
        </thead>
        <tbody>
          ${strats.map(st => {
            const winRate = ((st.wins / numTrials) * 100).toFixed(1);
            const avgPaid = (st.totalPayout / numTrials).toFixed(2);
            const stratHold = holdAfterBoost(baseMargin, avgPaid).toFixed(2);
            const stratSafe = parseFloat(stratHold) >= 0.5;
            return `
              <tr>
                <td><strong>${st.name}</strong></td>
                <td><span class="pill-rate">${winRate}%</span></td>
                <td><strong style="color: #2ecc71;">+${avgPaid}%</strong></td>
                <td><strong>${stratHold}%</strong></td>
                <td><span class="status-chip ${stratSafe ? 'chip-ok' : 'chip-warn'}">${stratSafe ? t('simProtected') : t('simNegativeHold')}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}
