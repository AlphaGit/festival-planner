#!/usr/bin/env python3
"""Festival screening planner — exact constraint solver.

Reads a YAML schedule file, finds conflict-free plans that include every
must-watch movie and as many want-to-watch movies as possible, and reports
every conflict with its alternatives so the user can decide (never silently
drops a movie without explanation).

Usage:
    python3 tiff_solver.py schedule.yaml [--html plan.html] [--json plan.json]
                           [--max-plans 8]

Exit codes: 0 = all movies fit, 2 = some movies dropped (see report), 1 = input error.
"""
import argparse
import json
import re
import sys
from datetime import datetime, date, timedelta

import yaml

MUST_COST = 1000  # dropping a must costs this; dropping a want costs 1
DATE_FMTS = ["%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"]


def parse_dt(v, field=""):
    if isinstance(v, datetime):
        return v
    if isinstance(v, date):
        return datetime(v.year, v.month, v.day)
    s = str(v).strip()
    for f in DATE_FMTS:
        try:
            return datetime.strptime(s, f)  # date-only -> midnight
        except ValueError:
            pass
    raise SystemExit(f"Cannot parse date/time {v!r} {('in ' + field) if field else ''}")


class Screening:
    def __init__(self, movie, start, end, venue, available=True):
        self.movie, self.start, self.end, self.venue = movie, start, end, venue
        self.available = available
        self.invalid_reason = None  # set during validation

    def label(self):
        return f"{self.start:%a %b %d %H:%M}–{self.end:%H:%M} @ {self.venue}"


class Movie:
    def __init__(self, title, priority, screenings):
        self.title, self.priority, self.screenings = title, priority, screenings

    @property
    def valid(self):
        return [s for s in self.screenings if s.invalid_reason is None]


def load(path):
    with open(path) as f:
        data = yaml.safe_load(f) or {}
    buf = int(data.get("buffer_minutes", 30))
    same_buf = int(data.get("same_venue_buffer_minutes", 10))

    windows = []
    for w in data.get("availability") or []:
        if isinstance(w, dict):
            ws = parse_dt(w["start"], "availability")
            we = parse_dt(w["end"], "availability")
        else:
            ws = parse_dt(w, "availability")
            we = ws.replace(hour=23, minute=59)
        windows.append((ws, we))

    excluded = set(data.get("exclude") or [])
    locks = {}
    for lk in data.get("locked") or []:
        locks[lk["title"]] = parse_dt(lk["start"], f"locked/{lk['title']}")

    movies = []
    for m in data.get("movies") or []:
        title = m["title"]
        prio = str(m.get("priority", "want")).lower()
        if prio not in ("must", "want"):
            raise SystemExit(f"{title}: priority must be 'must' or 'want', got {prio!r}")
        runtime = m.get("runtime_minutes")
        scrs = []
        for s in m.get("screenings") or []:
            start = parse_dt(s["start"], title)
            if "end" in s:
                end = parse_dt(s["end"], title)
            elif runtime:
                end = start + timedelta(minutes=int(runtime))
            else:
                raise SystemExit(f"{title}: screening {s['start']} needs 'end' or movie 'runtime_minutes'")
            scrs.append(Screening(title, start, end, s.get("venue", "?"),
                                  s.get("available", True) is not False))
        movies.append(Movie(title, prio, scrs))

    # Validate screenings
    for mv in movies:
        for s in mv.screenings:
            if not s.available:
                s.invalid_reason = "marked unavailable (sold out / no tickets)"
            elif windows and not any(ws <= s.start and s.end <= we for ws, we in windows):
                s.invalid_reason = "outside your availability windows"
            elif mv.title in locks and s.start != locks[mv.title]:
                s.invalid_reason = f"movie locked to {locks[mv.title]:%Y-%m-%d %H:%M}"
        if mv.title in locks and not mv.valid:
            raise SystemExit(f"{mv.title}: locked screening {locks[mv.title]} not found or unavailable")

    movies = [m for m in movies if m.title not in excluded]
    return data.get("festival", "Festival"), movies, excluded, buf, same_buf


