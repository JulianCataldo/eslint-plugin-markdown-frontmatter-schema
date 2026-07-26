# Claims

<!-- Attributed, revisable interpretation. Every claim points at ledger
entries and carries a PROPOSED two-axis grade (reliability A–F ×
corroboration 1–6) and threshold (anchor | hypothesis). Grades bind only
after human confirmation, recorded in corroboration.md. Intent inferred
without testimony or period documents caps at hypothesis. -->

Grading key: anchor = A–B reliability AND 1–2 corroboration; everything
else hypothesis. Verified-as-of stamps mark decaying content.

## Q1(a) — invalid fixture vs test expectations

### C1 — The mismatch is congenital, not drift (A1, anchor)

The `Invalid: Should not pass, with 2 errors` expectations and the fixture
they lint were born already mismatched in `555a2a7` (2025-07-25): the
committed fixture has pointed at the remote prettierrc schema since its
first byte, while the expectations assert local-`valid.schema.json` error
shapes. The fixture was never modified afterward. The campaign 02 Q1(a)
premise ("the fixture changed after the expectations were written") is
refuted. Evidence: E1, E2, E3, E4. Reliability A (re-runnable VCS checks),
corroboration 1.

### C2 — Current red actuals (A1, anchor; verified-as-of 2026-07-26)

Today the subtest yields THREE errors from the prettierrc schema (`must be
string at root`, `must match exactly one schema in oneOf at root`, `must be
integer at /printWidth`), all point-located (start == end), no suggestions —
against an expectation of TWO local-schema errors with real ranges and three
enum suggestions carrying absolute-offset fixes. Evidence: E3, E6.

### C3 — Repurpose origin story (B3, hypothesis)

Plausible reconstruction: the invalid fixture was repurposed pre-commit to
exercise the remote-URL loading path, leaving the test behind;
`fixtures/sample.md` (`description: 42`, no `$schema`, no test consumer) is
the fossil of the original local-schema invalid document whose byte layout
the expected suggestion range `[58, 64]` fits. The steward does not remember
(E36). Evidence: E2, E5, E7, E36. Single-source inference, witness memory
absent — capped at hypothesis.

### C4 — Forward intent: fresh-stance test identification (B2, anchor)

Neither restoring the fixture nor rewriting the expectations is an
obligation: the steward's intent is to identify the useful test set with a
fresh stance, regardless of past attempts. The red pair is fossil input to
the clean-slate harness redesign (C21), not a parity debt. Evidence: E36
(consistent with E42, E45 — same witness, so no independent-source credit).

## Q1(b) — Empty frontmatter red

### C5 — No-schema semantics: freeform intent supersedes both sides (B2, anchor)

Steward intent (2026-07-26): absence of an associated schema is an
acceptable state — "No explicit schema = no constraints = no errors"
(freeform frontmatter). The red test's `schemaNotFound` expectation is an
acknowledged misconception, and the current actual (`schemaMalformed`)
equally diverges from intent. For empty/no-schema frontmatter, the red
test's status as desired-behavior signal is WITHDRAWN; the planned
error-surfacing repass supersedes both sides. Mechanism stays as
characterized in the pool spec (dig-1). Evidence: E8, E9, E10, E37.

## Q2 + 03-Q4 — `--fix` claim vs suggestions-only

### C6 — `--fix` applies nothing today (A1, anchor; verified-as-of 2026-07-26)

`fix: true` (API form of `--fix`) produces no `output`, leaves the file
unchanged, and `ESLint.outputFixes` writes nothing, while the same message
carries three applicable enum suggestions with fix payloads. `meta.fixable:
'code'` is inert — no report ever attaches a top-level `fix`. Evidence:
E12, E13, E14.

### C7 — The README claim never matched any commit (A1, anchor)

"Auto-fix via `--fix` for simple cases" was written on day one (`7bf90fb`)
and at no commit in the repo's history did a top-level fix exist — the
suggestions-only shape is unchanged since the initial plugin commit.
Drift-at-birth, not decay. Evidence: E11, E12, E47.

