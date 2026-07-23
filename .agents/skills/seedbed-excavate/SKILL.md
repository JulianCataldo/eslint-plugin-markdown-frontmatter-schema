---
name: seedbed-excavate
description:
  Runs the seedbed-excavation workflow when un-spec'ed legacy behavior must join
  the knowledge pool, or when a "safe to delete" question needs evidence.
---

# Excavate brownfield knowledge

Use this skill as a thin entrypoint. All excavation policy lives in the
`seedbed-excavation` schema folder — `openspec/schemas/seedbed-excavation/`
(schema.yaml artifact and apply instructions, templates, and AGENTS.md). Load
and follow it instead of creating a second policy here.

## Resolve and load the change

1. If the user names a registered OpenSpec store, or the work lives in one, run
   `openspec store list --json` and retain `--store <id>` on every command that
   supports it.
2. Use an explicitly named change. Otherwise infer it from the conversation,
   auto-select it only when exactly one active `seedbed-excavation` change
   exists, or run `openspec list --json` and ask the user to choose. For a new
   dig, scaffold with `openspec new change <name> --schema seedbed-excavation`.
   A laconic invocation (a fuzzy feature slug) is a valid entry: it licenses
   bounded reconnaissance and a drafted survey for the human to correct — never
   a skipped scope gate.
3. Announce `Using change: <name>` and explain how to override it.
4. Run `openspec status --change "<name>" --json` and
   `openspec instructions <artifact|apply> --change "<name>" --json`, retaining
   the store flag when applicable. Read
   `openspec/schemas/seedbed-excavation/AGENTS.md` and the instructions the CLI
   returns; they are the policy source of truth.

Continue only by following the current schema-provided artifact or apply
instruction. Do not duplicate, reinterpret, or add excavation policy in this
shim; policy changes belong in the schema folder.
