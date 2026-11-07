# Skill and tool usage — House of Ingredients

## Skills discovered

The environment exposes these skills: `hallmark`, `codebase-memory`,
`reverse-engineer-anything`, plus the general OpenCode skills (docs, pdf, xlsx,
pptx, docx, browser, ponytail, test-driven-development, skill-creator, and
others). None of the prompt's suggested names exist: there is no "UI/UX Pro
Max", "Web Design Guidelines", "Interface Design", "Creative Frontend",
"Motion Design", "GSAP", "Visual QA", or "Image Generation" skill.

## Skills invoked

**Hallmark** was installed at `~/.agents/skills/hallmark` and was loaded and
followed as the lead design skill. This is a **custom run**: the brief asks to
invent the identity, so no theme was dealt. The flow applied:

- Pre-flight: read the repo, the live storefront, the catalogue, the tokens and
  the assets before writing code.
- `references/direction.md` for the custom run: the idea, the look, the faces,
  the colour and the stamp are ours; the Floor, the gates and the sweep still
  bind.
- `references/imagery.md`: verified library photographs only, credited; no
  drawn illustrations, no empty gradient placeholders.
- `references/fonts.md`: the display face must be one no catalog theme sets.
  `theme.mjs check --face` cleared Piazzolla, EB Garamond, Cardo, Gloock and
  others; Piazzolla was chosen.
- `references/craft.md`, `layout.md`, `anatomy.md`: type scale, section
  rhythm, the buy anatomy (the offer, the range, the ordering facts).
- `gates.md`: the Floor and the Reflex gates, the stamp, the waiver on gate 37.
- `scripts/sloplint.mjs`: the static sweep, run until 0 FAIL.

## Tools available and used

- **Browser automation**: Playwright (installed in the storefront) drove the
  real rendered pages at 1440 and 390 and captured the evidence.
- **Hallmark capture / sloplint render**: `puppeteer-core` was installed into
  the skill so the render tier could run against the dev server.
- **Image generation**: the image tool is present but its free-tier quota was
  exhausted, so no original photography could be generated. The brief's
  fallback was used: verified Wikimedia Commons photographs from Hallmark's
  library, credited in the footer.
- **Node**: the Hallmark scripts (`theme.mjs`, `sloplint.mjs`) ran locally.

## Tools unavailable

- GSAP / Motion / Framer Motion: not installed, and adding a dependency for a
  CSS motion system would be unnecessary. Motion is CSS only.
- Inspo MCP: not present.
- `TOGETHER_API_KEY`: not set, so Hallmark's generated-still path was closed.
- A live Google Fonts response at runtime: `next/font` downloads and
  self-hosts the faces at build time, so the production runtime does not call
  Google. The build does fetch them once.

## How the guidance changed the design

- The Floor removed the eyebrow pills, the tracked capitals, the card-in-card
  and the hidden-at-rest reveal from the previous design.
- The custom direction forced a new palette (parchment, ink, oxide red,
  cardamom, saffron) and a display face no catalog theme uses, instead of a
  recolor of the previous identity.
- The imagery rules kept the homepage honest: three credited photographs, and
  typography where no photograph exists. No gradient stands in for a photo.
- The gates caught the five-family font stack (dropped the mono), the mobile
  menu's `max-height` transition, and the inline colour literals.
