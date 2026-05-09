# Escape the Carceri

A free, single-page educational escape game built on Giovanni Battista Piranesi's *Le Carceri d'Invenzione* (Imaginary Prisons, 1745 / 1761). Six plates, six puzzles, one printable completion certificate.

**Provided by the [CrimRxiv Consortium](https://www.crimrxiv.com/consortium).**

## Live site

After GitHub Pages is enabled on this repo, the game is served at:

> `https://<owner>.github.io/prison-escape/`

(See *Deployment* below.)

## What it is

- **Audience:** undergraduates and the curious public.
- **Tone:** spooky-fun, but art-historically grounded.
- **Length:** about 10 minutes.
- **Tech:** pure static HTML / CSS / JavaScript. No backend. No database. No login. No cookies. No analytics. No data leaves the visitor's browser.
- **Storage:** none. No `localStorage`, no `sessionStorage`. State is held in memory and discarded on reload.
- **Accessibility:** keyboard-friendly, focus-visible outlines, semantic landmarks, alt text, reduced-motion respect.
- **Themes:** light + dark, both within a strict palette.

## Visual system

The site uses **only**:

- black
- white
- grays
- orange `#f68212`

No other hue appears anywhere. The aesthetic is stark, architectural, high-contrast — meant to echo the etchings.

## The six rooms

Each room is anchored to a real Carceri plate and its standard curatorial title. Puzzle logic stays close to what is actually visible in each plate (towers, smoke, machinery, chains, scale, confinement) and to widely accepted facts about the series.

| # | Plate | Title (curatorial) | Puzzle type |
|---|-------|--------------------|-------------|
| 1 | I    | Title Page          | Multiple choice — orientation |
| 2 | III  | The Round Tower     | Multiple choice — identify form |
| 3 | VI   | The Smoking Fire    | Image choice — match clue to plate |
| 4 | IX   | The Giant Wheel     | Multiple choice — match title to plate |
| 5 | II   | The Man on the Rack | Sequence — order means of restraint |
| 6 | XVI  | The Pier with Chains| 3-dial combo lock — synthesis |

## Image sources & rights

All Piranesi etchings used here are in the **public domain**. The high-resolution scans were donated by the **Los Angeles County Museum of Art (LACMA)**, William Randolph Hearst Collection, and made available through Wikimedia Commons.

Piranesi died in 1778, so all work is out of copyright in every jurisdiction. LACMA explicitly marks the high-resolution scans as public domain. Files used:

| File in `assets/` | Wikimedia Commons source |
|-------------------|--------------------------|
| `01_title_page.jpg`        | [Title_Page_LACMA_46.27.1.jpg](https://commons.wikimedia.org/wiki/File:Title_Page_LACMA_46.27.1.jpg) |
| `02_man_on_the_rack.jpg`   | [The_Man_on_the_Rack_LACMA_46.27.2.jpg](https://commons.wikimedia.org/wiki/File:The_Man_on_the_Rack_LACMA_46.27.2.jpg) |
| `03_round_tower.jpg`       | [The_Round_Tower_LACMA_46.27.3.jpg](https://commons.wikimedia.org/wiki/File:The_Round_Tower_LACMA_46.27.3.jpg) |
| `04_smoking_fire.jpg`      | [The_Smoking_Fire_LACMA_46.27.6.jpg](https://commons.wikimedia.org/wiki/File:The_Smoking_Fire_LACMA_46.27.6.jpg) |
| `05_giant_wheel.jpg`       | [The_Giant_Wheel_LACMA_46.27.9.jpg](https://commons.wikimedia.org/wiki/File:The_Giant_Wheel_LACMA_46.27.9.jpg) |
| `06_gothic_arch.jpg`       | [The_Gothic_Arch_LACMA_46.27.14.jpg](https://commons.wikimedia.org/wiki/File:The_Gothic_Arch_LACMA_46.27.14.jpg) |
| `07_pier_with_chains.jpg`  | [The_Pier_with_Chains_LACMA_46.27.16.jpg](https://commons.wikimedia.org/wiki/File:The_Pier_with_Chains_LACMA_46.27.16.jpg) |
| `08_lion_bas_reliefs.jpg`  | [The_Lion_Bas-Reliefs_LACMA_46.27.5.jpg](https://commons.wikimedia.org/wiki/File:The_Lion_Bas-Reliefs_LACMA_46.27.5.jpg) |

Originals (~2–4 MB each at full resolution) were resized to 1600px on the long edge with `imagemagick` for fast loading. Smaller 600px thumbnails for the matching puzzle live in `assets/thumbs/`. No images from the Microsoft Sway version of any related teaching deck were used.

## Licenses

- **Site code** (HTML, CSS, JS): [MIT License](LICENSE).
- **Original site copy, design, and puzzle text**: [CC BY 4.0](LICENSE-CONTENT.md). Please credit *CrimRxiv Consortium · Escape the Carceri* and link to this repository when reusing.
- **Piranesi etchings**: public domain. No additional rights claimed.

## Project layout

```
prison-escape/
├── index.html          # All page sections (intro, game, certificate, about, footer)
├── styles.css          # Mono + #f68212 design system, light/dark, print
├── game.js             # All game logic, no dependencies
├── assets/             # Resized Piranesi plates (public domain)
│   └── thumbs/         # Smaller versions for the matching puzzle
├── LICENSE             # MIT (code)
├── LICENSE-CONTENT.md  # CC BY 4.0 (original copy/design)
├── .nojekyll           # Tells GitHub Pages not to run Jekyll
└── README.md
```

## Run locally

It's static. Either open `index.html` directly, or run any static server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080/
```

## Deployment (GitHub Pages)

This repo is served from the `main` branch root. To re-enable or migrate:

1. Push to `main`.
2. Repo *Settings → Pages → Build and deployment*: Source = *Deploy from a branch*; Branch = `main` / `(root)`.
3. Wait ~1 minute. The site will appear at `https://<owner>.github.io/prison-escape/`.

The empty `.nojekyll` file is included so any future folders beginning with `_` are still served.

## Accuracy & caveats

- Plate titles like *The Round Tower*, *The Smoking Fire*, *The Giant Wheel*, *The Man on the Rack*, *The Gothic Arch*, and *The Pier with Chains* are **curatorial** titles applied long after Piranesi; he did not title individual plates. The game says so in spirit by anchoring puzzles to what is visibly there, not to invented narrative.
- The series was first issued around 1750 (14 plates, untitled and unnumbered) and reissued in 1761 with reworked plates and two additional images, totaling 16. The reissued 1761 set is the source for all images here.
- We avoid claims about Piranesi's biography or interpretive scholarship that would require a specific citation. Any such claim in the puzzle text is intentionally broad.

## Contributing

This is a small, focused educational artifact. If you spot a factual issue with a plate description, a broken image link, or an accessibility regression, please open an issue.

## Credits

- Etchings: Giovanni Battista Piranesi (1720–1778).
- Scans: Los Angeles County Museum of Art (LACMA), William Randolph Hearst Collection.
- Hosting source: Wikimedia Commons.
- Built and provided by the **CrimRxiv Consortium** — criminology's global open-access hub.

[CrimRxiv](https://www.crimrxiv.com/) · [Submit your work](https://www.crimrxiv.com/submit) · [Consortium](https://www.crimrxiv.com/consortium)
