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
- **Plan files (footer Export/Import) are id-keyed, not title-keyed.** The app's
  `localStorage` keys everything by film title (`sel`, `locks`, `scrKey`), but a
  backup file must survive TIFF retitling a film or relabelling a venue, so the
  translation happens at the file boundary: a film is its `source_url` slug, a
  screening is that slug + start ms + `location` id. `schema` (currently 1) gates
  imports and is deliberately *not* tied to the app version — bump it only when
  the file shape changes, and add a migration then. Unknown `tiff:<festival>:*`
  keys are swept in generically, so a new setting is backed up for free; only
  `sel`/`locks`/`soldout`/`picks`/`cost` are special-cased. Import refuses a file
  from another festival and replaces (never merges) after one `confirm`.
- **`branchSig` returns an array, never a joined string.** One real TIFF title
  contains a `|` (`REDEFINED | Short Film Showcase`), so no delimiter is safe.
  Compare signatures with `sameSig`, and keep the array shape in plan files.
- **Solver choice is load-bearing.** A hand-rolled JS search was tried and
  abandoned: it's exact but blows up (30–85s) on a real ~50-film catalog because
  of the large equal-cost plateau when enumerating options. logic-solver does it
  in ~0.2s. Do not "simplify" back to a hand-rolled solver.

## Catalog scraper

`scrape_tiff.py` — pure Python stdlib, no dependencies. Run `python3
scrape_tiff.py` to regenerate `catalog.json` from the TIFF site. Checks:
`python3 test_scrape.py` (covers `diff_catalog.py` too).

`diff_catalog.py` says what changed upstream *before* you rebuild — run it
first; it exits 1 when anything differs. TIFF edits continuously, and most
rounds are a handful of blurb tweaks buried in hundreds of lines of noise from
the proxy, so it normalises that away (see below) instead of you re-deriving it
each time.

**Start with `fetch_blob.mjs`, then work from that file.** It is the whole
routine refresh:

```sh
node fetch_blob.mjs                          # -> festivalfilmlist.json (raw)
python3 diff_catalog.py festivalfilmlist.json   # exits 1 if anything changed
python3 scrape_tiff.py festivalfilmlist.json    # only if it did
```

One download feeds both, so the diff and the rebuild can't disagree, and the
blob is a raw save — blurb markup intact (see below), no proxy in the path.

**The site is behind an AWS WAF.** A plain request to `/festivalfilmlist` gets
HTTP 202 with an empty body (JS challenge). `fetch_blob.mjs` clears it by
driving a real Chrome; `scrape_tiff.py` on its own falls back to `r.jina.ai`,
which renders the page in a browser. If both fail, open the URL yourself, save
the page, and pass the file: `python3 scrape_tiff.py saved.html` — `parse_blob`
handles a saved DOM (inline blurb tags promoted to elements, soft-wrap
newlines) as well as raw JSON.

**Don't attach to the Chrome you browse with.** `fetch_blob.mjs` launches its
own Chrome on a scratch profile (`$TMPDIR/tiff-scrape-chrome`, kept between
runs for its WAF cookie) and quits it afterwards. Chrome only serves the CDP
HTTP endpoints (`/json/version`, `/json/new`) to an instance started with
`--remote-debugging-port`; a live session that enabled debugging from
`chrome://inspect` 404s them all, and every WebSocket connection to it raises
an *"Allow remote debugging?"* dialog that grants full access to your cookies
and saved data. That dialog also renders outside the accessibility tree, so a
UI agent cannot reliably click it, and unanswered prompts stack up invisibly
while each connection hangs. The scratch profile has none of those problems.
Override the binary with `CHROME=<path>` and the port with `TIFF_CDP_PORT`.

**Anything browser-rendered loses blurb emphasis.** TIFF serves the blob as
`text/html` and writes closing tags as `<\/em>` (JSON escapes the slash). An HTML
parser keeps that as text but treats `<em>` as a real tag, so it becomes an
element and disappears — the proxy and a saved page both return orphan closers.
Schedule data is unaffected; only `<em>`/`<strong>` are lost, and once a whole
catalog shipped without italics because of it. `markup_intact()` detects the
orphans and the run prints how to fix it. `fetch_blob.mjs` avoids the whole
problem: it re-fetches the URL from *inside* a tab that already cleared the WAF,
so what lands on disk is the bytes TIFF sent, not a DOM someone re-serialised.
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
- All development happens on `main` — no feature branches, no PRs. Commit and
  push straight to `main`. Remote: `git@github.com:AlphaGit/festival-planner.git`.
  A session started in a worktree lands on a branch anyway (Orca names it after
  the task). That branch is scaffolding, not a feature branch: commit on it, then
  push it to `main` from the worktree with `git push origin HEAD:main` — never
  `cd` to the primary checkout and never open a PR. It's a fast-forward as long
  as nobody else moved `main`; if it isn't, rebase onto `origin/main` first. The
  primary checkout's local `main` stays behind until it next pulls — say so
  rather than trying to move a branch that's checked out elsewhere.
- Service worker cache: every requested change must bump `CACHE` in `sw.js`
  using semantic versioning (`planner-vMAJOR.MINOR.PATCH`) — patch for fixes,
  minor for features, major for breaking changes. Bumping purges old caches so
  clients pick up the new assets.
