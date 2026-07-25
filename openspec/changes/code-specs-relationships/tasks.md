## 1. ADR wiring

- [x] 1.1 Add excavation/apply post-processing hook lines to
      `openspec/config.yaml` `context:`, pointing at
      docs/adr/0001-code-spec-relationship-annotations.md (details in its
      companion doc) without restating them
- [x] 1.2 Hover-check one sample `@spec`/`@adr` annotation in VSCode; adjust
      the companion doc's draft grammar if the render breaks, then keep or
      revert the sample
- [x] 1.3 Reshape grammar to moniker form — `@spec` id + verbatim `+`
      sub-requirement lines, `// @spec` for inline and module levels — per
      in-session author follow-ups (round 3 + appendix); live annotations
      converted, hover re-verified

## 2. Acceptance gate (do not tick during apply)

- [ ] 2.1 Every required acceptance rule is resolved in acceptance.md — ticked
      by /openspec-sb-assess only
