#!/usr/bin/env node
/**
 * G1 — batch gate enforcement. All gates must pass before sync/import/stage/send.
 */
const fs = require('fs');
const path = require('path');
const { grokPath, readText } = require('./lib/paths');
const { parseBatch } = require('./lib/parse-batch');
const { checkBatch } = require('./lib/gen-z-check');

function runGates(batchPath, options = {}) {
  const md = readText(batchPath);
  const parsed = parseBatch(md);
  const results = [];
  const genZ = checkBatch(parsed);
  if (!genZ.ok) {
    for (const f of genZ.failures) {
      results.push({ gate: f.gate, model: f.model, issues: f.issues });
    }
  }

  if (parsed.meta.timeOfDay === 'nighttime') {
    if (!parsed.meta.morningPair) {
      results.push({ gate: 'morning-pair', model: '*', issues: ['night batch missing **Morning pair:**'] });
    } else if (options.morningPath && fs.existsSync(options.morningPath)) {
      const morning = parseBatch(readText(options.morningPath));
      const morningByModel = Object.fromEntries(morning.rows.map((r) => [r.model.toLowerCase(), r]));
      for (const row of parsed.rows) {
        const m = morningByModel[row.model.toLowerCase()];
        if (!m) continue;
        const nightColor = require('./lib/gen-z-check').extractColor(row.locationAndFit);
        const amColor = require('./lib/gen-z-check').extractColor(m.locationAndFit);
        if (nightColor && amColor && nightColor === amColor) {
          results.push({ gate: 'morning-color', model: row.model, issues: ['night color matches morning'] });
        }
        const ns = require('./lib/gen-z-check').extractSceneCategory(row.locationAndFit);
        const ms = require('./lib/gen-z-check').extractSceneCategory(m.locationAndFit);
        if (ns === ms) {
          results.push({ gate: 'morning-scene', model: row.model, issues: ['night scene matches morning'] });
        }
      }
    }
  }

  const ok = results.length === 0;
  return { ok, failures: results, meta: parsed.meta, rowCount: parsed.rows.length };
}

if (require.main === module) {
  const batchPath = process.argv[2];
  if (!batchPath) {
    console.error('Usage: node batch-gates.js <batch.md> [--morning path]');
    process.exit(1);
  }
  let morningPath;
  const mi = process.argv.indexOf('--morning');
  if (mi !== -1) morningPath = process.argv[mi + 1];
  const r = runGates(path.resolve(batchPath), { morningPath });
  if (r.ok) {
    console.log(`✅ All gates passed (${r.rowCount} rows)`);
    process.exit(0);
  }
  console.error('❌ Batch gates failed:');
  for (const f of r.failures) {
    console.error(`  [${f.gate}] ${f.model}: ${f.issues.join('; ')}`);
  }
  process.exit(1);
}

module.exports = { runGates };
