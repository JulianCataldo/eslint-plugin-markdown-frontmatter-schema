# Store campaigns — canonical policy

A campaign is an ordinary change, hosted in any store, that propagates
proposal work into other registered stores (ADR-0033). This file is the
canonical policy for campaign formats and mechanics; the `openspec-sb-multi-propose`
skill is a thin entrypoint that defers to it. Hosting a campaign confers no
authority over child stores, and every store hosts with identical mechanics.

## Host creation is stock-schema

`openspec-sb-multi-propose` creates a fresh host change through the invoking store's
stock proposal schema — the host is distinguished from an ordinary change only
by `openspec/changes/<campaign>/child-changes.yaml`. An existing directory at
the host path blocks creation unless it is the generation-matching reservation
of an interrupted invocation (see Resume).

## Manifest schema (version 1)

`child-changes.yaml`:

```yaml
schema_version: 1
generation: 3f6ec3f2-6bfb-4bd0-9d1f-6d0f6f6a2b1e
children:
  - store: app-web
    change: adopt-frontmatter-schema
    generation: 9a1a3d3e-0c8f-4b3f-8d0a-2f8f4f0f5b77
    role: Adopt the shared frontmatter schema in app-web
    depends:
      - store: lib-schema
        change: publish-frontmatter-schema
        generation: c0a80e52-7c4f-4f4e-9b8e-1d2c3b4a5968
```

Validation rules — reject the whole campaign before any write when violated:

- `schema_version` MUST be the integer `1`.
- `generation` values (campaign and every child) MUST be canonical UUID
  strings (lowercase 8-4-4-4-12 hex). Consumers validate the syntax but
  compare generations opaquely — never order, parse, or derive meaning from
  them. The campaign generation and all child generations MUST be pairwise
  distinct.
- `children` MUST be a nonempty list. Each child MUST carry `store`, `change`,
  `generation`, and a nonempty single-line `role`. Child `{store, change}`
  identities MUST be unique and target stores MUST be unique.
- Optional `depends` entries each repeat another child's complete
  `{store, change, generation}` identity. Dependencies MUST name manifest
  entries; the graph MUST be self-edge-free and acyclic. Lane execution order
  MUST NOT be needed for cross-lane references — siblings cite pre-allocated
  identities.
- The manifest MUST NOT contain lifecycle status keys (`status`, `state`,
  `archived`, and the like) or physical/relative path keys. Lifecycle is
  always derived by resolution, never recorded.

## Lane marker schema (version 1)

Each child change directory carries `campaign-lane.yaml`, written with the
child scaffold at reservation time:

```yaml
schema_version: 1
campaign:
  store: shared-decisions
  kind: change
  id: frontmatter-schema-rollout
  generation: 3f6ec3f2-6bfb-4bd0-9d1f-6d0f6f6a2b1e
lane:
  store: app-web
  change: adopt-frontmatter-schema
  generation: 9a1a3d3e-0c8f-4b3f-8d0a-2f8f4f0f5b77
```

The marker back-points to the campaign by typed identity (hosting store,
`kind: change`, campaign id, campaign generation) and carries the lane's own
identity so active-or-archive lookup can disambiguate reused slugs. Writing
the back-pointer MUST NOT add or edit a reverse `references:` edge in the
child store. No final reservation path may be observable without its
generation metadata: scaffold plus marker publish atomically, marker included.

## Creation runs in three phases

**1. Read-only preflight — all targets, zero writes.** Allocate the host and
every child identity (fresh UUID generations), then verify, without writing to
any store:

- every target store is reachable through the host's committed reference
  graph (transitively, visited-set bounce) and resolves through the local
  registry;
- the manifest passes every validation rule above;
- no target has an active change colliding with its child id other than a
  matching reservation, and no active or dated-archive candidate already
  carries a colliding generation for that id — an archived matching slug with
  a different generation stays addressable and does not block slug reuse;
- every output path known at decomposition (host directory, each child
  directory) is free or a verified matching reservation.

Any failure stops the whole campaign with a report naming every blocking lane
and graph error; every store remains byte-identical.

**2. Durable reservation — host first, then every lane.** Atomically publish
the host scaffold with its complete `child-changes.yaml`; then atomically
publish each child scaffold with its generation-bound `campaign-lane.yaml`.
The reservation phase is complete only when every declared marker exists and
matches its pre-allocated identity.

**3. Stock artifact generation.** Only after reservation completes anywhere
may host or lane proposal artifacts be generated. The host and each lane run
their store's stock proposal flow with canonical `--store <id>` selection and
that store's schema artifact order, augmented only by the campaign brief,
sibling identities, marker, and back-pointer. Later stock steps preflight any
newly determined external output (for example a proposed durable ADR path)
before writing it.

Flows that do not share an enclosing Git worktree may run in parallel; all
host/lane flows sharing one worktree MUST serialize so proposal-time numbering
(e.g. ADR sequence) and state reports stay deterministic.

## Write bounds (foreign-store etiquette)

A host or lane flow may create any fresh planning output its store's proposal
schema declares — including the change directory and new proposed durable
ADRs. It MUST NOT:

- overwrite or edit any path that predates its reservation or belongs to
  another generation;
- edit implementation code, commit, or amend Git state;
- add or edit `references:` or any other configuration in a foreign store.

Outputs install atomically per file (write-then-rename within the target
filesystem); cross-filesystem or cross-store transactionality is not promised.

## Git reporting

Before writing into a store: resolve its registered root; when an enclosing
Git worktree exists, discover it with Git and record branch plus dirty
pre-state; otherwise record `not-git-backed`. Reports name registered roots,
enclosing Git or non-Git state, and the exact paths each flow created.

## Archive-aware lookup

Resolving a generation-bearing campaign reference (host→child, child→host, or
sibling): inspect the active slug, when present, and every exact dated archive
candidate (`openspec/changes/archive/<date>-<id>`) in the target store as one
candidate set. Accept only a single candidate whose manifest or marker matches
the requested id and generation. Derive lifecycle from the result — active,
archived, unresolved (zero matches, e.g. unregistered host or missing
generation), or ambiguous (several matches, e.g. a duplicated generation
across active and archive). Zero or multiple matches degrade explicitly;
lookup never resolves by guess, never persists a dated archive path, and
never writes derived state into the manifest.

## Failure and generation-bound resume

If reservation or artifact generation fails after writes begin: stop dependent
work, preserve the valid host and every completed or reserved lane, report
every created path plus every failed, blocked, and unstarted host/lane flow,
and never roll back foreign trees.

A rerun resumes only reservations whose host/lane generations match the
manifest: it creates missing declared outputs, leaves already valid outputs
untouched, and treats an incomplete or invalid existing output — or any
unrelated existing content — as a reported conflict, never a silent repair.
No lifecycle status is ever added to the manifest to track this; state is
derived by resolution alone.
