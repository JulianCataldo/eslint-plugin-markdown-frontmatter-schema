# Excavation Survey

<!-- Scope the dig before touching evidence. Evidence collection MUST NOT
begin until the human confirms this scope — record that below. -->

## Subject and driving question

Campaign `02-campaign-drift` full frontier (Q1–Q8) plus its two declared
campaign-03 riders (03-Q3 orphaned fixtures, 03-Q4 `meta.fixable`), which the
campaign files themselves pair with 02-Q1(a)/02-Q2. Driving question: for each
declared-vs-executed divergence, (1) which side was intended when written, (2)
when did the sides diverge (VCS-dated), and (3) what is its disposition now
under the campaign-01 frame — LS-parity as governing target, error-surfacing
repass and semi-clean-slate ingestion redesign both planned (ADR 0002,
C13–C21)? Answering closes campaigns 02 and 03 if promotions confirm.

Recalibrations from campaign-01 findings and fresh recon (steward licensed
re-shaping, 2026-07-26 invocation):

- Campaign anchor observable is stale: suite is now 34 tests / 30 pass /
  4 fail (dig-1 characterization twin added 27). The 4 reds are the repo's
  only executable statement of desired behavior.
- Q8 premise is stale: `# /docs` was commented out in `4de64c9` (2026-07-24,
  the seedbed-setup commit itself); `docs/` is fully tracked, both ADRs
  committed. Q8 collapses to confirming the un-ignore was deliberate.
- Q6 absorbs ADR 0002's C20 verification flag (ESLint nearest-config/cwd
  semantics vs the suite's silent dependence on repo `eslint.config.js`).
- Q2 gains nuance: suggestions already carry `fix` payloads (IDE quick-fix
  applies them); the specific drift is the CLI `--fix` claim (README:110).
- Q3's WIP caveat ("remaining tuning on how schemas are loaded") now has a
  precise referent: the deferred ingestion redesign (C14/C17). `meta.docs.url`
  → upstream repo is sharpened by C21 (upstream dormant, port successor).
- Q7 pre-evidence: npm has 0.0.0 AND 0.0.1 (last modified 2025-08-06), zero
  git tags despite semantic-release config → publishes likely manual;
  `release.yml` is a fully-commented upstream-era copy (pnpm 7.1.7, `master`).

## Mode

Witnessed recovery — Julian Cataldo (steward, sole author) available; one
batched testimony round planned (dig-2 pattern). VCS history is rich and
recent; registry artifacts are immutable.

## Risk list

- Q1 wrongly adjudicated locks aspirational behavior in as contract, or
  erases the desired-behavior signal the 4 reds carry — both directions
  corrupt the pool spec's intent-status zones.
- Fixture churn (Q1a + 03-Q3) without certificate machinery could delete
  IDE-manual-use affordances (README:128 invites trying fixtures) — only a
  dig certificate licenses deletion.
- Q2 + 03-Q4 wrong disposition either strips a planned-capability cue
  (`fixable` flag, per the C15 "miswired attempts are cues" precedent) or
  leaves a false README promise standing.
- Q6 misread would mislabel the whole executable evidence class
  (characterization twin included) as cwd-portable when it may not be.
- Q5: registry tarballs decay-proof but the finding decays (next publish) —
  needs `verified-as-of`; packaging FIXES are ordinary work, not dig output.
- Standing: no back-door ratification of schema-config ingestion (steward:
  accidental, awaiting redesign); campaign edits stay bookkeeping, zero pool
  authority; upstream checkout read-only.

## Evidence-source inventory

- Running behavior: current suite (34/30/4); targeted probes — cwd-variation
  runs (Q6), `npm pack --dry-run` (Q5).
- Registry artifacts: published 0.0.0 / 0.0.1 tarballs (Q5, Q7) — immutable,
  probe-friendly, findings stamped `verified-as-of`.
- VCS history: `555a2a7` (tests+fixtures born together) → fixture drift
  dating (Q1a); `.gitignore` blame (Q8); README history (Q2–Q4); absence of
  tags (Q7).
- Period documents: README head comment (upstream-port framing),
  `release.yml` upstream-era copy, upstream repo read-only checkout for
  workflow provenance (Q7).
- Prior pool artifacts: `openspec/specs/rule-runtime-contract/spec.md`
  (Q1b trace = its options-shape + reporting zones), ADR 0002 claims
  C8/C14/C15/C17/C19/C20/C21.
- Witness: Julian Cataldo (steward) — batched testimony round for intent
  adjudications (Q1 sides, Q2/03-Q4 disposition, Q3 wording, Q7 release
  path, Q8 deliberateness).

## Intended outputs

- Dated drift register (claims) with per-item steward adjudication; normative
  landings likely as pool-spec intent-status deltas (Q1b, Q2) — explicit
  gated merges, never silent overwrites.
- Shadow ADR only if a genuine past decision emerges (candidate: Q7 release
  contract — "automation copied, never activated; manual-publish era").
- Q5: dated packaging snapshot; possibly a negative certificate
  (`docs/certificates/`) if the tarball verifiably does NOT ship something.
- 03-Q3: negative certificate (orphans safe to delete) or retained-with-
  reason adjudication; 03-Q4 joint disposition with Q2.
- Campaign bookkeeping (zero authority): refreshed stale anchors, Q8
  rewrite, campaign-01 closed stamp, campaign-02/03 flips on promotion.
- Honest unknowns stay recorded as such.

## Scope confirmation (human gate)

- Confirmed by: Julian Cataldo (steward)
- Date: 2026-07-26
- Notes: via in-session gate question, option "Full scope" — campaign 02
  Q1–Q8 with the recalibrations above, plus campaign-03 riders 03-Q3/03-Q4.
  Closes campaigns 02 and 03 if promotions confirm. One batched testimony
  round. Upstream checkout stays read-only; probes, tarball inspection, and
  scratch fixtures live in the session scratchpad, not the repo.
