# AGENTS.md

## Cursor Cloud specific instructions

This repository is a collection of **standalone static HTML/CSS/JS prompt-generator tools**. There is no package manager, build step, transpiler, framework, or test suite — each `*.html` file is self-contained (inline CSS + JS) and opens directly in a browser.

### Files
- `character_prompt_generator.html` — generate character gym-aesthetic prompts (works fully client-side).
- `gym_soul_engine_trainer.html` — trainer UI; `fetch()`es `gym_soul_engine_complete.json`; optional image generation calls the Replicate API and needs a user-supplied API key.
- `prompt_generator_from_images.html` — image-to-text trainer; `fetch()`es `gym_soul_engine_complete.json` and references images in `trainig_data_pinterest_2026-04-23/`.
- `prompt_generator_1.html` — standalone prompt generator (works fully client-side).
- `gym_soul_engine_complete.json` — dataset consumed by the two trainer pages.
- `trainig_data_pinterest_2026-04-23/` — reference images (also zipped alongside).

### Running (dev)
Serve the repo root over HTTP — do **not** use `file://`, because two pages `fetch()` `gym_soul_engine_complete.json` and browsers block that under `file://` (CORS). From the repo root:

```
python3 -m http.server 8000
```

Then open e.g. `http://localhost:8000/character_prompt_generator.html`.

### Notes / gotchas
- No lint/test/build commands exist. "Testing" means loading a page and exercising it in a browser.
- Relative asset/JSON paths assume the server root is the repo root; start the server from the repo root so `gym_soul_engine_complete.json` and `trainig_data_pinterest_2026-04-23/` resolve.
- The Replicate image-generation feature in `gym_soul_engine_trainer.html` requires a valid Replicate API token entered in the UI; without it the app stays in "demo mode" and the rest of the page still works.
