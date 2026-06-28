// Behaviour tests for app.js — NOT runnable standalone. test_app.js evals this in
// the same scope as app.js, so it sees app.js's functions and can set its module
// globals (CATALOG, MOVIES, GRID, UNAVAIL, TREE, OPT, BUF, SAMEBUF, ...) directly.
// Plain assert, no framework, matching test_solver.js. Tests target behaviour /
// the app's promises, not rendered HTML.

// require works here: test_app.js evals this in its module scope, so `require`
// (and __dirname) are in lexical scope and resolve relative to the repo root.
const { check, assert, eq, eqJSON, report } = require("./test_harness.js");
const T = (h, min) => Date.UTC(2025, 8, 10, h, min || 0);          // a fixed festival day
const reset = (festival) => { localStorage.clear(); VENUEPREF = new Set(); CATALOG = { festival: festival || "Test Fest", movies: [] }; };

// =============================================================================
// 1. Date parsing & formatting — wall-clock UTC, timezone-agnostic (CLAUDE.md)
// =============================================================================

check("parseDT handles space / T separators, seconds, and date-only", () => {
  eq(parseDT("2025-09-07 13:00"), Date.UTC(2025, 8, 7, 13, 0));
  eq(parseDT("2025-09-07T13:00"), Date.UTC(2025, 8, 7, 13, 0));
  eq(parseDT("2025-09-07 13:00:45"), Date.UTC(2025, 8, 7, 13, 0, 45));
  eq(parseDT("2025-09-07"), Date.UTC(2025, 8, 7, 0, 0));
});

check("parseDT throws on unparseable input", () => {
  let threw = false; try { parseDT("not-a-date"); } catch { threw = true; }
  assert(threw, "should throw on garbage");
});

check("time formatters use UTC, not local time (runner forces a non-UTC TZ)", () => {
  // If anyone swaps getUTCHours -> getHours these flip under America/Los_Angeles.
  eq(hm(Date.UTC(2025, 0, 1, 13, 5)), "13:05");
  eq(hm(Date.UTC(2025, 0, 1, 0, 30)), "00:30");
  assert(whenLabel(Date.UTC(2025, 8, 7, 13, 0)).includes("13:00"), "whenLabel uses the UTC hour");
});

// =============================================================================
// 2. Tagging (effStatus + solve gating)
// =============================================================================

check("effStatus defaults to skip and folds legacy 'unavailable' into skip", () => {
  eq(effStatus({}, "X"), "skip");
  eq(effStatus({ X: "unavailable" }, "X"), "skip");
  eq(effStatus({ X: "must" }, "X"), "must");
  eq(effStatus({ X: "want" }, "X"), "want");
  eq(effStatus({ X: "skip" }, "X"), "skip");
});

check("solve is offered only when at least one film is must/want", () => {
  const tally = (sel, movies) => movies.reduce((c, m) => (c[effStatus(sel, m.title)]++, c), { must: 0, want: 0, skip: 0 });
  const movies = [{ title: "A" }, { title: "B" }];
  assert(tally({}, movies).must + tally({}, movies).want === 0, "all-skip -> nothing to solve");
  const c = tally({ A: "want" }, movies);
  assert(c.must + c.want === 1, "one pick -> solvable");
});

// =============================================================================
// 3. Availability windows + grid
// =============================================================================

const H = 3600000, D = 86400000;

check("windowsFromCells: empty 'can't attend' set means no restriction", () => {
  eqJSON(windowsFromCells([0], [9, 10, 11], new Set()), []);
});

check("windowsFromCells: a blocked hour splits the free window in two", () => {
  eqJSON(windowsFromCells([0], [9, 10, 11, 12], new Set(["0|11"])), [[9 * H, 11 * H], [12 * H, 13 * H]]);
});

check("windowsFromCells: leading/trailing blocked hours are trimmed", () => {
  eqJSON(windowsFromCells([0], [9, 10, 11, 12], new Set(["0|9"])), [[10 * H, 13 * H]]);
  eqJSON(windowsFromCells([0], [9, 10, 11, 12], new Set(["0|12"])), [[9 * H, 12 * H]]);
});

