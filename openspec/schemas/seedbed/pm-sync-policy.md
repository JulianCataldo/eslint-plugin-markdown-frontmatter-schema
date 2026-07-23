# PM-platform sync policy

Policy source of truth for the `seedbed-pm-sync` skill: opt-in lifecycle sync
between the change workflow and one dedicated PM-platform board. The platform
owns the business "what"; the repository owns the technical "how". Seedbed ships
instructions, never integrations: platform access is delegated to vendor MCP
tools, best-effort and non-blocking.

## Activation is config-gated, OFF by default

Sync activates only through `openspec/pm-sync.yaml` at the planning root. File
absent, or `enabled: false`, means every workflow behaves purely locally: no
platform reads or writes, no binding lookups, and — hard rule — no setup prompts
or nudges from any lifecycle action. Only an explicit user request ("set up PM
sync", `/seedbed-pm-sync setup`) may start configuration.

## `openspec/pm-sync.yaml` shape

```yaml
enabled: true # omit the file entirely for OFF; false also disables
platform: linear # adapter id: linear (MVP) | jira | notion (documented slots)
team: ENG # platform team/workspace identifier
project: seedbed-pets # platform project/board identifier
labels: [seedbed] # optional: label filter applied to created/matched issues
bindings: # change ↔ issue bindings, maintained by the skill
  dev-project-management:
    issue: ENG-123
    bound_at: 2026-07-17T00:00:00Z
```

Identifiers use the platform's native ids/keys. The file is plain reviewable
YAML under git — bindings are repository state, recoverable and attributable
like everything else. Seedbed stores no credentials here or anywhere;
authentication belongs to the vendor MCP server's own setup.

## Adapters via vendor MCP tools

- `linear` — MVP adapter; use the official Linear MCP tools (prior art: the
  intent-driven.dev Linear/OpenSpec workflow and the `openspec-linearized`
  skill).
- `jira`, `notion` — documented slots, not MVP; same contract when they land.

Missing MCP tools are treated exactly like platform unavailability (below):
non-blocking, reported, with a pointer to the vendor's MCP setup docs.

## The what/how ownership split

- Platform-side (the "what"): business-facing summary, use cases, acceptance
  criteria at stakeholder level, status, links back to the repo change.
- Repo-side (the "how"): specs, design, tasks, implementation detail, acceptance
  evidence.

Sync MUST NOT copy technical design or task detail into platform items, and MUST
NOT treat platform content as the specification source of truth. When
platform-side edits contradict repo specs, surface the divergence to the user
(the oracle's drift check is the reading side of this); never auto-repair in
either direction.

## Lifecycle hooks

Under an active binding for a change:

- **Bind at proposal** — select or create the issue carrying the business
  context; record the binding in `pm-sync.yaml`; the issue gets the
  business-facing summary and a link to the change, the proposal stays lean and
  links back.
- **Progress at apply** — status transition (e.g. In Progress) and short
  progress comments at meaningful boundaries; task checkboxes stay in
  `tasks.md`, never mirrored as platform sub-tasks.
- **Done only after archive** — transition the issue to Done strictly after
  archival succeeds, never at apply completion, never before the acceptance gate
  closed. Until then the issue may show progress, not completion.

## Write-back discipline: rock solid, non-blocking

- Writes are deterministic and attributable: every platform write names the
  change that produced it (in the comment/description body), so a human can
  trace any board mutation back to repo history.
- Repository state is never mutated as part of error handling; a failed platform
  write never corrupts, blocks, or rolls back local SDD work.
- Platform or MCP unavailability is non-blocking: complete the local action,
  then report exactly which sync updates were skipped and why. No silent
  retries, no half-writes; the user re-runs the sync explicitly once the
  platform is back.
- Before writing, verify the binding still matches (issue exists, ids agree). A
  dangling binding is reported for the user to rebind or clear — never silently
  recreated.

## Board-shape guardrail

Supported shapes are dedicated, low-human-intervention boards: a self-contained
internal tool, a technical-debt family board, an autonomous feature-team board.
At setup, before any binding is written, warn and require explicit confirmation
when the target looks out of scope — a general production-bug triage board or a
scrutinized, month-spanning epic — where human attention dominates and
bidirectional conflicts are likely. Deferred strata (realtime multi-dev WIP
consolidation, bidirectional sync on human-heavy boards, dashboards, virtual
parent-tree mapping) are out of scope; direct requests for them to new ideas or
changes.
