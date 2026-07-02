/**
 * Playwright browser pool — live ChatGPT Images automation (cloud).
 * Persistent profile dir keeps Kevin's login across restarts.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { grokPath, MODELS_DIR, REPO_ROOT, readJson } = require('../../memory/grok/scripts/lib/paths');

const IMAGES_URL = 'https://chatgpt.com/images/';
const PROFILE_DIR = process.env.GROK_PW_USER_DATA_DIR || path.join(REPO_ROOT, 'infra', 'storage', 'browser-profile', 'grok');
const HEADLESS = process.env.GROK_PW_HEADED !== '1';
const KEEP_OPEN = process.env.GROK_PW_KEEP_OPEN === '1';

let context = null;
/** @type {Map<string, import('playwright').Page>} */
const pages = new Map();

function loadManifest() {
  return readJson(grokPath('models.manifest.json'));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getContext() {
  if (context) return context;
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: HEADLESS,
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled'],
  });
  context.on('close', () => {
    context = null;
    pages.clear();
  });
  return context;
}

async function getPageForTab(tab) {
  if (pages.has(tab)) {
    const p = pages.get(tab);
    if (!p.isClosed()) return p;
    pages.delete(tab);
  }
  const ctx = await getContext();
  const page = await ctx.newPage();
  pages.set(tab, page);
  return page;
}

async function isLoggedIn(page) {
  const url = page.url();
  if (/auth|login/i.test(url)) return false;
  const loginBtn = page.getByRole('button', { name: /log in|sign up/i }).first();
  if (await loginBtn.isVisible({ timeout: 2000 }).catch(() => false)) return false;
  return true;
}

async function dismissPopups(page) {
  for (const label of [/got it/i, /dismiss/i, /ok/i]) {
    const btn = page.getByRole('button', { name: label }).first();
    if (await btn.isVisible({ timeout: 500 }).catch(() => false)) {
      await btn.click().catch(() => {});
      await sleep(300);
    }
  }
}

async function navigateToImages(page) {
  if (!page.url().includes('chatgpt.com/images')) {
    await page.goto(IMAGES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(1500);
  }
  await dismissPopups(page);
}

async function findComposer(page) {
  const selectors = [
    '#prompt-textarea',
    'textarea[placeholder*="Message"]',
    'textarea',
    '[contenteditable="true"][data-placeholder]',
    '[contenteditable="true"]',
  ];
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.isVisible({ timeout: 1000 }).catch(() => false)) return el;
  }
  throw new Error('composer not found — are you logged in on chatgpt.com/images/?');
}

async function hasRefChip(page) {
  const chip = page.locator('[data-testid="file-chip"], [aria-label*="Remove file"], button:has-text("Remove")').first();
  return chip.isVisible({ timeout: 800 }).catch(() => false);
}

async function uploadRef(page, refPath) {
  if (await hasRefChip(page)) return { skipped: true, reason: 'chip present' };

  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count()) {
    await fileInput.setInputFiles(refPath);
    await sleep(1200);
    return { uploaded: true };
  }

  const plus = page.locator('[data-testid="composer-plus-btn"], button[aria-label*="Attach"], button[aria-label*="Add"]').first();
  if (await plus.isVisible({ timeout: 2000 }).catch(() => false)) {
    const [chooser] = await Promise.all([page.waitForEvent('filechooser', { timeout: 8000 }), plus.click()]);
    await chooser.setFiles(refPath);
    await sleep(1200);
    return { uploaded: true };
  }

  throw new Error('could not find file upload control');
}

async function ensureThinkingHigh(page) {
  if (process.env.GROK_SKIP_THINKING_GATE === '1') return { thinking: 'skipped' };

  const thinkingBtn = page.getByRole('button', { name: /thinking|reason/i }).first();
  if (await thinkingBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    const label = (await thinkingBtn.textContent()) || '';
    if (/high/i.test(label)) return { thinking: 'High' };
    await thinkingBtn.click();
    await sleep(400);
    const high = page.getByRole('menuitem', { name: /high/i }).or(page.getByText(/^High$/)).first();
    if (await high.isVisible({ timeout: 2000 }).catch(() => false)) {
      await high.click();
      await sleep(400);
      return { thinking: 'High' };
    }
  }

  const highVisible = page.getByText(/thinking:\s*high/i).first();
  if (await highVisible.isVisible({ timeout: 1000 }).catch(() => false)) {
    return { thinking: 'High' };
  }

  return { thinking: 'unknown', warning: 'could not confirm thinking=High' };
}

async function fillPrompt(page, text) {
  const composer = await findComposer(page);
  await composer.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await composer.fill(text);
}

