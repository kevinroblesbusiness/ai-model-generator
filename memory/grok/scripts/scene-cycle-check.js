#!/usr/bin/env node
/**
 * scene-cycle-check — 10-family pool before repeat (stub: pass if ≥4 scene categories in batch).
 */
const { readText } = require('./lib/paths');
const { parseBatch } = require('./lib/parse-batch');
const { extractSceneCategory } = require('./lib/gen-z-check');

function checkSceneCycle(batchPath) {
  const batch = parseBatch(readText(batchPath));
  const cats = new Set(batch.rows.map((r) => extractSceneCategory(r.locationAndFit)));
  if (cats.size >= 4) return { ok: true, categories: [...cats] };
  return { ok: false, error: `scene-cycle: need ≥4 categories, got ${cats.size}` };
}

if (require.main === module) {
  const p = process.argv[2];
  const r = checkSceneCycle(p);
  console.log(r.ok ? 'PASS' : 'FAIL', r.error || r.categories?.join(', '));
  process.exit(r.ok ? 0 : 1);
}

module.exports = { checkSceneCycle };