### C8 — Fix affordances are indispensable planned capability (B1, anchor)

YAML-parse-error surfacing, ESLint fix affordances, and rule metadata are
"indispensable, and must be clearly communicated to the user" — the
`fixable` flag, the unreported `yamlSyntaxError` messageId, and the
suggestion machinery stand as capability cues for the planned
error-surfacing repass (extends dig-2 C15), not dead weight to strip.
03-Q4 adjudicated: flag retained as cue; no certificate. Evidence: E38 +
independent artifact class E12/E14 (attempt machinery in code).

## Q3 — `meta.docs.url` + WIP caveat

### C9 — Upstream docs.url was deliberate-then, not-to-keep now (B2, anchor)

The rule's `meta.docs.url` has pointed at the upstream remark repo since the
initial commit because "the upstream project had better docs at this
moment"; it is "obviously not something to keep". Repointing at this repo is
sanctioned ordinary work (sharpened by upstream dormancy, ADR 0002 C21).
Evidence: E15, E39.

### C10 — WIP-caveat referent and rewording (B3, hypothesis)

The caveat "remaining tuning on how schemas are loaded" (added the night of
the 0.0.1 publish) reads as a period acknowledgment of the ingestion zone
later declared deferred-for-redesign (ADR 0002 C14/C17); its rewording was
not adjudicated (TR4 half unaddressed). Inference-only linkage — capped at
hypothesis; disposition open. Evidence: E16, E17, E39 note.

## Q4 — README project layout

### C11 — `src/fixtures/` is a writing error, no design payload (B1, anchor)

The path never existed at any commit (fixtures were born at repo root one
commit before the README), and the steward calls it "a detail" — no
layout-move fossil. A fixtures folder remains wanted "regardless of the
layout". Disposition: fix-when-touched, no dig output. Evidence: E18, E40
(artifact absence independently supports the no-move reading).

## Q5 — Published tarball contents

### C12 — 0.0.1 ships the compiled test suite; today would too (A1, anchor; today-half verified-as-of 2026-07-26)

The immutable 0.0.1 tarball contains 16 `dist/tests/` paths because the
exclusion `!dist/test` does not match `dist/tests`; `npm pack --dry-run` on
the current tree reproduces the same leak. Evidence: E19, E20, E21, E22.

### C13 — 0.0.0 was a deliberate stub publish (B1, anchor)

The 168-byte, manifest-only 0.0.0 (published hours before the code commits)
was a deliberate stub/name-claim publish — artifact shape and testimony
agree independently. Evidence: E19, E41.

### C14 — Packaging intent: tests must not ship (B1, anchor)

"dist/tests must NOT be shipped" — the `files` exclusion is a botched
attempt at exactly that intent (the `!` pattern exists but misses), making
this a confirmed packaging defect awaiting an ordinary-work fix at next
publish. Evidence: E19 (attempted exclusion as independent artifact), E41.

## Q6 + ADR 0002 C20 — harness config dependence

### C15 — The suite is cwd-bound to the repo's own config (A1, anchor)

