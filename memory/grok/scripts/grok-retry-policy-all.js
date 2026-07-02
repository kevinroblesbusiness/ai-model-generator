#!/usr/bin/env node
/** S8 — Policy retry for guardrails blocks (browser-pool delegate). */
const http = require('http');
const POOL = process.env.GROK_BROWSER_POOL_URL || 'http://127.0.0.1:3101';
const wait = parseInt(process.argv.find((a, i) => process.argv[i - 1] === '--wait') || '60', 10);

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
  const r = await post('/batch/policy-retry', { wait });
  console.log(r.status, r.body);
  process.exit(r.status === 200 ? 0 : 1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
