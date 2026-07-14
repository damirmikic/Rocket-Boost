# 🚀 MERKUR XTIP — Rocket Boost Odds Feature Presentation

Welcome to the **MerkurXtip Rocket Boost** interactive prototype and simulator. This application was created to present a novel gamified odds-boosting mechanic to MerkurXtip stakeholders. By blending the engagement of crash games (like *Aviator*) directly into traditional sports sportsbook tickets, this feature creates an interactive, high-retention betting experience while mathematically securing positive house expectations.

---

## 🌟 Key Features

1. **Live Rocket Flight Overlay**
   * An interactive, canvas-free SVG rocket moves across selected odds rows in real-time.
   * Visualizes exponential multiplier growth with live-updating HUD widgets.
   * Dynamic particle tail and explosive explosion triggers on crashes.

2. **Web Audio API Sound Engine**
   * Built entirely using browser-native audio synthesis.
   * Generates deep rocket engine drones, rising tick tones, victorious chord progressions, and white-noise explosions dynamically.
   * No external `.mp3` or `.wav` dependencies required, ensuring instant page loading.

3. **Monte Carlo Profitability Simulator**
   * Run mass simulations of **10,000 to 100,000 bets** in real-time.
   * Validates risk-reward ratios, Return to Player (RTP), and consolidated net house margins.
   * Interactive player profiles (Realistic Mix, Conservative, or Greedy/Jackpot Chasers) to model user behavior.

4. **Dynamic Margin Scaling (DMS) Engine**
   * Automatically protects the sportsbook from low-margin fixtures (e.g. 1.5% hold on Super Kvota matches).
   * Scales down maximum possible boost limits and increases rocket crash rates dynamically to defend positive house EV.

5. **VIP Segmentation Controls**
   * Simulates tiered loyalty levels (Bronze, Gold, Diamond) with custom caps, enabling targeted CRM activation.

6. **Bilingual Localization**
   * Full Serbian (SR) and English (EN) translation support via clean DOM bindings.

---

## 🛠️ Project Structure

```text
Rocket Boost/
├── assets/
│   └── rocket_boost_promo.png   # Main promotional banner image
├── index.html                   # Core dashboard grid & modals
├── styles.css                   # Custom responsive design system & animations
├── app.js                       # Audio synth, game loop, & simulator math
└── netlify.toml                 # Netlify deployment and headers configuration
```

---

## 🚀 Deployment Guide (Netlify)

This project consists of pure static files (`HTML`, `CSS`, and `JavaScript`) and is ready for Netlify deployment out-of-the-box.

### Option 1: Drag & Drop Deployment (Zero Command Line)
1. Go to the [Netlify App Dashboard](https://app.netlify.com/).
2. Log in or create a free account.
3. Navigate to **Sites** and scroll to the bottom.
4. Drag the entire `Rocket Boost` directory from your computer and drop it into the upload box labeled **"Want to deploy a new site without connecting to Git? Drag and drop your site folder here"**.
5. Your site will be online in seconds!

### Option 2: Netlify CLI
If you have the Netlify CLI installed:
```bash
# Install Netlify CLI if you haven't already
npm install netlify-cli -g

# Log in to your Netlify account
netlify login

# Run deployment from the project directory
netlify deploy --prod --dir=.
```

### Option 3: Continuous Deployment (Git-linked)
1. Initialize git and push this repository to GitHub, GitLab, or Bitbucket.
2. In the Netlify dashboard, click **Add new site** -> **Import an existing project**.
3. Choose your Git provider and select the repository.
4. Leave the **Build Command** empty and set **Publish Directory** to `.` (the project root).
5. Click **Deploy Site**. Every push to your main branch will now trigger an automatic deployment.

---

## 💡 Stakeholder Pitch Strategy

When presenting this feature to management, highlight the five mathematical and commercial pillars built directly into the Monte Carlo stats panel:
* **Controlled Payback Cost:** Greedy players chasing high multipliers (+30% boost) fail ~81% of the time, resulting in average boost payout costs of only ~5.7%.
* **High Value Perception:** Users feel in control, creating an engaging "+EV" perception while the sportsbook keeps a healthy hold.
* **Retention Boosters:** Consolation prizes (near-miss payouts) are triggered randomly on crashes to prevent user churn.
* **CRM Activation:** Restricting the feature to weekly VIP drops (Standard, Gold, Diamond) protects the promotional budget and boosts deposits.
* **Automated DMS Safeguards:** Protects against abuse on high-stake, low-margin events.
