// Festival planner — static-page app. View 1: tag the catalog (must/want/skip/
// unavailable, persisted to localStorage). View 2: solver options + decision
// wizard + the schedule to follow (also persisted). Pure browser, no build step.
// Depends on solver.js (TiffSolver) loaded first.
"use strict";

const MAXPLANS = 8;
const STATUSES = ["must", "want", "skip"];
const STATUS_LABEL = { must: "Must", want: "Want", skip: "Skip" };
// effective status: default to skip; fold legacy "unavailable" into skip
const effStatus = (sel, title) => { const s = sel[title]; return s === "unavailable" ? "skip" : (s || "skip"); };

// ---- module state (set per solve, read by the board/wizard renderers)
let CATALOG = null, MOVIES = [], BUF = 30, SAMEBUF = 10, PRIOFIRST = true;
let TRACKSOFF = new Set(), TIERSOFF = new Set(); // View 1 chips: hidden curatorial tracks / disallowed access tiers
let GRID = { days: [], hours: [] }, UNAVAIL = new Set();
let LOCATIONS = {}; // root locations map (id -> {name, address})
let LOCKS = {}, SELECTED = null, CURRENT_LIVE = []; // timeline overrides + click state
let RESOLVE_NOTICE = false; // show "scroll up, options updated" banner after a re-solve
let painting = false, paintOff = false; // availability grid drag state
let TREE = null, OPT = {}, REASONS = {}, PRIO = {}, DAYS = [], NOPT = 0, ALWAYS_OUT = [];

// ---- small utils
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MO = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n) => String(n).padStart(2, "0");
const hm = (ms) => { const d = new Date(ms); return pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()); };
const dayLabel = (ms) => { const d = new Date(ms); return `${WD[d.getUTCDay()]}, ${MO[d.getUTCMonth()]} ${pad(d.getUTCDate())}`; };
const whenLabel = (ms) => { const d = new Date(ms); return `${WD[d.getUTCDay()].slice(0, 3)} ${MO[d.getUTCMonth()].slice(0, 3)} ${pad(d.getUTCDate())} ${hm(ms)}`; };
const scLabel = (s) => `${whenLabel(s.start)}–${hm(s.end)} @ ${s.venue}`;

// Parse "YYYY-MM-DD[ T]HH:MM[:SS]" or date-only as wall-clock UTC ms (tz-agnostic).
function parseDT(v) {
  const m = String(v).trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) throw new Error("Cannot parse date/time: " + v);
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
}

// ---- localStorage (namespaced per festival)
const nsKey = (k) => `tiff:${CATALOG ? CATALOG.festival : "?"}:${k}`;
const loadJSON = (k, dflt) => { try { return JSON.parse(localStorage.getItem(nsKey(k))) ?? dflt; } catch { return dflt; } };
const saveJSON = (k, v) => { try { localStorage.setItem(nsKey(k), JSON.stringify(v)); } catch {} };
const getSel = () => loadJSON("sel", {});
const setSel = (sel) => saveJSON("sel", sel);
const getPicks = () => loadJSON("picks", []);
const setPicks = (p) => saveJSON("picks", p);
const getBuf = () => loadJSON("buf", 30);
const getSameBuf = () => loadJSON("samebuf", 10);
const getPrioFirst = () => loadJSON("prioritizefirst", true);
// chip state, persisted per festival. tracks default all-on (off-set empty);
// access tiers default to the catalog's disabledAccessTiers (e.g. P&I off).
const getTracksOff = () => loadJSON("tracksoff", []);
const setTracksOff = (v) => saveJSON("tracksoff", v);
const getTiersOff = () => loadJSON("tiersoff", (CATALOG && CATALOG.disabledAccessTiers) || []);
const setTiersOff = (v) => saveJSON("tiersoff", v);
// timeline overrides (persisted per festival)
const SEP = "";
const scrKey = (title, start, venue) => `${title}${SEP}${start}${SEP}${venue}`;
const getLocks = () => loadJSON("locks", {});            // { title: screeningKey }
const setLocks = (v) => saveJSON("locks", v);
const getSoldOut = () => new Set(loadJSON("soldout", [])); // set of screeningKey
const setSoldOut = (s) => saveJSON("soldout", [...s]);

const HOUR = 3600000, DAYMS = 86400000;

// Availability grid derived from the catalog's screening times: which days exist
// and which hour-blocks (hours can exceed 24 for after-midnight slots) to show.
function computeGrid() {
  const days = new Set();
  let minH = 24, maxH = 0, any = false;
  for (const m of (CATALOG.movies || [])) for (const s of (m.screenings || [])) {
    const start = parseDT(s.start), dayMs = start - (start % DAYMS);
    const sh = (start - dayMs) / HOUR, eh = sh + (+m.runtime_minutes || 0) / 60;
    days.add(dayMs); minH = Math.min(minH, Math.floor(sh)); maxH = Math.max(maxH, Math.ceil(eh)); any = true;
  }
  if (!any) return { days: [], hours: [] };
  const hours = [];
  for (let h = minH; h < maxH; h++) hours.push(h);
  return { days: [...days].sort((a, b) => a - b), hours };
}

