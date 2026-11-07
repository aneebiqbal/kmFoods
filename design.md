# Design: KM Foods

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: editorial
- Shape of the first page: Bento Grid, a Catalogue at its core
- Theme: Solstice (vibe: "cream paper, warm brown ink, low warm light")
- Axes: light / high-contrast serif / warm · posture: restrained

## Tokens
`tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(94% 0.03 80);  --color-paper-2: oklch(97% 0.02 85);  --color-paper-3: oklch(89% 0.05 80);
  --color-ink: oklch(27% 0.05 50);  --color-ink-2: oklch(36% 0.05 50);  --color-muted: oklch(48% 0.06 55);  --color-rule: oklch(84% 0.06 78);
  --color-accent: oklch(54% 0.20 24);  --color-accent-ink: oklch(97% 0.02 85);  --color-focus: oklch(54% 0.20 24);
  --font-display: "Yeseva One", ui-serif, Georgia, serif;  --font-body: "Archivo", ui-sans-serif, sans-serif;  --font-outlier: "Archivo Narrow", ui-sans-serif, sans-serif;
  --radius-card: 0;  --radius-pill: 999px;  --rule-hair: 1px;  --shadow-card: 10px 10px 0 var(--color-paper-3);
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`. Urdu sets in Noto Nastaliq Urdu (display) and Noto Naskh Arabic (body) under `[lang="ur"]`.

## Controls
- Primary: vermilion fill · pill · 46px
- Secondary: ink underline, no box · same height
- Field: square, 1px ink border, paper-2 fill

## Motion
- Character: still; one reveal at most; under reduced motion everything ends at once. Hover is a colour step, press is a 0.98 scale.

## Exports
`tokens.css` in this project. Tailwind, DTCG or shadcn blocks are added here on request, per `export-formats.md`.

## Variants

### House of Ingredients (homepage, Phase 1)
- Genre: editorial · Shape: custom, the archive counter · Theme: custom (vibe: "parchment, ink, oxide red, saffron, cardamom")
- Axes: light / editorial serif / warm · posture: restrained
- Faces: Piazzolla (display), Archivo (body and tabular figures), Noto Nastaliq Urdu (Urdu display), Noto Naskh Arabic (Urdu body). Gate 37 waived: the ingredient index needs Urdu and tabular figures.
- Tokens: the same roles, new values in `tokens.css`. Parchment ground, oxide red signal, saffron material, cardamom dark band.
- Signature: the ingredient index, a numbered ledger that reveals the category shelf on hover or focus.
- Scope: homepage, header and footer. The shop, product, cart and checkout routes inherit the system and keep their layouts.