async function clickSend(page) {
  const send = page
    .locator('[data-testid="send-button"], button[aria-label="Send"], button:has-text("Send")')
    .first();
  await send.click({ timeout: 10000 });
  await page.waitForURL(/\/c\//, { timeout: 120000 });
}

async function ensureAllTabs() {
  const manifest = loadManifest();
  const report = [];
  for (const m of manifest.models) {
    const page = await getPageForTab(m.tab);
    await navigateToImages(page);
    const loggedIn = await isLoggedIn(page);
    report.push({ tab: m.tab, model: m.model, url: page.url(), loggedIn });
    if (!loggedIn) {
      throw new Error(`Not logged in on ${m.tab} — export ChatGPT session to ${PROFILE_DIR} (see infra/secrets/README.md)`);
    }
  }
  return report;
}

async function preflight() {
  const manifest = loadManifest();
  const tabs = [];
  let allHigh = true;
  let popups = false;

  for (const m of manifest.models) {
    const page = await getPageForTab(m.tab);
    await navigateToImages(page);
    const loggedIn = await isLoggedIn(page);
    if (!loggedIn) {
      return {
        ok: false,
        error: 'not_logged_in',
        profileDir: PROFILE_DIR,
        hint: 'Log in once via headed browser or copy Playwright profile from Mac',
      };
    }
    const thinking = await ensureThinkingHigh(page);
    if (thinking.thinking !== 'High' && thinking.thinking !== 'skipped') allHigh = false;
    tabs.push({ tab: m.tab, model: m.model, url: page.url(), thinking: thinking.thinking });
  }

  return {
    ok: true,
    thinking: allHigh ? 'High' : 'check_required',
    tabsOnImages: tabs.length,
    popups,
    tabs,
    profileDir: PROFILE_DIR,
  };
}

async function warmAll() {
  const manifest = loadManifest();
  const warmed = [];
  const concurrency = parseInt(process.env.GROK_WARM_CONCURRENCY || '3', 10);

  async function warmOne(m) {
    const page = await getPageForTab(m.tab);
    await navigateToImages(page);
    if (!(await isLoggedIn(page))) throw new Error('not logged in');
    const refPath = path.join(MODELS_DIR, m.pic);
    if (!fs.existsSync(refPath)) throw new Error(`missing ref ${m.pic}`);
    const result = await uploadRef(page, refPath);
    const chip = await hasRefChip(page);
    warmed.push({ tab: m.tab, model: m.model, ...result, chip });
  }

  for (let i = 0; i < manifest.models.length; i += concurrency) {
    const chunk = manifest.models.slice(i, i + concurrency);
    await Promise.all(chunk.map(warmOne));
  }
  return { warmed: warmed.length, slots: warmed };
}

function latestPromptDir() {
  const promptsRoot = grokPath('prompts');
  const dirs = fs.readdirSync(promptsRoot).filter((d) => fs.statSync(path.join(promptsRoot, d)).isDirectory());
  dirs.sort();
  return dirs[dirs.length - 1];
}

async function stageAll({ promptOnly = true } = {}) {
  const manifest = loadManifest();
  const slug = latestPromptDir();
  const concurrency = parseInt(process.env.GROK_STAGE_CONCURRENCY || '3', 10);
  const staged = [];

  async function stageOne(m) {
    const page = await getPageForTab(m.tab);
    await navigateToImages(page);
    if (!promptOnly) {
      const refPath = path.join(MODELS_DIR, m.pic);
      await uploadRef(page, refPath);
    }
    const promptPath = path.join(grokPath('prompts', slug), `${m.model}.txt`);
    const text = fs.readFileSync(promptPath, 'utf8');
    await fillPrompt(page, text);
    staged.push({ tab: m.tab, model: m.model, id: m.id });
  }

  for (let i = 0; i < manifest.models.length; i += concurrency) {
    await Promise.all(manifest.models.slice(i, i + concurrency).map(stageOne));
  }
  return { staged: staged.length, promptOnly, batch: slug, slots: staged };
}

async function sendAll({ ids = null, delay = 25 } = {}) {
  const manifest = loadManifest();
  const targets = ids
    ? manifest.models.filter((m) => ids.includes(m.id) || ids.includes(m.tab))
    : manifest.models;
  const sent = [];

  for (const m of targets) {
    const page = await getPageForTab(m.tab);
    await navigateToImages(page);
    await dismissPopups(page);
    const thinking = await ensureThinkingHigh(page);
    if (thinking.thinking !== 'High' && thinking.thinking !== 'skipped' && process.env.GROK_SKIP_THINKING_GATE !== '1') {
      throw new Error(`thinking not High on ${m.tab}`);
    }
    await clickSend(page);
    sent.push({ tab: m.tab, model: m.model, url: page.url() });
    if (delay > 0) await sleep(delay * 1000);
  }
  return { sent: sent.length, slots: sent, delay };
}

async function policyRetryAll({ wait = 60 } = {}) {
  const manifest = loadManifest();
  const retried = [];
  for (const m of manifest.models) {
    const page = await getPageForTab(m.tab);
    const body = await page.content();
    if (!/content policies|guardrails|unable to generate/i.test(body)) continue;
    const edit = page.getByRole('button', { name: /edit/i }).first();
    if (await edit.isVisible({ timeout: 2000 }).catch(() => false)) {
      await edit.click();
      await sleep(500);
      await clickSend(page);
      retried.push({ tab: m.tab, model: m.model });
      await sleep(wait * 1000);
    }
  }
  return { retried };
}

async function shutdown() {
  if (context && !KEEP_OPEN) {
    await context.close();
    context = null;
    pages.clear();
  }
}

module.exports = {
  PROFILE_DIR,
  getContext,
  preflight,
  ensureAllTabs,
  warmAll,
  stageAll,
  sendAll,
  policyRetryAll,
  shutdown,
};
