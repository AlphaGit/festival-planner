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
  conflicting screening pair), minimizes weighted drop cost (must = 1000,
  want = 1), then enumerates distinct optimal drop-sets by `forbid`-ing each and
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
scrape_tiff.py` to regenerate `catalog.json` from the TIFF site.

## Conventions

- Dependencies: before adding/pinning any, confirm the version was published ≥7
  days ago (supply-chain hygiene).
- No build step for the browser app; no framework in tests. Keep it that way.
- Non-trivial solver/parse changes leave one runnable check behind: extend
  `test_solver.js` (run `node test_solver.js` — plain assert, no framework) and
  the in-browser `TiffSolver._selfTest()` smoke check.
- All development happens on `main` — no feature branches. Commit and push
  straight to `main`. Remote: `git@github.com:AlphaGit/festival-planner.git`.
