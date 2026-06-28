// Tests for solver.js — plain Node, no framework, no deps.
//
//   node test_solver.js     # exit 0 = all pass, 1 = a failure
//
// logic-solver.bundle.js is an IIFE that assigns `var LogicSolver` (not a
// CommonJS module), so it can't be require()d. We eval the bundle + solver.js
// into this scope and lift LogicSolver onto globalThis, which is exactly the
// load order index.html uses. ponytail: eval is the cheap, correct way to run
// the un-modularised vendored bundle headlessly — no build step, per CLAUDE.md.
const fs = require("fs");
const path = require("path");
eval(
  fs.readFileSync(path.join(__dirname, "logic-solver.bundle.js"), "utf8") +
  "\nglobalThis.LogicSolver = LogicSolver;\n" +
  fs.readFileSync(path.join(__dirname, "solver.js"), "utf8")
);
const { solve, compatible, building } = globalThis.TiffSolver;
const { check, assert, eq, report } = require("./test_harness.js");

// All times are wall-clock UTC (tz-agnostic), matching the app. Same date so
// only the hour/minute matters.
const at = (h, min, dur, venue) => { const start = Date.UTC(2025, 8, 10, h, min || 0); return { start, end: start + dur * 60000, venue }; };
const T = (h, min) => Date.UTC(2025, 8, 10, h, min || 0);
const kept = (plan) => Object.keys(plan).filter((t) => plan[t]).sort();
const distinctDropSets = (plans) => new Set(plans.map((p) => kept(p).join("|"))).size;

// =============================================================================
// Group A — core solver behaviour (was only covered by the in-browser self-test)
// =============================================================================

check("empty catalog -> cost 0, one empty plan", () => {
  const r = solve([], 30, 10, 8);
  eq(r.cost, 0); eq(r.plans.length, 1); eq(Object.keys(r.plans[0]).length, 0);
});

check("non-conflicting films all fit at cost 0", () => {
  const r = solve([
    { title: "A", priority: "want", valid: [at(9, 0, 60, "X")] },
    { title: "B", priority: "must", valid: [at(12, 0, 60, "Y")] },
  ], 30, 10, 8);
  eq(r.cost, 0); eq(r.plans.length, 1);
  assert(r.plans[0].A && r.plans[0].B, "both kept");
});

check("a head-on conflict drops the want and keeps the must (cost 1)", () => {
  const r = solve([
    { title: "Must", priority: "must", valid: [at(10, 0, 60, "X")] },
    { title: "Want", priority: "want", valid: [at(10, 0, 60, "X")] },
  ], 30, 10, 8);
  eq(r.cost, 1);
  r.plans.forEach((p) => { assert(p.Must, "must kept"); assert(!p.Want, "want dropped"); });
});

check("dropping a must costs 1000 (two musts can't share a slot)", () => {
  const r = solve([
    { title: "M1", priority: "must", valid: [at(10, 0, 60, "X")] },
    { title: "M2", priority: "must", valid: [at(10, 0, 60, "X")] },
  ], 30, 10, 8);
  eq(r.cost, 1000);
  r.plans.forEach((p) => eq(kept(p).length, 1, "exactly one must survives"));
});

check("among mutually-conflicting films, keeping the must is cheapest", () => {
  // 1 must + 3 wants all in the same slot: keep must (drop 3 wants = 3) beats
  // keep a want (drop must + 2 wants = 1002).
  const r = solve([
    { title: "M", priority: "must", valid: [at(10, 0, 60, "X")] },
    { title: "W1", priority: "want", valid: [at(10, 0, 60, "X")] },
    { title: "W2", priority: "want", valid: [at(10, 0, 60, "X")] },
    { title: "W3", priority: "want", valid: [at(10, 0, 60, "X")] },
  ], 30, 10, 8);
  eq(r.cost, 3, "drop the three wants");
  r.plans.forEach((p) => { assert(p.M, "must kept"); eq(kept(p).length, 1); });
});

