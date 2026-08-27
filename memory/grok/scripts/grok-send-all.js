#!/usr/bin/env node
/**
 * S7 — Send all staged prompts. Requires GROK_GO_SEND_ALL=1 or GROK_GO_SEND=M#.
 * Cloud: delegates to browser-pool service.
 */
const http = require('http');

const APPROVED = process.env.GROK_GO_SEND_ALL === '1' || process.env.GROK_GO_SEND;
const DELAY = parseInt(process.env.GROK_SEND_DELAY || '25', 10);
const POOL = process.env.GROK_BROWSER_POOL_URL || 'http://127.0.0.1:3101';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(path, POOL);
    const data = JSON.stringify(body);
    const req = http.request(
      { hostname: u.hostname, port: u.port, path: u.pathname, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } },
      (res) => {
        let b = '';
        res.on('data', (c) => (b += c));
        res.on('end', () => resolve({ status: res.statusCode, body: b }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  if (!APPROVED) {
    console.error('BLOCKED: set GROK_GO_SEND_ALL=1 or GROK_GO_SEND=M# (Kevin approval)');
    process.exit(1);
  }
  const ids = process.env.GROK_GO_SEND ? [process.env.GROK_GO_SEND] : null;
  try {
    const r = await post('/batch/send', { ids, delay: DELAY, approved: true });
    console.log(r.status, r.body);
    process.exit(r.status === 200 ? 0 : 1);
  } catch (e) {
    console.error('browser-pool unreachable:', e.message);
    console.error('Start: node services/browser-pool/server.js');
    process.exit(1);
  }
}

main();
