#!/usr/bin/env node
/** S6 — Stage all prompts (prompt-only, no re-upload). */
const http = require('http');
const fs = require('fs');
const { grokPath, readText } = require('./lib/paths');

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

function updateSessionStaged() {
  const p = grokPath('session_state.md');
  let md = readText(p);
  md = md.replace(/\| ⬜ \|/g, '| 🔄 |');
  fs.writeFileSync(p, md);
}

async function main() {
  const promptOnly = !process.argv.includes('--no-prompt-only');
  const r = await post('/batch/stage', { promptOnly });
  if (r.status === 200) {
    updateSessionStaged();
    console.log('S6 stage-all ✅', r.body);
    process.exit(0);
  }
  console.error('stage failed', r.body);
  process.exit(1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