All three original suites instantiate `new ESLint({ overrideConfig })` with
no language, cwd, or `overrideConfigFile`; run from any cwd without a
discoverable `eslint.config.*` the suite hard-fails ("Could not find config
file."), and run from repo root it silently composes with the repo's
dogfood block — which is what supplies `language: 'markdown/gfm'` at all.
The executable evidence class (characterization twin included) is
cwd-dependent. Evidence: E23, E24, E26.

### C16 — ESLint v9 resolves config from CWD; nearest-from-file is v10 (A1, anchor; verified-as-of 2026-07-26, versions 9.26.0/9.39.5)

With two nested configs, the CWD's config wins under v9 defaults even for a
file adjacent to the deeper config; `v10_config_lookup_from_file` (renamed
from `unstable_config_lookup_from_file`, "to reflect its stabilization")
flips to nearest-from-file. This RESOLVES ADR 0002's C20 verification flag:
"ESLint handles nearest eslint config" holds only from v10 or behind the
flag — today's semantics are cwd-based. Evidence: E25.

### C17 — Dogfood-as-harness was deliberate init pragmatism; isolation intended next (B2, anchor)

The arrangement "worked OK for the first init phase", was "just practical",
matches layouts seen in other OSS ESLint rules (steward IIRC), and the
forward intent is a properly isolated harness that "avoids weird 'feedback
loops'". Not an accident — a phase choice now expiring. Evidence: E42
(practice itself observed in E26).

## Q7 — Release contract

### C18 — Release automation never executed; publishes were manual (A1, anchor)

`release.yml` is a byte-identical copy of upstream's live workflow committed
fully commented out; semantic-release is present as script + devDeps with no
rc file and none of its mandatory side effects exist (zero git tags, no
changelog, no GitHub releases) across both npm versions — publishes happened
outside any automation, by `julian.cataldo`. Evidence: E27, E28, E29.

### C19 — Forward release intent: manual now, changesets later (B2, anchor)

The release story is "nascent"; low update frequency makes a full harness
unnecessary now. Later intent: homogenize with the steward's other repos by
migrating to changesets — conventional-commit-driven automation
(semantic-release) is disfavored; the copied workflow is a dead direction,
not a pending activation. Evidence: E43.

## Q8 — `/docs` ignore (recalibrated)

### C20 — Un-ignore deliberate; tracked docs/ is the end state (B1, anchor)

`/docs` was active from init and commented out in the seedbed-setup commit
itself (`4de64c9`, 2026-07-24); the ignore pattern "is NOT a pattern I want
to keep", tracked `docs/` (SDD docs, ADRs, cartography) is the desired end
state, and future typedoc output goes to a dedicated path
(`docs/typedoc`-like), never the default `docs/`. The Q8 premise (docs
untracked) was stale on arrival. Evidence: E30 (the commit act as
independent artifact), E44.

### C21 — Fixture/test moratorium until the post-excavation clean slate (B2, anchor)

No fixture deletions and no negative certificates from this dig: the current
integration tests are "NOT well organized" and the steward wants a clean
slate "after the full excavation is done" — that redesign is the disposal
authority for fixtures, test layout, and harness isolation alike (with C4,
C17). 03-Q3 adjudicated: retained-until-redesign, certificate declined.
Evidence: E45, E42, E36.

### C22 — Live fixture surfaces today (A1, anchor; verified-as-of 2026-07-26)

`fixtures/sample.md` is an intentionally-erroring in-IDE demo under the
dogfood config (2 errors: required `foo`, `description` type) with no test
consumer and no `lint` script — an IDE/manual-only surface invited by the
README's "try the fixtures in your IDE". `.dev.invalid.schema.json` is an
untracked byte-duplicate of `valid.schema.json` referenced by nothing.
Evidence: E31, E32, E33, E34.

### C23 — Typedoc origin story for the ignore (B3, hypothesis)

The `/docs` ignore originated as an autogenerated-typedoc convention carried
from simpler projects ("like the remark lint rule, IIRC") — hedged
single-source testimony; the upstream spot-check found no typedoc surface
and a tracked docs/ dir, so the origin stays uncorroborated. Harmless to the
C20 disposition either way. Evidence: E44, E46.

## Grade summary (proposed)

- A1 anchors: C1, C2*, C6*, C7, C12*, C15, C16*, C18, C22* (* carry
  verified-as-of stamps on their decaying halves)
- B1 anchors: C8, C11, C13, C14, C20
- B2 anchors: C4, C5, C9, C17, C19, C21
- B3 hypotheses: C3, C10, C23

Cross-dig effects on confirmation: C16 resolves ADR 0002's C20 verification
flag; C5 revises the "reds encode desired behavior" reading for the
empty-frontmatter case; C8 extends dig-2 C15 (cues, not dead weight) to the
`fixable` flag, adjudicating 03-Q4.
