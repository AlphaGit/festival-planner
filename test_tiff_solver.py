#!/usr/bin/env python3
"""Characterization tests for tiff_solver. Run: uv run python test_tiff_solver.py

Locks current behavior so the fallback-removal / parse_dt refactor can't change
results. No framework — plain asserts, one main() runner.
"""
import tempfile
import os
from datetime import datetime, date

import tiff_solver as T


def test_parse_dt():
    assert T.parse_dt("2024-03-06 19:30") == datetime(2024, 3, 6, 19, 30)
    assert T.parse_dt("2024-03-06T19:30") == datetime(2024, 3, 6, 19, 30)
    assert T.parse_dt("2024-03-06 19:30:45") == datetime(2024, 3, 6, 19, 30, 45)
    assert T.parse_dt("2024-03-06") == datetime(2024, 3, 6, 0, 0)  # date-only -> midnight
    assert T.parse_dt(datetime(2024, 3, 6, 9)) == datetime(2024, 3, 6, 9)  # passthrough
    assert T.parse_dt(date(2024, 3, 6)) == datetime(2024, 3, 6, 0, 0)
    try:
        T.parse_dt("not-a-date")
        assert False, "should have raised"
    except SystemExit:
        pass


def test_building():
    assert T.building("Scotiabank 6") == "scotiabank"
    assert T.building("Scotiabank 12") == "scotiabank"
    assert T.building("TIFF Bell Lightbox") == "tiff bell lightbox"


def test_compatible():
    def scr(s, e, venue="A"):
        return T.Screening("m", T.parse_dt(s), T.parse_dt(e), venue)
    a = scr("2024-03-06 18:00", "2024-03-06 20:00", "Scotiabank 6")
    b = scr("2024-03-06 20:05", "2024-03-06 22:00", "Scotiabank 12")  # same bldg, 5min gap
    # same building buffer 10 -> 5min gap NOT enough
    assert not T.compatible(a, b, buf=30, same_buf=10)
    # different building, buffer 30 -> still not enough at 5min
    c = scr("2024-03-06 20:05", "2024-03-06 22:00", "Lightbox")
    assert not T.compatible(a, c, buf=30, same_buf=10)
    # 15min gap same building -> ok
    d = scr("2024-03-06 20:15", "2024-03-06 22:00", "Scotiabank 12")
    assert T.compatible(a, d, buf=30, same_buf=10)


SCHEDULE = """
festival: TestFest
buffer_minutes: 30
same_venue_buffer_minutes: 10
movies:
  - title: Alpha
    priority: must
    runtime_minutes: 120
    screenings:
      - {start: "2024-03-06 18:00", venue: "Scotiabank 6"}
      - {start: "2024-03-07 18:00", venue: "Scotiabank 6"}
  - title: Beta
    priority: want
    runtime_minutes: 120
    screenings:
      - {start: "2024-03-06 18:30", venue: "Lightbox"}
"""

# Alpha@18:00 and Beta@18:30 overlap (different bldg, 30min buffer). Alpha is must,
# has a Mar-07 alternative -> optimal keeps both (Alpha moves to the 7th).


def test_load_and_solve_all_fit():
    with tempfile.NamedTemporaryFile("w", suffix=".yaml", delete=False) as f:
        f.write(SCHEDULE)
        path = f.name
    try:
        fest, movies, excluded, buf, same_buf = T.load(path)
        assert fest == "TestFest"
        assert buf == 30 and same_buf == 10
        assert {m.title for m in movies} == {"Alpha", "Beta"}
        cost, plans = T.solve(movies, buf, same_buf, max_plans=8)
        assert cost == 0, f"expected all-fit, got cost {cost}"
        # both movies scheduled in the representative plan
        rep = plans[0]
        assert rep["Alpha"] is not None and rep["Beta"] is not None
    finally:
        os.unlink(path)


CONFLICT_SCHED = """
festival: ConflictFest
buffer_minutes: 30
movies:
  - title: One
    priority: want
    runtime_minutes: 120
    screenings:
      - {start: "2024-03-06 18:00", venue: "A"}
  - title: Two
    priority: want
    runtime_minutes: 120
    screenings:
      - {start: "2024-03-06 18:30", venue: "B"}
"""
# Single screening each, overlapping, no alternatives -> one want must drop.


def test_solve_forced_drop_and_explain():
    with tempfile.NamedTemporaryFile("w", suffix=".yaml", delete=False) as f:
        f.write(CONFLICT_SCHED)
        path = f.name
    try:
        _, movies, _, buf, same_buf = T.load(path)
        cost, plans = T.solve(movies, buf, same_buf, max_plans=8)
        assert cost == 1, f"expected one want dropped (cost 1), got {cost}"
        rep = plans[0]
        dropped = [t for t, s in rep.items() if s is None]
        assert len(dropped) == 1
        notes = T.explain_conflicts(rep, movies, buf, same_buf)
        assert len(notes) == 1
        assert "conflicts with" in notes[0]["reasons"][0]
    finally:
        os.unlink(path)


