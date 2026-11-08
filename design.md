# Design: KM Foods

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: editorial
- Concept: The House of Ingredients — every ingredient has a place
- Shape of the first page: custom, the archive counter
- Theme: custom (vibe: "parchment, ink, oxide red, saffron, cardamom")
- Axes: light / editorial serif / warm · posture: restrained

## Tokens
`tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(93.7% 0.025 83);  --color-paper-2: oklch(95.9% 0.018 86);  --color-paper-3: oklch(90.6% 0.033 85);
  --color-ink: oklch(25.1% 0.010 133);  --color-ink-2: oklch(35.7% 0.015 129);  --color-muted: oklch(48% 0.02 122);  --color-rule: oklch(84.9% 0.035 85);
  --color-accent: oklch(50% 0.154 31);  --color-accent-ink: oklch(95.9% 0.018 86);  --color-focus: oklch(50% 0.154 31);
  --color-saffron: oklch(73.2% 0.135 76);  --color-dusk: oklch(39.2% 0.038 145);
  --font-display: "Piazzolla", ui-serif, Georgia, serif;  --font-body: "Archivo", ui-sans-serif, sans-serif;
  --radius-card: 0;  --radius-pill: 999px;  --rule-hair: 1px;  --shadow-card: 10px 10px 0 var(--color-paper-3);
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`. Urdu sets in Noto Nastaliq Urdu (display) and Noto Naskh Arabic (body) under `[lang="ur"]`. Gate 37 waived: the ingredient index needs Urdu and tabular figures.

## Controls
- Primary: oxide red fill · pill · 46px
- Secondary: ink underline, no box · same height
- Field: square, 1px ink border, paper-2 fill

## Motion
- Character: still; one reveal at most; under reduced motion everything ends at once. Hover is a colour step, press is a 0.98 scale.

## Exports
`tokens.css` in this project. Tailwind, DTCG or shadcn blocks are added here on request, per `export-formats.md`.

## Variants

### Phase 1 · homepage, header, footer
- Signature: the ingredient index, a numbered ledger that reveals the category shelf on hover or focus.
- Scope: homepage, header and footer. The shop, product, cart and checkout routes inherit the system.

### Phase 2 · commerce interior
- Shop: the complete ingredient ledger — a numbered product index with category directory.
- Category: the ingredient shelves — an editorial chapter template per category.
- Search: find an ingredient — a strong typographic lookup over the real catalogue.
- Product: the ingredient dossier — an editorial product record with a real purchase panel.