def building(venue):
    """'Scotiabank 6' and 'Scotiabank 12' are rooms in the same building."""
    return re.sub(r"\s+\d+$", "", venue).strip().lower()


def compatible(a, b, buf, same_buf):
    gap = timedelta(minutes=same_buf if building(a.venue) == building(b.venue) else buf)
    return a.end + gap <= b.start or b.end + gap <= a.start


def solve(movies, buf, same_buf, max_plans):
    """Exact solve via CP-SAT (OR-Tools). Minimizes drop cost (must=1000, want=1),
    then enumerates all distinct optimal drop-sets (the 'options' for the user).
    Returns (best_cost, plans) where each plan is {title: Screening or None}."""
    if not movies:
        return 0, [{}]
    try:
        from ortools.sat.python import cp_model
    except ImportError:
        raise SystemExit("Needs OR-Tools. Run: uv sync   (or: pip install ortools)")
    cap = max_plans * 4  # ponytail: 4x headroom so group_plans has variants to pick from
    model = cp_model.CpModel()
    x, d = {}, {}
    for m in movies:
        d[m.title] = model.NewBoolVar(f"d|{m.title}")
        vs = [model.NewBoolVar(f"x|{m.title}|{k}") for k in range(len(m.valid))]
        for k, v in enumerate(vs):
            x[(m.title, k)] = v
        model.AddExactlyOne(vs + [d[m.title]])
    for i, a in enumerate(movies):
        for b in movies[i + 1:]:
            for ka, sa in enumerate(a.valid):
                for kb, sb in enumerate(b.valid):
                    if not compatible(sa, sb, buf, same_buf):
                        model.AddAtMostOne([x[(a.title, ka)], x[(b.title, kb)]])
    obj = sum((MUST_COST if m.priority == "must" else 1) * d[m.title] for m in movies)
    model.Minimize(obj)
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 60
    status = solver.Solve(model)
    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        raise SystemExit("Solver found no feasible plan (check locks/availability).")
    best = int(solver.ObjectiveValue())
    model.Add(obj == best)
    plans = []
    while len(plans) < cap:
        status = solver.Solve(model)
        if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            break
        plan, dropped = {}, set()
        for m in movies:
            if solver.Value(d[m.title]):
                plan[m.title] = None
                dropped.add(m.title)
            else:
                plan[m.title] = next(s for k, s in enumerate(m.valid)
                                     if solver.Value(x[(m.title, k)]))
        plans.append(plan)
        # block this exact drop-set so the next solve yields a different option
        model.AddBoolOr([d[t].Not() for t in dropped] +
                        [d[m.title] for m in movies if m.title not in dropped])
    return best, plans


def group_plans(plans, max_plans):
    """Group optimal plans by the SET of included movies; one representative each."""
    groups = {}
    for p in plans:
        key = frozenset(t for t, s in p.items() if s)
        g = groups.setdefault(key, {"rep": p, "variants": 0})
        g["variants"] += 1
    # most movies first
    out = sorted(groups.values(), key=lambda g: -len([s for s in g["rep"].values() if s]))
    return out[:max_plans]


def explain_conflicts(plan, movies, buf, same_buf):
    """For each dropped movie, explain what blocks each of its screenings."""
    by_title = {m.title: m for m in movies}
    notes = []
    scheduled = {t: s for t, s in plan.items() if s}
    for title, s in plan.items():
        if s is not None:
            continue
        mv = by_title[title]
        reasons = []
        for sc in mv.screenings:
            if sc.invalid_reason:
                reasons.append(f"{sc.label()}: {sc.invalid_reason}")
            else:
                blockers = [f"{t} ({other.label()})" for t, other in scheduled.items()
                            if not compatible(sc, other, buf, same_buf)]
                reasons.append(f"{sc.label()}: conflicts with " + (", ".join(blockers) or "?"))
        notes.append({"title": title, "priority": mv.priority, "reasons": reasons})
    return notes


