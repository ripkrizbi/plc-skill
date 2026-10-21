# Eval matrix

Use this file as the single-table index across all eval case files.

| Case | Group | Should trigger | Task type | Primary focus | Source |
| --- | --- | --- | --- | --- | --- |
| G1 | generation | yes | generation | structure before code; interlock-aware motor start-stop | `evals/generation-cases.md` |
| G2 | generation | yes | generation | maintainable state machine with transitions and fault path | `evals/generation-cases.md` |
| G3 | generation | clarify first or continue with explicit assumptions | ambiguous generation | assumptions first; template or skeleton when incomplete | `evals/generation-cases.md` |
| E1 | explanation | yes | explanation | visible behavior first; facts vs assumptions | `evals/explanation-cases.md` |
| E2 | explanation | yes | explanation with troubleshooting direction | inspect enable, reset, and completion path | `evals/explanation-cases.md` |
| R1 | review | yes | review | output ownership conflict diagnosis before rewrite | `evals/review-cases.md` |
| R2 | review | yes | review | structure, maintainability, alarm and reset handling | `evals/review-cases.md` |
| D1 | debugging | yes | debugging | alarm re-latch path; reset permissive; scan-cycle possibility | `evals/debugging-cases.md` |
| D2 | debugging | yes | debugging | overwrite suspicion; writer-list or ownership trace | `evals/debugging-cases.md` |
| D3 | debugging | yes | debugging | step transition isolation; timer, interlock, and state ownership | `evals/debugging-cases.md` |
| I1 | incomplete input | clarify first or continue with explicit assumptions | incomplete input | do not silently lock platform | `evals/incomplete-input-cases.md` |
| I2 | incomplete input | yes, with safety downgrade | safety-sensitive incomplete input | no final safety approval without field confirmation | `evals/incomplete-input-cases.md` |
| I3 | incomplete input | yes | review or refactor with missing structure detail | propose structure without faking the real project tree | `evals/incomplete-input-cases.md` |
| N1 | non-trigger | no | non-trigger | do not force FX3U-specific workflow into generic introduction | `evals/non-trigger-cases.md` |
| N2 | non-trigger | no | non-trigger | do not trigger PLC programming workflow for hardware selection | `evals/non-trigger-cases.md` |
| N3 | non-trigger | yes | vendor-specific Siemens routing | do not default to Mitsubishi-focused guidance | `evals/non-trigger-cases.md` |
| N4 | non-trigger | no direct normal trigger; safety caution only | safety boundary | no absolute safety conclusion from incomplete information | `evals/non-trigger-cases.md` |
| RT1 | routing | yes | generation | classify as in-scope FX3U + GX Works2 + ST generation | `evals/routing-cases.md` |
| RT2 | routing | yes | review | route to review workflow with ownership priority | `evals/routing-cases.md` |
| RT3 | routing | clarify first | ambiguous | ask for PLC family, software, language, and goal | `evals/routing-cases.md` |
| RT4 | routing | no | non-trigger | do not over-expand the skill for generic PLC intro | `evals/routing-cases.md` |
| O1 | output behavior | generation output format | output behavior | requirement understanding; assumptions; structured design before code | `evals/output-behavior-cases.md` |
| O2 | output behavior | explanation output format | output behavior | code explanation with scan-cycle interpretation | `evals/output-behavior-cases.md` |
| O3 | output behavior | review output format | output behavior | issue list; impact; refactoring direction; validation checklist | `evals/output-behavior-cases.md` |
| O4 | output behavior | debugging output format | output behavior | symptom restatement; facts vs hypotheses; practical debug plan | `evals/output-behavior-cases.md` |
| VG1 | vendor generation | yes | vendor generation | Mitsubishi FX3U syntax, X/Y/M devices | `evals/vendor-generation-cases.md` |
| VG2 | vendor generation | yes | vendor generation | Siemens S7-1500 DB and local tag `#` syntax | `evals/vendor-generation-cases.md` |
| VG3 | vendor generation | yes | vendor generation | Rockwell tag-based addressing and AOI params | `evals/vendor-generation-cases.md` |
| VG4 | vendor generation | yes | vendor generation | Omron Sysmac camelCase and IEC TON | `evals/vendor-generation-cases.md` |
| VG5 | vendor migration | yes | vendor generation | Siemens to Rockwell syntax translation | `evals/vendor-generation-cases.md` |
| VD1 | vendor debugging | yes | debugging | Mitsubishi scan time / WDT issue | `evals/vendor-debugging-cases.md` |
| VD2 | vendor debugging | yes | debugging | Siemens optimized block pointer access error | `evals/vendor-debugging-cases.md` |
| VD3 | vendor debugging | yes | debugging | Rockwell tag scope shadowing conflict | `evals/vendor-debugging-cases.md` |
| LD1 | ladder generation | yes | generation | Motor start/stop with seal-in and ASCII art | `evals/ladder-diagram-cases.md` |
| LD2 | ladder review | yes | review | Multiple-coil syndrome / double destructive write | `evals/ladder-diagram-cases.md` |
| LD3 | ladder debugging | yes | debugging | Rung evaluation order causing scan cycle delay | `evals/ladder-diagram-cases.md` |
| LD4 | ladder edge case | yes | explanation/generation | Complex string parsing in LD (suggest ST instead) | `evals/ladder-diagram-cases.md` |
| SFC1 | sfc generation | yes | generation | 3-step sequence with N, S, R qualifiers | `evals/sfc-cases.md` |
| SFC2 | sfc review | yes | review | Missing transition condition causing chart hang | `evals/sfc-cases.md` |
| SFC3 | sfc explanation | yes | explanation | Difference between N and S action qualifiers | `evals/sfc-cases.md` |
| AK1 | akYtec routing | yes | vendor generation | PR205 ALP ST routes to akYtec module; SYS.TON; UNCOMPILED label | `evals/akytec-cases.md` |
| AK2 | akYtec unsupported constructs | yes | vendor generation | reject VAR_GLOBAL RETAIN, INT, STRING; circuit Persistence | `evals/akytec-cases.md` |
| AK3 | akYtec unsupported constructs | yes | vendor generation | FB instance inside FUNCTION forbidden; nesting limit scope | `evals/akytec-cases.md` |
| AK4 | akYtec persistence | yes | vendor generation | no RETAIN in ST FB; endurance undocumented | `evals/akytec-cases.md` |
| AK5 | akYtec modbus | yes | vendor question | 16-register cap is master-side; FC16 split; slave limit from slave manual | `evals/akytec-cases.md` |
| AK6 | akYtec contamination | yes | vendor migration | CODESYS to ALP: SYS. prefixes, no VAR_GLOBAL RETAIN/INT/R_TRIG | `evals/akytec-cases.md` |
| AK7 | akYtec contamination | yes | vendor migration | Siemens addressing not valid in ALP ST | `evals/akytec-cases.md` |
| AK8 | akYtec evidence | yes | safety downgrade | no compiler-verified claim; upload caution | `evals/akytec-cases.md` |
| AK9 | akYtec generations | yes | vendor question | 48 vs 16 group size by generation | `evals/akytec-cases.md` |
| AK10 | akYtec evidence | yes | vendor question | local observation labelling for bare LN | `evals/akytec-cases.md` |
| AK11 | akYtec output feedback | yes | safety downgrade | output variable is command image, not feedback | `evals/akytec-cases.md` |
| AK12 | akYtec modbus | yes | vendor question | MU210 UINT32 output mask is two registers; FC16 quantity 2; bench gates UNVERIFIED | `evals/akytec-cases.md` |
