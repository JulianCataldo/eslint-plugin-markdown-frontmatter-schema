# Campaign 02: drift — declared claims vs executed behavior

<!-- Question backlog; zero pool authority. States: open | in-dig | answered |
parked, each with its pointer kind. Closed campaigns stay as history. -->

Aim: reconcile every place where documentation, metadata, tests, or packaging
say one thing and the executable evidence says another. Anchor observable:
`pnpm test` on 2026-07-24 → 7 tests, 3 pass, **4 fail**. Gap class throughout:
doc↔behavior drift, except where noted.

Anchor refreshed 2026-07-26: the suite is now 34 tests / 30 pass / **4
fail** (dig-1's characterization twin added 27); the 4 are the two
divergence subtests plus their parent wrappers. Dig
`excavate-drift-reconciliation` (scope, grades C1–C23, and both promotions
confirmed by the steward 2026-07-26) answered Q1–Q8 in one pass — two
campaign premises fell to evidence before adjudication (Q1a's "fixture
changed later": the mismatch is congenital, C1; Q8's "docs/ ignored":
un-ignored by the seedbed-setup commit itself, C20) — and filed shadow ADR
0003 with the full drift register as appendix. The campaign is closed;
frontier clear.

## Frontier

- [x] Q1 (`answered` → `docs/adr/0003-drift-dispositions.md`, C1–C5) — Which
      side of the red suite is intended? (a) `Invalid: Should not pass, with
      2 errors` expects enum/type errors from `fixtures/valid.schema.json`,
      but the fixture on disk targets the remote prettierrc schema.
      Adjudicated 2026-07-26: premise REFUTED — fixture and expectations
      were born already mismatched in `555a2a7`; the fixture never changed
      (C1). Neither restore nor rewrite is an obligation: both sides are
      fossils for the post-excavation clean-slate harness redesign (C4,
      moratorium C21); the repurpose origin story stays hypothesis (C3).
      (b) `Empty frontmatter` expects `schemaNotFound`, actual is
      `schemaMalformed`. Adjudicated: the expectation itself is an
      acknowledged misconception — no explicit schema = no constraints = no
      errors (freeform, C5); the error-surfacing repass supersedes BOTH
      sides.
- [x] Q2 (`answered` → `docs/adr/0003-drift-dispositions.md`, C6–C8) —
      README claims "Auto-fix via `--fix` for simple cases" but only
      `suggest` is ever attached. Adjudicated 2026-07-26: the claim never
      matched any commit (drift-at-birth, C7); `fix: true` verifiably
      applies nothing (C6); fix affordances are indispensable PLANNED
      capability to be clearly communicated (C8) — wording alignment is
      sanctioned ordinary work, the capability lands with the repass.
- [x] Q3 (`answered` → `docs/adr/0003-drift-dispositions.md`, C9–C10) —
      `meta.docs.url` points at the upstream remark repo; WIP caveat
      promises "remaining tuning on how schemas are loaded". Adjudicated
      2026-07-26: url was deliberate-then ("better docs at this moment"),
      "obviously not something to keep" — repoint sanctioned (C9). Caveat
      rewording stays open at hypothesis (C10, TR4 half unaddressed).
- [x] Q4 (`answered` → `docs/adr/0003-drift-dispositions.md`, C11) — README
      layout names `src/fixtures/`; the path never existed at any commit.
      Adjudicated 2026-07-26: plain writing error, no layout-move fossil;
      a fixtures folder persists as concept; fix-when-touched.
- [x] Q5 (`answered` → `docs/adr/0003-drift-dispositions.md`, C12–C14) —
      Does the published tarball ship compiled tests? Adjudicated
      2026-07-26: YES — 0.0.1 ships 16 `dist/tests/` paths (`!dist/test`
      misses `dist/tests`), and today's tree would republish the same
      (C12); 0.0.0 was a deliberate manifest-only stub publish (C13);
      intent confirmed "dist/tests must NOT be shipped" (C14) — packaging
      fix is ordinary work.
- [x] Q6 (`answered` → `docs/adr/0003-drift-dispositions.md`, C15–C17) —
      Suite silently depends on the repo's own `eslint.config.js`.
      Adjudicated 2026-07-26: deliberate init-phase pragmatism
      (dogfood-as-harness), not accident (C17); the suite hard-requires a
      cwd-discoverable config and the repo config supplies the markdown
      language itself (C15); ESLint v9 resolves config from CWD —
      nearest-from-file ships behind `v10_config_lookup_from_file` and
      becomes the v10 default (C16, resolves ADR 0002's C20 flag).
      Isolation lands with the clean-slate harness.
- [x] Q7 (`answered` → `docs/adr/0003-drift-dispositions.md`, C18–C19) —
      What is the release contract? Adjudicated 2026-07-26: `release.yml`
      is a byte-identical, fully-commented copy of upstream's live
      workflow; semantic-release never executed (zero tags, no changelog);
      both publishes were manual — 0.0.0 stub, 0.0.1 the real one (C18).
      Forward: manual acceptable while nascent; LATER migrate to
      changesets (homogenization across steward repos) — the
      semantic-release direction is retired, never to activate (C19).
- [x] Q8 (`answered` → `docs/adr/0003-drift-dispositions.md`, C20/C23) —
      `/docs` gitignore. Adjudicated 2026-07-26: premise was STALE on
      arrival — the seedbed-setup commit `4de64c9` itself commented the
      ignore out and committed docs/; tracked `docs/` is the desired end
      state, the pattern is retired, future typedoc output goes to a
      dedicated subpath (C20). The typedoc origin story stays hypothesis
      (C23 — upstream spot-check found no typedoc surface).

## Resolved

(none yet)

## Cross-cutting dependencies

- Q1(a) changes fixtures — sequence it with `03-campaign-elimination` Q3
  (orphaned fixtures) so fixture churn happens once. Superseded 2026-07-26:
  no fixture churn at all — moratorium until the post-excavation
  clean-slate redesign (ADR 0003 decision 1, C21).
- Q1(a) also restores executable evidence for the suggestion branch
  (`01-campaign-reference` Q5). Deferred with the same moratorium; the
  `--fix` probe (dig attachment) meanwhile supplies live suggestion-branch
  evidence outside the suite (C6).
- Q1(b) and `01-campaign-reference` Q6 are the same root trace — and per
  C5 the desired side is now freeform-no-error, superseding the red test's
  own expectation.
- Q2 and `03-campaign-elimination` Q4 (the `fixable` flag) resolve together:
  either fixes exist, or the claim and the flag both go. Resolved together
  2026-07-26, third way: capability confirmed as planned-indispensable —
  flag stays as cue, claim wording aligns in ordinary work (C8).

## Accrual

- `docs/adr/0003-drift-dispositions.md` — shadow ADR (epistemics B2,
  anchor; `proposed`), promoted 2026-07-26 from dig
  `excavate-drift-reconciliation`; carries the 11-row drift register as
  appendix and the campaign's Q1–Q8 adjudications (plus 03-Q3/Q4). Probe
  rig re-runnable from that dig's `attachments/drift-probes/`.
- Pool-spec intent-delta (C5 freeform no-schema → ingestion zone; C8/C6/C7
  capability cues → reporting zone) merged into
  `openspec/specs/rule-runtime-contract/spec.md` § Intent status,
  2026-07-26, same dig.
