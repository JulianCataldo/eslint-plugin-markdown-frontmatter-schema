# 0001 — Code→spec relationship annotations (`@spec` / `@adr` JSDoc tags)

- Status: proposed
- Date: 2026-07-25
- Supersedes: none

## Context

Brownfield SDD excavation will produce specs-after-the-fact for this ~425-LOC
plugin, with nothing anchoring specs back to the code they govern. Prior art
in the wild (Jira tickets, PR numbers, ADR numbers in freeform comments,
`NOTE(NNN):`) shows the appetite; what changes here is format
conventionalization and mapping systematization. This is an experimental,
project-local probe — deliberately no spec pipeline of its own; a differently
shaped spec lands upstream in Seedbed once the pattern is validated.

## Decision

Adopt conventionalized `@spec` / `@adr` JSDoc annotations mapping code to SDD
artifacts, produced as mandatory post-processing in both workflows (an
excavation slice references each promoted spec in code before it closes; an
apply pass records relationships for touched code before it completes), with
human diff review as the only gate.

The full convention — draft tag grammar, shallowest-crisp placement across
three levels, raw/hover dual-legibility constraint, workflow hooks, trial
posture — is unrolled in
[docs/excavation/code-specs-relationships.md](../excavation/code-specs-relationships.md),
which remains revisable between slices under human judgment.

## Consequences

- Positive: mechanical SDD coverage markers reviewable in diffs; direct
  code→spec pointers for humans and LLMs without lengthy JSDoc prose; on a
  compact codebase, an eventual "all bits of code covered" statement becomes
  assertable.
- Negative: the codebase gets arguably uglier (Markdown brackets, relative
  paths); relative links can rot on file moves with no tooling beyond review.
- Risk: accumulated annotation noise after full excavation may erode the
  pattern's value — that reassessment is deliberately deferred.
