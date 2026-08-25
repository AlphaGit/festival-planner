#!/usr/bin/env python3
"""Checks for scrape_tiff.py and diff_catalog.py: python3 test_scrape.py

Covers the input shapes the film list arrives in (raw JSON, a browser-saved
page, the r.jina.ai proxy), the catalog assembly around them, and the change
report built on top.
"""
import json
import pathlib
import subprocess

import diff_catalog as dc
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
             "audienceType": "Public", "venue": {"room": "Roy Thomson Hall", "venueType": "physical"}},
            {"startTime": "2026-09-12 09:00:00", "endTime": "2026-09-12 10:35:00",
             "audienceType": "Press & Market", "venue": {"room": "Scotiabank 3", "venueType": "physical"}},
            {"startTime": "2026-09-13 12:00:00", "endTime": "2026-09-13 14:00:00",
             "audienceType": "Public", "venue": {"room": "Roy Thomson Hall", "venueType": "physical"},
             "cancelled": True},
            {"startTime": "2026-09-14 12:00:00", "endTime": "2026-09-14 14:00:00",
             "audienceType": "Public", "venue": {"room": "Online", "venueType": "digital"}},
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
check("press screening is accredited", tiers[1] == [st.PM_TIER])
check("cancelled screening is dropped", tiers[2] is None)
check("digital venue is dropped", tiers[3] is None)
check("digital flag is dropped", st.access_tiers(
    {"audienceType": "Public", "digital": True, "venue": {"room": "X", "venueType": "physical"}}) is None)
check("no audience is dropped", st.access_tiers(
    {"audienceType": "", "venue": {"room": "X", "venueType": "physical"}}) is None)
# TIFF renamed the public audience mid-festival-cycle ("General Public" ->
# "Public") and split the industry side three ways; both spellings must work
check("pre-2026 public wording still works", st.access_tiers(
    {"audienceType": "General Public", "venue": {"room": "X", "venueType": "physical"}}) == [])
for aud in ("Market", "Buyer"):
    check(f"{aud} screening is market-tier", st.access_tiers(
        {"audienceType": aud, "venue": {"room": "X", "venueType": "physical"}}) == [st.MARKET_TIER])
# an audience we've never seen must not be exposed as public — most restricted,
# and recorded so the run can report it
check("unknown audience is restricted, not public", st.access_tiers(
    {"audienceType": "Sponsor Lounge", "venue": {"room": "X", "venueType": "physical"}}) == [st.MARKET_TIER])
check("unknown audience is recorded", "Sponsor Lounge" in st.UNKNOWN_AUDIENCES)
st.UNKNOWN_AUDIENCES.clear()

# --- build ------------------------------------------------------------------
cat = st.build(BLOB, {"roy-thomson-hall": "60 Simcoe St, Toronto, ON M5J 2H5"})
m = cat["movies"][0]
check("one film kept", len(cat["movies"]) == 1)
check("cancelled and digital screenings excluded", len(m["screenings"]) == 2)
check("screenings are chronological", [s["start"] for s in m["screenings"]]
      == ["2026-09-11 18:30", "2026-09-12 09:00"])
check("tier tagged on the right screening", m["screenings"][1]["accessTiers"] == [st.PM_TIER])
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
check("only the tiers in use are declared, and all disabled by default",
      cat["accessTiers"] == {st.PM_TIER: "Press & Market"} and cat["disabledAccessTiers"] == [st.PM_TIER])

# --- markup loss detector ----------------------------------------------------
# a browser-rendered copy keeps `<\\/em>` as text but swallows `<em>` as an
# element, so orphan closers are the tell that emphasis was lost
check("intact markup passes", st.markup_intact(BLOB))
check("orphan closers are caught",
      not st.markup_intact({"items": [{"description": "Three Goodbyes</em>, TIFF"}]}))
check("no markup at all is fine", st.markup_intact({"items": [{"description": "plain"}]}))
check("missing descriptions are fine", st.markup_intact({"items": [{}]}))

# a pre-schedule film list (every scheduleItems empty) yields no films at all —
# main() turns this into a non-zero exit rather than clobbering catalog.json
empty = {**BLOB, "items": [{**BLOB["items"][0], "scheduleItems": []}]}
check("film with no screenings is dropped", st.build(empty)["movies"] == [])

# --- diff_catalog -----------------------------------------------------------
# a renderer-damaged copy differs from a raw one in markup and whitespace only;
# comparing those naively once reported 31 changes when 5 were real
RAW_BLURB = "<em>Kissed</em>  (TIFF \u201996)\n\nis a  drama"
RENDERED = "Kissed (TIFF \u201996) is a drama"
check("loose compare ignores markup and whitespace",
      dc.norm(RAW_BLURB, True) == dc.norm(RENDERED, True))
check("strict compare does not", dc.norm(RAW_BLURB, False) != dc.norm(RENDERED, False))

FILM = {"title": "F", "authors": "A", "blurb": "b", "runtime_minutes": 90,
        "tracks": ["t"], "image_url": "i", "source_url": "u",
        "screenings": [{"start": "2026-09-11 10:00", "venue": "X"}]}
same = json.loads(json.dumps(FILM))
check("identical films report nothing", dc.film_changes(FILM, same, True) == [])
moved = json.loads(json.dumps(FILM))
moved["screenings"] = [{"start": "2026-09-11 09:00", "venue": "X"}]
ch = dc.film_changes(FILM, moved, True)
check("a moved screening shows as one add and one drop",
      ch == ["+ 2026-09-11 09:00 X [public]", "- 2026-09-11 10:00 X [public]"])
tiered = json.loads(json.dumps(FILM))
tiered["screenings"] = [{"start": "2026-09-11 10:00", "venue": "X", "accessTiers": ["market"]}]
check("a screening changing tier is reported",
      dc.film_changes(FILM, tiered, True) == ["+ 2026-09-11 10:00 X [market]",
                                              "- 2026-09-11 10:00 X [public]"])
retimed = json.loads(json.dumps(FILM)); retimed["runtime_minutes"] = 100
check("a field change is reported", dc.film_changes(FILM, retimed, True) == ["~ runtime_minutes: 90 -> 100"])
reworded = json.loads(json.dumps(FILM)); reworded["blurb"] = "b, and more"
check("a blurb change is reported", dc.film_changes(FILM, reworded, True)[0] == "~ blurb:")
restyled = json.loads(json.dumps(FILM)); restyled["blurb"] = "<em>b</em>"
check("markup-only change is invisible to a loose compare",
      dc.film_changes(FILM, restyled, True) == [])
check("...but caught by a strict one", dc.film_changes(FILM, restyled, False) != [])
check("public screenings counted",
      dc.public({"movies": [FILM, tiered]}) == 1)

# --- fetch_blob.mjs ---------------------------------------------------------
# It drives Chrome, so there is nothing here to unit-test — but it hard-codes
# the film-list URL, and a copy that silently points somewhere else would hand
# diff_catalog a stale blob and report "no changes" forever.
BLOB_JS = pathlib.Path("fetch_blob.mjs").read_text(encoding="utf-8")
check("fetch_blob.mjs fetches the URL the scraper scrapes",
      f"'{st.URL}'" in BLOB_JS)
check("fetch_blob.mjs is valid node",
      subprocess.run(["node", "--check", "fetch_blob.mjs"],
                     capture_output=True).returncode == 0)

print("\nall scrape checks passed")