// Collapse the "can't attend" cell set into [start,end] windows per day (contiguous
// runs of free hours). Empty set => [] (no restriction). Pure: tested by _availTest.
function windowsFromCells(days, hours, unavail) {
  if (!unavail.size) return [];
  const out = [];
  for (const d of days) {
    let runStart = null;
    for (const hr of hours) {
      const free = !unavail.has(d + "|" + hr);
      if (free && runStart === null) runStart = hr;
      if (!free && runStart !== null) { out.push([d + runStart * HOUR, d + hr * HOUR]); runStart = null; }
    }
    if (runStart !== null) out.push([d + runStart * HOUR, d + (hours[hours.length - 1] + 1) * HOUR]);
  }
  return out;
}
const availWindows = () => windowsFromCells(GRID.days, GRID.hours, UNAVAIL);

// =====================================================================  LOAD
async function init() {
  $("solve").addEventListener("click", solveAndShow);
  $("back").addEventListener("click", showView1);
  $("buf").addEventListener("change", (e) => { BUF = +e.target.value || 30; saveJSON("buf", BUF); });
  $("samebuf").addEventListener("change", (e) => { SAMEBUF = +e.target.value || 10; saveJSON("samebuf", SAMEBUF); });
  $("priofirst").addEventListener("change", (e) => { PRIOFIRST = e.target.checked; saveJSON("prioritizefirst", PRIOFIRST); });
  // availability grid: click or drag (mouse/touch/pen) to paint "can't attend".
  // On touch the pointer is captured to the start cell, so we hit-test by coordinates.
  // touch: tap toggles one cell, swipe (any direction) scrolls the grid — so a
  // move/cancel before pointerup means "scroll", not "paint". mouse/pen: drag-paint.
  let tapCell = null;
  $("avail").addEventListener("pointerdown", (e) => {
    const td = e.target.closest("td.cell"); if (!td) return;
    if (e.pointerType === "touch") { tapCell = td; return; } // defer; let the browser scroll
    e.preventDefault(); painting = true; paintOff = !UNAVAIL.has(td.dataset.k); applyCell(td);
  });
  document.addEventListener("pointermove", (e) => {
    if (tapCell && e.pointerType === "touch") tapCell = null; // moved => it's a scroll, not a tap
    if (!painting) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const td = el && el.closest && el.closest("td.cell"); if (td) applyCell(td);
  });
  document.addEventListener("pointercancel", () => { tapCell = null; });
  document.addEventListener("pointerup", () => {
    if (tapCell) { paintOff = !UNAVAIL.has(tapCell.dataset.k); applyCell(tapCell); tapCell = null; saveJSON("unavail", [...UNAVAIL]); }
    if (painting) { painting = false; saveJSON("unavail", [...UNAVAIL]); }
  });
  $("availreset").addEventListener("click", () => { UNAVAIL.clear(); saveJSON("unavail", []); renderAvailGrid(); });
  // timeline: select a screening block to reveal its action bar (ignore venue links)
  $("board").addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const blk = e.target.closest(".blk"); if (!blk) return;
    const d = blk.dataset, k = { title: d.title, start: +d.start, end: +d.end, venue: d.venue };
    SELECTED = (SELECTED && SELECTED.title === k.title && SELECTED.start === k.start && SELECTED.venue === k.venue) ? null : k;
    renderActions(); drawBoard(CURRENT_LIVE);
  });
  // overrides panel: undo a lock / restore a sold-out screening / clear availability
  $("overrides").addEventListener("click", (e) => {
    const a = e.target.closest("[data-undo]"); if (!a) return;
    const kind = a.dataset.undo, key = a.dataset.key;
    if (kind === "lock") { const l = getLocks(); delete l[key.split(SEP)[0]]; refreshAfterLock(l); return; } // lock doesn't affect schedule
    if (kind === "soldout") { const so = getSoldOut(); so.delete(key); setSoldOut(so); }
    else if (kind === "avail") { UNAVAIL.clear(); saveJSON("unavail", []); renderAvailGrid(); }
    resolveOverrides();
  });
  // chip rows: toggle a curatorial track (view) or an access tier (view + schedulability)
  const toggleSet = (set, k) => { set.has(k) ? set.delete(k) : set.add(k); };
  $("trackchips").addEventListener("click", (e) => {
    const c = e.target.closest("[data-track]"); if (!c) return;
    toggleSet(TRACKSOFF, c.dataset.track); setTracksOff([...TRACKSOFF]); renderChips(); renderCatalog();
  });
  $("tierchips").addEventListener("click", (e) => {
    const c = e.target.closest("[data-tier]"); if (!c) return;
    toggleSet(TIERSOFF, c.dataset.tier); setTiersOff([...TIERSOFF]); renderChips(); renderCatalog();
  });
  // catalog tagging via event delegation (titles may contain quotes/apostrophes)
  $("catalog").addEventListener("click", (e) => {
    // progressive disclosure: click a clamped synopsis to expand/collapse it
    const bl = e.target.closest(".mblurb:not(.muted)");
    if (bl) { bl.classList.toggle("expanded"); return; }
    const b = e.target.closest("button[data-title]");
    if (!b) return;
    const sel = getSel();
    sel[b.dataset.title] = b.dataset.status;
    setSel(sel);
    renderCatalog();
  });
  try {
    const r = await fetch("catalog.json");
    if (!r.ok) throw new Error("HTTP " + r.status);
    useCatalog(await r.json());
  } catch (err) {
    $("hint").textContent = "Could not load catalog.json (" + err.message + "). Serve this folder over http (e.g. `python3 -m http.server`).";
  }
}

