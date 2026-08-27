#!/usr/bin/env node
/**
 * One-time ChatGPT login for cloud browser pool.
 * Opens a visible browser — sign in, then this script auto-detects and exits.
 *
 *   npm run browser-pool:login
 */
const path = require('path');
const { chromium } = require('playwright');
const { REPO_ROOT } = require('../../memory/grok/scripts/lib/paths');

const PROFILE_DIR = process.env.GROK_PW_USER_DATA_DIR || path.join(REPO_ROOT, 'infra', 'storage', 'browser-profile', 'grok');
const IMAGES_URL = 'https://chatgpt.com/images/';
const TIMEOUT_MS = 30 * 60 * 1000;

async function isLoggedIn(page) {
  const url = page.url();
  if (/auth\.openai|login/i.test(url)) return false;
  const loginBtn = page.getByRole('button', { name: /log in|sign up/i }).first();
  if (await loginBtn.isVisible({ timeout: 1500 }).catch(() => false)) return false;
  const composer = page.locator('#prompt-textarea, textarea, [contenteditable="true"]').first();
  return composer.isVisible({ timeout: 3000 }).catch(() => false);
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ChatGPT login — cloud browser pool');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('  A browser window should open to chatgpt.com/images/');
  console.log('  Sign in with your ChatGPT account.');
  console.log('  This script waits until login is detected, then saves session.');
  console.log('');
  console.log(`  Profile: ${PROFILE_DIR}`);
  console.log('');

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = context.pages()[0] || (await context.newPage());
  await page.goto(IMAGES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    if (await isLoggedIn(page)) {
      console.log('');
      console.log('✅ Login detected! Session saved.');
      console.log('');
      console.log('Next:');
      console.log('  npm run browser-pool:live');
      console.log('  node memory/grok/scripts/grok-preflight-playwright.js');
      console.log('');
      await context.close();
      process.exit(0);
    }
    process.stdout.write(`\r  Waiting for login… (${Math.round((Date.now() - start) / 1000)}s)`);
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.error('\n❌ Timed out after 30 min. Run again: npm run browser-pool:login');
  await context.close();
  process.exit(1);
}

main().catch((e) => {
  console.error('Login error:', e.message);
  process.exit(1);
});
