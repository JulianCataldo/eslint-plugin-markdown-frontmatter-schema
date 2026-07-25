# Excavation Survey

<!-- Scope the dig before touching evidence. Evidence collection MUST NOT
begin until the human confirms this scope — record that below. -->

## Subject and driving question

Subject: the runtime pipeline of the single rule
`frontmatter-schema/frontmatter-schema` — orchestration in
`src/create-reports.ts`, helpers `src/prepare.ts`, `src/validate.ts`,
`src/schema-loader.worker.ts`, rule shell `src/rules/frontmatter-schema.ts`
(~390 lines total).

Driving question: what is the rule's de-facto runtime contract — schema
resolution and loading, frontmatter parsing, validated payload, error
reporting/suggestions, and options-shape edges — as observed behavior?

Originating campaign questions: `docs/excavation/01-campaign-reference.md`
Q1–Q6. Per the "sizeable chunks" directive this dig is chunk 1 of 2 for
campaign 01: one characterization battery over one small pipeline serves all
six questions. Q7 (upstream-parity corpus read) is out — different evidence
class, gates campaign 03 adjudication, own dig.

Recon delta (2026-07-26; all campaign pointers verified live):

- New sub-question under Q3/Q4 — module-singleton Ajv with per-call `compile`
  (`src/validate.ts:15,87`) plus a fresh bundled schema object per file means
  multi-file semantics are unknown: `$id` re-registration may throw mid-lint;
  no memoization implies per-file re-bundle/re-fetch.
- Q6 refinement — meta options schema declares `defaultSchema: {type:
'object'}` (`src/rules/frontmatter-schema.ts:41`) while `parseGlobalSchema`
  accepts strings (`src/prepare.ts:89`): ESLint core options validation may
  make the string branch unreachable.
- GitHub tracker recon (steward-directed, 2026-07-26). Steward testimony this
  session — recalled a community report of the Q6-refinement problem with an
  associated PR — resolves to: issue #1 (VityaSchel, 2025-10-12) reporting
  both (a) every error at "Ln 1, Col 1" (Q4 root-error mapping) and (b)
  `defaultSchema` rejecting schema paths with ESLint's "expected object" (the
  Q6 refinement, hit in the wild); owner reply 2025-10-13 is intent
  testimony ("That's a bug … Should be correctly mapped at real location (as
  in tests)"). PR #2 (kirbysayshi, 2026-04-24, OPEN, unmerged) fixes (a)
  only — plus new tests/fixtures spanning Q2 (`yaml-tab-indent`), Q3 (remote
  schema), Q4 (`additional-property`); it encodes desired post-fix behavior,
  distinct from the current-behavior characterization this dig locks, and
  does not touch the options meta schema (b).
- Steward testimony (this session, 2026-07-26; verbatim, seeds the ledger
  post-gate): (1) "The MURKY schema config ingestion story. It is CLEARLY
  the achille heels of my remark-lint-frontmatter schema porting (this one
  already had problems, too, but it was less deceptive)" — "By murky I mean
  'I screwed up' and will fix later. semi clean slate (for this specific
  part of the eslint rule)". (2) "AJV full capability is NOT ENSURED. AJV is
  a beast. There is definitely TYPICAL (widespread in the JS ecosystem for
  AJV consumers) dead angles regarding PHYSICAL files path / id resolution."
  (3) "This is both area that definitely needed a proper design + testing
  that was not done in a disciplined manner (or at all)". Scope consequence:
  for schema ingestion (Q1/Q3/Q6) current behavior is testimony-confirmed
  accident, not intent — characterize it as the safety net for the pending
  redesign; the spec marks that area de-facto, non-ratified. Upstream is a
  weakened intent oracle for ingestion parity (feeds Q7 / campaign 03).

## Mode

Witnessed recovery. Julian Cataldo — sole author of all four substantive
commits, also the upstream author — is the steward driving this dig;
testimony available on demand. Evidence availability still caps grades per
claim.

## Risk list

- Package is published (npm `0.0.1`); a wrong reconstruction blesses
  accidental behavior as contract for config authors (T1), markdown authors
  (T2), and CI pipelines (T3).
- Campaign 02 reconciliation (red suite) waits on Q5/Q6 findings; campaign 03
  eliminations (`schemas` option, dead messageIds, `fixable`) wait on
  reachability evidence from here — a wrong read propagates into deletion
  decisions.
- Characterization must lock ACTUAL behavior, bugs included; a silently
  "corrected" expectation would poison both the suite and the pool.
- The multi-file Ajv `$id` question may be a latent crash affecting every
  consumer; mis-grading its severity skews later prioritization.