function useCatalog(cat) {
  CATALOG = cat;
  LOCATIONS = cat.locations || {};
  const name = cat.festival || "Festival";
  $("festival").textContent = name;
  document.title = name + " Planner";
  $("hint").textContent = "";
  // buffers are user options, persisted per festival (defaults 30 / 10)
  BUF = +getBuf() || 30;
  SAMEBUF = +getSameBuf() || 10;
  PRIOFIRST = getPrioFirst();
  $("buf").value = BUF;
  $("samebuf").value = SAMEBUF;
  $("priofirst").checked = PRIOFIRST;
  TRACKSOFF = new Set(getTracksOff());
  TIERSOFF = new Set(getTiersOff());
  GRID = computeGrid();
  UNAVAIL = new Set(loadJSON("unavail", []));
  renderAvailGrid();
  renderChips();
  renderCatalog();
  // if every film is already tagged (and something's worth solving), jump to results
  const sel = getSel();
  const movies = CATALOG.movies || [];
  const allTagged = movies.length && movies.every((m) => sel[m.title]);
  const anyPicked = movies.some((m) => sel[m.title] === "must" || sel[m.title] === "want");
  if (allTagged && anyPicked) solveAndShow();
  else showView1();
}

// ---- chip visibility (pure given TRACKSOFF / TIERSOFF). Tested by test_app.
// A screening is "allowed" if it needs no special access (no/empty accessTiers)
// or the user marked one of its tiers allowed. Public always shows.
const screeningAllowed = (s) => !s.accessTiers || !s.accessTiers.length || s.accessTiers.some((t) => !TIERSOFF.has(t));
// A movie shows in View 1 when at least one curatorial track is on (no tracks =>
// always) AND it has at least one allowed screening (hides P&I-only when P&I off).
const movieVisible = (m) =>
  ((m.tracks || []).length === 0 || (m.tracks || []).some((t) => !TRACKSOFF.has(t)))
  && (m.screenings || []).some(screeningAllowed);

// Render the two View 1 chip rows: curatorial tracks (view filter) and access
// tiers ("allowed access" — also gates which screenings are schedulable).
function renderChips() {
  const tracks = CATALOG.tracks || {};
  $("trackchips").innerHTML = Object.entries(tracks)
    .map(([id, name]) => `<button type="button" class="chipf${TRACKSOFF.has(id) ? " off" : ""}" data-track="${esc(id)}">${esc(name)}</button>`).join("");
  const tiers = CATALOG.accessTiers || {};
  const row = $("tieropt");
  if (!Object.keys(tiers).length) { row.hidden = true; return; }
  row.hidden = false;
  $("tierchips").innerHTML = Object.entries(tiers)
    .map(([id, name]) => `<button type="button" class="chipf access${TIERSOFF.has(id) ? " off" : ""}" data-tier="${esc(id)}">${esc(name)}</button>`).join("");
}

// =====================================================================  VIEW 1
function renderCatalog() {
  const sel = getSel();
  const counts = { must: 0, want: 0, skip: 0 };
  const trackNames = CATALOG.tracks || {};
  let rows = "";
  for (const m of (CATALOG.movies || [])) {
    const cur = effStatus(sel, m.title);
    counts[cur]++;
    if (!movieVisible(m)) continue;
    const btns = STATUSES.map((st) =>
      `<button class="tag ${st}${cur === st ? " on" : ""}" data-title="${esc(m.title)}" data-status="${st}">${STATUS_LABEL[st]}</button>`
    ).join("");
    const blurb = m.blurb
      ? `<div class="mblurb" title="Click to expand">${esc(m.blurb)}</div>`
      : `<div class="mblurb muted">(no synopsis)</div>`;
    const img = m.image_url
      ? `<img class="mimg" src="${esc(m.image_url)}" alt="" loading="lazy">`
      : `<div class="mimg placeholder">🎬</div>`;
    // meta row: track badge(s) + runtime + screening count (only what the catalog has)
    const trk = (m.tracks || []).map((id) => `<span class="trk">${esc(trackNames[id] || id)}</span>`).join("");
    const rt = m.runtime_minutes;
    const runtime = rt ? `<span class="mrt">${rt >= 60 ? `${(rt / 60 | 0)}h ${pad(rt % 60)}m` : `${rt}m`}</span>` : "";
    const nScr = (m.screenings || []).filter(screeningAllowed).length;
    const screenings = nScr ? `<span class="mrt">· ${nScr} screening${nScr > 1 ? "s" : ""}</span>` : "";
    const titleHtml = m.source_url
      ? `<a class="mtitle" href="${esc(m.source_url)}" target="_blank" rel="noopener">${esc(m.title)} ↗</a>`
      : `<div class="mtitle">${esc(m.title)}</div>`;
    const authors = m.authors ? `<div class="mauthors">${esc(m.authors)}</div>` : "";
    rows += `<div class="movie ${cur}">${img}`
      + `<div class="minfo">${titleHtml}${authors}<div class="mmeta">${trk}${runtime}${screenings}</div></div>`
      + `${blurb}<div class="tags">${btns}</div></div>`;
  }
  $("catalog").innerHTML = rows;
  $("counts").innerHTML =
    `<b>${counts.must}</b> must · <b>${counts.want}</b> want · ${counts.skip} skip`;
  $("solve").disabled = counts.must + counts.want === 0;
}

