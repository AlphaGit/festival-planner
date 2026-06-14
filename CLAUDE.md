# CLAUDE.md

Guidance for AI agents contributing to this project.

## What this is

A festival screening planner. Given a catalog of films (each with several
screening times/venues), it finds conflict-free schedules that keep every
"must-watch" and as many "want-to-watch" films as possible, and presents the
trade-offs so a human can choose between equally-optimal options.

It exists in two independent forms:

1. **Static browser app** (the primary product) — runs entirely client-side,
   no server, no build step. This is what users interact with.
2. **Python CLI** (`tiff_solver.py`) — the original/reference implementation.
   Same algorithm, renders a standalone HTML report. Kept for batch use and as
   the spec the browser app was ported from.

The two share no code. Keep them behaviourally consistent if you touch the
solver semantics (drop cost, buffers, option enumeration).

## Browser app

Files (load order matters in `index.html`):

- `logic-solver.bundle.js` — vendored MiniSat (logic-solver 2.0.1), bundled to a
  single IIFE global `LogicSolver`. **Do not edit by hand.** Rebuild from npm
  with esbuild if it ever needs updating. MIT-licensed.
- `solver.js` — exposes `TiffSolver.solve(movies, buf, sameBuf, maxPlans) ->
  { cost, plans }`. Builds a boolean model (one var per screening + a drop var
  per film; `exactlyOne` per film; `atMostOne` per conflicting screening pair),
  minimizes weighted drop cost (must = 1000, want = 1), then enumerates distinct
  optimal drop-sets by `forbid`-ing each and re-solving.
- `app.js` — everything else: loads `catalog.json`, **View 1** (tag each film
  must/want/skip/no-tickets, persisted to `localStorage`), runs the solver, then
  **View 2** (decision wizard + a timeline that collapses to one schedule as you
  choose). Pure functions ported from the Python: `splitCommon`, `decisionTree`,
  `explainConflicts`, plus the board/wizard renderers.
- `index.html` — the two views, all CSS.
- `catalog.json` — the festival catalog. Edit `festival` / `movies` for a new
  event. Format mirrors the YAML the Python CLI reads (no per-film priority —
  that's the user's job in View 1).

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

## Python CLI

```sh
uv sync
uv run python tiff_solver.py schedule.yaml --html plan.html --json plan.json
uv run python test_tiff_solver.py      # assert-based tests, no framework
```

Uses OR-Tools CP-SAT (hard dependency, declared in `pyproject.toml`). Exit
codes: 0 = all fit, 2 = some dropped, 1 = input error.

## Conventions

- Dependencies: before adding/pinning any, confirm the version was published ≥7
  days ago (supply-chain hygiene).
- No build step for the browser app; no framework in tests. Keep it that way.
- Non-trivial solver/parse changes leave one runnable check behind
  (`TiffSolver._selfTest()` in the browser; `test_tiff_solver.py` for Python).