- Two open community items wait on this dig's findings: issue #1 (two
  distinct problems) and unmerged PR #2 — respond/merge decisions should cite
  dig evidence instead of re-derivation.
- Steward declared schema ingestion semi clean slate ("fix later"): the
  ingestion redesign waits on this dig's characterization as its safety net,
  and the spec must record that area as de-facto only — enshrining it as
  intended contract is now a known-wrong reconstruction.

## Evidence-source inventory

- Running behavior (targets reliability A): new characterization battery —
  node:test over built `dist`, driven through ESLint's `Linter` with the
  repo's markdown language setup. Proposed candidates: resolution precedence
  and non-`https://` `$schema` forms (`http://`, protocol-relative, `file:`,
  absolute); malformed-YAML behavior (is `yamlSyntaxError` reachable);
  options matrix `['error']` / `['error', {}]` / `['error',
{defaultSchema}]`; whole-file-parse offset correctness (YAML-lookalike
  markdown bodies, multi-document text); enum suggestion shape (restores
  executable evidence for `src/validate.ts:65-69`); multi-file same-schema
  pass (`$id` re-compile, worker call count); `$schema` key vs
  `additionalProperties: false`; Ajv/ref-parser dead-angle matrix per
  steward testimony — relative `$ref` base for file vs inline-object vs
  remote schemas (cwd sensitivity), `$id` conflicts on the singleton
  registry, non-draft-07 meta-schemas (e.g. 2020-12), fragment pointers in
  `$schema` values.
- Existing suite: `pnpm test` (c8 + node:test), red 4/7 at boot run
  2026-07-24 — red expectations double as authored-intent period evidence;
  the c8 table marks unobserved paths.
- Dogfood run: `eslint.config.js:131-161` over repo markdown.
- VCS: four substantive commits (`07f5024` → `9bbddcd`, 2025-07-25 →
  2025-08-07) — thin but dated.
- Period documents: `README.md` (`--fix` claim, "API kept very similar"),
  `meta.docs.url` pointing at the upstream repo.
- GitHub tracker (period documents + third-party testimony): issue #1 —
  reporter VityaSchel, Q4 loc complaint + Q6 `defaultSchema` "expected
  object" in the wild + owner intent reply (verbatim in the ledger, its sole
  durable home); PR #2 — Andrew Petersen (kirbysayshi), unmerged fix for the
  Q4 root-error mapping with new Q2/Q3/Q4 fixtures and tests
  (desired-behavior evidence, not current-behavior) — referenced as a
  locally fetched SHA-pinned branch with high-level findings in the ledger,
  diffs re-derived from git on demand; authorship preserved for future
  credit.
- Witnesses: Julian Cataldo (author/steward) — named testimony channel for
  intent claims; external, reachable via the tracker if needed: VityaSchel
  (issue #1 reporter), kirbysayshi (PR #2 author).
- External, out of scope here: upstream `remark-lint-frontmatter-schema`
  corpus; npm `0.0.1` tarball snapshot.
- Constraint: offline/timeout semantics for remote schemas (Q3) may be only
  partially observable in this environment; an honest unknown is an
  acceptable terminal state for that sub-question.

## Intended outputs

- Participant spec(s) for the pool: the rule's runtime contract — normative
  content from anchor-grade claims only, split by intent status:
  parsing/validated-payload and reporting/suggestions may ratify where
  intent evidence supports (e.g. the owner loc-mapping reply on issue #1);
  the schema-ingestion area (resolution, loading, options) enters as a
  de-facto behavior snapshot explicitly marked non-ratified (testimony:
  accidental, redesign pending) with a verified-as-of stamp.
- Possible shadow ADR: whole-file YAML parse with file-global offsets
  (evidently decided circa 2025-07-25) — only if testimony or period evidence
  corroborates the intent.
- Elimination-shaped finds (unreachable `yamlSyntaxError`, inert `--fix`,
  unread `schemas`) are recorded as graded claims + evidence for campaign 03
  digs to cite; negative certificates stay with campaign 03 unless redirected.
- Honest unknowns allowed (remote-failure semantics).
- Post-promotion hook: any promoted spec triggers code→spec JSDoc annotations
  per ADR 0001.

## Scope confirmation (human gate)

- Confirmed by: Julian Cataldo (steward)
- Date: 2026-07-26
- Notes: confirmed via in-session gate question, option "Confirm scope as
  drafted" — Q1–Q6 as one chunk, Q7 deferred to its own dig; includes the
  GitHub tracker evidence sources and the steward-testimony amendments
  (schema-ingestion area to be recorded de-facto/non-ratified).
