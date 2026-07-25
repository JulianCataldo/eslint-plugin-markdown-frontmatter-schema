#!/usr/bin/env python3
"""Verify every ledger hook greps in its referenced file(s).

Reads evidence.md, splits into E-sections, resolves file references from
Source/Locator/Findings lines (attachments/*, src/*.ts, README.md), then
checks each fenced line appears byte-exact (or whitespace-trimmed) in at
least one referenced file. Sections without resolvable references (inline
full entries) are skipped.
"""
import re, sys, pathlib

CHANGE = pathlib.Path(__file__).resolve().parents[2]
REPO = CHANGE.parents[2]  # openspec/changes/<change> -> repo root

doc = (CHANGE / "evidence.md").read_text()
sections = re.split(r"(?m)^### (E\d+)\n", doc)[1:]
pairs = list(zip(sections[0::2], sections[1::2]))

REF_RE = re.compile(
    r"attachments/(?:captures|harness)/[\w.-]+|src/[\w/.-]+\.ts|README\.md"
)
failures, checked = [], 0
for eid, body in pairs:
    head = body.split("```", 1)[0]
    refs = []
    for m in set(REF_RE.findall(head)):
        p = (CHANGE / m) if m.startswith("attachments/") else (REPO / m)
        if p.exists():
            refs.append(p)
    fences = re.findall(r"```text\n(.*?)```", body, flags=re.S)
    if not refs:
        continue
    contents = [p.read_text(errors="replace") for p in refs]
    for fence in fences:
        for line in fence.splitlines():
            if not line.strip():
                continue
            checked += 1
            if any(line in c or line.strip() in c for c in contents):
                continue
            failures.append((eid, line, [p.name for p in refs]))

for eid, line, refs in failures:
    print(f"MISS {eid} :: {line!r} :: not in {refs}")
print(f"checked {checked} hooks; {len(failures)} misses")
sys.exit(1 if failures else 0)
