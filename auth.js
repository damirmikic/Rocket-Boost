/**
 * ==========================================================================
 * MERKUR XTIP — PASSWORD AUTH OVERLAY
 * Stakeholder-presentation access gate: tries the Netlify verify-password
 * function, falls back to local config.json comparison.
 * ==========================================================================
 */

import { state } from './state.js';
import { initSportsbook } from './app.js';
import { removeBet } from './parlay-slot.js';

export function checkAuthStateOnInit() {
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

export function handleAuthSubmit(e) {
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

export function togglePasswordVisibility() {
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

export function handleLogout() {
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