// availability grid (day columns × hour rows; hours may exceed 24 for late slots)
const dayHdr = (ms) => { const d = new Date(ms); return `${WD[d.getUTCDay()].slice(0, 3)} ${MO[d.getUTCMonth()].slice(0, 3)} ${pad(d.getUTCDate())}`; };
function renderAvailGrid() {
  const { days, hours } = GRID;
  if (!days.length) { $("avail").innerHTML = '<p class="muted">No screenings to schedule.</p>'; return; }
  let h = `<table class="availgrid"><thead><tr><th></th>${days.map((d) => `<th>${dayHdr(d)}</th>`).join("")}</tr></thead><tbody>`;
  for (const hr of hours) {
    h += `<tr><th class="hh">${pad(hr % 24)}:00</th>`;
    for (const d of days) {
      const k = d + "|" + hr;
      h += `<td class="cell${UNAVAIL.has(k) ? " off" : ""}" data-k="${k}"></td>`;
    }
    h += "</tr>";
  }
  $("avail").innerHTML = h + "</tbody></table>";
}
function applyCell(td) {
  const k = td.dataset.k;
  if (paintOff) { UNAVAIL.add(k); td.classList.add("off"); }
  else { UNAVAIL.delete(k); td.classList.remove("off"); }
}

// =====================================================================  SOLVE
// Build the included movie objects (must/want) with validated screenings.
function buildIncluded() {
  const sel = getSel();
  const windows = availWindows();
  const locks = getLocks(), soldOut = getSoldOut();
  const included = [];
  for (const m of (CATALOG.movies || [])) {
    const status = sel[m.title];
    if (status !== "must" && status !== "want") continue;
    const lockKey = locks[m.title]; // locked to this exact screening, or undefined
    // only "allowed" screenings are schedulable candidates — a disallowed access
    // tier (e.g. P&I when you don't hold that access) is never booked.
    const screenings = (m.screenings || []).filter(screeningAllowed).map((s) => {
      const start = parseDT(s.start);
      const end = s.end ? parseDT(s.end) : start + (+m.runtime_minutes || 0) * 60000;
      const key = scrKey(m.title, start, s.venue || "?");
      let invalidReason = null;
      if (lockKey) {
        // a locked film keeps ONLY its locked screening (overrides sold-out/availability)
        if (key !== lockKey) invalidReason = "not your locked screening";
      } else if (soldOut.has(key)) {
        invalidReason = "marked sold out / no tickets";
      } else if (windows.length && !windows.some(([a, b]) => a <= start && end <= b)) {
        invalidReason = "outside your availability";
      }
      return { start, end, venue: s.venue || "?", location: s.location || "", key, invalidReason };
    });
    // locked films are pinned: force must so the solver never drops them
    included.push({ title: m.title, priority: lockKey ? "must" : status, locked: !!lockKey, screenings, valid: screenings.filter((s) => !s.invalidReason) });
  }
  return included;
}

// stable identity of a branch choice: the film you end up watching at this slot —
// b.watch for a "watch X" branch, else the film(s) gained by skipping. Uses film
// titles (stable across re-solves), not option indices (which are reassigned).
const branchSig = (n, b) => { const before = inter(nodeOpts(n), "keep"); return b.watch || inter(b.options, "keep").filter((t) => !before.includes(t)).sort().join("|"); };
// describe current picks as (when, sig) against the live TREE, so we can re-apply
// the ones that still exist after the tree is rebuilt.
const picksToChoices = (picks) => { const out = []; let n = TREE; for (const i of picks) { if (!n || !n.branches || !n.branches[i]) break; const b = n.branches[i]; out.push({ when: b.when, sig: branchSig(n, b) }); n = b.child; } return out; };
// re-apply choices to a new tree, keeping the longest matching prefix (user only
// re-picks where the new options actually diverge from before).
const choicesToPicks = (choices, tree) => { const picks = []; let n = tree; for (const c of choices) { if (!n.branches) break; const idx = n.branches.findIndex((b) => b.when === c.when && branchSig(n, b) === c.sig); if (idx < 0) break; picks.push(idx); n = n.branches[idx].child; } return picks; };