def plan_to_rows(plan):
    rows = sorted((s for s in plan.values() if s), key=lambda s: s.start)
    return [{"title": s.movie, "start": s.start.strftime("%Y-%m-%d %H:%M"),
             "end": s.end.strftime("%H:%M"), "venue": s.venue,
             "day": s.start.strftime("%A, %B %d")} for s in rows]


def split_common(groups):
    """Partition movie titles by outcome across options: 'common' = same screening
    (or same drop) in every option, 'variable' = differs. Drives output compression."""
    reps = [g["rep"] for g in groups]
    if not reps:
        return set(), set()
    outcome = lambda s: None if s is None else (s.start, s.end, s.venue)
    common, variable = set(), set()
    for t in reps[0]:
        (common if len({outcome(p[t]) for p in reps}) == 1 else variable).add(t)
    return common, variable


def decision_tree(reps_idx, variable):
    """Chronological narrowing tree over the option set. At each node branch on the
    earliest screening-start where the surviving options disagree about what's
    watched, then recurse per group — so later choices are conditioned on earlier
    ones (picking a movie early frees/blocks later slots). Leaf = one option number.
    reps_idx: list of (option_number, plan). Returns nested dict."""
    def watched_at(plan, T):
        return next((t for t in variable if plan[t] and plan[t].start == T), None)

    def build(opts):
        if len(opts) == 1:
            return {"option": opts[0][0]}
        starts = sorted({plan[t].start for _, plan in opts for t in variable if plan[t]})
        for T in starts:
            groups = {}
            for i, plan in opts:
                groups.setdefault(watched_at(plan, T), []).append((i, plan))
            if len(groups) > 1:  # earliest slot where options disagree
                branches = [{"watch": title, "when": T.strftime("%a %b %d %H:%M"),
                             "options": sorted(i for i, _ in sub), "child": build(sub)}
                            for title, sub in sorted(groups.items(),
                                                     key=lambda kv: (kv[0] is None, kv[0] or ""))]
                return {"when": T.strftime("%a %b %d %H:%M"), "branches": branches}
        # options differ only by drops (no schedulable split) -> one leaf each
        return {"branches": [{"watch": None, "when": None, "options": [i],
                              "child": {"option": i}} for i, _ in opts]}

    return build(reps_idx)