check("maximises wants kept: drops the one film that blocks two, not the two", () => {
  // W1 (10:00–13:00) overlaps both W2 and W3; W2 and W3 don't overlap each other.
  // Keep W1 -> drop 2 wants (cost 2). Drop W1 -> keep 2 (cost 1). Min wants dropped.
  const r = solve([
    { title: "W1", priority: "want", valid: [at(10, 0, 180, "X")] },
    { title: "W2", priority: "want", valid: [at(10, 30, 60, "Y")] },
    { title: "W3", priority: "want", valid: [at(12, 0, 60, "Z")] },
  ], 30, 10, 8);
  eq(r.cost, 1, "drop exactly one want");
  r.plans.forEach((p) => { assert(!p.W1, "drop the film that blocks two"); assert(p.W2 && p.W3, "keep the other two"); });
});

// Flex has two screenings; whichever it takes frees a different B-venue want.
const FLEX = [
  { title: "Flex", priority: "want", valid: [at(10, 0, 90, "A"), at(14, 0, 90, "A")] },
  { title: "Morning", priority: "want", valid: [at(10, 0, 90, "B")] },
  { title: "Afternoon", priority: "want", valid: [at(14, 0, 90, "B")] },
  { title: "Always", priority: "must", valid: [at(18, 0, 60, "A")] },
];

check("enumerates all three equally-optimal options", () => {
  const r = solve(FLEX, 15, 10, 8);
  eq(r.cost, 1, "exactly one want dropped");
  eq(distinctDropSets(r.plans), 3, "three distinct drop-sets");
  r.plans.forEach((p) => assert(p.Always, "the must is in every option"));
});

check("maxPlans caps how many options come back", () => {
  eq(solve(FLEX, 15, 10, 2).plans.length, 2, "3 options available, capped to 2");
});

check("buffer: a too-tight cross-venue gap conflicts; zero buffer fits it", () => {
  const movies = [
    { title: "P", priority: "want", valid: [at(10, 0, 60, "X")] }, // 10:00–11:00
    { title: "Q", priority: "want", valid: [at(11, 0, 60, "Y")] }, // 11:00–12:00 (0-min gap)
  ];
  eq(solve(movies, 30, 10, 8).cost, 1, "30-min buffer rejects a 0-min gap");
  eq(solve(movies, 0, 0, 8).cost, 0, "0 buffer fits back-to-back");
});

check("same-building screenings use the smaller sameBuf, not buf", () => {
  const movies = [
    { title: "P", priority: "want", valid: [at(10, 0, 60, "Scotiabank 6")] },   // 10:00–11:00
    { title: "Q", priority: "want", valid: [at(11, 10, 60, "Scotiabank 12")] }, // 11:10–12:10 (10-min gap)
  ];
  eq(solve(movies, 60, 10, 8).cost, 0, "same building: 10-min gap >= sameBuf 10 fits");
  eq(solve(movies, 60, 15, 8).cost, 1, "same building: 10-min gap < sameBuf 15 conflicts");
});

check("compatible() honours buffers, direction and overlap", () => {
  const a = at(10, 0, 60, "X"), b = at(11, 0, 60, "Y"); // 0-min gap, different venue
  assert(!compatible(a, b, 30, 10), "30-min buffer rejects a 0-min gap");
  assert(compatible(a, b, 0, 0), "0 buffer accepts back-to-back");
  assert(compatible(b, a, 0, 0), "compatibility is symmetric");
  assert(!compatible(a, at(10, 30, 60, "Z"), 0, 0), "overlapping screenings are never compatible");
});

check("building() strips trailing room numbers, case-insensitively", () => {
  eq(building("Scotiabank 12"), "scotiabank");
  eq(building("TIFF Lightbox 3"), "tiff lightbox");
  eq(building("Royal Alexandra Theatre"), "royal alexandra theatre");
});

check("a film with no valid screenings is dropped and costed by priority", () => {
  const r = solve([
    { title: "Gone", priority: "want", valid: [] },
    { title: "Here", priority: "want", valid: [at(10, 0, 60, "X")] },
  ], 30, 10, 8);
  eq(r.cost, 1);
  r.plans.forEach((p) => { assert(!p.Gone, "no-screening film dropped"); assert(p.Here, "the schedulable one is kept"); });
});

// =============================================================================
// Group B — prioritize first screenings (the option added today)
// =============================================================================

