# EXP-02: Persistence, Sys EEPROM Versus EEPROM, Power Cycle and Re-upload

**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**
Environment: indicator steps in **SIM-with-connected-device or DEVICE**; power-cycle and re-upload steps **DEVICE (standalone PR205, bench only)**.
Rules under test: `PS-01`, `PS-02`, `PS-04`, `PS-08`, `PS-13`, `PS-14`, `VZ-30`.

## Objective

Observe where persistent variables are accounted (Sys EEPROM versus EEPROM), whether values survive a supply interruption and a
re-upload, and what happens to a persisted value when its default changes. This is **not** an endurance test.

## Safety and Wear Limits (mandatory)

- Persistent write endurance is undocumented (`akytec-persistence.md` open items). **Do not** drive a persistent variable from a block that writes every cycle on the uploaded device.
- Variant V-B below contains such a block and is **for indicator reading only; never upload it**.
- Limits: at most 10 operator edits per persistent variable, at most 3 supply interruptions, at most 3 uploads of variant V-A.
- Check the battery state in ALP before starting (PR205 UG §7.12 p.69: retain memory is battery-backed). Record it. Do not run with a discharged battery.

## Prerequisites

- Standalone PR205 on the bench, USB connected, no field wiring, not the plant controller.
- Read `bench/README.md`. Common header started.

## Construction Steps

1. New project, target PR205. Variable table > Standard, Integer type:
   - `pv_ui`: default 11, Persistence **on**
   - `nv_ui`: default 33, Persistence **off**
   - `pv_circ`: default 22, Persistence **on** (used only in variant V-B)
2. Form 1: two INT/REAL input/output elements, one bound to `pv_ui`, one to `nv_ui`. Disable editing = No for both.
3. **Variant V-A (uploadable).** Circuit empty (no output block for any of these variables). Save as `exp02_va`.
4. **Variant V-B (indicator reading only).** Copy V-A as `exp02_vb`. In the circuit place a constant INT 1 connected to an output variable block for `pv_circ`. Do **not** upload V-B.
5. Indicators. Record the status bar for: the empty project; V-A; V-B. Hover Sys EEPROM and EEPROM indicators for absolute amounts.
6. Upload V-A. Record device state. On the PR205 front panel use the buttons (PR205 UG Table 7.1 p.60) to edit `pv_ui` to 77 and `nv_ui` to 88 (apply and save the edit).
7. Interrupt the supply (disconnect the 24 V terminal block supply, wait 10 s, reconnect; ALP UM §4.6 p.60 says the device must be powered off before connecting to a PC, so also disconnect USB for this step). Read both values on the display, then via online debugging.
8. Re-upload V-A unchanged. Read both values.
9. In `exp02_va` change the default of `pv_ui` to 12 and `nv_ui` to 34. Upload. Read both values.
10. Record battery state again.

## Anticipated Results (UNVERIFIED hypotheses)

- A1: V-A adds to Sys EEPROM (visualization-bound persistent variable, `PS-02`); V-B adds `pv_circ` to EEPROM (unbound persistent variable with an output block, `PS-02` and ALP UM §6 p.120).
- A2: after step 7: `pv_ui` = 77 (persistent), `nv_ui` = its default 33.
- A3: step 8 is the open question (does a re-upload keep or reset persisted values?). No anticipation is made.
- A4: step 9 is the open question (does a changed default replace a persisted value?). No anticipation is made.

## Actual Observations

| Item | Observation |
| --- | --- |
| Battery state before / after | |
| Sys EEPROM change for V-A | |
| EEPROM change for V-A | |
| Sys EEPROM change for V-B | |
| EEPROM change for V-B | |
| pv_ui after step 6 | |
| nv_ui after step 6 | |
| pv_ui / nv_ui after step 7 | |
| pv_ui / nv_ui after step 8 | |
| pv_ui / nv_ui after step 9 | |
| Number of operator edits, supply interruptions, uploads used | |
| Menu path used for transfer | |
| ALP error or warning text, verbatim | |

Resource indicators:

| Step | FB | Var | Stack | Sys EEPROM | EEPROM | ROM | Sys RAM | RAM | System Visualization ROM | User Visualization ROM | Visualization RAM (%) | Absolute tooltip values |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |

## Evidence Checklist

- [ ] Status bar for empty, V-A and V-B
- [ ] Device display photos of each read
- [ ] Online-debugging screenshots
- [ ] Battery-state screenshot before and after
- [ ] Counter of edits, power cycles and uploads

## Stop Conditions

Stop on a battery warning, a retain-memory error, or any device failure indication (PR205 UG error tables). Do not continue to wear.

## Conclusion (fill only after the tables are complete)