# ---------------------------------------------------------------- HTML
def render_html(festival, groups, movies, buf, same_buf, excluded):
    """Unified board: one time-proportional timeline per day, one column per
    option. Screenings common to all options span the full width; contested
    screenings span only the columns of the options that include them."""
    prio = {m.title: m.priority for m in movies}
    reps = [g["rep"] for g in groups]
    n = len(reps)
    drops = [set(t for t, s in p.items() if s is None) for p in reps]
    always_out = set.intersection(*drops) if drops else set()

    # exact screening -> which options use it
    usage = {}
    for j, p in enumerate(reps, 1):
        for t, s in p.items():
            if s:
                usage.setdefault((t, s.start, s.end, s.venue), set()).add(j)

    # ---- board data (per day, time-proportional). Layout is done in JS so the
    # timeline can be redrawn for whatever option set the wizard leaves alive.
    by_day = {}
    for (t, st, en, ve), opts in usage.items():
        by_day.setdefault(st.strftime("%A, %B %d"), []).append((st, en, t, ve, sorted(opts)))
    days_data = []
    for day in sorted(by_day, key=lambda d: min(b[0] for b in by_day[d])):
        items = sorted(by_day[day])
        d0 = min(b[0] for b in items).replace(minute=0)
        d1 = max(b[1] for b in items)
        hours, h = [], d0
        while h <= d1:
            hours.append({"y": (h - d0).total_seconds() / 60, "label": h.strftime("%H:%M")})
            h += timedelta(hours=1)
        days_data.append({"label": day, "height": (d1 - d0).total_seconds() / 60,
                          "hours": hours,
                          "blocks": [{"top": (st - d0).total_seconds() / 60,
                                      "h": (en - st).total_seconds() / 60,
                                      "time": f"{st:%H:%M}–{en:%H:%M}", "title": t,
                                      "venue": ve, "prio": prio[t], "opts": opts}
                                     for st, en, t, ve, opts in items]})

    # ---- wizard data: decision tree + per-option keep/drop sets + drop reasons.
    # The flat per-option legend is replaced by a click-through wizard (built in JS).
    _, variable = split_common(groups)
    tree = decision_tree(list(enumerate(reps, 1)), variable)
    opt_sets = {i: {"keep": sorted(t for t, s in p.items() if s),
                    "drop": sorted(t for t, s in p.items() if s is None)}
                for i, p in enumerate(reps, 1)}
    opt_reasons = {}
    for i, p in enumerate(reps, 1):
        opt_reasons[i] = {x["title"]: x["reasons"]
                          for x in explain_conflicts(p, movies, buf, same_buf)
                          if x["title"] in variable}
    wiz_data = (f"<script>const TREE={json.dumps(tree)},"
                f"OPT={json.dumps(opt_sets)},REASONS={json.dumps(opt_reasons)},"
                f"PRIO={json.dumps(prio)},DAYS={json.dumps(days_data)},NOPT={n};</script>")
    wizard = ('<div class="wizard" id="wiz"></div>' if variable else "")

    glob = ""
    if always_out:
        det = ""
        for x in explain_conflicts(reps[0], movies, buf, same_buf):
            if x["title"] in always_out:
                lis = "".join(f"<li>{r}</li>" for r in x["reasons"])
                det += f'<div class="conflict"><strong>{x["title"]}</strong> ({x["priority"]})<ul>{lis}</ul></div>'
        glob = (f'<details class="alwaysout"><summary>✗ Not possible in any optimal option '
                f'({len(always_out)}): {", ".join(sorted(always_out))}</summary>{det}</details>')

    body = '<div id="board"></div>'  # JS renders the timeline from DAYS for the live option set

    excl = (f'<p class="muted">Excluded by your decision: {", ".join(sorted(excluded))}</p>'
            if excluded else "")
    return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>{festival} plan</title><style>