function solveAndShow() {
  const prevChoices = TREE ? picksToChoices(getPicks()) : null; // null = fresh load, use stored picks as-is
  LOCKS = getLocks();
  const included = buildIncluded();
  MOVIES = included;
  PRIO = Object.fromEntries(included.map((m) => [m.title, m.priority]));
  const { cost, plans } = TiffSolver.solve(included, BUF, SAMEBUF, MAXPLANS, PRIOFIRST);
  const groups = groupPlans(plans, MAXPLANS);
  computeView(groups);
  renderOverrides();
  saveJSON("cost", cost);
  let picks = prevChoices ? choicesToPicks(prevChoices, TREE) : getPicks();
  if (!validPicks(picks, TREE)) picks = [];
  if (!("branches" in nodeAt(picks))) RESOLVE_NOTICE = false; // nothing left to choose -> no "review" prompt
  showView2();
  render(picks);
}

// group optimal plans by the SET of kept movies; one representative each, most first.
function groupPlans(plans, maxPlans) {
  const groups = new Map();
  for (const p of plans) {
    const key = Object.keys(p).filter((t) => p[t]).sort().join("|");
    const g = groups.get(key) || { rep: p, variants: 0 };
    g.variants++; groups.set(key, g);
  }
  const kept = (p) => Object.values(p).filter(Boolean).length;
  return [...groups.values()].sort((a, b) => kept(b.rep) - kept(a.rep)).slice(0, maxPlans);
}

// ---- data-prep ports (split_common / decision_tree / explain_conflicts / DAYS)
function splitCommon(reps) {
  const outcome = (s) => (s ? `${s.start}|${s.end}|${s.venue}` : "null");
  const variable = new Set();
  for (const t of Object.keys(reps[0])) {
    if (new Set(reps.map((p) => outcome(p[t]))).size > 1) variable.add(t);
  }
  return variable;
}

function decisionTree(repsIdx, variable) {
  const watchedAt = (plan, T) => { for (const t of variable) if (plan[t] && plan[t].start === T) return t; return null; };
  function build(opts) {
    if (opts.length === 1) return { option: opts[0][0] };
    const starts = [...new Set(opts.flatMap(([, p]) => [...variable].filter((t) => p[t]).map((t) => p[t].start)))].sort((a, b) => a - b);
    for (const T of starts) {
      const groups = new Map();
      for (const [i, p] of opts) { const k = watchedAt(p, T); (groups.get(k) || groups.set(k, []).get(k)).push([i, p]); }
      if (groups.size > 1) {
        const branches = [...groups.entries()]
          .sort((a, b) => (a[0] === null ? 1 : b[0] === null ? -1 : a[0] < b[0] ? -1 : 1))
          .map(([title, sub]) => ({ watch: title, when: whenLabel(T), options: sub.map(([i]) => i).sort((x, y) => x - y), child: build(sub) }));
        return { when: whenLabel(T), branches };
      }
    }
    return { branches: opts.map(([i]) => ({ watch: null, when: null, options: [i], child: { option: i } })) };
  }
  return build(repsIdx);
}

function explainConflicts(plan) {
  const byTitle = Object.fromEntries(MOVIES.map((m) => [m.title, m]));
  const scheduled = Object.entries(plan).filter(([, s]) => s);
  const notes = [];
  for (const [title, s] of Object.entries(plan)) {
    if (s) continue;
    const mv = byTitle[title];
    const reasons = mv.screenings.map((sc) => {
      if (sc.invalidReason) return `${scLabel(sc)}: ${sc.invalidReason}`;
      const blockers = scheduled.filter(([, o]) => !TiffSolver.compatible(sc, o, BUF, SAMEBUF))
        .map(([t, o]) => `${t} (${scLabel(o)})`);
      return `${scLabel(sc)}: conflicts with ${blockers.join(", ") || "?"}`;
    });
    notes.push({ title, priority: mv.priority, reasons });
  }
  return notes;
}

