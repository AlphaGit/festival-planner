// Festival planner — static-page app. View 1: tag the catalog (must/want/skip/
// unavailable, persisted to localStorage). View 2: solver options + decision
// wizard + the schedule to follow (also persisted). Pure browser, no build step.
// Depends on solver.js (TiffSolver) loaded first.
"use strict";

const MAXPLANS = 8;
const STATUSES = ["must", "want", "skip"];
const STATUS_LABEL = { must: "Must", want: "Want", skip: "Not interested/not available" };
// effective status: default to skip; fold legacy "unavailable" into skip
const effStatus = (sel, title) => { const s = sel[title]; return s === "unavailable" ? "skip" : (s || "skip"); };

// ---- module state (set per solve, read by the board/wizard renderers)
let CATALOG = null, MOVIES = [], BUF = 30, SAMEBUF = 10, TRACKFILTER = "";
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

// =====================================================================  LOAD
async function init() {
  $("solve").addEventListener("click", solveAndShow);
  $("back").addEventListener("click", showView1);
  $("buf").addEventListener("change", (e) => { BUF = +e.target.value || 30; saveJSON("buf", BUF); });
  $("samebuf").addEventListener("change", (e) => { SAMEBUF = +e.target.value || 10; saveJSON("samebuf", SAMEBUF); });
  $("trackfilter").addEventListener("change", (e) => { TRACKFILTER = e.target.value; renderCatalog(); });
  // catalog tagging via event delegation (titles may contain quotes/apostrophes)
  $("catalog").addEventListener("click", (e) => {
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
  const name = cat.festival || "Festival";
  $("festival").textContent = name;
  document.title = name + " Planner";
  $("hint").textContent = "";
  // buffers are user options, persisted per festival (defaults 30 / 10)
  BUF = +getBuf() || 30;
  SAMEBUF = +getSameBuf() || 10;
  $("buf").value = BUF;
  $("samebuf").value = SAMEBUF;
  // track filter options from the root tracks map
  const tracks = cat.tracks || {};
  $("trackfilter").innerHTML = `<option value="">All tracks</option>`
    + Object.entries(tracks).map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join("");
  renderCatalog();
  // if every film is already tagged (and something's worth solving), jump to results
  const sel = getSel();
  const movies = CATALOG.movies || [];
  const allTagged = movies.length && movies.every((m) => sel[m.title]);
  const anyPicked = movies.some((m) => sel[m.title] === "must" || sel[m.title] === "want");
  if (allTagged && anyPicked) solveAndShow();
  else showView1();
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
    if (TRACKFILTER && !(m.tracks || []).includes(TRACKFILTER)) continue;
    const scr = (m.screenings || [])
      .map((s) => `${whenLabel(parseDT(s.start))}${s.available === false ? " (no tickets)" : ""} · ${esc(s.venue || "?")}`)
      .join("<br>");
    const btns = STATUSES.map((st) =>
      `<button class="tag ${st}${cur === st ? " on" : ""}" data-title="${esc(m.title)}" data-status="${st}">${STATUS_LABEL[st]}</button>`
    ).join("");
    const blurb = m.blurb ? `<div class="mblurb">${esc(m.blurb)}</div>` : "";
    const img = m.image_url ? `<img class="mimg" src="${esc(m.image_url)}" alt="" loading="lazy">` : "";
    const trk = (m.tracks || []).length
      ? `<div class="mtracks">${m.tracks.map((id) => `<span class="trk">${esc(trackNames[id] || id)}</span>`).join("")}</div>`
      : "";
    rows += `<div class="movie">${img}<div class="minfo"><div class="mtitle">${esc(m.title)}</div>`
      + `${trk}${blurb}<div class="mscr">${scr}</div></div><div class="tags">${btns}</div></div>`;
  }
  $("catalog").innerHTML = rows;
  $("counts").innerHTML =
    `<b>${counts.must}</b> must · <b>${counts.want}</b> want · ${counts.skip} not interested`;
  $("solve").disabled = counts.must + counts.want === 0;
}

// =====================================================================  SOLVE
// Build the included movie objects (must/want) with validated screenings.
function buildIncluded() {
  const sel = getSel();
  const windows = (CATALOG.availability || []).map((w) =>
    typeof w === "object" ? [parseDT(w.start), parseDT(w.end)] : null).filter(Boolean);
  const included = [];
  for (const m of (CATALOG.movies || [])) {
    const status = sel[m.title];
    if (status !== "must" && status !== "want") continue;
    const screenings = (m.screenings || []).map((s) => {
      const start = parseDT(s.start);
      const end = s.end ? parseDT(s.end) : start + (+m.runtime_minutes || 0) * 60000;
      let invalidReason = null;
      if (s.available === false) invalidReason = "marked unavailable (sold out / no tickets)";
      else if (windows.length && !windows.some(([a, b]) => a <= start && end <= b)) invalidReason = "outside your availability windows";
      return { start, end, venue: s.venue || "?", invalidReason };
    });
    included.push({ title: m.title, priority: status, screenings, valid: screenings.filter((s) => !s.invalidReason) });
  }
  return included;
}

function solveAndShow() {
  const included = buildIncluded();
  MOVIES = included;
  PRIO = Object.fromEntries(included.map((m) => [m.title, m.priority]));
  const { cost, plans } = TiffSolver.solve(included, BUF, SAMEBUF, MAXPLANS);
  const groups = groupPlans(plans, MAXPLANS);
  computeView(groups);
  saveJSON("cost", cost);
  let picks = getPicks();
  if (!validPicks(picks, TREE)) picks = [];
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
    (byDay.get(d) || byDay.set(d, []).get(d)).push({ start: s.start, end: s.end, title: t, venue: s.venue, opts: opts.sort((a, b) => a - b) });
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
          time: `${hm(b.start)}–${hm(b.end)}`, title: b.title, venue: b.venue, prio: PRIO[b.title], opts: b.opts,
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
function drawBoard(live) {
  const L = [...live].sort((x, y) => x - y), nc = L.length, pos = {};
  L.forEach((o, i) => (pos[o] = i));
  const solo = nc === 1;
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
        const h = Math.max(b.h - 2, solo ? 28 : 18);
        const cls = "blk " + (b.prio === "must" ? "must" : "want") + (full ? "" : " contested") + (b.h < 70 ? " small" : "") + (solo ? " solo" : "");
        bl += `<div class="${cls}" title="${esc(b.title)} — ${esc(b.venue)} — ${b.time}" `
          + `style="top:${b.top}px;height:${h}px;left:calc(${left}% + 2px);width:calc(${width}% - 5px)">`
          + `<div class="btime">${b.time}</div><div class="btitle">${full ? "" : "★ "}${esc(b.title)}</div>`
          + `<div class="bvenue">${esc(b.venue)}</div></div>`;
      }
    }
    const heads = nc > 1
      ? `<div class="optrow" style="grid-template-columns:repeat(${nc},1fr);min-width:${nc * 110}px">`
      + L.map((o) => `<div class="och" onclick="drawBoard([${o}])" title="show only option ${o}">O${o}</div>`).join("") + "</div>"
      : "";
    const tlw = nc > 1 ? `min-width:${nc * 110}px` : "";
    html += `<div class="day"><h3>${esc(day.label)}</h3><div class="tlwrap">${heads}`
      + `<div class="tl" style="height:${day.height + 24}px;${tlw}">${hl}${vl}${bl}</div></div></div>`;
  }
  $("board").innerHTML = html;
}

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
  drawBoard(live);
  let h = '<p class="muted">Pick a screening at each step. Each choice drops the ruled-out options from the timeline below; the last choice leaves one clean schedule.</p>';
  if (picks.length) {
    h += '<div class="wtrail">'; let n = TREE;
    picks.forEach((idx, k) => {
      const b = n.branches[idx];
      h += `<span class="wcrumb">${b.when}: ${b.watch ? "▶ " + esc(b.watch) : "(nothing)"}<a onclick="render([${picks.slice(0, k)}])">✕</a></span>`;
      n = b.child;
    });
    h += "</div>";
  }
  const keep = inter(live, "keep"), drop = inter(live, "drop");
  if ("option" in node) {
    h += `<div class="wfinal"><h4>→ Option ${node.option} — keeps ${keep.length}, gives up ${drop.length}</h4>`;
    h += "<div>" + keep.map((t) => chip(t, "get")).join("") + drop.map((t) => chip(t, "lose")).join("") + "</div>";
    const rs = REASONS[node.option] || {};
    if (Object.keys(rs).length) {
      h += '<details class="wreasons"><summary>why the given-up films don\'t fit</summary>';
      for (const t in rs) h += `<strong>${esc(t)}</strong><ul>` + rs[t].map((r) => `<li>${esc(r)}</li>`).join("") + "</ul>";
      h += "</details>";
    }
    h += "</div>";
  } else {
    h += `<p class="muted" style="margin:6px 0 0">Locked in: ${keep.length} kept${drop.length ? ", " + drop.length + " dropped" : ""}.</p>`;
    h += `<div class="wq">Next choice — ${node.when}:</div>`;
    node.branches.forEach((b, idx) => {
      const bk = inter(b.options, "keep"), bd = inter(b.options, "drop");
      const gain = bk.filter((t) => !keep.includes(t)), lose = bd.filter((t) => !drop.includes(t));
      const label = b.watch ? "Watch " + esc(b.watch) : "Skip this slot (watch nothing here)";
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
function showView2() { $("view1").hidden = true; $("view2").hidden = false; scrollTo(0, 0); }

window.render = render; window.drawBoard = drawBoard; // referenced by inline onclick
init();
