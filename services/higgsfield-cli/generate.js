#!/usr/bin/env node
/**
 * Higgsfield Soul v2 CLI wrapper (cloud — no browser).
 * Usage: node services/higgsfield-cli/generate.js --soul L --prompt "..."
 */
const SOUL_MAP = {
  C: { name: 'Catalina', soul_id: 'ba64a9fb-a780-4147-b4a7-af6101275afb' },
  L: { name: 'Leah', soul_id: 'ec3c8eed-d760-47fb-ac06-f69cb43fa2dd' },
  I: { name: 'Isabella', soul_id: '0d48f8f2-b9d4-48a3-a10b-e6cd153d1463' },
};

function main() {
  const code = process.argv.find((a) => a.startsWith('--soul')) ? process.argv[process.argv.indexOf('--soul') + 1] : null;
  const promptIdx = process.argv.indexOf('--prompt');
  const prompt = promptIdx !== -1 ? process.argv[promptIdx + 1] : null;
  if (!code || !SOUL_MAP[code]) {
    console.error('Usage: generate.js --soul C|L|I --prompt "..."');
    console.error('Live: higgsfield generate create text2image_soul_v2 --soul-id <id> --prompt "..." --wait');
    process.exit(1);
  }
  const { name, soul_id } = SOUL_MAP[code];
  console.log(JSON.stringify({ character: name, soul_id, prompt, dryRun: true, cli: `higgsfield generate create text2image_soul_v2 --soul-id ${soul_id} --prompt ${JSON.stringify(prompt)} --wait` }));
}

main();
