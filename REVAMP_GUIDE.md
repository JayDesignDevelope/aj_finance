# FinGarage Revamp — Builder Contract

You are building ONE part of the **FinGarage** website revamp — a front-end-only
("Duolingo for Money") financial-literacy platform for Indian **students, parents and
schools**. Pure HTML/CSS/vanilla-JS. **No frameworks, no build step, no new dependencies,
no network calls** except the Google Fonts link.

Repo working dir: `/Users/jayavinay.namgiri/CascadeProjects/Site/aj_finance`

## Shared foundation — DO NOT MODIFY THESE FILES
- `styles.css` — legacy brand styles (root)
- `fg-platform.css` — the design system you MUST use (root)
- `fg-app.js` — data layer + renders the global navbar & footer + helpers (root)

All **new pages live in `/pages/`**. The **homepage is `/index.html` in the repo root.**

## Page skeleton (every page in `pages/` MUST follow this)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAGE TITLE | FinGarage</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../fg-platform.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text x='2' y='26' font-size='28' font-weight='800' fill='%2300d09c'>F</text></svg>">
</head>
<body class="fg-page">
  <main id="fg-main">
    <!-- YOUR PAGE CONTENT -->
  </main>
  <script src="../fg-app.js"></script>
  <script>
    FG.mountChrome('ACTIVE_NAV_ID');   // ids below; '' if none
    // page-specific JS here
  </script>
</body>
</html>
```
- The homepage (`/index.html`, repo ROOT) uses the SAME skeleton but with **no `../` prefix**: `href="styles.css"`, `href="fg-platform.css"`, `src="fg-app.js"`, and sub-page links go to `pages/xxx.html`.
- **Do NOT add your own `<nav>` or `<footer>`** — `FG.mountChrome()` injects the global navbar + footer.
- **Do NOT reference** `script.js`, `product-pages.js`, or `product-pages.css`.

**Nav ids** (pass the one matching this page): `home, learn, games, invest, parents, schools, startup, markets, dashboard`.

## Design system (classes in `fg-platform.css` — use these, don't reinvent)
- Layout: `.fg-wrap` (container), `.fg-section` / `.fg-section-sm`, `.fg-center`, `.fg-grid` + `.fg-grid-2/-3/-4`, `.fg-mt`, `.fg-mt-lg`.
- Type: `.fg-eyebrow`, `.fg-h1`, `.fg-h2`, `.fg-h3`, `.fg-lead`, `.fg-grad-text`.
- Buttons: `.fg-btn` + `.fg-btn-primary` / `.fg-btn-dark` / `.fg-btn-ghost` / `.fg-btn-lg` / `.fg-btn-block`.
- Cards: `.fg-card`, `.fg-card-hover`.
- Gamified: `.fg-progress` (inner `<span style="width:NN%">`), `.fg-stat` (`.fg-stat-label/-value/-sub`, `.fg-up/.fg-down`), `.fg-ring` (money-score ring), `.fg-level` (set `--lvl` color via style; `.fg-level-badge/-grade`), `.fg-badge` (+ `.locked`; `.fg-badge-icon/-name/-desc`), `.fg-board` (`.fg-board-row` + `.me`; `.fg-board-rank` + `.top`, `-av`, `-name`, `-score`), `.fg-journey` (`.fg-journey-step/-ico`), `.fg-aud` (+ `.fg-aud-students/-parents/-schools`; `.fg-aud-ico`), `.fg-hero` (`.fg-hero-grid/-btns`), `.fg-tabs`/`.fg-tab`, `.fg-chip`/`.fg-chip-list`, `.fg-cta-band`, `.fg-reveal` (animates in on scroll — add to sections), `.fg-toast`.
- Brand tokens (CSS vars): `--fg-green #00d09c`, `--fg-green-d #00b386`, `--fg-indigo #5367ff`, `--fg-amber #f5a623`, `--fg-coral #eb5b3c`, `--fg-purple #9b51e0`, `--fg-sky #0ea5e9`, `--fg-ink #14142b`, `--fg-muted #5b5b78`, `--fg-bg #f7f9fc`, `--fg-line #e8eaf1`, `--fg-radius 18px`. Font: **Plus Jakarta Sans**.
- You MAY add a small `<style>` block in `<head>` for page-specific styling, but prefer system classes + tokens.

