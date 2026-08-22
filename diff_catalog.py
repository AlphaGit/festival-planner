#!/usr/bin/env python3
"""Show what changed upstream since the last catalog.json build.

    python3 diff_catalog.py                # fetch live, compare to catalog.json
    python3 diff_catalog.py saved.json     # compare a saved copy instead
    python3 diff_catalog.py saved.json other-catalog.json

Exits 0 when nothing changed, 1 when something did — so it can gate a rebuild.

The point of this existing rather than being re-typed each time: a copy fetched
through the r.jina.ai fallback loses blurb emphasis and gains stray newlines
(see CLAUDE.md), and comparing that naively reports dozens of phantom edits —
31 of them once, when only 5 were real. When the source is renderer-damaged we
compare blurbs as normalised text; when it's a raw save we compare exactly, so
markup changes show up too.
"""
import json
import re
import sys

import scrape_tiff as st

TIER = lambda s: (s.get("accessTiers") or ["public"])[0]
SKEY = lambda s: (s["start"], s["venue"], TIER(s))
FIELDS = ("authors", "runtime_minutes", "tracks", "image_url", "source_url")


def norm(s, loose):
    """Blurb text for comparison; `loose` drops what a renderer would have eaten."""
    if not loose:
        return s
    return re.sub(r"\s+", " ", re.sub(r"</?(em|strong)>", "", s)).strip()


def public(cat):
    return sum(1 for m in cat["movies"] for s in m["screenings"] if not s.get("accessTiers"))


def film_changes(a, b, loose):
    out = []
    sa, sb = {SKEY(s) for s in a["screenings"]}, {SKEY(s) for s in b["screenings"]}
    out += [f"+ {s[0]} {s[1]} [{s[2]}]" for s in sorted(sb - sa)]
    out += [f"- {s[0]} {s[1]} [{s[2]}]" for s in sorted(sa - sb)]
    out += [f"~ {f}: {a[f]!r} -> {b[f]!r}" for f in FIELDS if a[f] != b[f]]
    if norm(a["blurb"], loose) != norm(b["blurb"], loose):
        # phrase-level diff: blurbs are one long line, so word-wrap diffs are noise
        old, new = norm(a["blurb"], loose).split(", "), norm(b["blurb"], loose).split(", ")
        import difflib
        marks = [l for l in difflib.unified_diff(old, new, lineterm="", n=0)
                 if l[:1] in "+-" and l[:3] not in ("---", "+++")]
        out.append("~ blurb:")
        out += ["    " + m[:160] for m in marks[:8]]
        if len(marks) > 8:
            out.append(f"    ... and {len(marks) - 8} more phrases")
    return out


def report(old, new, loose):
    A = {m["title"]: m for m in old["movies"]}
    B = {m["title"]: m for m in new["movies"]}
    changed = 0
    for t in sorted(set(B) - set(A)):
        pub = sum(1 for s in B[t]["screenings"] if not s.get("accessTiers"))
        print(f"FILM ADDED: {t}  [{', '.join(B[t]['tracks']) or 'no track'}, {pub} public]")
        changed += 1
    for t in sorted(set(A) - set(B)):
        print(f"FILM REMOVED: {t}")
        changed += 1
    for t in sorted(set(A) & set(B)):
        if lines := film_changes(A[t], B[t], loose):
            changed += 1
            print(f"\n== {t}")
            for l in lines:
                print("   " + l)

    for label, key in (("venues", "locations"), ("tracks", "tracks")):
        gone = {k: old[key][k] for k in set(old[key]) - set(new[key])}
        fresh = {k: new[key][k] for k in set(new[key]) - set(old[key])}
        if gone or fresh:
            changed += 1
            print(f"\n{label}: +{fresh or '{}'} -{gone or '{}'}")

    print(f"\nfilms {len(A)} -> {len(B)} | screenings "
          f"{sum(len(m['screenings']) for m in old['movies'])} -> "
          f"{sum(len(m['screenings']) for m in new['movies'])} | "
          f"public {public(old)} -> {public(new)}")
    if st.UNKNOWN_AUDIENCES:
        print("unrecognised audiences:", ", ".join(sorted(st.UNKNOWN_AUDIENCES)))
    missing = [k for k, v in new["locations"].items() if not v["address"]]
    if missing:
        print("venues needing an address:", ", ".join(sorted(missing)))
    return changed


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else None
    ref = sys.argv[2] if len(sys.argv) > 2 else "catalog.json"
    data = st.fetch(src)
    loose = not st.markup_intact(data)
    if loose:
        print("NOTE: this copy is renderer-damaged (blurb markup stripped), so "
              "blurbs are compared as plain text — a markup-only change would "
              "not show up here. Rebuild from a raw save.\n")
    changed = report(json.load(open(ref, encoding="utf-8")),
                     st.build(data, st.prior_addresses(ref)), loose)
    print(f"\n{changed} change{'' if changed == 1 else 's'}" if changed else "\nno changes")
    sys.exit(1 if changed else 0)
