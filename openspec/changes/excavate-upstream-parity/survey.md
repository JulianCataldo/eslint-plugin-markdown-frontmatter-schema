# Excavation Survey

<!-- Scope the dig before touching evidence. Evidence collection MUST NOT
begin until the human confirms this scope — record that below. -->

## Subject and driving question

Campaign 01 Q7: which upstream `remark-lint-frontmatter-schema` behaviors were
intended to carry over to this ESLint port? Two layers:

1. **Divergence matrix** (behavioral baseline): upstream's de-facto contract vs
   the port's now-spec'd contract (`openspec/specs/rule-runtime-contract/spec.md`),
   across the shared surfaces — schema association (local `$schema` / global
   `schemas` map / embedded schema), path + URL resolution, YAML parse and
   syntax-error reporting, validated payload (`$schema` key handling), Ajv
   lifecycle and options, message shape / positions / suggestions, frontmatter
   gating.
2. **Intent map**: per divergence — carried / dropped deliberately / dropped
   accidentally / never existed upstream. This is the adjudication input
   campaign 03 Q1 (`schemas` glob option) and Q2 (`fixDescription`,
   `yamlSyntaxError` messageIds) wait on.

Out of scope: modifying the upstream repo (read-only corpus, including its
uncommitted working-tree delta); implementing any parity feature in the port;
adjudicating campaign 03 outcomes (this dig delivers input only);
re-excavating port behavior already locked in `rule-runtime-contract`.

## Mode

Witnessed recovery — the steward (Julian Cataldo) authored both packages and
is available. Standing testimony (2026-07-26, dig
`excavate-rule-runtime-contract` survey) already weakens the upstream-intent
oracle for the schema-ingestion zone: upstream had the same class of problems
("less deceptive"). Upstream corpus: local checkout at
`/Volumes/n_1024a-Projects/Repositories/packages/remark-lint-frontmatter-schema`
(own git repo, npm v3.15.3, dormant since 2023-09, deps installed —
runnable). Its working tree carries uncommitted modernization work
(`index copy.ts`, `package copy.json`, untracked `index.test.ts`, new
`with-empty-frontmatter.md` demo fixture) — evidence of recent steward
attention, interpretable only via testimony.

## Risk list

- Campaign 03 deletes declared surface that parity intent still wants
  (`schemas`, `yamlSyntaxError`) — or the port implements surface that was
  deliberately dropped. Both directions of a wrong intent map are destructive.
- Intent inferred from code similarity presented as recovered fact — the
  failure mode the epistemics exist to prevent; capped at hypothesis without
  testimony.
- Back-door ratification: "upstream does X" must not silently ratify the
  port's non-ratified ingestion zone. Upstream is a weakened oracle there per
  standing testimony.
- Waiting on this dig: campaign 03 Q1/Q2 adjudication; context for the PR #2
  (real squiggle positions) parity direction.

## Evidence-source inventory

- Upstream code as period document: `index.ts` (single file, v3.15.3) — B.
- Upstream runnable behavior: demo pipeline + installed deps; bounded
  characterization runs against upstream only where a divergence claim must
  anchor — A when re-run.
- Upstream VCS history + semantic-release CHANGELOG (2022–2023) + README/docs
  — B/C period documents.
- Port intent period documents: `README.md:6,10` ("This is a port … The API
  is kept very similar."), port git history, PR #2 as parity-gap signal — B.
- Upstream uncommitted working-tree delta — undated steward-intent trace;
  needs testimony.
- Named witness: Julian Cataldo (author of both). Testimony requests emitted
  per divergence where artifacts cannot answer intent.

## Intended outputs

- Primary: recovered intent map — expected shape: shadow ADR ("port scope:
  carried / dropped, evidently decided circa 2025–2026") with the divergence
  matrix as its evidence backbone; degrades honestly to hypothesis-grade
  reference where testimony stays thin.
- Campaign bookkeeping: 01-Q7 → answered with pool pointer; adjudication
  input recorded for 03-Q1/Q2 (negative certificates themselves stay with a
  future campaign 03 dig).
- Honest unknown is a valid per-area outcome.

## Scope confirmation (human gate)

- Confirmed by: Julian Cataldo (steward)
- Date: 2026-07-26
- Notes: via in-session gate question, option "Confirm full scope" — full
  divergence matrix (seven surfaces, bounded upstream characterization runs
  allowed) plus intent map. Upstream repo stays read-only; runner scripts and
  fixtures live outside it.
