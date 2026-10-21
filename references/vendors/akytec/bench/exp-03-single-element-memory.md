# EXP-03: Single-Element Visualization Memory Cost

**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**
Environment: SIM for step 1 (does the indicator exist offline?); **DEVICE (standalone PR205, bench only)** for steps 2 onward.
Rules under test: `VZ-01`, `VZ-03`, `VZ-04`, `VZ-05`, `VZ-07`, `VZ-08`, `VZ-09`.

## Objective

Measure how **Visualization RAM**, **User Visualization ROM** and **System Visualization ROM** change when exactly one element is added
or changed, and compare with the manual's published per-element costs (ALP UM §7.7 pp.176-181). Establish the absolute capacities.

## Prerequisites

- ALP 3.1 installed; PR205 on the bench with a USB cable; the bench device is not wired to anything and is not the plant controller.
- Two BMP files, 100 x 100 px and 100 x 100 px (different content), in the evidence folder.
- Read `bench/README.md` ground rules. Add the common observation header to the record.

## Construction Steps

1. **Offline presence (SIM).** Start ALP, do not connect a device. File > New project; choose target PR205; confirm. View > Status indicators: enable every visualization and memory indicator. Screenshot the status bar. Record which indicators are present offline.
2. **Connect (DEVICE).** Connect USB. Device > Port settings: Serial port, select the COM port, device address 16 (ALP UM §3.7/§4.6 p.61). Wait for the Device indicator. Screenshot the status bar; hover over every visualization indicator and screenshot each tooltip.
3. **Baseline.** Empty circuit, default "Form 1" only, no elements. Record the indicators. This is measurement M01.
4. **Upload baseline once.** File > Transfer application to device (or Device > ..., record which). Record the indicators again (M01b). Compare with M01.
5. **One change at a time.** Start from the baseline project each time (File > Save project as, one copy per measurement, or undo to baseline). For each measurement below, place the element from the Library Box into Form 1 at default size and default properties, change **only** what the row states, then record the indicators **before** uploading. Do not upload the variants.
6. Measurements:

| ID | Change from baseline | Manual anchor to compare (ALP UM) |
| --- | --- | --- |
| M02 | add one Text element | Text 464 B (p.176) |
| M03 | M02 + Visibility bound to a new BOOL variable | +20 B (p.176) |
| M04 | add one Indicator, no variable | default size, no frame 630 B (p.176) |
| M05 | M04 + bind a new BOOL variable | +20 B (p.176-177) |
| M06 | M05 with frame thickness 1 px | frame effect (p.177) |
| M07 | M05 with frame thickness 2 px | frame effect (p.177) |
| M08 | M05 with frame thickness 3 px | no further increase beyond 2 px (p.177) |
| M09 | M05 with width doubled | size dependence (p.177) |
| M10 | add one INT/REAL input/output, no variable | 776 B (p.177) |
| M11 | M10 + bind a new INT variable | +20 B (p.177) |
| M12 | M11 with Disable editing = No | +24 B (p.178) |
| M13 | add one Button (rectangle), no variable | 894 B (p.179) |
| M14 | M13 + bind a new BOOL variable | +20 B (p.179) |
| M15 | M14 + one screen-jump action | 10 B per action + 26 B (p.179) |
| M16 | baseline + one physical-button action: short press changes one Boolean variable | 80 + 20x1 + 10x1 + 10 = 120 B (p.176) |
| M17 | add one Image element with a 100 x 100 BMP | 372 B RAM and flash 100 x 100 x 2 = 20000 B (p.179) |
| M18 | M17 plus a second Image element using the **same** file | no extra flash (p.180) |
| M19 | M17 plus a second Image element using the **other** BMP | second 20000 B flash |
| M20 | baseline + custom Loading screen image | not covered by the table; record only |

## Anticipated Results (UNVERIFIED hypotheses from the manual)

- A1: the Visualization RAM change per row approximately equals the anchor (percentages will be coarse; use the absolute tooltip).
- A2: only Visualization RAM moves for non-image rows; User Visualization ROM moves for image rows (M17, M19) and by about 20000 B per distinct 100 x 100 image (VZ-05 inference).
- A3: M18 adds no User Visualization ROM.
- A4: System Visualization ROM does not change with any row here; if it does, record which.
- A5: the non-visualization indicators (Var, FB, EEPROM, Sys EEPROM) change only where a variable is added.
- A6: the visualization indicators may be absent offline (VZ-08).

## Actual Observations

Resource indicators, per-measurement record (one row per step above; M01 baseline, M01b after upload):

| Step | FB | Var | Stack | Sys EEPROM | EEPROM | ROM | Sys RAM | RAM | System Visualization ROM | User Visualization ROM | Visualization RAM (%) | Absolute tooltip values |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M01 | | | | | | | | | | | | |
| M01b | | | | | | | | | | | | |
| M02 | | | | | | | | | | | | |

(Copy the row for M03 to M20.)

| Question | Observation |
| --- | --- |
| Visualization indicators present offline? | |
| Absolute Visualization RAM capacity (tooltip) | |
| Absolute User Visualization ROM capacity | |
| Absolute System Visualization ROM capacity | |
| Indicator granularity (smallest visible change) | |
| Does an indicator change after upload versus before? | |
| ALP error or warning text, verbatim | |

## Evidence Checklist

- [ ] Status-bar screenshot for every measurement
- [ ] Tooltip screenshot for every visualization indicator at M01, M17, M19
- [ ] Project file per measurement saved unchanged
- [ ] Device information screenshot (firmware)

## Stop Conditions

Stop if ALP reports an overflow and disables upload; record the message and the step. Do not force-upload. Stop if the device shows a failure LED.

## Conclusion (fill only after the tables are complete)

