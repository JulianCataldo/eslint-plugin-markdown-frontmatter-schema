```epistemics
origin: recovered
reliability: B
corroboration: 2
threshold: anchor
provenance: openspec/changes/excavate-drift-reconciliation/claims.md#C1–#C23 (normative content draws on the confirmed anchors C1–C2, C4–C9, C11–C22; hypotheses C3, C10, C23 are flagged in place and carry no normative weight)
verified-as-of: 2026-07-26
```

# ADR-0003: Drift dispositions — clean-slate harness, freeform no-schema, release and packaging intents

- Status: proposed
- Evidently decided circa: 2025-07 (init-phase pragmatisms) through
  2026-07-26 (steward adjudications, recorded testimony E36–E45 of dig
  `excavate-drift-reconciliation`)
- Deciders: Julian Cataldo (steward, sole author)

## Context

Campaign `02-campaign-drift` inventoried every place where documentation,
metadata, tests, or packaging say one thing and the executable evidence says
another; campaign `03-campaign-elimination` held two paired questions
(orphaned fixtures, the inert `fixable` flag). The dig probed every
divergence (registry tarballs, `--fix` no-op, cwd/nearest-config semantics,
VCS dating) and put ten testimony requests to the steward, all answered
2026-07-26. Two campaign premises fell to evidence before adjudication: the
"fixture changed after the test" story (the mismatch is congenital, C1) and
the "docs/ is gitignored" premise (un-ignored by the seedbed-setup commit
itself, C20).

## Decision

1. **Clean-slate test/fixture/harness redesign after the excavation; until
   then, moratorium.** The useful test set will be re-identified "with a
   fresh stance, regardless of past attempts" (C4); the current integration
   tests are "NOT well organized" and get a clean slate once the full
   excavation is done (C21). Until that redesign: no fixture deletions, no
   negative certificates, no rewriting red expectations as parity debts —
   the congenitally mismatched `inline-linked` Invalid pair (C1–C3) and both
   red subtests stay as fossil inputs.
2. **No-schema semantics are freeform.** "Absence of schema is an acceptable
   state, not eligible for error raising… No explicit schema = no
   constraints = no errors" (C5). The `Empty frontmatter` red's
   `schemaNotFound` expectation is an acknowledged misconception; the
   current `schemaMalformed` actual diverges equally. The planned
   error-surfacing repass supersedes both sides.
