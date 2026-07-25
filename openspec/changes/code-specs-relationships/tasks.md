## 1. ADR wiring

- [ ] 1.1 Add excavation/apply post-processing hook lines to
      `openspec/config.yaml` `context:`, pointing at
      docs/adr/0001-code-spec-relationship-annotations.md (details in its
      companion doc) without restating them
- [ ] 1.2 Hover-check one sample `@spec`/`@adr` annotation in VSCode; adjust
      the companion doc's draft grammar if the render breaks, then keep or
      revert the sample

## 2. Acceptance gate (do not tick during apply)

- [ ] 2.1 Every required acceptance rule is resolved in acceptance.md — ticked
      by /openspec-sb-assess only