function computeView(groups) {
  const reps = groups.map((g) => g.rep);
  NOPT = reps.length;
  const variable = splitCommon(reps);
  TREE = decisionTree(reps.map((p, i) => [i + 1, p]), variable);
  OPT = {}; REASONS = {};
  reps.forEach((p, idx) => {
    const i = idx + 1;
    OPT[i] = { keep: Object.keys(p).filter((t) => p[t]).sort(), drop: Object.keys(p).filter((t) => !p[t]).sort() };
    REASONS[i] = Object.fromEntries(explainConflicts(p).filter((x) => variable.has(x.title)).map((x) => [x.title, x.reasons]));
  });
  // always-out: dropped in every option
  ALWAYS_OUT = reps.length ? OPT[1].drop.filter((t) => reps.every((_, i) => OPT[i + 1].drop.includes(t))) : [];

  // DAYS: per-day time-proportional block data, layout done at draw time.
  const usage = new Map();
  reps.forEach((p, idx) => {
    for (const [t, s] of Object.entries(p)) if (s) {
      const k = `${t}|${s.start}|${s.end}|${s.venue}`;
      (usage.get(k) || usage.set(k, { t, s, opts: [] }).get(k)).opts.push(idx + 1);
    }
  });
  const byDay = new Map();
  for (const { t, s, opts } of usage.values()) {
    const d = dayLabel(s.start);
    (byDay.get(d) || byDay.set(d, []).get(d)).push({ start: s.start, end: s.end, title: t, venue: s.venue, location: s.location, key: s.key, opts: opts.sort((a, b) => a - b) });
  }
  DAYS = [...byDay.entries()]
    .sort((a, b) => Math.min(...a[1].map((x) => x.start)) - Math.min(...b[1].map((x) => x.start)))
    .map(([label, items]) => {
      items.sort((a, b) => a.start - b.start || a.end - b.end);
      const d0 = Math.min(...items.map((x) => x.start)); const d0h = d0 - (d0 % 3600000);
      const d1 = Math.max(...items.map((x) => x.end));
      const hours = [];
      for (let t = d0h; t <= d1; t += 3600000) hours.push({ y: (t - d0h) / 60000, label: hm(t) });
      return {
        label, height: (d1 - d0h) / 60000, hours,
        blocks: items.map((b) => ({
          top: (b.start - d0h) / 60000, h: (b.end - b.start) / 60000,
          time: `${hm(b.start)}–${hm(b.end)}`, title: b.title, venue: b.venue, location: b.location,
          start: b.start, end: b.end, key: b.key, prio: PRIO[b.title], opts: b.opts,
        })),
      };
    });

  // always-out banner
  if (ALWAYS_OUT.length) {
    let det = "";
    for (const x of explainConflicts(reps[0])) if (ALWAYS_OUT.includes(x.title))
      det += `<div class="conflict"><strong>${esc(x.title)}</strong> (${x.priority})<ul>${x.reasons.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>`;
    $("glob").innerHTML = `<details class="alwaysout"><summary>✗ Not possible in any option (${ALWAYS_OUT.length}): ${ALWAYS_OUT.map(esc).join(", ")}</summary>${det}</details>`;
  } else $("glob").innerHTML = "";
  $("optcount").textContent = `${NOPT} optimal option${NOPT === 1 ? "" : "s"}`;
}

function validPicks(picks, tree) {
  let n = tree;
  for (const i of picks) { if (!n.branches || i < 0 || i >= n.branches.length) return false; n = n.branches[i].child; }
  return true;
}

// =====================================================================  VIEW 2 (board + wizard)
function runs(cols) { // contiguous runs of column indices -> [[a,b],...]
  const r = []; let a = cols[0], p = cols[0];
  for (let k = 1; k <= cols.length; k++) { const c = cols[k]; if (c !== p + 1) { r.push([a, p]); a = c; } p = c; }
  return r;
}
// venue label for a timeline block. If the screening's location resolves in the
// catalog's locations map, link it to the default maps app; else plain venue text.
function venueHtml(locId, venue) {
  const loc = LOCATIONS[locId];
  if (!loc) return `<div class="bvenue">${esc(venue)}</div>`;
  const q = encodeURIComponent([loc.name, loc.address].filter(Boolean).join(", ") || venue);
  return `<a class="bvenue" href="https://maps.google.com/?q=${q}" target="_blank" rel="noopener">${esc(loc.name || venue)}</a>`;
}
function drawBoard(live) {
  CURRENT_LIVE = live;
  const L = [...live].sort((x, y) => x - y), nc = L.length, pos = {};
  L.forEach((o, i) => (pos[o] = i));
  let html = "";
  for (const day of DAYS) {
    const vis = day.blocks.filter((b) => b.opts.some((o) => live.includes(o)));
    if (!vis.length) continue;
    let hl = ""; for (const hr of day.hours) hl += `<div class="hline" style="top:${hr.y}px"><span>${hr.label}</span></div>`;
    let vl = ""; for (let k = 1; k < nc; k++) vl += `<div class="vline" style="left:${100 * k / nc}%"></div>`;
    let bl = "";
    for (const b of vis) {
      const cols = b.opts.filter((o) => live.includes(o)).map((o) => pos[o]).sort((x, y) => x - y);
      for (const [a, z] of runs(cols)) {
        const left = 100 * a / nc, width = 100 * (z - a + 1) / nc, full = (z - a + 1) === nc;
        const h = Math.max(b.h - 2, 28);
        const locked = LOCKS[b.title] === b.key;
        const isSel = SELECTED && SELECTED.title === b.title && SELECTED.start === b.start && SELECTED.venue === b.venue;
        const cls = "blk " + (b.prio === "must" ? "must" : "want") + (full ? "" : " contested")
          + (b.h < 70 ? " small" : "") + (locked ? " locked" : "") + (isSel ? " selected" : "");
        bl += `<div class="${cls}" title="${esc(b.title)} — ${esc(b.venue)} — ${b.time}" `
          + `data-title="${esc(b.title)}" data-start="${b.start}" data-end="${b.end}" data-venue="${esc(b.venue)}" `
          + `style="top:${b.top}px;height:${h}px;left:calc(${left}% + 2px);width:calc(${width}% - 5px)">`
          + `<div class="btime">${locked ? "🔒 " : ""}${b.time}</div><div class="btitle">${full ? "" : "★ "}${esc(b.title)}</div>`
          + venueHtml(b.location, b.venue) + `</div>`;
      }
    }
    const heads = nc > 1
      ? `<div class="optrow" style="grid-template-columns:repeat(${nc},1fr);min-width:${nc * 110}px">`
      + L.map((o) => `<div class="och" onclick="drawBoard([${o}])" title="show only option ${o}">O${o}</div>`).join("") + "</div>"
      : "";
    const tlw = nc > 1 ? `min-width:${nc * 110}px` : "";
    html += `<div class="day${nc > 1 ? " scrollx" : ""}"><h3>${esc(day.label)}</h3><div class="tlwrap">${heads}`
      + `<div class="tl" style="height:${day.height + 24}px;${tlw}">${hl}${vl}${bl}</div></div></div>`;
  }
  const hint = nc > 1 ? `<div class="scrollhint">↔ ${nc} options shown side by side — scroll sideways to compare them.</div>` : "";
  const notice = RESOLVE_NOTICE
    ? `<div class="updnotice" onclick="document.getElementById('wiz').scrollIntoView({behavior:'smooth'});this.remove()">✓ Schedule updated${NOPT > 1 ? ` — ${NOPT} options now` : ""} — tap to review ↑</div>`
    : "";
  RESOLVE_NOTICE = false;
  $("board").innerHTML = notice + hint + html;
}

