# akYtec ALP Overview

Use this module when the request is clearly about akYtec programmable relays programmed in **akYtec ALP**.

## Current State

Baseline vendor module. Primary target: **ALP 3.1 with second-generation devices, especially PR205**.
It is not a mature module. Do not describe it as equivalent to the Mitsubishi path.

Display/visualization is covered for graphic-color-LCD devices in `akytec-visualization.md`; its open items are tied to bench protocols that have **not** been executed.
Out of scope: the monochrome text LCD editor, FBD library block details, macro internals, LoRa, akYtec Cloud, and any other akYtec product line.

## Read Order

1. `references/vendors/akytec/akytec-overview.md` (this file)
2. `references/vendors/akytec/akytec-rules.md`
3. Only when the request needs it:
   - `references/vendors/akytec/akytec-modbus-and-network.md`
   - `references/vendors/akytec/akytec-persistence.md`
   - `references/vendors/akytec/akytec-visualization.md` (display/HMI, resource indicators) and `references/vendors/akytec/bench/README.md`
   - `references/vendors/akytec/akytec-mu210-modbus-note.md` (MU210 output-mask writes from an ALP master)
   - `references/vendors/akytec/akytec-cheatsheet.md`
   - `references/vendors/akytec/akytec-pitfalls-and-pro-tips.md`
   - `references/vendors/akytec/official-doc-index.md`

## Evidence Labels (used in every akYtec file)

| Label | Meaning |
| --- | --- |
| `[DOC]` | Stated by the manufacturer manual. Always carries a section and printed-page citation. |
| `[INFERRED]` | Reasoned from `[DOC]` statements; the basis is given. Not stated by the manufacturer. |
| `[LOCAL OBSERVATION / NOT INDEPENDENTLY VERIFIED]` | Reported from project work. Neither manual-backed nor reproducible from this repository. |
| `[UNVERIFIED]` | Open question or contradictory source. Treat as unknown. |

Citation shorthand:

- **ALP UM** = akYtec ALP user manual v3.1, document `UM_akYtec_ALP_v3.1_3-EN-130795-2.4`. Pages are the printed page numbers in the manual footer (PDF page = printed page + 1).
- **PR205 UG** = PR205 user guide, document `UG_PR205_3-EN-148069-1.5`. Pages are printed page numbers (PDF page = printed page + 1).

The manuals are not redistributed here. Obtain them from akYtec (see `official-doc-index.md`).

## What ALP Is (Platform Model)

- `[DOC]` ALP programs akYtec devices with FBD (graphical) and ST. The main program is an FBD circuit; ST is used to write **user functions** and **user function blocks** that are added to the project library and placed in the circuit. (ALP UM §1 p.5; §4.12-4.13 pp.79-88; §12 p.242)
- `[DOC]` Execution is cyclic: latch inputs, run the program top to bottom, write outputs. The user cannot set the cycle time. (ALP UM §4.1 p.23; §8.2 p.214)
- `[DOC]` ALP distinguishes first-generation devices (PR100, PR102, PR200, SMI200) from second-generation devices (PR103, PR205, PR225). Several features exist only on the second generation. (ALP UM §1 p.5; §5.3.2 table pp.97-99)
- `[DOC]` ALP calls its text language "ST", but it is a restricted dialect with its own namespaces and declaration blocks. See `akytec-rules.md`.

## Terminology Map

| ALP term | Nearest generic term | Caution |
| --- | --- | --- |
| Circuit program / main program | Main program (FBD) | There is no ST `PROGRAM` in ALP. |
| ST function | Function | Returns one value; no FB instances inside. |
| ST function block | Function block | Own instance memory; no RETAIN. |
| Macro | User FB made of FBD blocks | Different from an ST function block. |
| Standard variable | Global tag | Created in the Variable table first. |
| Network variable | Modbus-mapped tag | Slave or master side, per interface. |
| Persistence (checkbox) | Retain | A variable-table property, not an ST keyword. |

## Routing Signals

Route here when any of these appear:

- akYtec, ALP, akYtec ALP
- PR205, PR225, PR103, PR100, PR102, PR200, SMI200, PRM extension modules
- `.owl` project files, `.fst` / `.fbst` exports
- `SYS.TON`, `SYS.BLINK`, `UDINT_TO_TIME` in an ST context

Do **not** treat PR205 code as CODESYS, IEC-generic, or Siemens code.
If the user mixes ecosystems (for example CODESYS `VAR_GLOBAL RETAIN` for a PR205), warn first and translate; see `akytec-pitfalls-and-pro-tips.md`.

## Generation Policy

- Never state that ALP ST code is compiler-verified unless the user supplies ALP compile evidence.
  Every example in this module is **UNCOMPILED**.
- Do not assume second-generation behavior applies to first-generation devices, or the reverse.
  Do not assume PR225 or PR103 behave like PR205 unless the manual states the shared behavior.
- Do not assume electrical feedback from a local output variable. See `akytec-rules.md` rule `ENV-09`.
- Hardware-affecting logic needs bench validation by the user. This module does not replace commissioning.

---

**Last updated:** 2026-10-21 (ALP manual v3.1, revision 2.4)
