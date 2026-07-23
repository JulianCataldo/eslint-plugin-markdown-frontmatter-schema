---
name: seedbed-tend
description:
  Tends SDD git state on demand — rebuilds lane state from the working tree, git
  history, and the openspec tree alone, buckets dirty Seedbed-owned paths by
  change lane, proposes scoped commit plans with mirrored subject style, and
  commits only on explicit approval of the exact plan. Advisory always; never a
  silent commit, never non-owned files. Drafts changesets only where
  `.changeset/` exists or the author opts in.
---

# Tend SDD git state

Use this skill as a thin entrypoint. All stewardship policy lives in
`openspec/schemas/seedbed/AGENTS.md` ("SDD git stewardship" and its Changesets
facet); load and follow it instead of creating a second policy here.

## Rebuild state, plan, await approval

1. If the user names a registered OpenSpec store, or the work lives in one, run
   `openspec store list --json` and retain `--store <id>` on every command that
   supports it.
2. Read `openspec/schemas/seedbed/AGENTS.md` (reached through the planning
   root's `openspec/schemas` path or symlink) and the planning root's
   `openspec/config.yaml` context — the repository's declared owned-surface
   extensions and, if any, its declared commit convention.
3. Rebuild state with no conversational context assumed: `git status`, the
   index, subject history (`git log --oneline`), and the openspec tree are the
   whole input. A fresh session must produce an equivalent plan to an in-flow
   one over the same tree.
4. Bucket dirty owned paths per the policy (per-lane slices, garden bucket, one
   shared-bucket question, out-of-scope count), draft subjects per the style
   resolution order, and draft changesets only per the facet rules. Present the
   full plan — path sets, messages, any changeset text — and stop.
5. Execute only what the human approved, exactly as approved, then report by
   pointer per the aftermath discipline.

## Hard rules carried by the policy

- No commit without explicit approval, in the current session, of the exact path
  set and message; presenting a plan stages nothing.
- Owned paths only; out-of-scope dirty files appear at most as a count.
- No lane mixing without explicit human direction; declining any suggestion is
  always conforming.
- Planning tissue never bumps a release-bearing package; stand down when the
  Changesets config couples the SDD stream to product releases.

Do not duplicate, reinterpret, or extend stewardship policy in this shim; policy
changes belong in the schema folder.