// ---- timeline overrides: action bar for the selected block + the undo panel
function renderActions() {
  const el = $("blockactions");
  if (!SELECTED) { el.hidden = true; el.innerHTML = ""; return; }
  const { title, start, venue } = SELECTED;
  const locked = LOCKS[title] === scrKey(title, start, venue);
  let h = `<div class="ba-label"><b>${esc(title)}</b> · ${esc(whenLabel(start))} @ ${esc(venue)}</div><div class="ba-btns">`;
  if (locked) {
    h += `<button onclick="unlockSel()">🔓 Unlock</button>`;
  } else {
    h += `<button onclick="lockSel()">🔒 I have tickets — lock this</button>`
      + `<button onclick="soldoutSel()">🚫 Sold out — drop this screening</button>`;
  }
  h += `<button onclick="cantmakeSel()">🗓 I can't make this time</button>`
    + `<button class="ba-cancel" onclick="cancelSel()">Cancel</button></div>`;
  el.innerHTML = h; el.hidden = false;
}

function renderOverrides() {
  const locks = getLocks(), soldOut = [...getSoldOut()];
  const parts = [];
  for (const t in locks) {
    const [, start, venue] = locks[t].split(SEP);
    parts.push(`<span class="ov lock">🔒 ${esc(t)} · ${esc(whenLabel(+start))} @ ${esc(venue)}`
      + `<a data-undo="lock" data-key="${esc(locks[t])}">unlock</a></span>`);
  }
  for (const key of soldOut) {
    const [t, start, venue] = key.split(SEP);
    parts.push(`<span class="ov drop">🚫 ${esc(t)} · ${esc(whenLabel(+start))} @ ${esc(venue)}`
      + `<a data-undo="soldout" data-key="${esc(key)}">restore</a></span>`);
  }
  if (UNAVAIL.size) parts.push(`<span class="ov avail">🗓 ${UNAVAIL.size} blocked time slot${UNAVAIL.size === 1 ? "" : "s"}`
    + `<a data-undo="avail">clear</a></span>`);
  $("overrides").innerHTML = parts.length ? `<span class="ov-h">Overrides:</span> ${parts.join(" ")}` : "";
}

// apply an override then re-solve from a clean slate (the option tree changes)
function resolveOverrides() { SELECTED = null; RESOLVE_NOTICE = true; solveAndShow(); renderActions(); } // solveAndShow re-applies still-valid picks
function addUnavailRange(start, end) {
  const day = start - (start % DAYMS), h0 = Math.floor((start - day) / HOUR), h1 = Math.ceil((end - day) / HOUR);
  for (let h = h0; h < h1; h++) UNAVAIL.add(day + "|" + h);
  saveJSON("unavail", [...UNAVAIL]); renderAvailGrid();
}
// lock/unlock = "I have tickets" on the already-scheduled screening: just record
// it so future re-solves keep it pinned. Doesn't change the current schedule, so
// don't re-run the solver or reset the wizard.
function refreshAfterLock(l) { setLocks(l); LOCKS = l; SELECTED = null; renderOverrides(); renderActions(); drawBoard(CURRENT_LIVE); }
window.lockSel = () => { const { title, start, venue } = SELECTED; const l = getLocks(); l[title] = scrKey(title, start, venue); refreshAfterLock(l); };
window.unlockSel = () => { const l = getLocks(); delete l[SELECTED.title]; refreshAfterLock(l); };
window.soldoutSel = () => { const { title, start, venue } = SELECTED; const so = getSoldOut(); so.add(scrKey(title, start, venue)); setSoldOut(so); resolveOverrides(); };
window.cantmakeSel = () => { addUnavailRange(SELECTED.start, SELECTED.end); resolveOverrides(); };
window.cancelSel = () => { SELECTED = null; renderActions(); drawBoard(CURRENT_LIVE); };