check("windowsFromCells: each day computed independently", () => {
  eqJSON(windowsFromCells([0, D], [9, 10, 11], new Set([D + "|10"])),
    [[9 * H, 12 * H], [D + 9 * H, D + 10 * H], [D + 11 * H, D + 12 * H]]);
});

check("computeGrid derives day columns and the hour span from screenings", () => {
  CATALOG = { festival: "G", movies: [
    { title: "A", runtime_minutes: 90, screenings: [{ start: "2025-09-07 18:30", venue: "X" }] }, // 18:30–20:00
    { title: "B", runtime_minutes: 60, screenings: [{ start: "2025-09-08 09:00", venue: "Y" }] }, // 09:00–10:00
  ] };
  const g = computeGrid();
  eq(g.days.length, 2, "two distinct days");
  eq(g.hours[0], 9, "earliest hour block");
  eq(g.hours[g.hours.length - 1], 19, "latest block covers a 20:00 end");
});

check("computeGrid models after-midnight slots as hour blocks >= 24", () => {
  CATALOG = { festival: "G2", movies: [
    { title: "Late", runtime_minutes: 120, screenings: [{ start: "2025-09-07 23:30", venue: "X" }] }, // -> 01:30
  ] };
  assert(computeGrid().hours.some((h) => h >= 24), "late slot pushes blocks past midnight");
});

// =============================================================================
// 4. Screening validation (buildIncluded) — locks / sold-out / availability
// =============================================================================

