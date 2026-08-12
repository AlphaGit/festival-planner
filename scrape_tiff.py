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
import json
import os
import re
import sys
import urllib.request
from datetime import datetime
from html.parser import HTMLParser

URL = "https://www.tiff.net/festivalfilmlist"
# ponytail: tiff.net sits behind an AWS WAF JS challenge, so a plain request gets
# HTTP 202 + an empty body. r.jina.ai renders the page in a real browser and
# returns the JSON. Ceiling: third-party proxy — if it dies, save the page from
# your own browser and pass the file (`python3 scrape_tiff.py saved.html`).
PROXY_URL = "https://r.jina.ai/" + URL
FESTIVAL = "TIFF 2026"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

PI_TIER = "press-industry"
PI_TIER_NAME = "Press & Industry"


KEEP_TAGS = {"em": "em", "i": "em", "strong": "strong", "b": "strong"}


class _Inline(HTMLParser):
    """Blurb text keeping only <em>/<strong> — <i>/<b> fold into them.

    Those two are the whole of TIFF's blurb markup (film titles in italics,
    the odd bold lead-in) and the only tags the app renders, so everything
    else is dropped. Tags are balanced on the way out: a page saved from a
    browser loses the opening tags but keeps their closers as text, and a
    stray `</em>` would otherwise ride into the catalog.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.open, self.skip = [], [], 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):  # their text is code, not blurb
            self.skip += 1
        elif t := KEEP_TAGS.get(tag):
            self.open.append(t)
            self.out.append(f"<{t}>")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)
            return
        t = KEEP_TAGS.get(tag)
        if t and t in self.open:
            while self.open:  # close anything still nested inside it first
                x = self.open.pop()
                self.out.append(f"</{x}>")
                if x == t:
                    break

    def text(self):
        return "".join(self.out + [f"</{t}>" for t in reversed(self.open)]).strip()

    def handle_data(self, d):
        if not self.skip:
            self.out.append(d)


def strip_html(s):
    p = _Inline()
    p.feed(s)
    p.close()
    return p.text()


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


class _TextNodes(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_data(self, d):
        self.parts.append(d)


def parse_blob(text):
    """Parse the film-list JSON out of raw JSON, a proxy response, or saved HTML.

    tiff.net serves the blob as text/html, so a browser "Save As" yields a
    parsed DOM: the inline <em> tags from film blurbs became real elements and
    soft-wrap newlines landed in the text. Text nodes keep their order, so
    joining them recovers the JSON — minus the inline tags strip_html drops
    anyway. r.jina.ai prepends a header, hence the slice to the first key.
    """
    if text.lstrip().startswith("<"):
        p = _TextNodes()
        p.feed(text)
        text = "".join(p.parts)
    # Both renderers inject raw newlines (soft wrap in a saved page, leading
    # blank lines via the proxy). A newline inside a JSON string must be
    # escaped, so every raw one is an artifact; between tokens it's just
    # whitespace. Collapsing to a space is therefore lossless either way.
    # (`[^\S\n]` = whitespace but not a newline: a saved page wraps at &nbsp;
    # too, which decodes to U+00A0 and would otherwise survive as a stray space)
    text = re.sub(r"[^\S\n]*\n\s*", " ", text)
    return json.loads(text[text.index('{"filters"'):].rstrip())


def get(url, headers=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read().decode("utf-8", "replace")


def fetch(src):
    if src and src != "-":
        with open(src, encoding="utf-8") as f:
            return parse_blob(f.read())
    body = get(URL)
    if not body.strip():  # HTTP 202, empty body: AWS WAF challenge
        print("tiff.net returned a WAF challenge; retrying via r.jina.ai", file=sys.stderr)
        body = get(PROXY_URL, {"x-return-format": "text"})
    return parse_blob(body)


def prior_addresses(path):
    """Venue addresses already filled in by hand, keyed by location id.

    The film list carries no addresses, so they're researched manually once
    (see CLAUDE.md). Carrying them across a re-scrape means only genuinely new
    venues need looking up.
    """
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        prev = json.load(f)
    return {k: v["address"] for k, v in prev.get("locations", {}).items() if v.get("address")}


def build(data, addresses=None):
    addresses = addresses or {}
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
            locations.setdefault(loc, {"name": room, "address": addresses.get(loc, "")})
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
    cat = build(fetch(src), prior_addresses(out))
    if not cat["movies"]:
        sys.exit("no screenings in the film list — TIFF hasn't published the "
                 "schedule yet. catalog.json left untouched.")
    with open(out, "w") as f:
        json.dump(cat, f, indent=2, ensure_ascii=False)
        f.write("\n")
    sc = sum(len(m["screenings"]) for m in cat["movies"])
    pi = sum(1 for m in cat["movies"] for s in m["screenings"] if s.get("accessTiers"))
    print(f"{out}: {len(cat['movies'])} films, {sc} screenings ({pi} P&I), "
          f"{len(cat['locations'])} venues, {len(cat['tracks'])} tracks")
    missing = sorted(k for k, v in cat["locations"].items() if not v["address"])
    if missing:
        print(f"venues needing an address by hand: {', '.join(missing)}")
