# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for **Kc.coiffure**, a French at-home hair salon. No build system, no dependencies, no package manager — pure vanilla HTML/CSS/JS.

## Previewing the Site

Open `index.html` in a browser directly, or serve locally to avoid HEIC/CORS quirks:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

Three files make up the entire site:

- **`index.html`** — Single-page layout with four anchor sections: `#accueil` (hero), `#galerie` (gallery), `#tarifs` (pricing cards), `#contact` (email/phone only, no form).
- **`style.css`** — Dark theme: `--color-black` (#111) background, `--color-pink` (#FADADD) accents. Fonts loaded from Google CDN: Playfair Display (headings) + Outfit (body). Responsive breakpoint at 768px via `clip-path` mobile nav.
- **`script.js`** — Contains duplicate code blocks (navbar logic and gallery logic each appear 3× due to successive commits). Only the **last** block of each function runs; earlier duplicates are dead code. The canonical gallery logic is `initGallery` / `showMore` / `renderPhotos`.

### Gallery System

Photos live in `photos/` and are referenced by a **hardcoded array** `localPhotos` in `script.js`. On load, photos are Fisher-Yates shuffled, 3 are shown, and a "Afficher plus" button reveals the rest.

**To add a new photo:** copy the file into `photos/` and append its filename to the `localPhotos` array in `script.js`.

Supported formats in the array: `.JPG` and `.HEIC` (HEIC only displays in Safari; Chrome/Firefox will show a broken image).

## Known Issues

- **`script.js` has triplicate dead code** — the navbar event listeners and gallery setup are copy-pasted three times. The file should be cleaned down to a single copy of each block.
- **HEIC images** (`1000014209.HEIC`, `8777824078707904769.HEIC`) are not supported by Chrome/Firefox. Convert to JPG for cross-browser display.
- The `style.css` contains `.upload-box`, `.booking-form`, and `.hidden-input` styles that reference UI elements no longer present in `index.html` (removed in a prior refactor).