#!/usr/bin/env node
/**
 * Remote ChatGPT login — opens a live browser link you can click.
 * Requires BROWSERBASE_API_KEY (free tier: browserbase.com)
 *
 *   BROWSERBASE_API_KEY=xxx node scripts/remote-chatgpt-login.js
 *
 * Opens chatgpt.com/images in a remote browser, prints a live URL,
 * waits for you to pass Cloudflare + sign in, then saves session.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const Browserbase = require('@browserbasehq/sdk').default || require('@browserbasehq/sdk');

const { REPO_ROOT } = require('../memory/grok/scripts/lib/paths');
const OUT = path.join(REPO_ROOT, 'infra/secrets/chatgpt-storage.json');
const IMAGES_URL = 'https://chatgpt.com/images/';
const TIMEOUT_MS = 20 * 60 * 1000;

async function isReady(page) {
  const cf = await page.getByText(/verify you are human/i).isVisible().catch(() => false);
  if (cf) return false;
  const login = await page.getByRole('button', { name: /log in|sign up/i }).first().isVisible().catch(() => false);
  const composer = await page.locator('#prompt-textarea, textarea, [contenteditable="true"]').first().isVisible().catch(() => false);
  return composer || login;
}

async function isLoggedIn(page) {
  const composer = await page.locator('#prompt-textarea, textarea, [contenteditable="true"]').first().isVisible().catch(() => false);
  const login = await page.getByRole('button', { name: /log in|sign up/i }).first().isVisible().catch(() => false);
  return composer && !login;
}

async function main() {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  if (!apiKey) {
    console.error('');
    console.error('Need BROWSERBASE_API_KEY for remote login (cloud cannot pass Cloudflare alone).');
    console.error('');
    console.error('Option A — add key to Cursor secrets, re-run agent');
    console.error('Option B — on Mac, one command:');
    console.error('  bash scripts/chatgpt-login-mac.sh');
    console.error('  then drag infra/secrets/chatgpt-storage.json into chat');
    console.error('');
    process.exit(1);
  }

  const bb = new Browserbase({ apiKey });
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    keepAlive: true,
  });

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const context = browser.contexts()[0] || (await browser.newContext());
  const page = context.pages()[0] || (await context.newPage());

  await page.goto(IMAGES_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });

  const debug = await bb.sessions.debug(session.id);
  const liveUrl = debug.debuggerFullscreenUrl || debug.debuggerUrl;

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CLICK THIS LINK — sign in to ChatGPT (one time)');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(liveUrl);
  console.log('');
  console.log('  1. Open the link above');
  console.log('  2. Click Cloudflare "Verify you are human" if shown');
  console.log('  3. Log in to ChatGPT');
  console.log('  4. Wait until Images prompt box appears');
  console.log('  This script auto-detects login and saves session.');
  console.log('');

  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    try {
      if (await isLoggedIn(page)) {
        fs.mkdirSync(path.dirname(OUT), { recursive: true });
        await context.storageState({ path: OUT });
        console.log('');
        console.log('✅ Login saved →', OUT);
        console.log('Session ID:', session.id);
        await browser.close();
        process.exit(0);
      }
      if (await isReady(page)) {
        process.stdout.write('\r  On ChatGPT — finish login if needed…');
      } else {
        process.stdout.write(`\r  Waiting… (${Math.round((Date.now() - start) / 1000)}s)`);
      }
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.error('\n❌ Timed out. Re-run when ready.');
  await browser.close();
  process.exit(1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
