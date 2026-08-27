#!/usr/bin/env node
/**
 * Cloud orchestrator — HTTP facade over grok-pipeline stages.
 */
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const PORT = parseInt(process.env.GROK_ORCHESTRATOR_PORT || '3100', 10);
const REPO = path.resolve(__dirname, '../..');
const PIPELINE = path.join(REPO, 'memory/grok/scripts/grok-pipeline.js');
const GATES = path.join(REPO, 'memory/grok/scripts/batch-gates.js');

function runNode(script, args = []) {
  return new Promise((resolve) => {
    const child = spawn('node', [script, ...args], { cwd: REPO, env: process.env });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('close', (code) => resolve({ code, out, err }));
  });
}

function readBody(req) {
  return new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => resolve(b ? JSON.parse(b) : {}));
  });
}

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const body = req.method === 'POST' ? await readBody(req) : {};

  if (req.method === 'POST' && url.pathname === '/batch/validate') {
    const batch = body.batchPath;
    const r = await runNode(GATES, [batch]);
    return json(res, r.code === 0 ? 200 : 400, { ok: r.code === 0, stdout: r.out, stderr: r.err });
  }

  if (req.method === 'POST' && url.pathname === '/batch/build') {
    const r = await runNode(PIPELINE, ['build', '--batch', body.batchPath]);
    return json(res, r.code === 0 ? 200 : 400, { ok: r.code === 0, stdout: r.out, stderr: r.err });
  }

  if (req.method === 'GET' && url.pathname === '/batch/status') {
    const fs = require('fs');
    const p = path.join(REPO, 'memory/grok/session_state.md');
    const text = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    return json(res, 200, { session_state: text });
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    return json(res, 200, { ok: true });
  }

  json(res, 404, { error: 'not found', routes: ['POST /batch/validate', 'POST /batch/build', 'GET /batch/status'] });
});

server.listen(PORT, () => console.log(`orchestrator :${PORT}`));