const nodeAt = (picks) => { let n = TREE; for (const i of picks) n = n.branches[i].child; return n; };
const nodeOpts = (node) => ("option" in node ? [node.option] : [...new Set(node.branches.flatMap((b) => b.options))]);
function inter(opts, field) { // titles in `field` of EVERY option in opts
  let s = null;
  for (const o of opts) { const cur = new Set(OPT[o][field]); s = s ? s.filter((t) => cur.has(t)) : [...cur]; }
  return (s || []).sort();
}
const chip = (t, kind) => `<span class="chip ${kind}${PRIO[t] === "must" ? " must" : ""}">${esc(t)}</span>`;

function render(picks) {
  setPicks(picks);
  const node = nodeAt(picks), live = nodeOpts(node);
  const final = "option" in node;
  drawBoard(live);
  let h = final
    ? ""
    : '<p class="muted">Pick a screening at each step. Each choice drops the ruled-out options from the timeline below; the last choice leaves one clean schedule.</p>';
  if (picks.length) {
    h += '<div class="wtrail">'; let n = TREE;
    picks.forEach((idx, k) => {
      const b = n.branches[idx];
      const before = inter(nodeOpts(n), "keep"), watch = b.watch || inter(b.options, "keep").filter((t) => !before.includes(t)).join(" / ");
      h += `<span class="wcrumb">${b.when}: ${watch ? "▶ " + esc(watch) : "(nothing)"}<a onclick="render([${picks.slice(0, k)}])">✕</a></span>`;
      n = b.child;
    });
    h += "</div>";
  }
  const keep = inter(live, "keep"), drop = inter(live, "drop");
  if (final) {
    h += `<div class="wfinal done"><div class="wdone">✓ Your schedule is set</div>`;
    h += `<h4>Keeps ${keep.length} film${keep.length === 1 ? "" : "s"}${drop.length ? `, gives up ${drop.length}` : ""}</h4>`;
    h += "<div>" + keep.map((t) => chip(t, "get")).join("") + drop.map((t) => chip(t, "lose")).join("") + "</div>";
    const rs = REASONS[node.option] || {};
    if (Object.keys(rs).length) {
      h += '<details class="wreasons"><summary>why the given-up films don\'t fit</summary>';
      for (const t in rs) h += `<strong>${esc(t)}</strong><ul>` + rs[t].map((r) => `<li>${esc(r)}</li>`).join("") + "</ul>";
      h += "</details>";
    }
    h += `<p class="muted" style="margin:8px 0 0">This is your schedule — follow the timeline below. Edit a pick via the steps above, or start over.</p>`;
    h += "</div>";
  } else {
    h += `<p class="muted" style="margin:6px 0 0">Locked in: ${keep.length} kept${drop.length ? ", " + drop.length + " dropped" : ""}.</p>`;
    h += `<div class="wq">Next choice — ${node.when}:</div>`;
    node.branches.forEach((b, idx) => {
      const bk = inter(b.options, "keep"), bd = inter(b.options, "drop");
      const gain = bk.filter((t) => !keep.includes(t)), lose = bd.filter((t) => !drop.includes(t));
      const label = b.watch ? "Watch " + esc(b.watch)
        : gain.length ? "Watch " + gain.map(esc).join(" / ") + " instead"
        : "Skip this slot (watch nothing here)";
      h += `<button class="wbtn" onclick="render([${picks.concat(idx)}])"><b>${label}</b>`
        + `<div class="leads">→ leads to: ` + gain.map((t) => chip(t, "get")).join("") + lose.map((t) => chip(t, "lose")).join("")
        + (gain.length || lose.length ? "" : '<span class="muted">narrows timing only</span>') + "</div></button>";
    });
  }
  if (picks.length) h += '<button class="wreset" onclick="render([])">↺ start over</button>';
  $("wiz").innerHTML = h;
}

// ---- navigation
function showView1() { $("view2").hidden = true; $("view1").hidden = false; scrollTo(0, 0); }
function showView2() { const entering = $("view2").hidden; $("view1").hidden = true; $("view2").hidden = false; if (entering) scrollTo(0, 0); }

window.render = render; window.drawBoard = drawBoard; // referenced by inline onclick

// runnable check for the availability cell->window conversion (run `_availTest()`)
window._availTest = () => {
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b), W = (h) => h * HOUR;
  const days = [0], hours = [9, 10, 11, 12];
  console.assert(eq(windowsFromCells(days, hours, new Set()), []), "no removals => no restriction");
  console.assert(eq(windowsFromCells(days, hours, new Set(["0|11"])), [[W(9), W(11)], [W(12), W(13)]]), "split around a gap");
  console.assert(eq(windowsFromCells(days, hours, new Set(["0|12"])), [[W(9), W(12)]]), "trailing hour removed");
  console.assert(eq(windowsFromCells(days, hours, new Set(["0|9"])), [[W(10), W(13)]]), "leading hour removed");
  return "ok";
};

init();
