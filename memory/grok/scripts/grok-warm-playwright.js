#!/usr/bin/env node
/** S5 — Warm identity refs on all 10 tabs via browser-pool. */
const http = require('http');
const POOL = process.env.GROK_BROWSER_POOL_URL || 'http://127.0.0.1:3101';

function get(path) {
  return new Promise((resolve, reject) => {
    const u = new URL(path, POOL);
    http.get(u, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    }).on('error', reject);
  });
}

async function main() {
  try {
    const pre = await get('/preflight');
    if (pre.status !== 200) {
      console.error('preflight failed:', pre.body);
      process.exit(1);
    }
    const warm = await new Promise((resolve, reject) => {
      const u = new URL('/batch/warm', POOL);
      const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname, method: 'POST' }, (res) => {
        let b = '';
        res.on('data', (c) => (b += c));
        res.on('end', () => resolve({ status: res.statusCode, body: b }));
      });
      req.on('error', reject);
      req.end();
    });
    console.log(warm.status, warm.body);
    process.exit(warm.status === 200 ? 0 : 1);
  } catch (e) {
    console.error('browser-pool unreachable:', e.message);
    process.exit(1);
  }
}

main();
