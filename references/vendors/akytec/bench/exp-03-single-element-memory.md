# EXP-03: Single-Element Visualization Memory Cost

**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**
Environment: SIM for step 1 (does the indicator exist offline?); **DEVICE (standalone PR205, bench only)** for steps 2 onward.
Rules under test: `VZ-01`, `VZ-03`, `VZ-04`, `VZ-05`, `VZ-07`, `VZ-08`, `VZ-09`.

## Objective

Measure how **Visualization RAM**, **User Visualization ROM** and **System Visualization ROM** change when exactly one element is added
or changed, and compare with the manual's published per-element costs (ALP UM §7.7 pp.176-181). Establish the absolute capacities.

### Available (free) versus used: define it before measuring

The manual words the indicators inconsistently. The status-bar overview says resource indicators "show the used resource in percent of the total available amount" (ALP UM §3.7 p.19), while the visualization indicators are described as "the available visualization ROM / RAM ... as a percentage" (pp.19-20). So whether a displayed number means **used** or **free** is `[UNVERIFIED]` (`VZ-36`). The element costs in the manual (ALP UM §7.7 pp.176-181) are **used** bytes. Do not compare a free value to a cost.

Definitions used in this protocol:

- `T` = total capacity (bytes), `F` = free (available) amount, `U` = used amount. `U = T - F`.
- For each visualization indicator record the **verbatim label and tooltip text**, the percentage, and every absolute figure shown. Mark each figure as `T`, `F` or `U` only after step 5a establishes the direction.
- Compute the cost of a change as **delta used**: `dU = U(after) - U(before)`. If only `F` is shown, `dU = F(before) - F(after)`. Compare `dU` (never a raw displayed value) with the manual anchor.
- If only a percentage is shown and no absolute figure, record the percentage and state that no byte delta could be computed.

## Prerequisites

- ALP 3.1 installed; PR205 on the bench with a USB cable; the bench device is not wired to anything and is not the plant controller.
- Two BMP files, 100 x 100 px and 100 x 100 px (different content), in the evidence folder.
- Read `bench/README.md` ground rules. Add the common observation header to the record.

## Construction Steps

1. **Offline presence (SIM).** Start ALP, do not connect a device. File > New project; choose target PR205; confirm. View > Status indicators: enable every visualization and memory indicator. Screenshot the status bar. Record which indicators are present offline.
2. **Connect (DEVICE).** Connect USB. Device > Port settings: Serial port, select the COM port, device address 16 (ALP UM §3.7/§4.6 p.61). Wait for the Device indicator. Screenshot the status bar; hover over every visualization indicator and screenshot each tooltip.
3. **Baseline.** Empty circuit, default "Form 1" only, no elements. Record the indicators. This is measurement M01.
4. **Upload baseline once.** File > Transfer application to device (or Device > ..., record which). Record the indicators again (M01b). Compare with M01.
5a. **Direction test (once, before any M row).** From the baseline add ten identical Text elements (about ten times the Text anchor if the anchors hold). Record the indicators. If the Visualization RAM percentage or free figure goes **down**, the indicator shows free capacity; if it goes **up**, it shows used capacity. Record which, then delete the ten elements and confirm the indicator returns to its baseline. Repeat the direction check for User Visualization ROM with one 100 x 100 BMP (M17) and note that System Visualization ROM may not move at all.
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

- A1: `dU` per row approximately equals the anchor (percentages will be coarse; use the absolute figures). A fixed baseline offset (for example the empty-screen 252 B or system overhead) is expected in `U` but not in `dU`.
- A2 (hypothesis only): only Visualization RAM moves for non-image rows. For image rows (M17, M19) User Visualization ROM may move; the figure 100 x 100 x 2 = 20000 B comes from the manual's formula and is **not** an expected pass/fail value, because the indicator may use other units, granularity or reserved space. Treat any image footprint as unknown until it is read from the device.
- A3 (hypothesis only): M18 adds no further User Visualization ROM, as the manual says for a reused image (ALP UM p.180); not yet observed.
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

Used/free reconciliation (one block per visualization indicator; repeat for Visualization RAM, User Visualization ROM, System Visualization ROM):

| Step | Verbatim tooltip text | Figure(s) shown | Marked as T / F / U | U (bytes) | dU vs previous baseline | Manual anchor | dU minus anchor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M01 | | | | | | | |
| 5a (ten Text elements) | | | | | | | |
| M02 | | | | | | | |

(Copy the last row for M03 to M20.)

| Question | Observation |
| --- | --- |
| Direction established in step 5a (indicator shows free or used) | |
| Visualization indicators present offline? | |
| Absolute Visualization RAM capacity T (tooltip) | |
| Absolute User Visualization ROM capacity T | |
| Absolute System Visualization ROM capacity T | |
| Indicator granularity (smallest visible change) | |
| Does an indicator change after upload versus before? | |
| ALP error or warning text, verbatim | |

## Evidence Checklist

- [ ] Status-bar screenshot for every measurement
- [ ] Tooltip screenshot for every visualization indicator at M01, step 5a, M17, M19
- [ ] Project file per measurement saved unchanged
- [ ] Device information screenshot (firmware)

## Stop Conditions

Stop if ALP reports an overflow and disables upload; record the message and the step. Do not force-upload. Stop if the device shows a failure LED.

## Conclusion (fill only after the tables are complete)

