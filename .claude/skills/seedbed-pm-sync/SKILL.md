---
name: seedbed-pm-sync
description:
  Runs opt-in PM-platform lifecycle sync for OpenSpec changes — bind an issue at
  proposal, reflect progress at apply, transition to Done only after archive —
  honoring the what/how ownership split on dedicated low-human-intervention
  boards. Off by default; activates only through openspec/pm-sync.yaml.
---

# Sync a change with the PM platform

Use this skill as a thin entrypoint. All sync policy lives in
`openspec/schemas/seedbed/pm-sync-policy.md`; load and follow it instead of
creating a second policy here.

## Resolve and load the binding

1. If the user names a registered OpenSpec store, or the work lives in one, run
   `openspec store list --json` and retain `--store <id>` on every command that
   supports it.
2. Read `openspec/schemas/seedbed/pm-sync-policy.md` (reached through the
   planning root's `openspec/schemas` path or symlink) and
   `openspec/schemas/seedbed/AGENTS.md`; they are the policy source of truth.
3. Check `openspec/pm-sync.yaml` at the planning root. Absent or
   `enabled: false` means sync is OFF: do nothing platform-side and add no setup
   pressure — configuration starts only on an explicit user request.
4. Resolve the change (named, inferred, or chosen via `openspec list --json`)
   and its binding, then follow the policy's lifecycle hooks through the vendor
   MCP tools the adapter names.

## Hard rules carried by the policy

- Platform owns the business "what"; the repo owns the technical "how" — design
  and tasks never leave the repo.
- Done only after archive succeeds, never before.
- Writes are deterministic and attributable; platform or MCP unavailability is
  non-blocking — finish local work, report skipped sync, no silent retries.
- Warn and require explicit confirmation before binding an out-of-scope board
  shape.

Do not duplicate, reinterpret, or extend sync policy in this shim; policy
changes belong in the schema folder.
