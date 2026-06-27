# 🎬 Festival Planner

Plan which films to see at a festival when screenings clash.

You tag each film **must-watch**, **want-to-watch**, or **skip**. The planner
finds conflict-free schedules that keep every must-watch and as many
want-to-watch films as possible, then walks you through the remaining choices
until you're left with one schedule to follow.

**Live:** https://planner.alphasmanifesto.com (currently loaded with TIFF 2025).

## How it works

1. **Tag the catalog** — mark each film must / want / skip. Choices are saved in
   your browser (`localStorage`), per festival.
2. **Create schedule** — the solver searches every screening time for conflicts
   and computes the optimal set of films to keep.
3. **Decide** — a wizard asks you only the questions that matter: each one is the
   earliest time slot where the remaining options disagree. Every answer narrows
   the schedule.
4. **Done** — you end with a single conflict-free timeline.

The app runs entirely in your browser. No accounts, no server, nothing leaves
your device. It's also a PWA — installable and works offline.

## Running it

Static client-side app, no build step. Serve over HTTP (the catalog is
`fetch`ed, which `file://` blocks):

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Files: `index.html` (views + CSS), `app.js` (catalog loading, tagging, wizard,
timeline), `solver.js` (the scheduling model), `logic-solver.bundle.js`
(vendored SAT solver), `catalog.json` (the festival data).

## Using a different festival

Replace `catalog.json`. The format lists films, each with one or more screenings
(time + venue). No per-film priority in the data — that's what you set by
tagging. `scrape_tiff.py` (pure stdlib: `python3 scrape_tiff.py`) regenerates
`catalog.json` from the TIFF site.

## Tests

```sh
node test_solver.js   # plain assert, no framework, no deps
```

The browser solver also has an in-page self-check: `TiffSolver._selfTest()`.

## Contributing

All work lands on `main` — no feature branches. See
[CLAUDE.md](CLAUDE.md) for design notes, solver semantics, and conventions
before changing anything load-bearing.

---

Built with ♥ by [Alpha](https://github.com/AlphaGit)
