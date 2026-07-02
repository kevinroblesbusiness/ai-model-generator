#!/usr/bin/env node
/** Parse batch markdown tables into structured rows */
function parseBatch(md) {
  const lines = md.split('\n');
  const meta = {};
  const rows = [];

  for (const line of lines) {
    const status = line.match(/^\*\*Status:\*\*\s*(.+)/i);
    if (status) meta.status = status[1].trim();
    const tod = line.match(/^\*\*Time of day:\*\*\s*(.+)/i);
    if (tod) meta.timeOfDay = tod[1].trim();
    const morning = line.match(/^\*\*Morning pair:\*\*\s*`?([^`\n]+)`?/i);
    if (morning) meta.morningPair = morning[1].trim();
    const date = line.match(/^\*\*Date:\*\*\s*(.+)/i);
    if (date) meta.date = date[1].trim();

    const row = line.match(/^\|\s*(\d+)\s*\|\s*([^|]+)\|\s*(.+)\|/);
    if (row && row[1] !== '#') {
      rows.push({
        num: parseInt(row[1], 10),
        model: row[2].trim(),
        locationAndFit: row[3].trim(),
      });
    }
  }

  return { meta, rows };
}

function batchSlug(batchPath) {
  const base = require('path').basename(batchPath, '.md');
  return base;
}

module.exports = { parseBatch, batchSlug };
