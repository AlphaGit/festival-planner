// Festival screening planner — exact solver (browser).
//
// Models the schedule as a boolean satisfiability problem and solves it with
// logic-solver (MiniSat, bundled in logic-solver.bundle.js — load that FIRST).
// Minimizes weighted drop cost (must = 1000, want = 1), then enumerates the
// distinct optimal drop-sets (the "options") by forbidding each found drop-set
// and re-solving. Fast and exact even on dense catalogs (~50 films) where a
// hand-rolled search blows up on the equal-cost plateau.
//
// Input:  movies = [{ title, priority: "must"|"want",
//                      valid: [{ start, end, venue }] }]   // start/end = epoch ms
// Output: { cost, plans } where each plan is { [title]: screening | null }.
//
// Usage: <script src="logic-solver.bundle.js"></script>
//        <script src="solver.js"></script>   then TiffSolver.solve(...)
(function (root) {
  "use strict";
  const MUST_COST = 1000; // dropping a must costs this; dropping a want costs 1

  // "Scotiabank 6" and "Scotiabank 12" are rooms in the same building.
  function building(venue) {
    return String(venue).replace(/\s+\d+$/, "").trim().toLowerCase();
  }
  // Two screenings fit if a gap (buffer) separates them. Same building -> smaller gap.
  function compatible(a, b, buf, sameBuf) {
    const gap = (building(a.venue) === building(b.venue) ? sameBuf : buf) * 60000;
    return a.end + gap <= b.start || b.end + gap <= a.start;
  }

  function solve(movies, buf, sameBuf, maxPlans, prioritizeFirst) {
    const L = root.LogicSolver;
    if (!L) throw new Error("logic-solver.bundle.js must be loaded before solver.js");
    if (!movies.length) return { cost: 0, plans: [{}] };

    const s = new L.Solver();
    const dvar = (i) => "d_" + i;            // movie i dropped
    const xvar = (i, k) => "x_" + i + "_" + k; // movie i watched at its k-th valid screening
    // each movie: watch exactly one valid screening, or drop it
    movies.forEach((m, i) =>
      s.require(L.exactlyOne(...m.valid.map((_, k) => xvar(i, k)), dvar(i))));
    // incompatible screenings across movies can't both be chosen
    for (let i = 0; i < movies.length; i++)
      for (let j = i + 1; j < movies.length; j++)
        movies[i].valid.forEach((sa, ka) =>
          movies[j].valid.forEach((sb, kb) => {
            if (!compatible(sa, sb, buf, sameBuf)) s.require(L.atMostOne(xvar(i, ka), xvar(j, kb)));
          }));

    const dvars = movies.map((_, i) => dvar(i));
    const weights = movies.map((m) => (m.priority === "must" ? MUST_COST : 1));
    let sol = s.solve();
    if (!sol) return { cost: 0, plans: [{}] }; // unreachable: dropping everything is always feasible
    const opt = s.minimizeWeightedSum(sol, dvars, weights);
    const cost = movies.reduce((a, m, i) => a + (opt.evaluate(dvar(i)) ? weights[i] : 0), 0);
    // pin to the optimum, then walk distinct drop-sets
    s.require(L.equalBits(L.weightedSum(dvars, weights), L.constantBits(cost)));

    const planOf = (so) => {
      const p = {};
      movies.forEach((m, i) => {
        if (so.evaluate(dvar(i))) p[m.title] = null;
        else p[m.title] = m.valid[m.valid.findIndex((_, k) => so.evaluate(xvar(i, k)))];
      });
      return p;
    };

    // Secondary objective (tie-break only): prefer earlier screenings. Rank each
    // movie's valid screenings by start (0 = earliest); the penalty for watching
    // it is that rank, with a soft 1.5x bias toward must-watches (must=3, want=2)
    // so a must yields its earlier slot only once 2+ want-slots would benefit.
    // This is a SEPARATE weightedSum from drop cost, minimized WITHIN each
    // drop-set via assumptions — it can never change which films are kept, nor
    // hide a keep/drop option. Off (or with no multi-screening movies) -> no-op.
    const lateTerms = [], lateWeights = [];
    if (prioritizeFirst) {
      movies.forEach((m, i) => {
        const order = m.valid.map((_, k) => k).sort((a, b) =>
          m.valid[a].start - m.valid[b].start || (m.valid[a].venue < m.valid[b].venue ? -1 : 1));
        const w = m.priority === "must" ? 3 : 2;
        order.forEach((k, rank) => { if (rank) { lateTerms.push(xvar(i, k)); lateWeights.push(rank * w); } });
      });
    }
    const lateSum = lateTerms.length ? L.weightedSum(lateTerms, lateWeights) : null;
    // minimize lateness for a FIXED drop-set (via solveAssuming — non-permanent).
    const earliest = (so, dropAssump) => {
      if (!lateSum) return so;
      let best = so, bestLate = best.getWeightedSum(lateTerms, lateWeights);
      while (bestLate > 0) {
        const better = s.solveAssuming(L.and(dropAssump, L.lessThan(lateSum, L.constantBits(bestLate))));
        if (!better) break;
        best = better; bestLate = best.getWeightedSum(lateTerms, lateWeights);
      }
      return best;
    };

    const plans = [];
    let cur = opt;
    while (cur && plans.length < maxPlans) {
      // forbid this exact set of dropped movies so the next solve differs in WHICH it drops
      const dropAssump = L.and(...movies.map((m, i) => (cur.evaluate(dvar(i)) ? dvar(i) : L.not(dvar(i)))));
      plans.push(planOf(earliest(cur, dropAssump)));
      s.forbid(dropAssump);
      cur = s.solve();
    }
    return { cost, plans };
  }

  // ---- self-check: TiffSolver._selfTest() (needs logic-solver loaded).
  function _selfTest() {
    const assert = (c, m) => { if (!c) throw new Error("FAIL: " + m); };
    const at = (h, mnt, dur, venue) => { const start = Date.UTC(2024, 2, 6, h, mnt || 0); return { start, end: start + dur * 60000, venue }; };
    // dependent-choice case: Flex has 2 screenings; its time frees the other slot.
    const r = solve([
      { title: "Flex", priority: "want", valid: [at(10, 0, 90, "A"), at(14, 0, 90, "A")] },
      { title: "MorningOnly", priority: "want", valid: [at(10, 0, 90, "B")] },
      { title: "AfternoonOnly", priority: "want", valid: [at(14, 0, 90, "B")] },
      { title: "Always", priority: "must", valid: [at(18, 0, 60, "A")] },
    ], 15, 10, 8);
    assert(r.cost === 1, "expected one want dropped, got " + r.cost);
    assert(new Set(r.plans.map((p) => Object.keys(p).filter((t) => p[t]).sort().join(","))).size === 3,
      "expected 3 distinct optimal options");
    r.plans.forEach((p) => assert(p.Always, "every option must keep the must-watch"));
    // all-fit case
    const fit = solve([
      { title: "X", priority: "want", valid: [at(9, 0, 60, "A")] },
      { title: "Y", priority: "must", valid: [at(12, 0, 60, "B")] },
    ], 30, 10, 8);
    assert(fit.cost === 0 && fit.plans.length === 1 && fit.plans[0].X && fit.plans[0].Y, "all-fit failed");
    assert(building("Scotiabank 12") === "scotiabank", "building strip failed");

    // ---- prioritize-first (5th arg = true) ----
    // lone want, two free screenings listed late-then-early -> earlier is chosen
    const early = solve([
      { title: "Solo", priority: "want", valid: [at(14, 0, 60, "A"), at(10, 0, 60, "A")] },
    ], 30, 10, 8, true);
    assert(early.plans[0].Solo.start === Date.UTC(2024, 2, 6, 10, 0), "prioritize-first should pick the earliest screening");
    // must vs one competing want: must keeps its early slot (3*0+2*1=2 beats 3*1+2*0=3)
    const mw = solve([
      { title: "M", priority: "must", valid: [at(10, 0, 60, "A"), at(16, 0, 60, "A")] },
      { title: "W", priority: "want", valid: [at(10, 0, 60, "A"), at(12, 0, 60, "A")] },
    ], 30, 10, 8, true);
    assert(mw.cost === 0, "must-vs-want should fit both, got cost " + mw.cost);
    assert(mw.plans[0].M.start === Date.UTC(2024, 2, 6, 10, 0), "must should take its early slot");
    assert(mw.plans[0].W.start === Date.UTC(2024, 2, 6, 12, 0), "want should yield to the must");
    // two wants outvote one must: must yields to 13:00 (3) so both wants go early (2+2=4)
    const agg = solve([
      { title: "M", priority: "must", valid: [at(9, 0, 60, "A"), at(13, 0, 60, "A")] },
      { title: "W1", priority: "want", valid: [at(9, 0, 60, "A"), at(11, 0, 60, "A")] },
      { title: "W2", priority: "want", valid: [at(11, 0, 60, "A"), at(13, 0, 60, "A")] },
    ], 30, 10, 8, true);
    assert(agg.cost === 0, "aggregate case should fit all three, got cost " + agg.cost);
    assert(agg.plans[0].M.start === Date.UTC(2024, 2, 6, 13, 0), "must should yield to two wants");
    assert(agg.plans[0].W1.start === Date.UTC(2024, 2, 6, 9, 0), "W1 should be early");
    assert(agg.plans[0].W2.start === Date.UTC(2024, 2, 6, 11, 0), "W2 should be early");

    console.log("solver.js self-test passed");
  }

  root.TiffSolver = { solve, compatible, building, MUST_COST, _selfTest };
})(typeof globalThis !== "undefined" ? globalThis : this);
