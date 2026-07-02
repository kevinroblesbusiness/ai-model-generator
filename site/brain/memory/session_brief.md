# Session Brief — 2026-07-02

## Status
- ⚠️  TRENDS OUTDATED — update brain/trends/current.md before generating
- Approved total: 0 | Leah: 0 | Catalina: 0 | Isabella: 0
- Goal: 9/day (3 per model)

## Today's Schedule
No schedule for today — run scripts/scheduler.py first.

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

## Leah — Character File
# Leah
**Young blonde Asian woman — long blonde hair, always blonde**
Moody, edgy, dark/sexy. Confident. Night settings. Blonde against dark rooms is the signature.

## Vibe
Flirtatious over corporate. Hip pop, touch hair, fingers on lip, arched back. Smoldering gaze not stiff.
Pinterest search: `edgy girl night out LA candid` | `moody girl neon light portrait` | `hot girl dark room caught on camera` | `night out girl smoldering gaze` | `girl leaning against wall night neon` | `dark aesthetic girl body instagram`

## Works
- Gas station neon+fluorescent (8/10)
- Dark charcoal bedroom mirror selfie (8/10)
- Matte black kitchen counter lean (8/10)
- Moody dim lighting + black ribbed set
- Smoky liner + glossy nude lip
- Rain-slicked crosswalk (6/10 — good setting, fix pose)
- Speakeasy, karaoke booth, neon corridor, dive bar bathroom
- **White minimal bedroom mirror selfie** — phone at chest, body turned, slight arch, full length mirror, white walls (confirmed real photo ref)
- **Modern building exterior at night** — concrete railing, warm sconce, city blur behind, looking back over shoulder (confirmed real photo ref)
- **City sidewalk at night** — storefront neon behind, one hand on waist, body turned, direct eye contact (confirmed real photo ref)

## Flopped
- Generic rooftop + blazer (5/10)
- Heavy marble hotel (3/10 — grandma)
- One hand in pocket — too stiff
- Multiple reflective surfaces → generation errors

## Rules
- **Black only** — Kevin confirmed. No exceptions.
- Vary silhouette not color: neckline, crop length, texture, sleeve detail
- Single reflective surface max
- Modern/boutique hotel only — no marble

## Outfits
Use `python3 outfit_gen.py leah <going_out|home|active>`

## Makeup
Smoky liner + glossy nude lip (signature) | bold liner + matte lip | barely-there gloss for home

## Approved
- leah_03_approved.txt — gas station, halter crop + leather mini (8/10)
- leah_04_approved.txt — dark bedroom mirror selfie, black ribbed set (8/10)
- leah_05_approved.txt — matte black kitchen, black satin cami (8/10)

## Leah — Tracker
# Leah Tracker

## Settings Used
| Used | Setting |
|------|---------|
| ✅ | Late night gas station |
| ✅ | Dark bedroom (mirror selfie) |
| ✅ | Matte black kitchen counter |
| ⬜ | Rain-slicked city crosswalk at night |
| ⬜ | Modern boutique hotel corridor |
| ⬜ | Rooftop at night |
| ⬜ | Neon urban street |
| ⬜ | Sports car exterior |
| ⬜ | Dark living room |
| ⬜ | Bathroom (modern, sleek) |
| ⬜ | Gym mirror |
| ⬜ | Yoga mat |

## Outfits Used
| Used | Outfit |
|------|--------|
| ✅ | Charcoal ribbed halter crop + black leather mini skirt |
| ✅ | Black ribbed bralette + black ribbed high-waist shorts |
| ✅ | Black satin slip cami + black seamless mini shorts |
| ⬜ | Deep burgundy bodycon dress |
| ⬜ | Velvet slip dress |
| ⬜ | Dark mesh top + low-rise pants |
| ⬜ | Sleek blazer + mini skirt (nothing underneath) |
| ⬜ | Strapless corset + dark wide-leg trousers |
| ⬜ | Oversized band tee + underwear showing |
| ⬜ | Lace bodysuit + biker shorts |
| ⬜ | Dark silk robe loosely tied |
| ⬜ | Fitted black turtleneck crop + leggings |
| ⬜ | Dark green silk slip dress |
| ⬜ | Navy blue bodycon dress |
| ⬜ | Dark plum velvet mini dress |

## Jewelry Used
| Used | Piece |
|------|-------|
| ✅✅✅ | Small silver hoops — ROTATE OUT |
| ✅✅ | Thin silver choker — rest |
| ✅ | Stacked silver rings |
| ✅ | Silver star pendant |
| ⬜ | Crystal drop earrings |
| ⬜ | Chunky silver chain necklace |
| ⬜ | Gold anklet |
| ⬜ | Diamond tennis bracelet |
| ⬜ | Bold silver cuff |
| ⬜ | No jewelry (minimalist) |
| ⬜ | Gold hoops (contrast) |

## Makeup Used
| Used | Look |
|------|------|
| ✅✅ | Sharp contour — rest |
| ✅✅ | Smoky/smudged liner — rest |
| ✅✅ | Glossy nude lip — rest |
| ✅ | Frosted pink lip |
| ✅ | Dewy skin |
| ✅ | Matte base |
| ⬜ | Bold colorful graphic liner |
| ⬜ | Frosted blue icy eyeshadow |
| ⬜ | Holographic/opalescent shadow |
| ⬜ | Overlined red lip |
| ⬜ | Dark berry lip |
| ⬜ | No-makeup dewy skin |
| ⬜ | Statement high blush |

## Hair Used
| Used | Style |
|------|-------|
| ✅ | Half-up half-down tousled |
| ✅ | Sleek straight down |
| ✅ | Loose effortless waves |
| ⬜ | High sleek ponytail |
| ⬜ | Messy bun |
| ⬜ | Slicked back |
| ⬜ | Side part with face-framing layers |
| ⬜ | Low bun |

## Poses Used
| Used | Pose |
|------|------|
| ✅ | Leaning on car hood, palms back, legs crossed |
| ✅ | Mirror selfie, hip pop, one knee bent |
| ✅ | Counter lean, hands gripping edge, shoulders back |
| ⬜ | Walking toward camera |
| ⬜ | Sitting on floor/steps |
| ⬜ | One hand on wall, body turned |
| ⬜ | Hands in hair |
| ⬜ | Sitting on counter |
| ⬜ | Looking over shoulder |
| ⬜ | Lying on bed propped up |