3. **Fix affordances, YAML-parse-error surfacing, and rule metadata are
   indispensable planned capabilities** that "must be clearly communicated
   to the user" (C8). `meta.fixable: 'code'` and the unreported
   `yamlSyntaxError` messageId are retained as capability cues (extending
   ADR 0002's C15 pattern); today `--fix` verifiably applies nothing (C6)
   and the README's day-one "Auto-fix via `--fix`" claim never matched any
   commit (C7).
4. **Release contract: manual now, changesets later.** Both npm publishes
   were made outside any automation (0.0.0 as a deliberate stub, C13, C18);
   that stays acceptable while the release story is "nascent". The forward
   intent is homogenization with the steward's other repos via a migration
   to changesets; the semantic-release surface and the byte-identical,
   fully-commented upstream workflow copy are a retired direction — never to
   be activated (C18, C19).
5. **Packaging: compiled tests must not ship.** `dist/tests` in the
   published 0.0.1 (and in any pack of today's tree) is a defect — the
   `files` exclusion `!dist/test` is a botched attempt at the confirmed
   intent "dist/tests must NOT be shipped" (C12, C14).
6. **Docs conventions.** Tracked `docs/` (SDD docs, ADRs, cartography) is
   the desired end state; the `/docs` gitignore pattern is retired. Future
   typedoc output goes to a dedicated subpath (e.g. `docs/typedoc`), never
   the default `docs/` (C20; origin story held at hypothesis, C23).
7. **Sanctioned ordinary work** (no further design gate; not executed by
   this dig): repoint `meta.docs.url` at this repository (C9); correct the
   README layout entry (C11) and align the `--fix` wording with decision 3;
   fix the `files` exclusion per decision 5; the `# /docs` breadcrumb line
   may be dropped with decision 6.
8. **Harness isolation must account for ESLint config-lookup semantics.**
   Verified: ESLint v9 resolves the config file from the CWD (the suite
   hard-fails away from repo root and silently composes with the repo's own
   `eslint.config.js`, which supplies the markdown language, C15);
   nearest-from-file lookup ships behind `v10_config_lookup_from_file` and
   stabilizes as the v10 default (C16). This resolves ADR 0002's C20
   verification flag: "ESLint handles nearest eslint config" holds only
   from v10 or behind the flag. The dogfood-as-harness arrangement was
   deliberate init-phase pragmatism, now expiring in favor of a properly
   isolated harness without "feedback loops" (C17).

## Consequences

- With campaigns 01 (closed), 02, and 03 fully answered, the cartography's
  frontier is clear — the "after the full excavation" precondition of
  decision 1 is met, and the clean-slate redesign is unblocked as the next
  design-phase move.
- The suite intentionally stays red at the two divergence subtests (34
  tests / 30 pass / 4 fail counting parents) until the repass/clean slate
  lands; those reds are fossils, not regressions — CI must not "fix" them
  ad hoc.
- 03-Q3 closes with retained-with-reason (moratorium), not a certificate:
  `fixtures/sample.md` is a live intentionally-erroring IDE demo;
  `.dev.invalid.schema.json` is an untracked byte-duplicate awaiting the
  redesign's broom (C22, verified-as-of 2026-07-26).
- 03-Q4 closes via decision 3: the flag is a cue, not dead weight.
- Decaying content carries `verified-as-of 2026-07-26`: the v9/v10 lookup
  semantics (version-bound 9.26.0/9.39.5), the would-ship-today packaging
  state, and the fixture-surface snapshot.
- Hypotheses stay explicit-load only: the fixture-repurpose origin (C3),
  the WIP-caveat rewording (C10, TR4 half unaddressed), the typedoc origin
  story (C23).
- ADR 0002 remains untouched; its C20 verification flag is resolved by this
  record (decision 8).

## Appendix — drift register (declared vs executed, all items)

| # | Surface | Declared / expected | Executed / actual | Born | Claims | Disposition |
|---|---------|---------------------|-------------------|------|--------|-------------|
| 02-Q1a | `inline-linked` Invalid subtest | 2 local-schema errors + enum suggestions (ranges `[58,64]`) | 3 remote-prettierrc errors, point-located, no suggestions | `555a2a7`, congenital | C1, C2, C3 | Fossil; fresh-stance redesign input (C4) |
| 02-Q1b | `empty-no` subtest | `schemaNotFound` | `schemaMalformed` at 1:1–3:4 | expectation = misconception | C5 | Freeform no-schema intent; repass supersedes both sides |
| 02-Q2 | README "Auto-fix via `--fix`" | CLI auto-fix works | `fix:true` applies nothing; suggestions-only | `7bf90fb`, drift-at-birth | C6, C7, C8 | Capability indispensable-planned; wording alignment = ordinary work |
| 02-Q3 | `meta.docs.url` | docs for this rule | points at dormant upstream repo | `07f5024` | C9, C10 | Repoint sanctioned; caveat rewording open (hypothesis) |
| 02-Q4 | README layout `src/fixtures/` | dir exists | never existed at any commit | `7bf90fb` | C11 | Writing error; fix-when-touched |
| 02-Q5 | `files: ["dist", "!dist/test"]` | tests excluded | 0.0.1 ships 16 `dist/tests/` paths; today would too | init era | C12, C13, C14 | Defect; must-not-ship; fix at ordinary work; 0.0.0 = stub |
| 02-Q6 | test harness | self-contained overrideConfig | cwd-bound; composes with repo `eslint.config.js` (supplies the language) | `555a2a7` | C15, C16, C17 | Deliberate init pragmatism; isolate in clean slate; v9 cwd / v10 nearest |
| 02-Q7 | release surface | semantic-release + workflow | never executed; wholesale-commented upstream copy; manual publishes | init era | C18, C19 | Manual now; changesets later; sem-rel direction retired |
| 02-Q8 | `.gitignore` `/docs` | campaign: "docs ignored/untracked" | commented out in `4de64c9`; docs tracked | premise stale-on-arrival | C20, C23 | End state confirmed; pattern retired; typedoc → dedicated path |
| 03-Q3 | `sample.md`, `.dev.invalid.schema.json` | orphan candidates | live IDE demo + untracked byte-duplicate | — | C21, C22 | Moratorium; no certificate; redesign disposes |
| 03-Q4 | `meta.fixable: 'code'` | fixes exist | inert (no `fix` ever attached) | `07f5024` | C6, C8 | Cue retained; repass decides final form |
