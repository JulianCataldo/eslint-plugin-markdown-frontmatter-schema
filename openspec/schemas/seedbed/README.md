# Seedbed OpenSpec Schema

`seedbed` is Seedbed's owned workflow for changes that need the standard
proposal-to-tasks OpenSpec flow plus a confirmed acceptance contract, post-apply
assessment, durable Architecture Decision Records, seed-prompt lifecycle
guidance, and parked-work conventions.

Key references:

- Article:
  https://intent-driven.dev/blog/2026/04/29/spec-driven-development-with-adr/

[![Spec-Driven Development with ADR](https://img.youtube.com/vi/y5oemaPsmOA/hqdefault.jpg)](https://youtu.be/y5oemaPsmOA)

- Good fit: architectural changes, platform decisions, cross-module work, new
  service boundaries, technology choices, or changes where future contributors
  need a persistent decision trail.
- Not a good fit: small tactical fixes, content-only edits, simple UI changes,
  or work where `specs -> tasks` is enough.

## Installation

This schema is delivered as part of the Seedbed harness. In an installed target
there is no separate schema-copy step; use the activation setting below.

## Activate

Set this in `openspec/config.yaml`:

```yaml
schema: seedbed
```

## Stage Gates

Artifact order: `proposal -> specs -> acceptance -> design -> adr -> tasks`

The dependency graph enforces this order: `acceptance` turns finalized specs
into observable rules before `design` decides how to satisfy and evidence them.
Both `design` and `tasks` depend on that contract.

Gate expectations:

- `specs` must be based on the capabilities identified in `proposal.md`.
- `acceptance` must contain either human-confirmed rules or an explicit,
  human-confirmed waiver. Rules identify observable outcomes, competent
  assessors, and trustworthy evidence before implementation begins.
- `design` must account for the proposal, specs, acceptance contract, and
  currently in-force ADRs, and must include an explicit requirement-to-decision
  mapping: every spec requirement names the decision(s) that satisfy it, and
  every decision is motivated by a requirement or justifies itself.
- `adr` completes by writing `openspec/changes/<change>/adr.md`, a concise ADR
  review manifest created after design and before task planning.
- `tasks` are planned only after proposal, specs, acceptance, design, and ADR
  artifacts are complete. Every generated task list retains its final
  acceptance-gate checkbox for assessment alone.

## Apply and Assess

Apply implements the confirmed contract and produces its required evidence. It
never ticks the final acceptance-gate task and ends **ready for assessment**,
not ready for archive. Findings from a prior assessment are ordinary follow-up
work, so the loop is re-enterable:

`apply -> assess -> finding -> apply -> reassess`

Run the distributed `openspec-sb-assess` skill with `/openspec-sb-assess` in Claude Code or
`$openspec-sb-assess` in Codex. OpenCode discovers the canonical `.agents/skills/` copy
and activates it through its native `skill` tool. Assessment gathers the
cheapest trustworthy evidence for each rule, records honest dispositions in
`acceptance.md`, and stops for a named human or independent-model judgment where
the contract requires one. Only assessment may tick the final gate, and only
after every required rule is resolved.

Archive uses that unchecked task as a soft gate. If a human overrides unresolved
required rules, the durable reason must be recorded in `acceptance.md` before
archive proceeds; advisory rules never block.

## Seed Prompts

When a proposal request explicitly names a staged seed under
`openspec/seed-prompts/`, the proposal step promotes it first: consent and
secret review, move to `openspec/changes/<change>/seed-prompt.<ext>` (extension
preserved), and a `seed-prompt.meta.yaml` sidecar — no content hash yet. A
promoted seed stays open for human-performed, append-only follow-ups through
proposal, planning, and implementation, until the archival pre-check records
`content_sha256`/`git_blob` and retires the seed in one transition,
officializing its whole prompt history. Seed payloads are human-authored and are
never written or rewritten by an LLM in any state; developer-reviewed repository
formatting is permitted as maintenance.

Once a seed's metadata declares `context_policy: explicit-only` (retirement),
conforming proposal, design, and apply steps read only the metadata sidecar for
routing and do not load the seed payload — in active changes or archives —
unless the user explicitly requests seed or provenance review. Full lifecycle
documentation lives at `openspec/seed-prompts/README.md`.

## ADR Persistence

`openspec/changes/<change>/adr.md` is the per-change ADR review artifact used
for OpenSpec artifact completion. It records that ADR review happened, lists the
in-force ADR context that was reviewed, and references any durable ADR files
created for the change.

Durable ADR files are generated under the planning root's `docs/adr/` folder —
the `docs/adr/` beside this `openspec/` harness (the repository root's in a
single co-located setup) — never inside the OpenSpec change folder. Create
`docs/adr/NNNN-kebab-title.md` only when the change introduces a major durable
architectural decision; numbering and supersession are scoped per planning root.
Accepted ADRs are immutable. If a future decision changes a prior ADR, create a
new ADR that supersedes the old one and leave the original file unchanged.

## Note

- For ADR skills please refer to:
  [Intent-Driven-Template Skills](https://github.com/intent-driven-dev/intent-driven-template/tree/main/.agents/skills/architectural-decision-records).
- This skill takes care of choosing the ADR style/template used by this schema.

## Seedbed-Owned Paths

Seedbed policy, templates, and scoped guidance live only under
`openspec/schemas/seedbed/`, which the OpenSpec CLI does not regenerate. Agent
entrypoints use `.agents/skills/`, with a byte-identical `.claude/skills/`
duplicate only for Claude Code discovery. Seedbed never authors
`openspec/AGENTS.md`, stock CLI command/skill inventories, or home-directory
files.

For more schemas, refer to
https://github.com/intent-driven-dev/openspec-schemas.
