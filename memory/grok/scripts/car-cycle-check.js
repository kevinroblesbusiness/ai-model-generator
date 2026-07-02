#!/usr/bin/env node
/** Car rows: 2025 make+model, brand cycle (stub). */
const { readText } = require('./lib/paths');
const { parseBatch } = require('./lib/parse-batch');

function checkCarCycle(batchPath) {
  const batch = parseBatch(readText(batchPath));
  const carRows = batch.rows.filter((r) => /car|mercedes|bmw|tesla|porsche/i.test(r.locationAndFit));
  for (const r of carRows) {
    if (!/2025/i.test(r.locationFit)) {
      return { ok: false, error: `car-cycle: ${r.model} missing 2025 make+model` };
    }
  }
  return { ok: true, carRows: carRows.length };
}
module.exports = { checkCarCycle };
