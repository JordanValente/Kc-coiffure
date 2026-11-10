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

Three files make up the entire site (design « Noir poudré », Nov 2026):

- **`index.html`** — Single page: `#accueil` (hero), `#prestations` (price cards), `#galerie` (filterable gallery), `#deroulement` (3 steps), `#contact` (phone/email only, no form), footer, and a fixed mobile action bar (Appeler / Email).
- **`style.css`** — Light ivory theme: `--ivory` #FBF7F5 background, `--ink` #171313, `--accent` #8E4A55, `--pink` #E9C6C9. Fonts from Google: Bodoni Moda (headings) + Manrope (body). Responsive breakpoint at 860px (burger menu + mobile bar).
- **`script.js`** — Mobile menu toggle and gallery logic (`photos` array, category filters, « Voir plus » by 8).

### Gallery System

Photos live in `photos/` and are listed in the `photos` array in `script.js` as `{ file, cat, alt }`, `cat` being `couleur`, `coiffage` or `coupe`.

**To add a new photo:** copy the file into `photos/` and add an entry to the `photos` array in `script.js`. Use JPG/PNG: HEIC only displays in Safari (the original HEIC files are kept, their JPG conversions are the ones referenced).

## Business facts shown on the site

- At-home only, by appointment: Tuesday morning, Wednesday, Friday, Saturday.
- Zone: Cazilhac (34) and up to 50 km around.
- Phone 06 13 19 58 04 · kc.coiffureadomicile@gmail.com

## Backup of the previous site

The previous dark pink/black design is preserved on the git branch `sauvegarde-ancien-site`. To restore it: `git checkout sauvegarde-ancien-site -- index.html style.css script.js`.
