# Parked ideas — the carton box

Deferred work has two intentionally different shapes in this repository:

1. **Parked ideas** (this directory) — valuable but blurry or premature
   material. They are **not** OpenSpec changes: `openspec list`, status,
   archive, and bulk validation never see them, so they cannot pollute the
   change inventory with invalid stubs.
2. **Parked changes** — real, fully planned OpenSpec changes whose apply work is
   paused by a `PARKED.md` marker (documented below).

Neither kind is ever auto-deleted. A human activates, resumes, rejects, or
deletes deferred work explicitly; automated cleanup must leave it untouched.

## Parked ideas

One idea per file at `openspec/ideas/<id>.md`, where `<id>` is the kebab-case
change id it would activate into. Keep records concise — four short sections:

```markdown
# <Title>

- id: <kebab-id> (matches this filename and the future change id)
- recorded: YYYY-MM-DD

## Origin

- Source: `<path the idea was extracted from>`
- Immutable revision: git blob `<sha1>` (content SHA-256 `<hash>` when the
  source is a promoted seed)
- Locator: <semantic section, tag id, MARK comment, or heading — never bare line
  numbers, which formatting invalidates>

## Gist

<A few sentences preserving the idea faithfully, hesitations included.>

## Reason postponed

<Why this is not being done now.>

## Wake-up condition

<The observable trigger that should make someone activate it.>
```

When the origin is a retired seed prompt, the pointer itself is routing
metadata; actually opening the payload during activation is an explicit
provenance request by the activating human, which the retired-seed context rules
permit.

### Activation (deterministic)

1. `openspec new change <id>` — the CLI creates a normal, schema-bearing change;
   activation never builds on an existing stub directory.
2. `git mv openspec/ideas/<id>.md openspec/changes/<id>/deferred-origin.md` —
   the idea record becomes the change's provenance file.
3. Generate the proposal and subsequent artifacts normally, using
   `deferred-origin.md` as source material.

## Parked changes (`PARKED.md`)

A **parked change** is an ordinary change under `openspec/changes/<id>/` paused
by adding a `PARKED.md` marker to its directory.

Preconditions — park only when **all** hold:

- every apply-required planning artifact is complete;
- `openspec validate <id> --strict` passes;
- no delta has been synchronized into main specs (`openspec/specs/`). If a sync
  already happened, either finish the work or explicitly revert the synchronized
  deltas first.

Marker contents — all four fields required:

```markdown
# PARKED

- Reason: <why apply is paused>
- Wake-up condition: <what un-pauses it>
- Owner: <who decides>
- Parked: YYYY-MM-DD
```

Inventory — `openspec list` still shows parked changes as ordinary changes and
does **not** display parked state; the explicit inventory is:

```sh
find openspec/changes -mindepth 2 -maxdepth 2 -name PARKED.md
```

Resumption:

1. Delete `PARKED.md`.
2. Rerun `openspec validate <id> --strict`; resolve any dependency or schema
   drift it reveals first.
3. Only then continue apply.
