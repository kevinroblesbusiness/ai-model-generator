# GPT Site

Static site for Hicks Field prompt workflow. Deployed via GitHub Pages.

## Tools

| Page | Use |
|------|-----|
| [index.html](index.html) | Hub |
| [night_pipeline.html](night_pipeline.html) | **Tonight's night batch** — copy prompts to ChatGPT |
| [prompt_generator_1.html](prompt_generator_1.html) | Single prompt builder |
| [character_prompt_generator.html](character_prompt_generator.html) | Character gym prompts |

## Night pipeline

1. Open `night_pipeline.html`
2. Copy each prompt (or "Copy all 3")
3. Paste into **GPT site** (ChatGPT image gen)
4. Save approved images to `model_pics/batch_036/`

## Refresh data

From `ai-model-generator` repo:

```bash
python3 scripts/export_site_data.py
cp -r site/* ../gpt/
```

Updates `data/night_batch.json` from `brain/scheduling/`.

## Local dev

```bash
cd site && python3 -m http.server 8000
```

Open http://localhost:8000/night_pipeline.html
