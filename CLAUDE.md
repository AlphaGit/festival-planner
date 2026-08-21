# CLAUDE.md

Guidance for AI agents contributing to this project.

## What this is

A festival screening planner. Given a catalog of films (each with several
screening times/venues), it finds conflict-free schedules that keep every
"must-watch" and as many "want-to-watch" films as possible, and presents the
trade-offs so a human can choose between equally-optimal options.

It's a **static browser app** — runs entirely client-side, no server, no build
step. This is the whole product. A small helper, `scrape_tiff.py` (pure Python
stdlib), regenerates `catalog.json` from the TIFF site; it is the only Python
left in the repo and shares no code with the app.

## Browser app

Files (load order matters in `index.html`):

- `logic-solver.bundle.js` — vendored MiniSat (logic-solver 2.0.1), bundled to a
  single IIFE global `LogicSolver`. **Do not edit by hand.** Rebuild from npm
  with esbuild if it ever needs updating. MIT-licensed.
- `solver.js` — exposes `TiffSolver.solve(movies, buf, sameBuf, maxPlans,
  prioritizeFirst) -> { cost, plans }`. Builds a boolean model (one var per
  screening + a drop var per film; `exactlyOne` per film; `atMostOne` per
  conflicting screening pair), minimizes weighted drop cost (locked = 1e6,
  must = 1000, want = 1 — a `locked` film is a held ticket, so it outranks any
  must), then enumerates distinct optimal drop-sets by `forbid`-ing each and
  re-solving. When `prioritizeFirst` is set (default in the UI), a strictly
  subordinate secondary objective biases each kept film toward its earlier
  screenings — minimized *within* each drop-set via `solveAssuming` so it never
  changes which films are kept. Penalty = chronological rank, soft-weighted
  must=3/want=2. `cost` stays drop-cost only.
- `app.js` — everything else: loads `catalog.json`, **View 1** (tag each film
  must/want/skip/no-tickets, persisted to `localStorage`), runs the solver, then
  **View 2** (decision wizard + a timeline that collapses to one schedule as you
  choose). Pure functions: `splitCommon`, `decisionTree`, `explainConflicts`,
  plus the board/wizard renderers.
- `index.html` — the two views, all CSS.
- `catalog.json` — the festival catalog. Edit `festival` / `movies` for a new
  event, or regenerate with `scrape_tiff.py` (no per-film priority — that's the
  user's job in View 1).

### Run it

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Serve over http — `catalog.json` is fetched, and `file://` blocks `fetch` in
Chrome.

### Key design notes

- Times are parsed as wall-clock UTC (tz-agnostic) so the browser's timezone
  never shifts displayed times. Keep this — don't introduce local-time `Date`.
- `localStorage` is namespaced by `festival` name (`tiff:<festival>:sel` /
  `:picks`). Renaming the festival orphans existing tags (not lost).
- The decision wizard is a chronological tree: each choice is the earliest slot
  where surviving options disagree; choosing narrows the rest (dependent, not
  independent — picking a film's time frees other slots). Leaves = options.
- **Solver choice is load-bearing.** A hand-rolled JS search was tried and
  abandoned: it's exact but blows up (30–85s) on a real ~50-film catalog because
  of the large equal-cost plateau when enumerating options. logic-solver does it
  in ~0.2s. Do not "simplify" back to a hand-rolled solver.

## Catalog scraper

`scrape_tiff.py` — pure Python stdlib, no dependencies. Run `python3
scrape_tiff.py` to regenerate `catalog.json` from the TIFF site. Checks:
`python3 test_scrape.py`.

**The site is behind an AWS WAF.** A plain request to `/festivalfilmlist` gets
HTTP 202 with an empty body (JS challenge). The scraper detects that and retries
through `r.jina.ai`, which renders the page in a real browser. If that proxy ever
fails, open the URL in your own browser, save the page, and pass the file:
`python3 scrape_tiff.py saved.html` — `parse_blob` handles a saved DOM (inline
blurb tags promoted to elements, soft-wrap newlines) as well as raw JSON.

**Anything browser-rendered loses blurb emphasis.** TIFF serves the blob as
`text/html` and writes closing tags as `<\/em>` (JSON escapes the slash). An HTML
parser keeps that as text but treats `<em>` as a real tag, so it becomes an
element and disappears — the proxy and a saved page both return orphan closers.
Schedule data is unaffected; only `<em>`/`<strong>` are lost, and once a whole
catalog shipped without italics because of it. `markup_intact()` detects the
orphans and the run prints how to fix it: open the URL in a browser and save the
raw response with `fetch(location.href).then(r=>r.text())`, then pass that file.
Use a raw save whenever blurbs matter; the proxy is fine for a schedule refresh.

**Screenings appear late.** TIFF publishes the lineup weeks before the schedule;
until the schedule drops, every `scheduleItems` is empty and the scraper exits
non-zero rather than overwriting `catalog.json` with a filmless catalog.

**Audience wording is load-bearing.** Each screening's `audienceType` decides
whether it's public or needs accreditation. TIFF changed the vocabulary mid-cycle
— `"General Public"` became `"Public"`, and the industry side split into
`"Press & Market"` / `"Market"` / `"Buyer"` when TIFF: The Market launched. The
old substring test (`"General Public" in aud`) then quietly reclassified all 638
public screenings as press. `AUDIENCE_TIERS` is now an explicit map; anything
unrecognised is treated as accredited (hidden by default, never exposed as
public) and reported at the end of the run. Add new values there, don't loosen
the match.

**The blob includes delegate-only programming.** TIFF: The Market adds ~140
Summit / Market Screening entries with no public screening. They're kept, tagged
with an accredited tier, and both tiers ship in `disabledAccessTiers` — so the
app hides those films and leaves them out of the must/want/skip tally
(`schedulable()` in app.js) until a user says they hold that access.

**Venue addresses.** Each `locations[<id>].address` powers the Google Maps link
in the timeline (View 2). The film list carries no addresses, so the scraper
copies them forward from the existing `catalog.json` by location id — only
genuinely new venues come out blank, and the run prints which ones. Fill those in
by hand (research the address online); they persist through later re-scrapes.

## Conventions

- Dependencies: before adding/pinning any, confirm the version was published ≥7
  days ago (supply-chain hygiene).
- Visual style (colors, typography, component look) follows
  `BRANDING_GUIDELINES.md` — TIFF-inspired black/white/red. Pick colors from
  its palette table; don't introduce new hues.
- No build step for the browser app; no framework in tests. Keep it that way.
- Non-trivial changes leave a runnable check behind (plain assert, no framework):
  `node test_solver.js` (scheduling), `node test_app.js` (app.js behaviour) and
  `python3 test_scrape.py` (catalog scraper).
  The latter evals the un-modularised app headlessly behind a tiny DOM shim — its
  cases live in `test_app.cases.js`. Both share `test_harness.js` (check/assert/
  eq/report). Keep the in-browser `TiffSolver._selfTest()` smoke check too.
- All development happens on `main` — no feature branches. Commit and push
  straight to `main`. Remote: `git@github.com:AlphaGit/festival-planner.git`.
- Service worker cache: every requested change must bump `CACHE` in `sw.js`
  using semantic versioning (`planner-vMAJOR.MINOR.PATCH`) — patch for fixes,
  minor for features, major for breaking changes. Bumping purges old caches so
  clients pick up the new assets.
