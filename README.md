# 🚀 MERKUR XTIP — Rocket Boost & Turbo X Platform

Welcome to the **MerkurXtip Rocket Boost & Turbo X** interactive sportsbook prototype and simulator. Designed to introduce a novel gamified odds-boosting mechanic into traditional sports betting, this application merges the adrenaline and visual engagement of crash games (like *Aviator*) directly into single-match and multi-match parlay tickets.

By pairing interactive multiplier flight controls with a mathematically verified **Monte Carlo simulation engine**, this platform provides a exciting "+EV" user experience while safeguarding positive house margin expectations.

---

## 🌟 Key Features

### 1. ⚡ Turbo X Rocket Flight & Pair Turbo Engine
* **Interactive SVG Flight Canvas:** Real-time rocket motion across selected bet rows with exponential multiplier growth.
* **Stop & Lock Mechanic:** Bettors can lock in their multiplier at any point before a potential crash.
* **Pair Turbo Status Badge UI:** Once activated on a specific selection, a sleek static status badge (`⚡ +X.X%` / `⚡ Turbo na paru zaključan`) displays locked boosted odds without screen clutter.
* **Consolation Payout System:** Near-miss rocket crashes automatically award dynamic consolation boosts to mitigate player churn.

### 2. 🎰 Parlay Spin & Slot Promotion Engine
* **Express Ticket Multiplier Wheel:** Parlay tickets can activate a slot-based multiplier wheel awarding up to +50% or Super Boost odds enhancements.
* **Daily Spin Limits & Rules:** Built-in cap management (3 daily spins) with mutual exclusion rules preventing simultaneous Pair Turbo and Parlay Slot stacking on the same slip.

### 3. 🏀 Basketball & NBA Player Props System
* **Player Stat Lines:** Dedicated market coverage for NBA and EuroLeague star player props (Points, Rebounds, Assists, Combined Stats).
* **Interactive Roulette Boost:** Custom prop line selector featuring visual wheel spin odds boosting for player props.

### 4. ⚽ Live Merkur Match Feed & Expanded Markets
* **Direct Merkur REST API Integration:** Fetches live fixtures directly from MerkurXtip services (`https://www.merkurxtip.rs/restapi/...`) with automatic seamless fallback to structured mock match data.
* **Hierarchical Sidebar Tree:** Accordion navigation organized by Country, League, and Sport.
* **Comprehensive Market Coverage:** 1X2 Match Winner, Over/Under Goals, Both Teams to Score (GG/NG), Double Chance (1X/X2), Asian Handicap, and Half-Time markets.

### 5. 🔊 Web Audio Synthesis Engine
* **Zero External Dependencies:** Built entirely with browser-native Web Audio API synthesis (no `.mp3` or `.wav` assets required).
* **Dynamic Audio Effects:** Deep engine thrust drones, rising tick tones scaling with multipliers, victorious chord progressions, slot wheel ticks, and white-noise explosions.

### 6. 📊 Monte Carlo Profitability & Risk Simulator
* **Real-time Batch Testing:** Simulate **10,000 to 100,000 bets** in seconds to test house margins under various risk parameters.
* **User Profile Modeling:** Test performance against Conservative, Realistic, and Greedy/Jackpot Chaser player behavioral profiles.
* **RTP & House EV Defense:** Validates Return to Player (RTP) percentages and verifies positive house profit retention under real-world usage.

### 7. 🛡️ Dynamic Margin Scaling (DMS) & Low-Margin Safeguards
* **Super Kvota Protection:** Automatically detects low-margin or boosted fixtures, disabling Turbo X exploitation on protected events (`🛡️ Specijalna igra`).
* **EV Defense Engine:** Dynamically adjusts crash probability distributions based on target fixture profit margins.

### 8. 🔐 Password-Protected Authentication Overlay
* **Stakeholder Presentation Mode:** Built-in modal access barrier supporting both local JSON password verification (`config.json`) and Netlify Serverless Function validation.

### 9. 📱 Mobile-First Responsive UX
* **Slide-out Betslip Drawer:** Mobile bottom bar with live slip counters, smooth drawer slide animations, and responsive layout scaling.
* **Smart UI Collapsing:** Auto-collapses settings controls during rocket flight to maintain focus and prevent visual overlap.

### 10. 🌐 Bilingual Localization (Serbian & English)
* Instant full-page UI translation toggle between Serbian (SR) and English (EN) with reactive DOM updates.

---

## 🛠️ Project Structure

```text
Rocket Boost/
├── assets/
│   └── rocket_boost_promo.png   # Main promotional banner asset
├── index.html                   # Master layout, betslip modal, & cockpit overlay
├── styles.css                   # Responsive styles, glassmorphism UI & animations
├── app.js                       # Audio synth, match parser, Turbo flight loop & Monte Carlo engine
├── config.example.json          # Example template for local access authentication
├── find_lines.js                # Helper script for line inspection
└── netlify.toml                 # Netlify deployment, proxy redirects & security headers
```

---

## 🚀 Deployment Guide (Netlify)

This application is composed of pure static web assets (`HTML`, `CSS`, `JS`) and pre-configured Netlify redirect rules for live Merkur API feeds and serverless endpoints.

### Option 1: Netlify Drag & Drop (Instant)
1. Log in to [Netlify App](https://app.netlify.com/).
2. Navigate to **Sites** and scroll to the deployment drop area.
3. Drag and drop the `Rocket Boost` root folder into the upload region.
4. Your application will be live immediately.

### Option 2: Netlify CLI
```bash
# Install Netlify CLI globally if needed
npm install netlify-cli -g

# Authenticate with Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=.
```

### Option 3: Continuous Deployment (Git Integration)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Netlify, choose **Add new site** -> **Import an existing project**.
3. Select your repository.
4. Set **Build Command** to empty and **Publish Directory** to `.`.
5. Deploy site. Future git pushes will automatically update the live site.

---

## 🔒 Configuration & Proxy Setup

The repository includes `netlify.toml` which configures essential proxy rules:
* **Merkur API Proxy (`/api/merkur-feed`):** Routes requests to MerkurXtip's live REST API while resolving CORS policy restrictions.
* **Authentication Endpoint (`/api/verify-password`):** Proxies password validation requests to Netlify serverless functions (`/.netlify/functions/verify-password`).

To configure local authentication without serverless functions, copy `config.example.json` to `config.json`:
```json
{
  "access_password": "YOUR_SECRET_PASSWORD"
}
```

---

## 💡 Stakeholder Pitch & Business Model

When demonstrating **Rocket Boost & Turbo X** to executive management or sportsbook risk managers, highlight these core mathematical and operational advantages:

1. **Psychological Thrill vs. Controlled House Cost:** High multipliers (+30% to +45%) create strong viral engagement, while player crash probabilities (~81% crash rate for aggressive targets) constrain effective boost payout costs to under ~5.7%.
2. **Margin Protection by Design:** Dynamic Margin Scaling (DMS) ensures that boosted odds cannot erode base house hold on key fixtures.
3. **Mutual Exclusion Safeguards:** Prevents promotional stacking (e.g. combining Parlay Slot bonuses with Pair Turbo X on the same ticket).
4. **Player Retention & Re-engagement:** Consolation boost mechanics soften loss impact during crashes, significantly extending session length and deposit frequency.
5. **Turnkey Mobile & Web Integration:** Zero heavyweight framework dependencies or audio asset loads guarantee fast initial page loads on cellular data networks.