check("buildIncluded keeps only must/want films and tags their priority", () => {
  reset("BI");
  CATALOG = { festival: "BI", movies: [
    { title: "M", runtime_minutes: 60, screenings: [{ start: "2025-09-07 10:00", venue: "X" }] },
    { title: "W", runtime_minutes: 60, screenings: [{ start: "2025-09-07 12:00", venue: "X" }] },
    { title: "S", runtime_minutes: 60, screenings: [{ start: "2025-09-07 14:00", venue: "X" }] },
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  setSel({ M: "must", W: "want", S: "skip" });
  const inc = buildIncluded();
  eqJSON(inc.map((m) => m.title).sort(), ["M", "W"]);
  eq(inc.find((m) => m.title === "M").priority, "must");
});

check("buildIncluded computes a screening's end from runtime when none is given", () => {
  reset("BI2");
  CATALOG = { festival: "BI2", movies: [{ title: "M", runtime_minutes: 75, screenings: [{ start: "2025-09-07 10:00", venue: "X" }] }] };
  GRID = computeGrid(); UNAVAIL = new Set(); setSel({ M: "want" });
  eq(buildIncluded()[0].valid[0].end - buildIncluded()[0].valid[0].start, 75 * 60000);
});

check("buildIncluded drops a sold-out screening from the valid set", () => {
  reset("BI3");
  CATALOG = { festival: "BI3", movies: [
    { title: "M", runtime_minutes: 60, screenings: [{ start: "2025-09-07 10:00", venue: "X" }, { start: "2025-09-07 14:00", venue: "X" }] },
  ] };
  GRID = computeGrid(); UNAVAIL = new Set(); setSel({ M: "want" });
  setSoldOut(new Set([scrKey("M", parseDT("2025-09-07 10:00"), "X")]));
  const inc = buildIncluded()[0];
  eq(inc.screenings.length, 2, "both still listed");
  eq(inc.valid.length, 1, "sold-out one excluded from valid");
  eq(inc.valid[0].start, parseDT("2025-09-07 14:00"));
});

check("a locked film keeps ONLY its locked screening, forced must, overriding sold-out & availability", () => {
  reset("BI4");
  CATALOG = { festival: "BI4", movies: [
    { title: "M", runtime_minutes: 60, screenings: [{ start: "2025-09-07 10:00", venue: "X" }, { start: "2025-09-07 14:00", venue: "X" }] },
  ] };
  GRID = computeGrid();
  UNAVAIL = new Set(GRID.days.flatMap((d) => GRID.hours.map((h) => d + "|" + h))); // block everything
  setSel({ M: "want" });
  const lockKey = scrKey("M", parseDT("2025-09-07 14:00"), "X");
  setLocks({ M: lockKey });
  setSoldOut(new Set([lockKey])); // even the locked one marked sold-out
  const inc = buildIncluded()[0];
  eq(inc.priority, "must", "locked -> forced must so the solver can't drop it");
  assert(inc.locked, "locked flag set");
  eq(inc.valid.length, 1, "only the locked screening survives");
  eq(inc.valid[0].start, parseDT("2025-09-07 14:00"));
});

check("buildIncluded invalidates screenings outside the availability windows", () => {
  reset("BI5");
  CATALOG = { festival: "BI5", movies: [
    { title: "M", runtime_minutes: 60, screenings: [{ start: "2025-09-07 10:00", venue: "X" }, { start: "2025-09-07 20:00", venue: "X" }] },
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  for (const d of GRID.days) for (const h of GRID.hours) if (h >= 12) UNAVAIL.add(d + "|" + h); // free mornings only
  setSel({ M: "want" });
  const inc = buildIncluded()[0];
  eq(inc.valid.length, 1, "evening screening outside availability");
  eq(inc.valid[0].start, parseDT("2025-09-07 10:00"));
});

check("a locked want is kept end-to-end even when a must-watch wants the same slot", () => {
  // The full promise of "I have tickets — lock this": the held screening survives
  // in every optimal option, and the competing must yields — even though the
  // locked film is only tagged 'want'.
  reset("LOCK");
  CATALOG = { festival: "LOCK", movies: [
    { title: "Ticketed", runtime_minutes: 60, screenings: [{ start: "2025-09-07 19:00", venue: "X" }] },
    { title: "BigMust", runtime_minutes: 60, screenings: [{ start: "2025-09-07 19:00", venue: "X" }] }, // same slot -> conflict
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  setSel({ Ticketed: "want", BigMust: "must" }); // Ticketed is only a want...
  setLocks({ Ticketed: scrKey("Ticketed", parseDT("2025-09-07 19:00"), "X") }); // ...but I hold a ticket
  const { plans } = TiffSolver.solve(buildIncluded(), BUF, SAMEBUF, MAXPLANS, PRIOFIRST);
  const groups = groupPlans(plans, MAXPLANS);
  assert(groups.every((g) => g.rep.Ticketed), "locked want survives in every option");
  assert(groups.every((g) => !g.rep.BigMust), "the must yields to the held ticket");
});

check("two clashing locked tickets become a wizard choice; the rest of the plan stays", () => {
  // Two held tickets for overlapping screenings can't both be honoured. Rather
  // than silently dropping one, the app surfaces both as options so the user
  // resolves the clash in the wizard — and unrelated films stay scheduled.
  reset("CLASH");
  CATALOG = { festival: "CLASH", movies: [
    { title: "TicketA", runtime_minutes: 60, screenings: [{ start: "2025-09-07 19:00", venue: "X" }] },
    { title: "TicketB", runtime_minutes: 60, screenings: [{ start: "2025-09-07 19:00", venue: "Y" }] }, // overlaps A
    { title: "Other", runtime_minutes: 60, screenings: [{ start: "2025-09-07 12:00", venue: "Z" }] },   // unrelated, fits
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  setSel({ TicketA: "want", TicketB: "want", Other: "want" });
  setLocks({
    TicketA: scrKey("TicketA", parseDT("2025-09-07 19:00"), "X"),
    TicketB: scrKey("TicketB", parseDT("2025-09-07 19:00"), "Y"),
  });
  const inc = buildIncluded();
  MOVIES = inc; PRIO = Object.fromEntries(inc.map((m) => [m.title, m.priority])); // set as solveAndShow does
  const groups = groupPlans(TiffSolver.solve(inc, BUF, SAMEBUF, MAXPLANS, PRIOFIRST).plans, MAXPLANS);
  computeView(groups);
  eq(NOPT, 2, "the clash yields exactly two options");
  eqJSON(groups.map((g) => (g.rep.TicketA ? "A" : "B")).sort(), ["A", "B"], "each option keeps a different ticket");
  assert(TREE.branches && TREE.branches.length === 2, "the wizard asks the user to choose at the clash");
  eqJSON(TREE.branches.map((b) => b.watch).sort(), ["TicketA", "TicketB"], "one branch per ticket");
  assert(groups.every((g) => g.rep.Other), "unrelated films stay scheduled — the plan continues");
  assert(!ALWAYS_OUT.includes("TicketA") && !ALWAYS_OUT.includes("TicketB"), "neither ticket is flagged impossible");
});

// =============================================================================
// 5. Option grouping (groupPlans)
// =============================================================================

check("groupPlans keys by full schedule (films AND slots), merges only identical, most-kept first, respects cap", () => {
  // Venue/time-distinct schedules are distinct options; only byte-identical ones
  // merge as variants. (The solver emits one plan per genuinely distinct schedule.)
  const s = (start, venue) => ({ start, end: start + 1, venue: venue || "V" });
  const plans = [
    { A: s(1), B: s(1), C: null },
    { A: s(1), B: s(1), C: null }, // identical schedule -> merges
    { A: s(1), B: s(2), C: null }, // same kept-set {A,B} but B at a later slot -> distinct option
    { A: s(1), B: null, C: null }, // kept-set {A}
  ];
  const g = groupPlans(plans, 8);
  eq(g.length, 3, "three distinct schedules (two share a kept-set but differ by slot)");
  assert(g[0].rep.A && g[0].rep.B, "a bigger keep-set sorts first");
  eq(g.find((x) => x.rep.A && x.rep.B && x.rep.B.start === 1).variants, 2, "identical schedules collapse");
  eq(groupPlans(plans, 1).length, 1, "honours maxPlans cap");
});

// =============================================================================
// 5b. Preferred venues (building grouping + preferred flag + end-to-end conflict)
// =============================================================================

check("venue prefs: buildings group rooms; buildIncluded flags preferred screenings", () => {
  reset("VENUE");
  CATALOG = { festival: "VENUE", movies: [
    { title: "F", runtime_minutes: 60, screenings: [
      { start: "2025-09-07 10:00", venue: "Scotiabank 4" },
      { start: "2025-09-07 14:00", venue: "TIFF Lightbox 1" },
    ] },
    { title: "G", runtime_minutes: 60, screenings: [
      { start: "2025-09-08 10:00", venue: "Scotiabank 6" },
    ] },
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  const b = venueBuildings();
  eqJSON(Object.keys(b).sort(), ["scotiabank", "tiff lightbox"], "Scotiabank 4/6 collapse to one building");
  eq(b["scotiabank"], "Scotiabank", "display name strips the room number");
  VENUEPREF = new Set(["scotiabank"]);
  renderChips(); // smoke: the venue-chip render path executes without throwing
  setSel({ F: "want", G: "want" });
  const F = buildIncluded().find((m) => m.title === "F");
  eq(F.valid.find((s) => s.venue === "Scotiabank 4").preferred, true, "Scotiabank flagged preferred");
  eq(F.valid.find((s) => s.venue === "TIFF Lightbox 1").preferred, false, "Lightbox not preferred");
});

check("venue prefs: a venue/time conflict becomes a wizard choice end-to-end", () => {
  reset("VCONF");
  CATALOG = { festival: "VCONF", movies: [
    { title: "F", runtime_minutes: 60, screenings: [
      { start: "2025-09-07 10:00", venue: "Hall A" },       // non-preferred, early
      { start: "2025-09-07 18:00", venue: "Scotiabank 4" }, // preferred, late
    ] },
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  VENUEPREF = new Set(["scotiabank"]);
  setSel({ F: "want" });
  const inc = buildIncluded();
  MOVIES = inc; PRIO = Object.fromEntries(inc.map((m) => [m.title, m.priority]));
  const groups = groupPlans(TiffSolver.solve(inc, BUF, SAMEBUF, MAXPLANS, PRIOFIRST).plans, MAXPLANS);
  computeView(groups);
  eq(NOPT, 2, "earlier vs preferred-venue => two options");
  eqJSON(groups.map((g) => g.rep.F.venue).sort(), ["Hall A", "Scotiabank 4"], "one option per venue/time");
  assert(TREE.branches && TREE.branches.length === 2, "the wizard asks which screening of F");
});

// =============================================================================
// 6. Decision wizard (splitCommon + decisionTree + navigation)
// =============================================================================

check("splitCommon flags only the films whose screening differs across options", () => {
  const s = (start) => ({ start, end: start + 60, venue: "V" });
  const reps = [
    { Always: s(100), Flex: s(200), Drop: null },
    { Always: s(100), Flex: s(300), Drop: null },
  ];
  const v = splitCommon(reps);
  assert(v.has("Flex"), "Flex's time differs -> a real choice");
  assert(!v.has("Always"), "identical across options -> not a choice");
  assert(!v.has("Drop"), "dropped in both -> not a choice");
});

check("decisionTree: a single option is a leaf", () => {
  eqJSON(decisionTree([[1, { A: { start: 100, end: 160, venue: "V" } }]], new Set()), { option: 1 });
});

check("decisionTree branches chronologically at the earliest divergent slot; leaves are options", () => {
  const s = (start) => ({ start, end: start + 60, venue: "V" });
  const tree = decisionTree([[1, { Flex: s(T(10, 0)) }], [2, { Flex: s(T(14, 0)) }]], new Set(["Flex"]));
  assert(tree.branches, "diverges -> branches");
  eq(tree.branches.length, 2, "watch-early vs watch-late");
  eq(tree.branches[0].watch, "Flex", "earliest slot's branch is 'watch Flex'");
  eqJSON(tree.branches.map((b) => b.child), [{ option: 1 }, { option: 2 }], "each branch resolves to one option");
});

check("nodeOpts / inter narrow the live options as picks are made", () => {
  OPT = { 1: { keep: ["A", "B"], drop: ["C"] }, 2: { keep: ["A", "C"], drop: ["B"] } };
  TREE = { when: "slot", branches: [
    { watch: "B", when: "slot", options: [1], child: { option: 1 } },
    { watch: "C", when: "slot", options: [2], child: { option: 2 } },
  ] };
  eqJSON(nodeOpts(TREE).sort((a, b) => a - b), [1, 2]);
  eqJSON(inter([1, 2], "keep"), ["A"], "A is kept in every option");
  eqJSON(inter([1], "keep"), ["A", "B"], "narrowing to option 1 adds B");
  eq(nodeAt([0]).option, 1, "first branch leads to option 1");
});

// =============================================================================
// 7. Pick reconciliation across re-solves
// =============================================================================

check("validPicks rejects out-of-range or too-deep pick paths", () => {
  TREE = { branches: [{ child: { option: 1 } }, { child: { option: 2 } }] };
  assert(validPicks([0], TREE) && validPicks([1], TREE));
  assert(!validPicks([2], TREE), "index past the last branch");
  assert(!validPicks([0, 0], TREE), "a leaf has no further branches");
});

check("picks re-apply by film signature, surviving option-index reshuffles", () => {
  OPT = { 1: { keep: ["A", "B"], drop: ["C"] }, 2: { keep: ["A", "C"], drop: ["B"] } };
  TREE = { when: "S", branches: [
    { watch: "B", when: "S", options: [1], child: { option: 1 } },
    { watch: "C", when: "S", options: [2], child: { option: 2 } },
  ] };
  const choices = picksToChoices([0]); // user chose "watch B"
  eq(choices.length, 1); eq(choices[0].sig, "B");
  // a rebuilt tree where the SAME "watch B" branch now sits at index 1
  const tree2 = { when: "S", branches: [
    { watch: "C", when: "S", options: [1], child: { option: 1 } },
    { watch: "B", when: "S", options: [2], child: { option: 2 } },
  ] };
  eqJSON(choicesToPicks(choices, tree2), [1], "choice follows the film, not the old index");
});

check("choicesToPicks keeps the longest still-valid prefix and drops the diverged tail", () => {
  OPT = { 1: { keep: ["A", "B"], drop: [] }, 2: { keep: ["A", "C"], drop: [] } };
  const tree2 = { when: "S1", branches: [
    { watch: "X", when: "S1", options: [1], child: { when: "S2", branches: [{ watch: "Y", when: "S2", options: [1], child: { option: 1 } }] } },
  ] };
  eqJSON(choicesToPicks([{ when: "S1", sig: "X" }, { when: "S2", sig: "NOPE" }], tree2), [0],
    "first level matches, second no longer exists -> stop there");
});

// =============================================================================
// 8. Conflict explanations (explainConflicts)
// =============================================================================

check("explainConflicts gives each dropped film its per-screening reasons", () => {
  const sA = { start: T(10, 0), end: T(11, 0), venue: "X", invalidReason: null };
  const sBconf = { start: T(10, 30), end: T(11, 30), venue: "Y", invalidReason: null }; // overlaps A
  const sBsold = { start: T(15, 0), end: T(16, 0), venue: "Z", invalidReason: "marked sold out / no tickets" };
  MOVIES = [
    { title: "A", priority: "must", screenings: [sA] },
    { title: "B", priority: "want", screenings: [sBconf, sBsold] },
  ];
  BUF = 30; SAMEBUF = 10;
  const notes = explainConflicts({ A: sA, B: null });
  eq(notes.length, 1, "only the dropped film is explained");
  eq(notes[0].title, "B"); eq(notes[0].priority, "want");
  assert(notes[0].reasons.some((r) => r.includes("conflicts with") && r.includes("A")), "names the blocking film");
  assert(notes[0].reasons.some((r) => r.includes("sold out")), "carries the invalidReason verbatim");
});

// =============================================================================
// 9. Persistence & per-festival namespacing
// =============================================================================

check("loadJSON/saveJSON round-trip and fall back to documented defaults", () => {
  reset("P1");
  eqJSON(loadJSON("sel", {}), {}, "absent -> default");
  eq(getBuf(), 30); eq(getSameBuf(), 10); eq(getPrioFirst(), true);
  saveJSON("sel", { M: "must" });
  eqJSON(loadJSON("sel", {}), { M: "must" });
});

check("storage is namespaced per festival — renaming orphans (never reads) old tags", () => {
  reset("Fest A");
  setSel({ M: "must" });
  eqJSON(getSel(), { M: "must" });
  CATALOG = { festival: "Fest B", movies: [] }; // a rename / different event
  eqJSON(getSel(), {}, "the new festival starts clean");
  CATALOG = { festival: "Fest A", movies: [] };
  eqJSON(getSel(), { M: "must" }, "old festival's tags are still intact");
});

// =============================================================================
// 10. Access tiers + track chips (View 1 visibility & scheduling)
// =============================================================================

check("screeningAllowed: public always allowed; a tiered screening is gated by TIERSOFF", () => {
  TIERSOFF = new Set();
  assert(screeningAllowed({ venue: "X" }), "no accessTiers => public => allowed");
  assert(screeningAllowed({ accessTiers: [], venue: "X" }), "empty accessTiers => public");
  assert(screeningAllowed({ accessTiers: ["press-industry"] }), "tier allowed when its chip is on");
  TIERSOFF = new Set(["press-industry"]);
  assert(!screeningAllowed({ accessTiers: ["press-industry"] }), "tier disallowed when its chip is off");
  assert(screeningAllowed({ venue: "X" }), "public still allowed while a tier is off");
});

check("movieVisible: P&I-only film hidden when access off; dual film stays via its public slot", () => {
  TRACKSOFF = new Set(); TIERSOFF = new Set(["press-industry"]);
  const piOnly = { title: "PI", tracks: ["x"], screenings: [{ start: "a", accessTiers: ["press-industry"] }] };
  const dual = { title: "D", tracks: ["x"], screenings: [{ start: "a" }, { start: "b", accessTiers: ["press-industry"] }] };
  assert(!movieVisible(piOnly), "P&I-only hidden when access not allowed");
  assert(movieVisible(dual), "dual film visible via its public screening");
  TIERSOFF = new Set();
  assert(movieVisible(piOnly), "P&I-only appears once access is allowed");
});

check("movieVisible: a track chip hides its films, but only when ALL their tracks are off", () => {
  TRACKSOFF = new Set(["galas"]); TIERSOFF = new Set();
  assert(!movieVisible({ title: "G", tracks: ["galas"], screenings: [{ start: "a" }] }), "all tracks off => hidden");
  assert(movieVisible({ title: "G2", tracks: ["galas", "docs"], screenings: [{ start: "a" }] }), "shown via another on track");
  TRACKSOFF = new Set();
});

check("buildIncluded drops disallowed-tier screenings; allowing the tier re-adds them", () => {
  reset("AT1");
  CATALOG = { festival: "AT1", accessTiers: { "press-industry": "P&I" }, disabledAccessTiers: ["press-industry"], movies: [
    { title: "Dual", runtime_minutes: 60, tracks: ["t"], screenings: [
      { start: "2025-09-07 10:00", venue: "X" },
      { start: "2025-09-07 14:00", venue: "Y", accessTiers: ["press-industry"] },
    ] },
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  TRACKSOFF = new Set(); TIERSOFF = new Set(["press-industry"]); // P&I off (the default)
  setSel({ Dual: "must" });
  let inc = buildIncluded()[0];
  eq(inc.screenings.length, 1, "only the public screening is a candidate");
  eq(inc.valid[0].start, parseDT("2025-09-07 10:00"), "and it's the public one");
  TIERSOFF = new Set(); // mark P&I allowed
  inc = buildIncluded()[0];
  eq(inc.screenings.length, 2, "the P&I screening becomes a candidate once access is allowed");
  TIERSOFF = new Set();
});

check("a P&I-only film tagged must has no candidates while access is off (never booked)", () => {
  reset("AT2");
  CATALOG = { festival: "AT2", accessTiers: { "press-industry": "P&I" }, disabledAccessTiers: ["press-industry"], movies: [
    { title: "Market", runtime_minutes: 60, tracks: ["t"], screenings: [{ start: "2025-09-07 10:00", venue: "X", accessTiers: ["press-industry"] }] },
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  TRACKSOFF = new Set(); TIERSOFF = new Set(["press-industry"]);
  setSel({ Market: "must" });
  eq(buildIncluded()[0].valid.length, 0, "no allowed screenings => nothing to schedule");
  TIERSOFF = new Set();
  eq(buildIncluded()[0].valid.length, 1, "allowing access makes it schedulable");
  TIERSOFF = new Set();
});

check("track chips never affect scheduling — a track-hidden must still has candidates", () => {
  reset("AT3");
  CATALOG = { festival: "AT3", movies: [
    { title: "G", runtime_minutes: 60, tracks: ["galas"], screenings: [{ start: "2025-09-07 10:00", venue: "X" }] },
  ] };
  GRID = computeGrid(); UNAVAIL = new Set();
  TRACKSOFF = new Set(["galas"]); TIERSOFF = new Set();
  setSel({ G: "must" });
  assert(!movieVisible(CATALOG.movies[0]), "hidden from the View 1 list");
  eq(buildIncluded()[0].valid.length, 1, "but still scheduled — tracks are view-only");
  TRACKSOFF = new Set();
});

check("getTiersOff defaults to the catalog's disabledAccessTiers until the user overrides", () => {
  reset("AT4");
  CATALOG = { festival: "AT4", disabledAccessTiers: ["press-industry"], movies: [] };
  eqJSON(getTiersOff(), ["press-industry"], "first load: P&I off by default");
  setTiersOff([]); // user marks they hold P&I access
  eqJSON(getTiersOff(), [], "override persists");
  eqJSON(getTracksOff(), [], "tracks default all-on");
});

report("app");
