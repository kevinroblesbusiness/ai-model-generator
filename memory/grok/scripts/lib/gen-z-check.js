#!/usr/bin/env node
/** Gen Z vibe gate — young places, cute fits, dress at nightlife */

const BANNED_FITS = /\b(skorts?|micro\s+mini|(?<!thigh-length\s)\bmini\b)\b/i;
const BANNED_FOOTWEAR = /\b(sandals|mules|wedges|sneakers)\b/i;
const BANNED_LOCATIONS = /\b(wine bar|country club|bowling|nightclub|farmers?\s+market|flower truck)\b/i;
const BANNED_PROPS = /\b(latte|phone|lip gloss)\b/i;
const PARTY_FIT_BAD = /\b(crop|shorts|biker)\b/i;
const PARTY_VENUE = /\b(bar|party|restaurant|rooftop\s+bar|club)\b/i;

const BANNED_COLORS = /\b(yellow|orange|green|lavender|plum|gold|champagne|olive)\b/i;

function extractColor(fitLine) {
  const m = fitLine.match(/cute\s+([a-z]+(?:\s+[a-z]+)?)\s+/i);
  return m ? m[1].toLowerCase() : null;
}

function extractSceneCategory(line) {
  const l = line.toLowerCase();
  if (/\bgym\b/.test(l)) return 'gym';
  if (/\bhome|apartment|bedroom|high-rise\b/.test(l)) return 'home';
  if (/\bmall|corridor\b/.test(l)) return 'mall';
  if (/\bbeach|boardwalk\b/.test(l)) return 'beach';
  if (/\bmansion|driveway\b/.test(l)) return 'mansion';
  if (/\bcar\b|mercedes|bmw|tesla|porsche\b/.test(l)) return 'car';
  if (/\bhouse party|party\b/.test(l)) return 'party';
  if (/\bphotoshoot\b/.test(l)) return 'photoshoot';
  return 'other';
}

function checkRow(row, timeOfDay) {
  const issues = [];
  const line = row.locationAndFit;

  if (BANNED_FITS.test(line)) issues.push('banned fit (skorts/mini/micro)');
  if (BANNED_FOOTWEAR.test(line)) issues.push('banned footwear');
  if (BANNED_LOCATIONS.test(line)) issues.push('banned location');
  if (BANNED_PROPS.test(line)) issues.push('banned prop in location line');
  if (BANNED_COLORS.test(line)) issues.push('banned color family');

  if (timeOfDay === 'nighttime' && PARTY_VENUE.test(line) && PARTY_FIT_BAD.test(line)) {
    issues.push('party/bar/restaurant requires cute dress not crop+shorts');
  }

  if (!/cute\s+/i.test(line)) issues.push('missing "cute" prefix in fit');

  return issues;
}

function checkBatch({ meta, rows }) {
  const failures = [];
  const colors = new Set();
  const scenes = {};
  const fits = new Set();

  for (const row of rows) {
    const rowIssues = checkRow(row, meta.timeOfDay);
    if (rowIssues.length) {
      failures.push({ gate: 'gen-z', model: row.model, issues: rowIssues });
    }
    const color = extractColor(row.locationAndFit);
    if (color) {
      if (colors.has(color)) {
        failures.push({ gate: 'unique-color', model: row.model, issues: [`duplicate color: ${color}`] });
      }
      colors.add(color);
    }
    const scene = extractSceneCategory(row.locationAndFit);
    scenes[scene] = (scenes[scene] || 0) + 1;
    const fitKey = row.locationAndFit.replace(/^[^,]+,\s*/, '').toLowerCase();
    if (fits.has(fitKey)) {
      failures.push({ gate: 'fit-fingerprint', model: row.model, issues: ['duplicate fit silhouette'] });
    }
    fits.add(fitKey);
  }

  const sceneCount = Object.keys(scenes).length;
  const mansionRows = scenes.mansion || 0;
  if (sceneCount < 4 && rows.length >= 10) {
    failures.push({ gate: 'scene-mix', model: '*', issues: [`only ${sceneCount} scene categories (need ≥4)`] });
  }
  if (mansionRows > 4) {
    failures.push({ gate: 'scene-mix', model: '*', issues: [`${mansionRows} mansion rows (max 4)`] });
  }

  if (!meta.status || !/approved/i.test(meta.status)) {
    failures.push({ gate: 'approved', model: '*', issues: ['batch status must include approved'] });
  }

  return { ok: failures.length === 0, failures, scenes };
}

module.exports = { checkBatch, checkRow, extractColor, extractSceneCategory };
