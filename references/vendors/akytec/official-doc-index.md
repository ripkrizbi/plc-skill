# akYtec Official Documentation Index

Evidence routing only. This file lists where the manufacturer documents live and which sections the akYtec module cites.
The manuals are **not** reproduced or bundled in this repository. Obtain them from akYtec and check the revision before relying on a page number.

## Sources

- Manufacturer: akYtec GmbH, Hannover, Germany. Website: https://www.akytec.de (downloads for software, firmware and user guides).
- Programming software: akYtec ALP (free download from the manufacturer).

## Documents Cited by This Module

| Short name | Document ID | Used for |
| --- | --- | --- |
| ALP UM | `UM_akYtec_ALP_v3.1_3-EN-130795-2.4` (ALP 3.1 user manual, revision 2.4, 280 pages) | ST language, variables, persistence, Modbus configuration, execution model |
| PR205 UG | `UG_PR205_3-EN-148069-1.5` (PR205 user guide, revision 1.5) | PR205 memory sizes, retain memory and battery |
| MU210 UG | `UG_MU210-402_3-EN-47647-2.2` (MU210-402 user guide, revision 2.2) | One cited example of a slave-side FC16 length limit |

Page numbers in this module are **printed** page numbers; a PDF viewer shows printed page + 1 for these documents.

## ALP UM Section Index (as cited)

| Topic | Sections | Printed pages |
| --- | --- | --- |
| Introduction, terms, device generations | 1, 1.2 | 5-6 |
| Status bar and resource indicators | 3.7 | 19-20 |
| Program execution | 4.1 | 23 |
| Variable block, Write at end of cycle | 4.3.2 | 29-34 |
| Delay line, execution sequence, conversion blocks | 4.3.4, 4.3.7, 4.3.9 | 34-38 |
| Simulation, ST code simulation | 4.5, 4.5.2 | 52-60 |
| Upload and online debugging | 4.7, 4.8 | 61-65 |
| Macro development | 4.11 | 70-79 |
| ST functions and function blocks (creation, export, import) | 4.12, 4.13 | 79-88 |
| Data exchange, interfaces, Modbus | 5.3, 5.3.2, 5.3.2.1-5.3.2.3 | 91-115 |
| Variables, persistence, binding | 6, 6.1, 6.4, 6.5 | 120-132 |
| FBD counters (state saving) | 7.2.4 | 152-155 |
| ST functions / ST function block library entries | 7.4, 7.5 | 163-170 |
| Cycle time | 8.2 | 214 |
| ST language | 12 (12.1-12.6) | 242-279 |

## PR205 UG Section Index (as cited)

| Topic | Section | Printed page |
| --- | --- | --- |
| Specification tables (memory, network variables, logging flash) | 3.1 Table 3.2 | 9 |
| Real-time clock and retain memory, battery | 7.12 | 69 |

## MU210 UG Section Index (as cited)

| Topic | Section | Printed page |
| --- | --- | --- |
| Modbus functions table | Appendix D, Table D.3 | 31 |
| Function-specific errors | Appendix D, Table D.5 | 32 |

## Not Yet Indexed (Planned Follow-up)

Display and visualization chapters (ALP UM §3.8, §4.4, §4.5.1, §7.6, §7.7), the FBD function and function-block library (§7.1-7.3), component manager and macro internals, LoRa and akYtec Cloud, PRM extension modules, and any hardware manual not listed above.

## Evidence Policy

- A rule without a section and printed page is not `[DOC]`.
- A statement from project work without manual support or compiler evidence is `[LOCAL OBSERVATION / NOT INDEPENDENTLY VERIFIED]`.
- A compiler or bench result supplied by the user is evidence for that user's device and ALP version only; state both when quoting it.
