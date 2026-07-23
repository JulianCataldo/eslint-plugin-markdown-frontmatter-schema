# Negative Certificates

Dated elimination records live under `docs/certificates/` as
`<kebab-subject>.md`. A negative certificate records what an elimination
procedure verified its subject does **not** touch — never why the subject
exists. Certificates are recovered knowledge: they are produced by the
`seedbed-excavation` schema (`openspec/schemas/seedbed-excavation/`, template
`negative-certificate.md`) and outlive the excavation change that produced them.

## Shape

Each certificate opens with the structural `epistemics` block
(`origin: recovered`, both grade axes, threshold, provenance, and a
**mandatory** `verified-as-of` stamp), followed by the subject, the re-runnable
procedure where possible, the eliminated risks each with provenance, and the
honest remainder of risks the procedure could not rule out.

## Decay

Elimination results decay. A certificate whose `verified-as-of` predates
relevant system drift has degraded to hypothesis weight: consumers request
re-verification instead of trusting it silently, and it is no longer a
sufficient basis for deleting or breaking behavior. Re-verification appends a
fresh certificate or re-stamps via a new excavation — never a silent edit of the
old record's findings.

No index is maintained; `grep -l "origin: recovered" docs/certificates/` and
filenames are the discovery surface until volume justifies more.
