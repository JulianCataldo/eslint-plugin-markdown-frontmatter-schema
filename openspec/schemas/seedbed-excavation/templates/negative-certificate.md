```epistemics
origin: recovered
reliability: <A–F per the excavation schema legend>
corroboration: <1–6 per the excavation schema legend>
threshold: <anchor | hypothesis>
provenance: <change + claim ids, e.g. openspec/changes/<change>/claims.md#C4>
verified-as-of: <YYYY-MM-DD — required: elimination results decay>
```

<!-- The epistemics block above is structural, not a suggestion. Its
verified-as-of field is the certificate's authoritative date. -->

# Negative certificate: <subject>

<!-- Records what an elimination procedure verified the subject does NOT
touch — never why the subject exists. Destination:
<planning-root>/docs/certificates/<kebab-subject>.md. A consumer treats this
certificate as hypothesis weight once verified-as-of predates relevant
system drift. -->

- Subject: <!-- code path, feature, integration -->
- Procedure: <!-- what was run or checked; re-runnable where possible -->

## Eliminated risks

<!-- One line per risk shown not to apply, each with provenance:
- <risk> — provenance: <E/C ids or command> -->

## Not eliminated

<!-- The honest remainder: risks the procedure could not rule out. -->
