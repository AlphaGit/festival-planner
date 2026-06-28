// Festival screening planner — exact solver (browser).
//
// Models the schedule as a boolean satisfiability problem and solves it with
// logic-solver (MiniSat, bundled in logic-solver.bundle.js — load that FIRST).
// Minimizes weighted drop cost (locked = 1e6, must = 1000, want = 1), then
// enumerates the distinct optimal drop-sets (the "options") by forbidding each
// found drop-set and re-solving. Fast and exact even on dense catalogs (~50
// films) where a hand-rolled search blows up on the equal-cost plateau.
//
// Input:  movies = [{ title, priority: "must"|"want", locked?: bool,
//                      valid: [{ start, end, venue, preferred? }] }] // start/end = epoch ms
// Output: { cost, plans, truncated } where each plan is { [title]: screening | null }.
//         preferred (a screening at a user-preferred venue) never changes cost — it
//         only surfaces genuine venue/time trade-offs as extra equal-cost options.
//
// Usage: <script src="logic-solver.bundle.js"></script>
//        <script src="solver.js"></script>   then TiffSolver.solve(...)
(function (root) {
  "use strict";
  const MUST_COST = 1000; // dropping a must costs this; dropping a want costs 1
  // A locked film is a held ticket — it must outrank any must *preference*. 1e6 is
  // strictly above MUST_COST * the most films a catalog has (~50), so dropping a
  // lock is never optimal unless it's literally infeasible (e.g. two locks clash).
  // ponytail: bump if catalogs ever exceed ~1000 films.
  const LOCK_COST = 1e6;

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
    const weights = movies.map((m) => (m.locked ? LOCK_COST : m.priority === "must" ? MUST_COST : 1));
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

    // ---- venue preference (binary, building-level) --------------------------
    // A valid screening may carry preferred:true (its venue is in the user's
    // preferred set). p_i = "movie i sits at a preferred venue" = OR of its
    // preferred xvars. We enumerate distinct (drop-set + preferred-venue profile)
    // optima instead of just distinct drop-sets, then Pareto-filter so only
    // GENUINE trade-offs survive as options — preferred-but-later vs
    // non-preferred-but-earlier, or two films that can't both reach a preferred
    // venue. Branching only matters for a film with a MIX of preferred/non-pref
    // valid screenings; with none, `venueActive` is false and this is the exact
    // old path (distinct drop-sets only) — a true no-op when no venue is marked.
    // Venue is never scored: cost stays drop-cost, so a profile that would cost a
    // dropped film is never enumerated. The user decides every surfaced conflict.
    const prefIdx = movies.map((m) => m.valid.map((s, k) => (s.preferred ? k : -1)).filter((k) => k >= 0));
    const prefExpr = movies.map((m, i) => (prefIdx[i].length ? L.or(...prefIdx[i].map((k) => xvar(i, k))) : null));
    const venueActive = movies.some((m, i) => prefIdx[i].length > 0 && prefIdx[i].length < m.valid.length);
    const atPref = (so, i) => prefIdx[i].some((k) => so.evaluate(xvar(i, k)));
    // assumption pinning a solution's drop-set (+ preferred-venue profile when active)
    const profileOf = (so) => L.and(...movies.flatMap((m, i) => {
      const terms = [so.evaluate(dvar(i)) ? dvar(i) : L.not(dvar(i))];
      if (venueActive && prefExpr[i]) terms.push(atPref(so, i) ? prefExpr[i] : L.not(prefExpr[i]));
      return terms;
    }));
    const lateOf = (so) => (lateSum ? so.getWeightedSum(lateTerms, lateWeights) : 0);

    // enumerate distinct optima; collapse time within each profile.
    const ENUM_CAP = venueActive ? Math.max(maxPlans * 8, 64) : maxPlans;
    const raw = [];
    let cur = opt, truncated = false;
    while (cur && raw.length < ENUM_CAP) {
      const pa = profileOf(cur);
      const best = earliest(cur, pa); // lateness-min WITHIN this drop-set + profile
      const keptIdx = movies.map((_, i) => i).filter((i) => !best.evaluate(dvar(i)));
      raw.push({ so: best, keptSig: keptIdx.join(","), keptN: keptIdx.length,
        pref: new Set(keptIdx.filter((i) => atPref(best, i))), late: lateOf(best) });
      s.forbid(pa); // never repeat this (drop-set, profile)
      cur = s.solve();
    }
    if (cur) truncated = true; // hit ENUM_CAP — more optima exist than we explored

    // Pareto-filter per kept-set: drop a schedule when another with the SAME kept
    // set is at least as good on BOTH axes (preferred-venue set ⊇, lateness ≤) and
    // strictly better on one. Survivors are the genuine venue/time trade-offs.
    const superset = (a, b) => { for (const x of b) if (!a.has(x)) return false; return true; };
    const dominated = (e) => raw.some((o) => o !== e && o.keptSig === e.keptSig
      && superset(o.pref, e.pref) && o.late <= e.late
      && (o.pref.size > e.pref.size || o.late < e.late));
    const survivors = raw.filter((e) => !venueActive || !dominated(e));
    survivors.sort((a, b) => b.keptN - a.keptN); // most films kept first (stable)
    if (survivors.length > maxPlans) truncated = true;
    const plans = survivors.slice(0, maxPlans).map((e) => planOf(e.so));
    return { cost, plans, truncated };
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

    // ---- venue preference: a preferred-but-late vs non-preferred-but-early slot
    // is a genuine trade-off -> two equal-cost options, both keeping the film.
    const vp = solve([
      { title: "V", priority: "want", valid: [at(10, 0, 60, "A"), { ...at(14, 0, 60, "B"), preferred: true }] },
    ], 30, 10, 8, true);
    assert(vp.plans.length === 2, "venue conflict should surface two options, got " + vp.plans.length);
    vp.plans.forEach((p) => assert(p.V, "both venue options keep the film"));
    assert(new Set(vp.plans.map((p) => p.V.venue)).size === 2, "the two options differ by venue");

    console.log("solver.js self-test passed");
  }

  root.TiffSolver = { solve, compatible, building, MUST_COST, _selfTest };
})(typeof globalThis !== "undefined" ? globalThis : this);
