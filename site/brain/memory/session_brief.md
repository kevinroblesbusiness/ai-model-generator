# Session Brief — 2026-07-02

## Status
- ⚠️  TRENDS OUTDATED — update brain/trends/current.md before generating
- Approved total: 0 | Leah: 0 | Catalina: 0 | Isabella: 0
- Goal: 9/day (3 per model)

## Today's Schedule
  ⬜ Leah       morning      HB01 — Dark bedroom, charcoal walls, single dim lamp
  ⬜ Leah       afternoon    AG01 — Gym mirror, fluorescent overhead, equipment blurred behind
  ⬜ Leah       night        ON01 — Late night gas station, neon + fluorescent
  ⬜ Catalina   morning      HB02 — Light bedroom, white walls, platform bed, cool LED
  ⬜ Catalina   afternoon    AG02 — Yoga mat, natural window light, morning
  ⬜ Catalina   night        ON02 — Rooftop restaurant, Edison string lights, city skyline
  ⬜ Isabella   morning      HB03 — Bedroom, ring light setup, mirror selfie
  ⬜ Isabella   afternoon    AG03 — Gym, cable machines visible behind, dark aesthetic
  ⬜ Isabella   night        ON03 — Cobblestone alley, string lights, warm stone walls

## Rules (always apply)
# Universal Rules

## Workflow — Every Batch
1. Run `python3 outfit_gen.py <character> <category>` — always first, no exceptions
2. Scan ALL sources before writing — run in parallel every time:
   - Google search using character's Pinterest terms (character files)
   - Reddit (r/Instagrammers, r/femalefashionadvice, LA photo spot threads)
   - Who What Wear / Refinery29 / Nylon — pose and location articles
   - Google Images — real photo descriptions from indexed content
   - Any other accessible source (Tumblr, Snapchat Spotlight, Lemon8 if accessible)
3. Extract from scans: specific real locations, poses, lighting, what's actually behind subjects in real shots
4. Mash together best elements from 3-5 real references — this location, that pose, this light
5. Write prompt recreating a real shot — never imagined from scratch

## Model Usage
- **Haiku** → file reads, git ops, running scripts, logging
- **Sonnet/Opus** → prompt generation, research, creative work, memory updates

---

## The Aesthetic
Gen Z LA creator. 18-25. Candid. In the moment. NOT posed, NOT a photoshoot, NOT a fashion ad. Hot girl caught on camera — mid-laugh, adjusting her hair, looking away, not performing.

Reference: Sophie Rain, Addison Rae, Charli D'Amelio — real, in-the-moment, sex appeal without trying.

**Every prompt must feel like someone just caught the shot.** Candid language only: mid-laugh, looking to the side, caught off guard, adjusting her top, glancing down, turning when called.

---

## Backgrounds
Full list in `brain/scheduling/settings_pool.md` — 78 settings with IDs. Use scheduler.py to assign.

**AI works best with:** single dominant element close to subject — one wall, one light source, one texture. Tight framing, no depth required.

**Always avoid:**
- Wide street scenes → AI generates generic suburban plaza
- Beverly Hills / luxury storefronts → reads 2019
- Lakes, parks, pools → goes CGI
- Multiple architectural elements in same shot

---

## Outfits
Managed by `outfit_gen.py` — slot-based randomizer with 7-day cooldowns. Always run it. Never pick outfits manually.

**Avoid:** elaborate/busy pieces | muted colors on Catalina | wide-leg trousers on Isabella

---

## Poses — Show the body, never a mannequin
**Works:** mirror selfie (phone up, hand on waist, slight arch) | looking back over shoulder | crouching one leg forward | hip pop hand in hair | mid-stride toward camera

**Avoid:** standing straight shoulders square | hands in pockets | arms crossed | anything that hides the waist

---

## Non-Negotiables
- Full body shot
- Full face of makeup
- White nail polish, all five toes visible
- Indoors → barefoot | outdoors → strappy heeled sandals
- End every prompt: "The photo appears to be captured with a smartphone"
- HEX values every prompt: skin tone (3-4) + hair (2-3) + outfit + background + lighting — missing = washed out
- Single code block, no blank lines inside — mobile copy friendly
- Max one reflective surface — mirror counts, never add wet floor + mirror together
- Must read clearly early 20s
- Save only on explicit approval

## Active Reminders
# Reminders
After approvals drop ONE casually. Never stack. Read energy first.

- [ ] Isabella first 8/10 still needed — boba shop or city sidewalk night
- [ ] 2 approved so far, building toward 9/day
- [ ] Prompt generator — remind at ~10-15 approved total
- [ ] New day = update trends before anything
