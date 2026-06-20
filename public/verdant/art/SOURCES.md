# Asset Provenance

## Visual Assets — Public Beta (007)

All assets in this directory are visual companions to Verdant's product pages. Placeholders are marked for replacement at production; sourced assets are listed below.

### Sourced Single Subjects

- **koi-cream.jpg** — Orange koi on cream ground, clean subject. Source: lucid-origin (AI-generated, Specs: 1024×1024px, single subject on off-white). Used as accent art on Garden page (Money pillar, weeds), footer, and product callouts. Query provenance: Lucidity (lucid-origin), orange fish specimen on plain background.

- **reeds-mist.jpg** — Misty green reed Sumi-e, Japanese ink style. Source: lucid-origin (AI-generated, Specs: landscape, widest available). Used as hero/section background on paper. Query provenance: Lucidity (lucid-origin), green reeds in mist, Sumi-e ink painting style.

- **lantern-strip.png** — Vertical glowing-lantern garden strips, composite vertical study. Source: ChatGPT-generated spec (AI-generated, Specs: 2048px upscale, hero landscape widest, square subjects; Query ID: jltcc3l5yzdmvtufmcob). Used as ScrollPillars card art and gallery. Format: PNG (original, no WebP conversion available on build system).

### Existing Assets

- **koson-*.jpg** — Koson ukiyo-e prints (Meiji period, public domain). Already cropped and in place.

### Format Note

Preferred format is WebP (cwebp -q 82) for new assets. On this build system (macOS sips, no libwebp), WebP conversion is unsupported. Assets are delivered in source format (JPG/PNG) as optimized originals. Replacement at production with WebP conversion is expected.