check("prioritize-first picks the earliest screening (and sorts, not input order)", () => {
  const r = solve([
    { title: "Solo", priority: "want", valid: [at(14, 0, 60, "A"), at(10, 0, 60, "A")] },
  ], 30, 10, 8, true);
  eq(r.plans[0].Solo.start, T(10, 0));
});

check("a single-screening film is unaffected by the toggle", () => {
  const movies = [{ title: "One", priority: "want", valid: [at(10, 0, 60, "A")] }];
  eq(solve(movies, 30, 10, 8, true).plans[0].One.start, T(10, 0));
  eq(solve(movies, 30, 10, 8, false).plans[0].One.start, T(10, 0));
});

check("the toggle never changes cost or which keep/drop options exist", () => {
  const off = solve(FLEX, 15, 10, 8, false);
  const on = solve(FLEX, 15, 10, 8, true);
  eq(on.cost, off.cost, "cost unchanged by earliness");
  eq(distinctDropSets(on.plans), distinctDropSets(off.plans), "same set of options — none hidden");
});

check("must keeps its early slot against a single competing want", () => {
  // M@10/W@12 lateness = 3*0 + 2*1 = 2 beats M@16/W@10 = 3*1 + 2*0 = 3.
  const r = solve([
    { title: "M", priority: "must", valid: [at(10, 0, 60, "A"), at(16, 0, 60, "A")] },
    { title: "W", priority: "want", valid: [at(10, 0, 60, "A"), at(12, 0, 60, "A")] },
  ], 30, 10, 8, true);
  eq(r.cost, 0, "both fit");
  eq(r.plans[0].M.start, T(10, 0), "must takes the early slot");
  eq(r.plans[0].W.start, T(12, 0), "want yields");
});

check("a must yields its early slot once two wants would benefit", () => {
  // M late = 3*1 = 3 beats both-wants-late = 2*1 + 2*1 = 4.
  const r = solve([
    { title: "M", priority: "must", valid: [at(9, 0, 60, "A"), at(13, 0, 60, "A")] },
    { title: "W1", priority: "want", valid: [at(9, 0, 60, "A"), at(11, 0, 60, "A")] },
    { title: "W2", priority: "want", valid: [at(11, 0, 60, "A"), at(13, 0, 60, "A")] },
  ], 30, 10, 8, true);
  eq(r.cost, 0, "all three fit");
  eq(r.plans[0].M.start, T(13, 0), "must yields to 13:00");
  eq(r.plans[0].W1.start, T(9, 0), "W1 early");
  eq(r.plans[0].W2.start, T(11, 0), "W2 early");
});

check("reported cost is drop-cost only, never inflated by lateness", () => {
  // One want is dropped (cost 1) and the must is pushed to a later slot by a
  // conflict (non-zero lateness). cost must still report just the drop.
  const r = solve([
    { title: "A", priority: "want", valid: [at(10, 0, 60, "X")] },                 // conflicts B
    { title: "B", priority: "want", valid: [at(10, 0, 60, "X")] },                 // one of A/B dropped
    { title: "M", priority: "must", valid: [at(10, 0, 60, "Z"), at(14, 0, 60, "Z")] }, // forced to 14:00
  ], 30, 10, 8, true);
  eq(r.cost, 1, "exactly one want dropped; lateness adds nothing");
});

// =============================================================================
// Group C — locked screenings (a held ticket outranks a must *preference*)
// =============================================================================

check("a locked screening outranks a competing must, even when it's only a want", () => {
  // Locked want and a must both want the same single slot. The held ticket wins;
  // the must yields. No optimal option drops the lock.
  const r = solve([
    { title: "Locked", priority: "want", locked: true, valid: [at(19, 0, 60, "X")] },
    { title: "Must", priority: "must", valid: [at(19, 0, 60, "X")] },
  ], 30, 10, 8);
  r.plans.forEach((p) => { assert(p.Locked, "held ticket kept"); assert(!p.Must, "must yields to the ticket"); });
  eq(r.plans.length, 1, "dropping the lock is never an option");
});

check("the in-browser _selfTest() also passes here", () => {
  globalThis.TiffSolver._selfTest();
});

report("solver");
