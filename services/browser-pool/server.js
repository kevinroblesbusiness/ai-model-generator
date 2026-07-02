#!/usr/bin/env node
/**
 * Browser pool — ChatGPT Images in cloud via Playwright.
 * GROK_PW_DRY_RUN=1 → simulate (no browser)
 * GROK_PW_DRY_RUN=0 → live chatgpt.com/images/
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { grokPath, MODELS_DIR, readJson } = require('../../memory/grok/scripts/lib/paths');

const PORT = parseInt(process.env.GROK_BROWSER_POOL_PORT || '3101', 10);
const DRY = process.env.GROK_PW_DRY_RUN === '1';

let pool = null;
if (!DRY) {
  pool = require('./playwright-pool');
}

const TAB_REGISTRY = path.join(grokPath(), '.tab-slots.json');

function loadManifest() {
  return readJson(grokPath('models.manifest.json'));
}

function loadRegistry() {
  if (fs.existsSync(TAB_REGISTRY)) return JSON.parse(fs.readFileSync(TAB_REGISTRY, 'utf8'));
  const manifest = loadManifest();
  const reg = {};
  for (const m of manifest.models) {
    reg[m.tab] = { model: m.model, pageId: DRY ? `dry-${m.tab}` : m.tab, lastWarm: null };
  }
  return reg;
}

function saveRegistry(reg) {
  fs.mkdirSync(path.dirname(TAB_REGISTRY), { recursive: true });
  fs.writeFileSync(TAB_REGISTRY, JSON.stringify(reg, null, 2));
}

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj, null, 2));
}

function readBody(req) {
  return new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => resolve(b ? JSON.parse(b) : {}));
  });
}

async function dryWarm() {
  const manifest = loadManifest();
  const reg = loadRegistry();
  const warmed = [];
  for (const m of manifest.models) {
    const refPath = path.join(MODELS_DIR, m.pic);
    if (!fs.existsSync(refPath)) return { error: `missing ref ${m.pic}`, status: 400 };
    reg[m.tab] = { ...reg[m.tab], model: m.model, lastWarm: new Date().toISOString(), chip: true };
    warmed.push(m.tab);
  }
  saveRegistry(reg);
  return { warmed: warmed.length, slots: warmed, dryRun: true };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      return json(res, 200, { ok: true, dryRun: DRY, profileDir: pool?.PROFILE_DIR });
    }

    if (req.method === 'GET' && url.pathname === '/preflight') {
      if (DRY) {
        const reg = loadRegistry();
        return json(res, 200, {
          ok: true,
          thinking: 'High',
          tabsOnImages: Object.keys(reg).length,
          popups: false,
          dryRun: true,
          message: 'DRY RUN — set GROK_PW_DRY_RUN=0 + ChatGPT login profile for live',
        });
      }
      const report = await pool.preflight();
      return json(res, report.ok ? 200 : 401, { ...report, dryRun: false });
    }

    if (req.method === 'POST' && url.pathname === '/batch/warm') {
      if (DRY) {
        const r = await dryWarm();
        if (r.error) return json(res, r.status, { error: r.error });
        return json(res, 200, r);
      }
      const result = await pool.warmAll();
      const reg = loadRegistry();
      for (const s of result.slots) {
        reg[s.tab] = { ...reg[s.tab], model: s.model, lastWarm: new Date().toISOString(), chip: s.chip };
      }
      saveRegistry(reg);
      return json(res, 200, { ...result, dryRun: false });
    }

    if (req.method === 'POST' && url.pathname === '/batch/stage') {
      const opts = req.method === 'POST' ? await readBody(req) : {};
      if (DRY) {
        return json(res, 200, { staged: 10, promptOnly: opts.promptOnly !== false, dryRun: true });
      }
      const result = await pool.stageAll({ promptOnly: opts.promptOnly !== false });
      return json(res, 200, { ...result, dryRun: false });
    }

    if (req.method === 'POST' && url.pathname === '/batch/send') {
      const opts = await readBody(req);
      if (!opts.approved) return json(res, 403, { error: 'approved flag required' });
      if (DRY) {
        return json(res, 200, { sent: opts.ids || 'all', delay: opts.delay || 25, dryRun: true });
      }
      const result = await pool.sendAll({ ids: opts.ids, delay: opts.delay || 25 });
      return json(res, 200, { ...result, dryRun: false });
    }

    if (req.method === 'POST' && url.pathname === '/batch/policy-retry') {
      const opts = await readBody(req);
      if (DRY) return json(res, 200, { retried: true, wait: opts.wait || 60, dryRun: true });
      const result = await pool.policyRetryAll({ wait: opts.wait || 60 });
      return json(res, 200, { ...result, dryRun: false });
    }

    json(res, 404, { error: 'not found' });
  } catch (e) {
    console.error(e);
    json(res, 500, { error: e.message, dryRun: DRY });
  }
});

server.listen(PORT, () => {
  console.log(`browser-pool :${PORT} mode=${DRY ? 'DRY_RUN' : 'LIVE_PLAYWRIGHT'} profile=${pool?.PROFILE_DIR || 'n/a'}`);
});

process.on('SIGINT', async () => {
  if (pool) await pool.shutdown();
  process.exit(0);
});
