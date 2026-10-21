# akYtec ST lint fixtures

Inputs for `scripts/verify-akytec-module.js`. They are static text samples, not compiler-verified ALP projects.

- `positive/`: snippets that must lint clean. A clean lint is not a compile result.
- `negative/`: snippets that must be flagged. The first line is `(* EXPECT: <rule codes> *)`; every listed code must appear.

Negative samples are deliberately wrong for ALP (unsupported ST constructs or syntax from other PLC ecosystems). Do not reuse them as examples.
