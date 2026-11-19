# Build a Budget

An interactive budgeting game for a multimodal argument on food insecurity. You play a single parent of a 4-year-old who works full time as a cashier in Fargo, ND or Minneapolis, MN. You make "responsible" choices and still see what's left for food.

Everything lives in **`index.html`**. It's a single file with no external dependencies.

| File | What it is |
|---|---|
| `index.html` | The whole game. All numbers are in the `CONFIG` object at the top of the `<script>`, with a source comment on each value. All player-facing text is in the `TEXT` object right below it. |
| `test-paths.js` | Plays all 48 paths (2 cities × 2 housing × 2 child care × 2 transport × 3 surprise) and prints each path's final balance. It also checks that each "Replay earning $Z/hr" wage really closes the gap. Run it with `node test-paths.js`. |

Live game: <https://broccooley.github.io/build_a_budget/>

---

## 0. Edit mode: change words and leave notes for Claude

Open the game with `?edit` at the end of the address:
<https://broccooley.github.io/build_a_budget/?edit>

A dark bar appears at the bottom. Players who scan the QR code never see it.

- **Click any words** to edit them right where they are. Press **Enter** (or **Save**) to keep the change. Changed text is highlighted yellow.
  - Gray 🔒 boxes inside a sentence are numbers from the data (like a dollar amount). They stay locked. You can change the words around them.
  - **Statistics are locked.** Numbers, the 13.7% and 63% facts, and other data can't be edited here. If something looks wrong, use Ask Claude.
  - Put `**double stars**` around words to make them bold.
- **Edit words** switch: turn it off to play the game normally, and back on to edit.
- **Screen** menu: jump straight to any screen.
- **Ask Claude**: highlight anything in the game, tap **Ask Claude about this** (or the Ask Claude button), and type what you want changed. You can also ask about the whole screen without highlighting.
- **Notes**: see your notes and text changes. Delete or undo any of them.
- **Send to Claude**: copies all your notes and text changes. Paste them into your chat with Claude. Claude makes the changes, checks them, and publishes the update for you.

Your edits are saved in that browser until Claude publishes them, so they show up only for you until then.

## Publishing

Claude publishes updates directly to the `BrocCooley/build_a_budget` repository with git. No manual uploading is needed. The live site updates 1–2 minutes after each push.

If you change numbers, run `node test-paths.js` afterward to see how every path changes.

---

## 1. Host it free on GitHub Pages

1. Create a free account at <https://github.com> if you don't have one.
2. Click **+ → New repository**. Name it something like `food-budget-game`, set it to **Public**, and click **Create repository**.
3. On the new repo page, click **uploading an existing file**. Drag in `index.html` (plus `README.md` if you like) and click **Commit changes**.
4. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, **Branch** to `main` and folder to `/ (root)`, then click **Save**.
5. Wait about a minute and refresh the Pages settings. Your URL appears at the top:
   `https://YOUR-USERNAME.github.io/food-budget-game/`

Updates replace the old version at the same URL, so your QR code keeps working.

## 2. Make a QR code

Use the GitHub Pages URL from step 1.

- **Easiest:** In Chrome or Edge, open the URL, click the address bar, and choose the **QR code** icon (or *Share → Create QR code*). Then download the PNG.
- **Any QR generator** works too. Use a *static* QR code (the URL is encoded directly), not a "dynamic" one. Dynamic codes route through the generator's server and often expire after a free trial.

Tips for posters and slides:
- Print it at least **2 cm / 1 in** wide, with a white margin around it.
- Scan it with your own phone from a few feet away before printing.
- Put a short label under it, like "Scan to play (2 min)".

## 3. Embed it in another site (iframe)

Paste this wherever your site builder accepts HTML (an "Embed", "Custom HTML", or "Code" block):

```html
<iframe
  src="https://YOUR-USERNAME.github.io/food-budget-game/"
  title="Build a Budget: a game about food insecurity"
  style="width:100%; max-width:520px; height:760px; border:0; border-radius:16px; display:block; margin:0 auto;"
  loading="lazy">
</iframe>
```

- The game centers itself and stays at most 480 px wide, so it looks the same on desktop as on a phone.
- If the bottom gets cut off, increase `height` (for example, to `820px`). Content longer than the frame scrolls inside it.
- **Google Sites:** Insert → Embed → *By URL*, paste the Pages link, then drag the box to about 760 px tall.
- **Wix / Squarespace / WordPress:** use their "Embed code" or "Custom HTML" block with the snippet above.

## Notes on the numbers

- Take-home pay = gross minus 7.65% payroll tax. Annual tax credits (EITC, child tax credits) are paid once a year at tax time and aren't included in monthly cash flow.
- Car, bus, basics, Minneapolis home-based child care, the convenience-store markup, and the credit-card terms are **estimates**. They're labeled that way in the game's Sources list.
- SNAP is estimated with the federal FY2027 formula (`snapBenefit()` in `index.html`; values in `CONFIG.snap`). It's added at the groceries step and can only go toward food, not rent or bills. The 200%-of-poverty income limit is confirmed for North Dakota; check Minnesota's before the final version.
- The USDA food figure (~$500/mo for a parent and a 4-year-old) should be checked against the current USDA *Cost of Food* report before the final version.
