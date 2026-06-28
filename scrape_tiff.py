#!/usr/bin/env python3
"""Scrape the TIFF films list into catalog.json (the browser app's format).

TIFF serves the entire festival as one JSON blob at /festivalfilmlist — no
per-film page scraping needed. We keep non-cancelled, in-person screenings and
classify each by audience: public screenings carry no access tier, Press &
Industry / Market ones are tagged `accessTiers: ["press-industry"]` (a
screening-level axis, distinct from movie-level curatorial tracks). Digital and
other restricted audiences are dropped. We emit the same shape app.js /
solver.js already consume.

    python3 scrape_tiff.py                 # fetch live -> catalog.json
    python3 scrape_tiff.py raw.json        # use a saved blob instead of fetching
    python3 scrape_tiff.py - out.json      # fetch live -> out.json

runtime_minutes = shortest screening block across ALL listings (incl. P&I),
which is the pure film runtime; public blocks include intros/Q&A and run longer.

P&I ships disabled by default (disabledAccessTiers): most users can't attend
press screenings, so they're hidden until a user marks they hold that access.
"""
import html
import json
import re
import sys
import urllib.request
from datetime import datetime

URL = "https://www.tiff.net/festivalfilmlist"
FESTIVAL = "TIFF 2025"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

PI_TIER = "press-industry"
PI_TIER_NAME = "Press & Industry"


def strip_html(s):
    # ponytail: blurbs only carry inline tags (<em>, <strong>); regex is enough,
    # no parser dependency. unescape after so &amp; -> & not &amp;lt; artifacts.
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def slugify(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def block_minutes(s):
    fmt = "%Y-%m-%d %H:%M:%S"
    return int((datetime.strptime(s["endTime"], fmt) - datetime.strptime(s["startTime"], fmt)).total_seconds() // 60)


def access_tiers(s):
    """Access tiers for a KEPT screening, or None to drop it.

    [] = public; ["press-industry"] = Press & Industry / Market. TIFF's
    audienceType is "General Public" for public showings and a combo of
    accreditation passes otherwise ("Buyers Pass,Pro Pass,Guest,Press Passes",
    "Buyers Pass", ...) — every non-public accreditation is an industry/press
    showing, so anything that isn't public (and has some audience) is P&I.
    Cancelled, digital, and audience-less rows are dropped (None).
    """
    if s.get("cancelled") or (s.get("venue") or {}).get("venueType") != "physical":
        return None
    aud = (s.get("audienceType") or "").strip()
    if not aud:
        return None
    return [] if "General Public" in aud else [PI_TIER]


def fetch(src):
    if src and src != "-":
        with open(src) as f:
            return json.load(f)
    req = urllib.request.Request(URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def build(data):
    tracks, locations, movies = {}, {}, []
    any_pi = False
    for it in data["items"]:
        kept = [(s, t) for s in it["scheduleItems"] if (t := access_tiers(s)) is not None]
        if not kept:
            continue  # digital-only / cancelled / no public or P&I screening

        for prog in it.get("webProgrammes", []):
            tracks.setdefault(slugify(prog), prog)

        screenings = []
        for s, tiers in sorted(kept, key=lambda x: x[0]["startTime"]):
            room = s["venue"]["room"]
            loc = slugify(room)
            locations.setdefault(loc, {"name": room, "address": ""})
            sc = {"start": s["startTime"][:16], "venue": room, "location": loc}  # "YYYY-MM-DD HH:MM"
            if tiers:
                sc["accessTiers"] = tiers
                any_pi = True
            screenings.append(sc)

        # pure runtime = shortest block over every listing, not just kept ones
        runtime = min(block_minutes(s) for s in it["scheduleItems"])
        img = it.get("img") or ""
        movies.append({
            "title": it["title"],
            "authors": ", ".join(it.get("directors") or []),
            "blurb": strip_html(it.get("description") or ""),
            "image_url": ("https:" + img) if img.startswith("//") else img,
            "source_url": "https://www.tiff.net" + it["url"] if it.get("url", "").startswith("/") else it.get("url", ""),
            "tracks": [slugify(p) for p in it.get("webProgrammes", [])],
            "runtime_minutes": runtime,
            "screenings": screenings,
        })

    movies.sort(key=lambda m: m["title"].lower())
    return {
        "festival": FESTIVAL,
        "tracks": dict(sorted(tracks.items(), key=lambda kv: kv[1])),
        "accessTiers": {PI_TIER: PI_TIER_NAME} if any_pi else {},
        "disabledAccessTiers": [PI_TIER] if any_pi else [],
        "locations": dict(sorted(locations.items())),
        "movies": movies,
    }


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else None
    out = sys.argv[2] if len(sys.argv) > 2 else "catalog.json"
    cat = build(fetch(src))
    with open(out, "w") as f:
        json.dump(cat, f, indent=2, ensure_ascii=False)
        f.write("\n")
    sc = sum(len(m["screenings"]) for m in cat["movies"])
    pi = sum(1 for m in cat["movies"] for s in m["screenings"] if s.get("accessTiers"))
    print(f"{out}: {len(cat['movies'])} films, {sc} screenings ({pi} P&I), "
          f"{len(cat['locations'])} venues, {len(cat['tracks'])} tracks")
