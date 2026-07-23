# Agent guidance for the `seedbed-excavation` schema

Scoped rules for conforming agents producing recovered knowledge. The
consumer-side rules (how any agent weighs recovered artifacts it meets in the
pool) live in `openspec/schemas/seedbed/AGENTS.md`; this file governs the
excavation flow itself.

## Trust anchor

Excavation reverses the greenfield derivation arrow: observed behavior is ground
truth and intent is the weakest, inferred artifact. Never present an inference
as recovered fact; the flow's job is to label exactly how much weight each
statement can bear.

## The `epistemics` marker

Every recovered output opens with a fenced `epistemics` block:

```epistemics
origin: recovered
reliability: <A–F>
corroboration: <1–6>
threshold: <anchor | hypothesis>
provenance: <pointers to the claims/evidence backing this output>
verified-as-of: <YYYY-MM-DD, only when the content decays>
```

- `origin: recovered` is the greppable signal; absence of a marker means
  authored.
- The two axes are graded independently and MUST NOT be collapsed into a single
  confidence value: "reliable source, uncorroborated claim" and "dubious source,
  corroborated claim" are different situations.
- An output marker aggregates conservatively on each axis: reliability and
  corroboration MUST each be no stronger than the weakest value among confirmed
  claims used for normative content or rationale. If any such claim is
  hypothesis-threshold, the output is hypothesis-threshold.
- `verified-as-of` is mandatory for decaying content — negative certificates and
  behavior snapshots — and omitted otherwise.
- An output missing or truncating this block MUST NOT enter the pool.

## Grade legend (Admiralty two-axis code)

Source reliability (of the evidence backing the claim):

- **A** — re-runnable observed behavior: tests, traces, or procedures anyone can
  reproduce
- **B** — reliable: first-hand witness testimony, period documents, VCS history
- **C** — fairly reliable: second-hand accounts, adjacent documentation
- **D** — not usually reliable: stale docs, hearsay, folklore
- **E** — unreliable: sources known to be wrong before
- **F** — reliability cannot be judged

Degree of corroboration (of the claim itself):

- **1** — confirmed: directly re-run or supported by at least two independent
  sources
- **2** — probably true: supported by one independent source
- **3** — possibly true: consistent with evidence, uncorroborated
- **4** — doubtful: conflicting evidence exists
- **5** — improbable: contradicted by evidence
- **6** — cannot be judged: no basis to assess

## Thresholds — where the letters get behavioral weight

- **anchor** — A–B reliability AND 1–2 corroboration. Anchor-grade knowledge
  participates in default context like authored artifacts and may serve as a
  basis for destructive decisions.
- **hypothesis** — every other combination. Grep-visible and discoverable, but
  its payload stays out of default context (explicit-load only), and it is never
  a sufficient basis for deleting or breaking behavior.

Caps: a claim about intent derived by inference alone is capped at hypothesis
until corroborated by testimony or period documents. Evidence availability caps
grades — full archaeology with poor evidence honestly yields low grades, and its
only anchor-grade output may be a negative certificate.

## Human gates — instruction-enforced, never self-confirmed

Three gate points, all recorded (scope in survey.md, the other two in
corroboration.md):

1. **Survey scope** — evidence collection starts only after a human confirms the
   dig's scope.
2. **Grade assignment** — agent-assigned grades are proposals; they bind only
   once a human confirms them.
3. **Output promotion** — each output is filed to its destination only after an
   explicit human confirmation.

The drafting agent MUST NOT confirm any gate itself. Grading your own inference
is theater; the gate exists to prevent it (collector≠evaluator separation is
parked follow-up work, not a license).

## Promotion safety

Never silently overwrite or merge into an existing pool destination. If the
destination exists, stop for a human choice and keep the recovered draft
separate until a provenance-preserving destination is selected. In particular,
never place recovered content under a file-level marker that would relabel
authored content as recovered.

## Testimony

Testimony is a first-class evidence class: verbatim statements with witness
identity and date in the ledger. When intent is unrecoverable from artifacts,
emit a named testimony request — who to ask, what to ask, what it would
corroborate — instead of inventing a plausible story. When evidence and
testimony are exhausted, record the unknown honestly; the output may be at most
a negative certificate.

## Evidence stays verbatim

The ledger extends the verbatim-seed value: entries are never professionalized,
paraphrased, or polished, and the ledger is append-only. Interpretation is
separate, attributed, revisable — that is what claims are for.

## Characterization tests — a leaf tool, per use case

Characterization testing (Feathers 2004; "TDD after the fact") mints
reliability-A evidence: write a test with an unknown expectation, run it, lock
in the ACTUAL output verbatim. Bugs are recorded as current behavior (the
desired fix parked separately, e.g. a skipped test); fixing while characterizing
is the test-form of professionalizing evidence — never do it. The locked test is
re-runnable observed behavior, self-corroborating in the target repo's CI; the
ledger entry points at it.

Reach for it when a claim must anchor (it feeds a spec requirement or a
destructive decision) and the subject is a self-standing, non-leaking unit — an
intricate algorithm, a pure transformation — while sideways evidence (existing
tests, testimony, period documents) is profoundly lacking. Do not characterize
wholesale: a thorough existing suite already carries most claims (it is authored
intent frozen in code), and environment-heavy behavior (entangled SSO,
cross-service UI) is better evidenced by observed runs or parallel A/B
baselines, graded by their reproducibility. Propose the candidates yourself —
the human should not have to triage this heuristic; the other evidence classes
stay valid, and an explicit user request overrides these defaults. The test's
afterlife belongs to the target repo's suite; the durable pool artifact is the
output that cites it.

## Useful claim lenses

When interpreting evidence about past approaches, two lenses earn a claim each:
failed-attempt analysis (what was tried, why abandoned, whether that context
still holds) and revival detection (is a "new" proposal a rebranded prior
attempt, and what killed it last time). Both cap at hypothesis until
corroborated like any intent claim.

## Shadow ADRs

A shadow (backfilled) ADR documents a decision evidently made in the past. It
enters the ordinary ADR lifecycle — numbering, proposed → accepted review,
immutability, supersession — unchanged, and additionally MUST carry the
`epistemics` marker, graded rationale (inferred rationale capped at hypothesis
unless corroborated), evidence pointers, and the approximate decision date
("Evidently decided circa …"). It never presents inferred rationale as the
original decider's confirmed intent, and it is a new conforming record — never a
normalization of a legacy file.

## Negative certificates

Dated elimination records at `<planning-root>/docs/certificates/`: what a
procedure verified the subject does NOT touch, with provenance per eliminated
risk and a mandatory `verified-as-of` stamp — and no claim about why the subject
exists. A certificate whose stamp predates relevant drift degrades to hypothesis
weight; consumers request re-verification rather than trusting it silently.

## One flow, two modes

Witnessed recovery (author or witnesses available) is the fast path — testimony
corroborates claims quickly. Full archaeology is the same artifacts with poorer
evidence classes and lower grade ceilings. Dig just-in-time per change and file
finds durably; big-bang corpus ingestion is the anti-pattern this schema
rejects.
