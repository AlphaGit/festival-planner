#!/usr/bin/env python3
"""Checks for scrape_tiff.py: python3 test_scrape.py

Covers the input shapes the film list arrives in (raw JSON, a browser-saved
page, the r.jina.ai proxy) and the catalog assembly around them.
"""
import json

import scrape_tiff as st

BLOB = {
    "filters": {"webProgrammes": ["Gala Presentations"]},
    "items": [{
        "title": "A & B",
        "url": "/films/a-b",
        "img": "//img.example/a.webp",
        "description": "<em>Wow</em> &amp; more.",
        "directors": ["Ada L."],
        "webProgrammes": ["Gala Presentations"],
        "scheduleItems": [
            {"startTime": "2026-09-11 18:30:00", "endTime": "2026-09-11 20:40:00",
             "audienceType": "General Public", "venue": {"room": "Roy Thomson Hall", "venueType": "physical"}},
            {"startTime": "2026-09-12 09:00:00", "endTime": "2026-09-12 10:35:00",
             "audienceType": "Buyers Pass,Press Passes", "venue": {"room": "Scotiabank 3", "venueType": "physical"}},
            {"startTime": "2026-09-13 12:00:00", "endTime": "2026-09-13 14:00:00",
             "audienceType": "General Public", "venue": {"room": "Roy Thomson Hall", "venueType": "physical"},
             "cancelled": True},
            {"startTime": "2026-09-14 12:00:00", "endTime": "2026-09-14 14:00:00",
             "audienceType": "General Public", "venue": {"room": "Online", "venueType": "digital"}},
        ],
    }],
}
RAW = json.dumps(BLOB, ensure_ascii=False)


def check(name, cond):
    print(("ok   " if cond else "FAIL ") + name)
    if not cond:
        raise AssertionError(name)


# --- parse_blob: the three shapes ------------------------------------------
check("raw json parses", st.parse_blob(RAW) == BLOB)
check("proxy preamble is skipped", st.parse_blob("Title: \n\nURL Source: x\n\n" + RAW) == BLOB)
# a browser "Save As" re-parses the blob as HTML: entities escaped, inline tags
# from blurbs promoted to elements and their close tags hoisted to the end
saved = ('<html><head></head><body>' + RAW.replace("&", "&amp;").replace("<em>", "<em>")
         + '</em></body></html>')
parsed = st.parse_blob(saved)
check("saved page parses", len(parsed["items"]) == 1)
check("saved page keeps the ampersand", parsed["items"][0]["title"] == "A & B")
# soft-wrap newlines the renderer injected mid-blob collapse back to one space
check("injected newlines collapse", st.parse_blob(RAW.replace("&amp; more", "&amp;\n     more")) == BLOB)
# a saved page also wraps at &nbsp;, which decodes to U+00A0 — it must not
# survive as a second space (that silently doubled spaces in 4 film titles)
check("nbsp wrap points collapse", st.parse_blob(RAW.replace("A & B", "A &" + chr(160) + "\nB")) == BLOB)

# --- screening classification ----------------------------------------------
tiers = [st.access_tiers(s) for s in BLOB["items"][0]["scheduleItems"]]
check("public screening has no tier", tiers[0] == [])
check("accredited screening is P&I", tiers[1] == [st.PI_TIER])
check("cancelled screening is dropped", tiers[2] is None)
check("digital screening is dropped", tiers[3] is None)

# --- build ------------------------------------------------------------------
cat = st.build(BLOB, {"roy-thomson-hall": "60 Simcoe St, Toronto, ON M5J 2H5"})
m = cat["movies"][0]
check("one film kept", len(cat["movies"]) == 1)
check("cancelled and digital screenings excluded", len(m["screenings"]) == 2)
check("screenings are chronological", [s["start"] for s in m["screenings"]]
      == ["2026-09-11 18:30", "2026-09-12 09:00"])
check("P&I tier tagged on the right screening", m["screenings"][1]["accessTiers"] == [st.PI_TIER])
check("runtime is the shortest block", m["runtime_minutes"] == 95)
check("blurb keeps em, unescapes entities", m["blurb"] == "<em>Wow</em> & more.")

# --- blurb markup: keep <em>/<strong>, drop the rest, always balanced ---------
check("i and b fold into em and strong",
      st.strip_html("<i>a</i> <b>c</b>") == "<em>a</em> <strong>c</strong>")
check("other tags are dropped, their text kept",
      st.strip_html("<p>a</p><a href='#'>b</a>") == "ab")
check("script and style content is dropped",
      st.strip_html("a<script>evil()</script><style>i{}</style>b") == "ab")
# TIFF's own data ships orphan closers ("Three Goodbyes</em>" with no opener) —
# passing one through would italicise the rest of the page
check("orphan closing tag is dropped", st.strip_html("Three Goodbyes</em>, TIFF") == "Three Goodbyes, TIFF")
check("unclosed tags are closed", st.strip_html("<em>a <strong>b") == "<em>a <strong>b</strong></em>")
check("attributes are dropped", st.strip_html('<em class="x">a</em>') == "<em>a</em>")
check("image url is absolutised", m["image_url"] == "https://img.example/a.webp")
check("source url is absolutised", m["source_url"] == "https://www.tiff.net/films/a-b")
check("track slugified", m["tracks"] == ["gala-presentations"] and
      cat["tracks"]["gala-presentations"] == "Gala Presentations")
check("known address carried forward",
      cat["locations"]["roy-thomson-hall"]["address"] == "60 Simcoe St, Toronto, ON M5J 2H5")
check("new venue left blank for manual lookup", cat["locations"]["scotiabank-3"]["address"] == "")
check("P&I tier declared and disabled by default",
      cat["accessTiers"] == {st.PI_TIER: st.PI_TIER_NAME} and cat["disabledAccessTiers"] == [st.PI_TIER])

# a pre-schedule film list (every scheduleItems empty) yields no films at all —
# main() turns this into a non-zero exit rather than clobbering catalog.json
empty = {**BLOB, "items": [{**BLOB["items"][0], "scheduleItems": []}]}
check("film with no screenings is dropped", st.build(empty)["movies"] == [])

print("\nall scrape checks passed")
