# SpecMark

SpecMark is an **opt-in semantic editing toolkit for human-authored prompts** —
HTML-flavored tags (`<s-META>`, `<s-NONGOAL>`, …) that give scoped, foldable,
greppable structure to intent that sequential natural language leaves ambiguous.
It rides VS Code's evergreen "HTML web data" capabilities and built-in HTML
language server: auto-completion expands to semantic tags, and the IDE
whizzbangs (folding, outline, semantic ranges, per-block moves) come for free.

## Boundary: human-to-LLM, opt-in, only

- SpecMark appears only in **human-authored input to an LLM**. LLM-produced
  proposals, specs, code, and agent-to-agent messages use their target medium's
  own conventions — SpecMark must never become a transitive, LLM-produced
  lingui.
- Usage is optional, case by case. Plain-prose seeds in `.html`, `.md`, or
  `.txt` are fully valid with no conversion pressure; SpecMark earns its keep on
  murky, ADR-grade seeds, not on every prompt. No coercive enforcement, ever —
  if it is painful, it gets avoided, which would defeat the purpose.

## Supported editing integration

The supported toolchain is **Prettier 3.x** and **VS Code's built-in HTML
language features**. Within it:

- Tags use the `s-` prefix with visually uppercase semantic names (`<s-META>`,
  `<s-NONGOAL>`). Distinctive and searchable by convention — not a promise of
  collision-free grep or of custom-element runtime semantics.
- Verbatim snippets go in `<script type="example|reference" lang="…">`
  containers. The `type` keeps the HTML language server (and its TypeScript
  capture) from treating contents as JavaScript; the `lang` lets the formatter
  handle the embedded language. A tested convention, not a universal editor
  guarantee.

## The files in this folder

- [sdd-jargon.html-data.json](sdd-jargon.html-data.json) — the **generated**
  editor data (never hand-edit it) that your project's `.vscode/settings.json`
  references via `html.customData`, enabling completion and hover documentation
  for the SpecMark tags.
- The editable glossary source of truth (`specmark/sdd-jargon.ts`) and its
  generator live in the Seedbed repository — this folder ships only the derived
  artifact. Refreshing the harness updates it.

## Governance: pre-1.0 exploratory

Until the Seedbed repository package reaches **1.0.0, the glossary SSOT
inventory is the proto-spec**: tags are added or refined directly in the Seedbed
SSOT when live prompt authoring motivates them, and uninventoried `s-` tags may
be trialed in your prompts before entering the inventory — no workflow gate
rejects or converts them. Governance is reassessed (and may be re-tightened) at
Seedbed's 1.0.0 checkpoint.
