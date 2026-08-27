#!/usr/bin/env node
/** Verify imported ChatGPT session works. */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const { REPO_ROOT } = require('../memory/grok/scripts/lib/paths');

const STORAGE = process.env.GROK_CHATGPT_STORAGE || path.join(REPO_ROOT, 'infra/secrets/chatgpt-storage.json');

async function main() {
  if (!fs.existsSync(STORAGE)) {
    console.error('❌ Missing:', STORAGE);
    console.error('Run on Mac: bash scripts/chatgpt-login-mac.sh');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: STORAGE });
  const page = await context.newPage();
  await page.goto('https://chatgpt.com/images/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const url = page.url();
  const loginVisible = await page.getByRole('button', { name: /log in|sign up/i }).first().isVisible().catch(() => false);
  const composer = await page.locator('#prompt-textarea, textarea, [contenteditable="true"]').first().isVisible().catch(() => false);

  await browser.close();

  if (loginVisible || /auth|login/i.test(url)) {
    console.error('❌ Session expired or not logged in. Re-run: bash scripts/chatgpt-login-mac.sh');
    process.exit(1);
  }

  if (!composer) {
    console.error('⚠️  Logged in but composer not found — session may still work');
    process.exit(0);
  }

  console.log('✅ ChatGPT session valid — ready for browser-pool:live');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
