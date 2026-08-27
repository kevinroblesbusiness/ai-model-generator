#!/usr/bin/env node
/** Portable repo paths — cloud + local */
const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '../../../..');
const GROK_ROOT = path.join(REPO_ROOT, 'memory', 'grok');
const MODELS_DIR = path.join(REPO_ROOT, 'models');

function grokPath(...parts) {
  return path.join(GROK_ROOT, ...parts);
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function writeText(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

module.exports = { REPO_ROOT, GROK_ROOT, MODELS_DIR, grokPath, readJson, readText, writeText };