## Data / logic API (`window.FG`, client-side, localStorage-backed)
- `FG.LEVELS` — 5 objects `{id, name, grade, color, tagline, topics:[...]}`
- `FG.BADGES` — `[{id, icon, name, desc}]`
- `FG.ASSETS` — `[{id, name, type, risk, base:100, drift, vol, color}]`
- `FG.GAMES` — 11 games `[{id, name, sub, icon, tag:'Classic'|'New', color}]`
- `FG.auth.login(role, name)` / `.logout()` / `.isLoggedIn()` / `.role()`  — roles `'student'|'parent'|'school'`
- `FG.learning.level()` / `.levelObj()` / `.levelPctFor(levelId)` / `.completeTopic(levelId)` / `.award(badgeId)`
- `FG.portfolio.totalValue()` / `.holdingValue()` / `.returnsPct()` / `.buy(assetId, rupees)` / `.sell(assetId, rupees)`
- `FG.priceOf(assetObj)`, `FG.assetById(id)`
- `FG.fmtINR(n)` → `"₹1,23,456"`, `FG.fmtShortINR(n)` → `"₹1.23 L"`, `FG.pct(n)`, `FG.clamp(v,a,b)`
- `FG.badgeById(id)`, `FG.toast(msg)`, `FG.save()`, `FG.reset()`
- `FG.state` — live state:
  `{ user:{loggedIn, role, name, grade, avatar, childName},
     learning:{level, xp, moneyScore(0–1000), streak, levelProgress:{1..5 → topicsDone}, quizzes:{taken, correct}, badges:[ids]},
     portfolio:{startValue:100000, cash, holdings:[{assetId, units, avgPrice}], sip:{active, amount, approvedByParent, months}} }`
  Mutate it then call `FG.save()`.

## Tone & rules
- Friendly, playful, encouraging, **gamified** (levels, XP, streaks, badges, leaderboards).
- Indian context: ₹, Indian student/parent names, SIP, Nifty 50, Sensex, UPI, CIBIL.
- All money/investing shown is **VIRTUAL / educational** — add a subtle note: *"Virtual money for learning — not investment advice."*
- Any real-investment journey requires **parent approval** (compliance).
- Production-grade, responsive, accessible (alt text, button labels), **no console errors**.
- Charts via `<canvas>` 2D or inline SVG — no chart libraries.
- Make interactive things genuinely work (buttons, calculators, simulations) using the FG API.

## Icons — use professional SVG icons, NEVER emoji
`FG.icon(name, opts)` returns an inline `<svg>` string. `opts`: `{size:24, stroke:2, cls:''}`. It uses
`currentColor`, so the icon takes the text color of its container. Insert via innerHTML / template strings.
- For data already carrying an icon name, render it: `FG.icon(g.icon, {size:28})` (FG.GAMES[].icon and
  FG.BADGES[].icon are now icon NAMES, not emoji).
- Replace every emoji pictograph in markup with `FG.icon('<name>')`. Keep plain typographic arrows `→`
  in button text as-is; replace `✓`/`✔` bullets with `FG.icon('check',{size:16})`.

Available icon names: `user, users, flame, target, rocket, trending-up, trending-down, bar-chart,
line-chart, chart-pie, coins, coin, wallet, piggy, receipt, shield, shield-check, scale, puzzle, sprout,
plant, trophy, medal, star, check, check-circle, book, cap, gamepad, briefcase, bulb, gift, sparkles,
building, bank, compass, map, brain, calendar, hourglass, pause, play, refresh, x, x-circle, thumbs-up,
thumbs-down, flag, credit-card, megaphone, mail, heart, gem, zap, pin, hand, code, palette, flask,
lock-open, activity, arrow-right, route, plus, handshake` (unknown name → falls back to a dot).

Emoji → name quick map: 🌱sprout 🔥flame 🎯target 🐷piggy 📈trending-up 📉trending-down 🧩puzzle 🪴plant
🚀rocket 💰coins 🪙coin 🧾receipt 📊bar-chart ✨🎉sparkles 🛡️shield ⚖️scale 🎓🧑‍🎓cap 🙂👧👨👩🧑user (groups→users)
🎮gamepad 🏆trophy 🏅🥇medal ⭐star 💼briefcase 💡bulb 💵💸wallet 📚📖book 🏫building 💎gem 💚❤️heart 🤝handshake
🛤route ➕plus 🏦bank 🧭compass 🗺map 🧠brain 🧪🔬flask 🗓calendar ⏳hourglass ⏸pause ❌x 👍thumbs-up 👎thumbs-down
🚩flag 💳credit-card 📣megaphone 📩mail 🦄rocket 💪trophy 💹trending-up 🎢activity 👋hand 📍pin ⚡zap 🎨palette
💻code 🔓lock-open ↺refresh. When a colored container expects a white icon, the icon inherits the container's color automatically.

After creating/editing your file(s), open them to confirm the HTML is well-formed and inline `<script>` is valid JS, and that no emoji pictographs remain. Return a one-line summary.
