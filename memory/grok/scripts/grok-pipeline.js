#!/usr/bin/env node
/**
 * Grok pipeline — S1 validate, S2 sync, S3 import, S4 verify, build = S1–S4
 */
const fs = require('fs');
const path = require('path');
const { grokPath, readText, writeText, readJson } = require('./lib/paths');
const { parseBatch, batchSlug } = require('./lib/parse-batch');
const { runGates } = require('./batch-gates');

function cmdValidate(batchPath, opts) {
  const r = runGates(batchPath, opts);
  if (!r.ok) throw new Error('validate failed — run batch-gates.js for details');
  console.log(`S1 validate ✅ ${r.rowCount} rows`);
  return r;
}

function cmdSync(batchPath) {
  const { meta, rows } = parseBatch(readText(batchPath));
  const manifest = readJson(grokPath('models.manifest.json'));
  const idMap = Object.fromEntries(manifest.models.map((m) => [m.model.toLowerCase(), m.id]));

  const lines = [
    '# Session State — Grok / GPT Images',
    '',
    `**Date:** ${meta.date || new Date().toISOString().slice(0, 10)}`,
    '**Status:** IN PROGRESS',
    `**Last updated:** ${new Date().toISOString()}`,
    `**Batch:** \`${path.relative(grokPath(), batchPath)}\``,
    '',
    '## NEXT ACTION',
    '',
    'Warm refs (S5) when Kevin says go.',
    '',
    '## Batch Plan',
    '',
    '| ID | Model | Location and fit | Status |',
    '|----|-------|------------------|--------|',
  ];

  for (const row of rows) {
    const id = idMap[row.model.toLowerCase()] || `M${row.num}`;
    lines.push(`| ${id} | ${row.model} | ${row.locationAndFit} | ⬜ |`);
  }

  lines.push('', '## Failed cells', '', '(none)', '');
  writeText(grokPath('session_state.md'), lines.join('\n'));
  console.log('S2 sync ✅ session_state.md updated');
}

function splitLocationFit(line) {
  const cuteIdx = line.search(/,\s*cute\s/i);
  if (cuteIdx === -1) return { location: line.trim(), outfit: '' };
  return {
    location: line.slice(0, cuteIdx).trim(),
    outfit: line.slice(cuteIdx + 2).trim(),
  };
}

function inferTimeOfDay(line, meta) {
  if (/\bmorning\b/i.test(line)) return 'morning';
  if (/\bnighttime\b/i.test(line)) return 'nighttime';
  return meta.timeOfDay || 'daytime';
}

function buildPrompt(row, meta, template) {
  const { location, outfit } = splitLocationFit(row.locationAndFit);
  const tod = inferTimeOfDay(row.locationAndFit, meta);
  const outfitLine = /^cute\s/i.test(outfit) ? outfit : `cute ${outfit}`;
  return template
    .replace(/^Location:\s*$/m, `Location: ${location}`)
    .replace(/^Outfit:\s*$/m, `Outfit: ${outfitLine}`)
    .replace(/^Time of day:\s*$/m, `Time of day: ${tod}`);
}

function cmdImport(batchPath) {
  const { meta, rows } = parseBatch(readText(batchPath));
  const slug = batchSlug(batchPath);
  const outDir = grokPath('prompts', slug);
  const template = readText(grokPath('prompts/master-template.txt'));

  fs.mkdirSync(outDir, { recursive: true });
  for (const row of rows) {
    const body = buildPrompt(row, meta, template);
    const out = path.join(outDir, `${row.model}.txt`);
    writeText(out, body);
    console.log(`  wrote ${path.relative(grokPath(), out)}`);
  }
  console.log(`S3 import ✅ ${rows.length} prompt files → prompts/${slug}/`);
}

function cmdVerify(batchPath) {
  const { rows } = parseBatch(readText(batchPath));
  const slug = batchSlug(batchPath);
  const outDir = grokPath('prompts', slug);
  const missing = [];
  const badPrefix = [];

  for (const row of rows) {
    const f = path.join(outDir, `${row.model}.txt`);
    if (!fs.existsSync(f)) {
      missing.push(row.model);
      continue;
    }
    const t = readText(f);
    if (!t.startsWith('Gen Z Instagram photo')) badPrefix.push(row.model);
  }

  if (missing.length || badPrefix.length) {
    throw new Error(`verify failed: missing=${missing.join(',')} badPrefix=${badPrefix.join(',')}`);
  }
  console.log(`S4 verify ✅ ${rows.length} prompt files valid`);
}

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  let batchPath;
  let morningPath;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--batch' && args[i + 1]) {
      batchPath = path.resolve(args[++i]);
    } else if (args[i] === '--morning' && args[i + 1]) {
      morningPath = path.resolve(args[++i]);
    }
  }

  if (!batchPath && cmd !== 'verify') {
    console.error('Usage: grok-pipeline.js <validate|sync|import|verify|build> --batch FILE.md');
    process.exit(1);
  }

  try {
    const opts = { morningPath };
    switch (cmd) {
      case 'validate':
        cmdValidate(batchPath, opts);
        break;
      case 'sync':
        runGates(batchPath, opts);
        cmdSync(batchPath);
        break;
      case 'import':
        cmdImport(batchPath);
        break;
      case 'verify':
        if (!batchPath) batchPath = grokPath('instagram-sexy-fits/batches/036-gen-z-day-scene-mix-jul02.md');
        cmdVerify(batchPath);
        break;
      case 'build':
        cmdValidate(batchPath, opts);
        cmdSync(batchPath);
        cmdImport(batchPath);
        cmdVerify(batchPath);
        console.log('✅ build complete (S1–S4)');
        break;
      default:
        console.error(`Unknown command: ${cmd}`);
        process.exit(1);
    }
  } catch (e) {
    console.error('❌', e.message);
    process.exit(1);
  }
}

main();