def test_exclude_and_lock():
    sched = """
festival: F
buffer_minutes: 30
exclude: [Skipme]
locked:
  - {title: Locked, start: "2024-03-07 18:00"}
movies:
  - title: Skipme
    runtime_minutes: 60
    screenings: [{start: "2024-03-06 10:00", venue: "A"}]
  - title: Locked
    runtime_minutes: 60
    screenings:
      - {start: "2024-03-06 18:00", venue: "A"}
      - {start: "2024-03-07 18:00", venue: "A"}
"""
    with tempfile.NamedTemporaryFile("w", suffix=".yaml", delete=False) as f:
        f.write(sched)
        path = f.name
    try:
        _, movies, excluded, buf, same_buf = T.load(path)
        assert "Skipme" in excluded
        assert {m.title for m in movies} == {"Locked"}  # excluded removed
        locked = movies[0]
        valid = locked.valid
        assert len(valid) == 1 and valid[0].start == datetime(2024, 3, 7, 18, 0)
    finally:
        os.unlink(path)


MULTI_OPT = """
festival: MultiFest
buffer_minutes: 30
movies:
  - title: Fixed
    priority: must
    runtime_minutes: 60
    screenings:
      - {start: "2024-03-06 10:00", venue: "A"}
  - title: One
    priority: want
    runtime_minutes: 120
    screenings:
      - {start: "2024-03-06 18:00", venue: "A"}
  - title: Two
    priority: want
    runtime_minutes: 120
    screenings:
      - {start: "2024-03-06 18:30", venue: "B"}
"""
# Fixed never conflicts -> common. One vs Two overlap, only one fits -> variable.


def test_split_common():
    with tempfile.NamedTemporaryFile("w", suffix=".yaml", delete=False) as f:
        f.write(MULTI_OPT)
        path = f.name
    try:
        _, movies, _, buf, same_buf = T.load(path)
        _, plans = T.solve(movies, buf, same_buf, max_plans=8)
        groups = T.group_plans(plans, 8)
        assert len(groups) == 2, f"expected 2 options, got {len(groups)}"
        common, variable = T.split_common(groups)
        assert common == {"Fixed"}, common          # scheduled same everywhere
        assert variable == {"One", "Two"}, variable  # each kept in one option, dropped in other
    finally:
        os.unlink(path)


DEP = """
festival: DepFest
buffer_minutes: 15
movies:
  - title: Flex
    priority: want
    runtime_minutes: 90
    screenings:
      - {start: "2024-03-06 10:00", venue: "A"}
      - {start: "2024-03-06 14:00", venue: "A"}
  - title: MorningOnly
    priority: want
    runtime_minutes: 90
    screenings: [{start: "2024-03-06 10:00", venue: "B"}]
  - title: AfternoonOnly
    priority: want
    runtime_minutes: 90
    screenings: [{start: "2024-03-06 14:00", venue: "B"}]
"""
# Flex has 2 screenings; watching it morning vs afternoon frees the other slot.
# 3 optimal options -> a tree where the 14:00 choice is conditioned on the 10:00 one.


def test_decision_tree_is_dependent():
    with tempfile.NamedTemporaryFile("w", suffix=".yaml", delete=False) as f:
        f.write(DEP)
        path = f.name
    try:
        _, movies, _, buf, same_buf = T.load(path)
        _, plans = T.solve(movies, buf, same_buf, max_plans=8)
        groups = T.group_plans(plans, 8)
        _, variable = T.split_common(groups)
        tree = T.decision_tree(list(enumerate([g["rep"] for g in groups], 1)), variable)
        # root splits at the earliest slot (10:00) on what you watch then
        assert tree["when"] == "Wed Mar 06 10:00"
        watched = {b["watch"] for b in tree["branches"]}
        assert watched == {"Flex", "MorningOnly"}, watched
        # picking Flex@10:00 resolves immediately; the other branch needs a 2nd choice
        kids = {b["watch"]: b["child"] for b in tree["branches"]}
        assert "option" in kids["Flex"]                 # leaf
        assert "branches" in kids["MorningOnly"]         # further question
        assert kids["MorningOnly"]["when"] == "Wed Mar 06 14:00"
        # every leaf maps to a distinct option, covering all 3
        leaves = []
        def walk(n):
            if "option" in n: leaves.append(n["option"])
            else: [walk(b["child"]) for b in n["branches"]]
        walk(tree)
        assert sorted(leaves) == [1, 2, 3], leaves
    finally:
        os.unlink(path)


def main():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for t in tests:
        t()
        print(f"ok  {t.__name__}")
    print(f"\n{len(tests)} passed")


if __name__ == "__main__":
    main()