body{{font-family:-apple-system,Segoe UI,sans-serif;margin:24px auto;max-width:1280px;color:#1a1a2e;background:#fafafa;padding:0 16px}}
h1{{font-size:1.5em}} .muted{{color:#777}}
.wizard{{background:#fff;border:2px solid #e6a817;border-radius:10px;padding:12px 16px;margin:14px 0}}
.wtrail{{margin:0 0 8px}}
.wcrumb{{display:inline-block;font-size:.85em;background:#fdf3dc;border:1px solid #f0d68a;border-radius:6px;padding:3px 8px;margin:2px 4px 2px 0}}
.wcrumb a{{color:#c0392b;text-decoration:none;margin-left:6px;cursor:pointer;font-weight:700}}
.wq{{font-weight:700;margin:8px 0 4px}}
.wbtn{{display:block;width:100%;text-align:left;background:#fafafa;border:1px solid #ddd;border-radius:8px;padding:8px 12px;margin:6px 0;cursor:pointer;font:inherit}}
.wbtn:hover{{background:#fdf6e3;border-color:#e6a817}}
.wbtn b{{font-size:1.02em}}
.leads{{font-size:.85em;margin-top:3px}}
.chip{{display:inline-block;padding:1px 8px;border-radius:12px;margin:2px;font-size:.8em;background:#f0f0f0}}
.chip.get{{background:#e8f7ee;color:#1e7a44;border:1px solid #bce5cc;font-weight:600}}
.chip.lose{{background:#fdecea;color:#c0392b;border:1px solid #f3c2bc;text-decoration:line-through}}
.chip.must{{font-weight:700}}
.wfinal{{background:#f4faf6;border:1px solid #bce5cc;border-radius:8px;padding:10px 14px;margin-top:8px}}
.wfinal h4{{margin:.2em 0}} .wreasons ul{{margin:2px 0}} .wreasons{{font-size:.85em;color:#555;margin-top:6px}}
.wreset{{background:none;border:none;color:#2980b9;cursor:pointer;font:inherit;padding:0;margin-top:8px}}
.day h3{{margin:26px 0 6px;border-bottom:2px solid #ddd;padding-bottom:4px}}
.tlwrap{{overflow-x:auto}}
.optrow{{display:grid;margin-left:52px;position:sticky;top:0;background:#fafafa;z-index:5}}
.och{{text-align:center;font-size:.75em;font-weight:700;color:#666;padding:3px 0;cursor:pointer;border-radius:4px}}
.och:hover{{background:#fdf6e3}} .och.on{{background:#e6a817;color:#fff}}
.tl{{position:relative;margin-left:52px;border-left:1px solid #e0e0e0}}
.hline{{position:absolute;left:0;right:0;border-top:1px dashed #ececec}}
.hline span{{position:absolute;left:-52px;top:-8px;font-size:.7em;color:#999}}
.vline{{position:absolute;top:0;bottom:0;border-left:1px dashed #e8e8e8}}
.blk{{position:absolute;box-sizing:border-box;background:#fff;border:1px solid #ddd;border-left:4px solid #999;border-radius:6px;padding:3px 7px;overflow:hidden;font-size:.78em;line-height:1.3}}
.blk.must{{border-left-color:#c0392b}} .blk.want{{border-left-color:#2980b9}}
.blk.contested{{outline:2px dashed #e6a817;outline-offset:-2px;background:#fffdf5;z-index:2}}
.btime{{font-variant-numeric:tabular-nums;color:#555;font-size:.85em}}
.btitle{{font-weight:600}} .bvenue{{color:#777;font-size:.85em}}
.blk.small .bvenue{{display:none}} .blk.small{{padding-top:1px}}
.blk.solo{{font-size:.92em}} .blk.solo .btitle{{font-size:1.05em}}
.conflict ul{{margin:4px 0}}
.alwaysout{{margin:12px 0;background:#f6f6f6;border:1px solid #ddd;border-radius:8px;padding:10px 14px}}
.alwaysout summary{{cursor:pointer;font-weight:600}}
@media(max-width:600px){{
  body{{margin:12px auto;padding:0 8px}} h1{{font-size:1.15em}}
  .wizard{{padding:10px 12px}} .wbtn{{padding:7px 9px}}
  .hline span{{font-size:.62em}} .blk{{font-size:.72em;padding:2px 5px}}
}}
</style></head><body>
<h1>{festival} — screening plan <span class="muted">({n} optimal options)</span></h1>{excl}{glob}{wizard}{body}
{wiz_data}
<script>
// ---- board: redraw the timeline for exactly the options in `live`.
// Dead options' columns disappear; one option left => clean full-width column.
const BOARD=document.getElementById('board');
function runs(cols){{ // contiguous runs of column indices -> [[a,b],...] for rectangular blocks
  const r=[]; let a=cols[0], p=cols[0];
  for(let k=1;k<=cols.length;k++){{ const c=cols[k]; if(c!==p+1){{ r.push([a,p]); a=c; }} p=c; }}
  return r;
}}
function drawBoard(live){{
  const L=[...live].sort((x,y)=>x-y), nc=L.length, pos={{}};
  L.forEach((o,i)=>pos[o]=i);
  const solo = nc===1;
  let html='';
  for(const day of DAYS){{
    const vis=day.blocks.filter(b=>b.opts.some(o=>live.includes(o)));
    if(!vis.length) continue;
    let hl=''; for(const hr of day.hours) hl+=`<div class="hline" style="top:${{hr.y}}px"><span>${{hr.label}}</span></div>`;
    let vl=''; for(let k=1;k<nc;k++) vl+=`<div class="vline" style="left:${{100*k/nc}}%"></div>`;
    let bl='';
    for(const b of vis){{
      const cols=b.opts.filter(o=>live.includes(o)).map(o=>pos[o]).sort((x,y)=>x-y);
      for(const [a,z] of runs(cols)){{
        const left=100*a/nc, width=100*(z-a+1)/nc, full=(z-a+1)===nc;
        const h=Math.max(b.h-2, solo?28:18);
        const cls='blk '+(b.prio==='must'?'must':'want')+(full?'':' contested')+(b.h<70?' small':'')+(solo?' solo':'');
        bl+=`<div class="${{cls}}" title="${{b.title}} — ${{b.venue}} — ${{b.time}}" `
          +`style="top:${{b.top}}px;height:${{h}}px;left:calc(${{left}}% + 2px);width:calc(${{width}}% - 5px)">`
          +`<div class="btime">${{b.time}}</div><div class="btitle">${{full?'':'★ '}}${{b.title}}</div>`
          +`<div class="bvenue">${{b.venue}}</div></div>`;
      }}
    }}
    const heads = nc>1
      ? `<div class="optrow" style="grid-template-columns:repeat(${{nc}},1fr);min-width:${{nc*110}}px">`
        +L.map(o=>`<div class="och" onclick="drawBoard([${{o}}])" title="show only option ${{o}}">O${{o}}</div>`).join('')+'</div>'
      : '';
    const tlw = nc>1 ? `min-width:${{nc*110}}px` : '';
    html+=`<div class="day"><h3>${{day.label}}</h3><div class="tlwrap">${{heads}}`
      +`<div class="tl" style="height:${{day.height+24}}px;${{tlw}}">${{hl}}${{vl}}${{bl}}</div></div></div>`;
  }}
  BOARD.innerHTML=html;
}}
// ---- wizard
const WIZ=document.getElementById('wiz');
function nodeAt(picks){{ let n=TREE; for(const i of picks) n=n.branches[i].child; return n; }}
function nodeOpts(node){{
  if('option' in node) return [node.option];
  return [...new Set(node.branches.flatMap(b=>b.options))];
}}
function inter(opts, field){{ // titles present in `field` set of EVERY option in opts
  let s=null;
  for(const o of opts){{ const cur=new Set(OPT[o][field]); s=s?[...s].filter(t=>cur.has(t)):[...cur]; }}
  return (s||[]).sort();
}}
function chip(t,kind){{ return `<span class="chip ${{kind}}${{PRIO[t]==='must'?' must':''}}">${{t}}</span>`; }}
function render(picks){{
  if(!WIZ) return;
  const node=nodeAt(picks), live=nodeOpts(node);
  drawBoard(live);
  let h='<p class="muted">Pick a screening at each step. Each choice drops the ruled-out options from the timeline above; the last choice leaves one clean schedule.</p>';
  // breadcrumbs of decisions made
  if(picks.length){{
    h+='<div class="wtrail">';
    let n=TREE;
    picks.forEach((idx,k)=>{{
      const b=n.branches[idx];
      h+=`<span class="wcrumb">${{b.when}}: ${{b.watch?'▶ '+b.watch:'(nothing)'}}<a onclick="render([${{picks.slice(0,k)}}])">✕</a></span>`;
      n=b.child;
    }});
    h+='</div>';
  }}
  // locked-in so far (kept/dropped in EVERY surviving option)
  const keep=inter(live,'keep'), drop=inter(live,'drop');
  if('option' in node){{
    h+=`<div class="wfinal"><h4>→ Option ${{node.option}} — keeps ${{keep.length}}, gives up ${{drop.length}}</h4>`;
    h+='<div>'+keep.map(t=>chip(t,'get')).join('')+drop.map(t=>chip(t,'lose')).join('')+'</div>';
    const rs=REASONS[node.option]||{{}};
    if(Object.keys(rs).length){{
      h+='<details class="wreasons"><summary>why the given-up films don\\'t fit</summary>';
      for(const t in rs) h+=`<strong>${{t}}</strong><ul>`+rs[t].map(r=>`<li>${{r}}</li>`).join('')+'</ul>';
      h+='</details>';
    }}
    h+='</div>';
  }} else {{
    h+=`<p class="muted" style="margin:6px 0 0">Locked in: ${{keep.length}} kept${{drop.length?', '+drop.length+' dropped':''}}.</p>`;
    h+=`<div class="wq">Next choice — ${{node.when}}:</div>`;
    node.branches.forEach((b,idx)=>{{
      const bk=inter(b.options,'keep'), bd=inter(b.options,'drop');
      const gain=bk.filter(t=>!keep.includes(t)), lose=bd.filter(t=>!drop.includes(t));
      const label=b.watch?('Watch '+b.watch):'Skip this slot (watch nothing here)';
      h+=`<button class="wbtn" onclick="render([${{picks.concat(idx)}}])"><b>${{label}}</b>`
        +`<div class="leads">→ leads to: `
        +(gain.map(t=>chip(t,'get')).join('')||'')
        +(lose.map(t=>chip(t,'lose')).join('')||'')
        +(gain.length||lose.length?'':'<span class="muted">narrows timing only</span>')
        +`</div></button>`;
    }});
  }}
  if(picks.length) h+='<button class="wreset" onclick="render([])">↺ start over</button>';
  WIZ.innerHTML=h;
}}
if(WIZ) render([]); else drawBoard(nodeOpts(TREE));  // no contested films -> draw the single plan
</script>
</body></html>"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("schedule")
    ap.add_argument("--html")
    ap.add_argument("--json")
    ap.add_argument("--max-plans", type=int, default=8)
    args = ap.parse_args()

    festival, movies, excluded, buf, same_buf = load(args.schedule)
    if not movies:
        print("No movies in schedule file."); return 1

    cost, plans = solve(movies, buf, same_buf, args.max_plans)
    groups = group_plans(plans, args.max_plans)

    common, variable = split_common(groups)
    ref = groups[0]["rep"]  # common outcomes identical across options -> read from first
    result = {"festival": festival, "all_fit": cost == 0,
              "musts_dropped": cost // MUST_COST, "wants_dropped": cost % MUST_COST,
              "common": {
                  "schedule": plan_to_rows({t: s for t, s in ref.items() if t in common}),
                  "dropped": [d for d in explain_conflicts(ref, movies, buf, same_buf)
                              if d["title"] in common]},
              "options": []}
    for g in groups:
        plan = g["rep"]
        result["options"].append({
            "schedule": plan_to_rows({t: s for t, s in plan.items() if t in variable}),
            "dropped": [d for d in explain_conflicts(plan, movies, buf, same_buf)
                        if d["title"] in variable],
            "timing_variants": g["variants"]})

    if args.json:
        with open(args.json, "w") as f:
            json.dump(result, f, indent=2, default=str)
    if args.html:
        with open(args.html, "w") as f:
            f.write(render_html(festival, groups, movies, buf, same_buf, excluded))

    # Console summary
    print(f"{festival}: {len(movies)} movies considered, "
          f"{len([m for m in movies if m.priority=='must'])} must / "
          f"{len([m for m in movies if m.priority=='want'])} want")
    if cost == 0:
        print(f"SUCCESS — every movie fits. {len(groups)} distinct option(s).")
    else:
        print(f"CONFLICTS — best plans drop {result['musts_dropped']} must, "
              f"{result['wants_dropped']} want. {len(groups)} distinct option(s) — USER DECISION NEEDED.")
    def print_block(schedule, dropped, indent="  "):
        for r in schedule:
            print(f"{indent}{r['start']}–{r['end']}  {r['title']}  @ {r['venue']}")
        for d in dropped:
            print(f"{indent}DROPPED [{d['priority']}] {d['title']}:")
            for reason in d["reasons"]:
                print(f"{indent}  - {reason}")

    c = result["common"]
    print(f"\n— Common to all {len(result['options'])} option(s) —")
    print_block(c["schedule"], c["dropped"])
    if len(result["options"]) == 1:
        return 0 if cost == 0 else 2
    for i, opt in enumerate(result["options"], 1):
        print(f"\n— Option {i} differs ({opt['timing_variants']} timing variant(s)) —")
        if not opt["schedule"] and not opt["dropped"]:
            print("  (no differences)")
        print_block(opt["schedule"], opt["dropped"])
    return 0 if cost == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
