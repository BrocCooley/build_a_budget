# Food Insecurity in the U.S.: project website

Static site (HTML/CSS/JS, no build step) for a multimodal argument on food insecurity. Created by Ryan Cooley.

| Page | Folder |
|---|---|
| Home | `index.html` |
| Map | `map/` (data in `data/states.json`, shapes in `data/us-states.json`) |
| Game page | `game/` (embeds the game and shows a QR code) |
| The game itself (unchanged) | `game/play/index.html` |
| What Now | `what-now/` |
| Works Cited | `works-cited/` (entries in `assets/works-cited.js`) |

## Preview it on your computer

```
node serve.js
```

Then open <http://localhost:8080>. (The map loads JSON files, so it needs this local server. Double-clicking the HTML file won't work.)

## Write your words: `content.js`

Every argument on the site comes from **`content.js`**. Entries that start with `TODO:` show as yellow **YOUR WORDS** boxes with a guiding question. Replace the whole text, including `TODO:`, with your writing, and it shows as normal text.

- Keep the quotes and the comma: `home_thesis: "Your sentence here.",`
- New paragraph: `\n\n`. Bold: `**text**`. Italics: `*text*`. Typing a `"` inside your text: `\"`
- Entries: `site_title`, `home_hook`, `home_thesis`, `map_takeaway`, `game_reflection`, `solutions`
- Extra Works Cited entries: add MLA strings to `works_cited_extra`. They're sorted in automatically.

## QR code URL

The QR code on the Game page points to `GAME_PUBLIC_URL` in **`site-config.js`**. After deploying, set it to:

```
https://<your-username>.github.io/<repo-name>/game/play/
```

It's currently set to `https://broccooley.github.io/build_a_budget/game/play/`.

## Deploy to GitHub Pages

This site lives on the `website` branch of `BrocCooley/build_a_budget`. Claude can publish it for you (merge `website` into `main` and push). To do it yourself:

1. On GitHub, open the repository → **Pull requests → New pull request**, base `main` ← compare `website` → **Create pull request → Merge**.
2. **Settings → Pages** should already show *Deploy from a branch*, `main`, `/ (root)`.
3. Wait 1–2 minutes. The site will be at `https://broccooley.github.io/build_a_budget/`.

⚠️ Publishing moves the game from the root link to `/game/play/`. Any QR code printed for the old root link will open the website home page instead, which still has a Game link.

## Data

- **State map:** USDA ERS, *Household Food Security in the United States in 2024* (ERR-358, Dec. 30, 2025), state table "Prevalence of household food insecurity and very low food security by State, average 2022–2024", downloaded from the ERS Key Statistics & Graphics page (`mapdata.xlsx`). Values rounded to one decimal. The U.S. comparison uses the 2022–2024 U.S. average (13.3%), not the single-year 2024 figure (13.7%).
- **Home statistic:** 13.7% in 2024 and 14.0% in 2014, from the ERS trends data on the same page.
- **Map shapes:** U.S. Census Bureau cartographic boundaries (2017) via `us-atlas` 3.0.1 (ISC license).
- **QR library:** `vendor/qrcode.js`, qrcode-generator 1.4.4 by Kazuhiko Arase (MIT license).

## Game test

`node tools/test-paths.js` plays all 48 game paths and checks the math.
