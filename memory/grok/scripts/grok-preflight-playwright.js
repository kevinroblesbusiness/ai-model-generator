#!/usr/bin/env node
/** G0 — Preflight health check (thinking=High, tabs on /images/). */
const http = require('http');
const POOL = process.env.GROK_BROWSER_POOL_URL || 'http://127.0.0.1:3101';

http.get(`${POOL}/preflight`, (res) => {
  let b = '';
  res.on('data', (c) => (b += c));
  res.on('end', () => {
    console.log(b);
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
}).on('error', (e) => {
  console.error('browser-pool unreachable:', e.message);
  process.exit(1);
});
