#!/usr/bin/env node
/**
 * Browser pool stub — Playwright integration point for cloud.
 * Set GROK_PW_DRY_RUN=1 to simulate without ChatGPT session.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { grokPath, MODELS_DIR, readJson } = require('../../memory/grok/scripts/lib/paths');

const PORT = parseInt(process.env.GROK_BROWSER_POOL_PORT || '3101', 10);
const DRY = process.env.GROK_PW_DRY_RUN === '1';

const TAB_REGISTRY = path.join(grokPath(), '.tab-slots.json');

function loadManifest() {
  return readJson(grokPath('models.manifest.json'));
}

function loadRegistry() {
  if (fs.existsSync(TAB_REGISTRY)) return JSON.parse(fs.readFileSync(TAB_REGISTRY, 'utf8'));
  const manifest = loadManifest();
  const reg = {};
  for (const m of manifest.models) {
    reg[m.tab] = { model: m.model, pageId: `dry-${m.tab}`, lastWarm: null };
  }
  return reg;
}

function saveRegistry(reg) {
  fs.mkdirSync(path.dirname(TAB_REGISTRY), { recursive: true });
  fs.writeFileSync(TAB_REGISTRY, JSON.stringify(reg, null, 2));
}

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return json(res, 200, { ok: true, dryRun: DRY });
  }

  if (req.method === 'GET' && url.pathname === '/preflight') {
    const reg = loadRegistry();
    const tabs = Object.keys(reg).length;
    return json(res, 200, {
      ok: true,
      thinking: 'High',
      tabsOnImages: tabs,
      popups: false,
      dryRun: DRY,
      message: DRY ? 'DRY RUN — set ChatGPT session + GROK_PW_DRY_RUN=0 for live' : 'live',
    });
  }

  if (req.method === 'POST' && url.pathname === '/batch/warm') {
    const manifest = loadManifest();
    const reg = loadRegistry();
    const warmed = [];
    for (const m of manifest.models) {
      const refPath = path.join(MODELS_DIR, m.pic);
      if (!fs.existsSync(refPath) && !DRY) {
        return json(res, 400, { error: `missing ref ${m.pic}` });
      }
      reg[m.tab] = { ...reg[m.tab], model: m.model, lastWarm: new Date().toISOString(), chip: true };
      warmed.push(m.tab);
    }
    saveRegistry(reg);
    return json(res, 200, { warmed: warmed.length, slots: warmed, dryRun: DRY });
  }

  if (req.method === 'POST' && url.pathname === '/batch/stage') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const opts = body ? JSON.parse(body) : {};
      const promptOnly = opts.promptOnly !== false;
      return json(res, 200, { staged: 10, promptOnly, dryRun: DRY });
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/batch/send') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const opts = body ? JSON.parse(body) : {};
      if (!opts.approved) {
        return json(res, 403, { error: 'approved flag required' });
      }
      return json(res, 200, { sent: opts.ids || 'all', delay: opts.delay || 25, dryRun: DRY });
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/batch/policy-retry') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const opts = body ? JSON.parse(body) : {};
      return json(res, 200, { retried: true, wait: opts.wait || 60, dryRun: DRY });
    });
    return;
  }

  json(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`browser-pool :${PORT} dryRun=${DRY}`);
});
