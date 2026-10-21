# EXP-04: Multiple Screens, Jumps, Buttons and Boot Screen

**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**
Environment: **SIM** for jumps and rendering; **DEVICE (standalone PR205, bench only)** for boot screen, button hold, indicators with a connected device, and cycle time.
Rules under test: `VZ-01`, `VZ-03`, `VZ-04`, `VZ-10`, `VZ-12` to `VZ-14`, `VZ-17`.

## Objective

Determine whether Visualization RAM follows the heaviest screen or accumulates over screens, how Boolean-variable jumps and
physical-button actions behave, which screen shows at boot, and whether many editable elements change the cycle time.

## Prerequisites

- EXP-03 completed or at least its capacity readings known. Standalone PR205 (unwired). `bench/README.md` read.
- Start the common observation header from `bench/README.md` (ALP version, firmware, device, project hash) before step 1.

## Construction Steps

1. New project, PR205. Variable table: BOOL `j12`, BOOL `j21`, BOOL `j13`, INT `v_a`, INT `v_b`. Save as `exp04_base`.
2. Screens (Display Manager; right-click Group 1 > Add display form):
   - **S1** "Heavy": 10 Text elements, default properties.
   - **S2** "Light": 1 Text element.
   - **S3** "Heavy2": 10 Text elements.
   - **S4** "Big": 20 Text elements.
3. RAM accumulation (record indicators after each; DEVICE connected, do not upload):
   - R1: only S1. R2: S1 + S2. R3: S1 + S2 + S3. R4: S1 + S2 + S3 + S4. R5: S1 + S4 only (delete S2, S3).
4. Jumps (SIM): on S1 right-click > Set up jumps (ALP UM §4.4.2 p.50): To display form S2, By change `j12`. On S2 jump back to S1 by `j21`. In the circuit place no writer for `j12`; set `j12` in the simulator Watch Window to 1. Record the screen shown and the value of `j12` after the jump (manual says it is set back to 0).
5. Unconditional and ordered jumps: add a second jump on S1 to S3 by `j13`; set both `j12` and `j13` to 1 in the same cycle; record which jump runs (jump list order is execution order, VZ-13).
6. Buttons (SIM): on S1 open the "Buttons" panel; program the OK button short press: change `j12`; a second event: long press: jump to S3. Run the display simulation window; use keys Q W E A S D Z X C (ALP UM §4.5.1 p.56). Record `hold` is not simulable in step mode.
7. Button RAM: with R1 as baseline, add one physical-button event (short press, change one Boolean variable). Record Visualization RAM delta; compare 80 + 20x1 + 10x1 + 10 = 120 B (ALP UM §7.7 p.176).
8. Boot screen (DEVICE): drag S2 above S1 in Group 1 (Shift + drag, ALP UM §4.4 p.40). Upload. Power-cycle. Record which screen shows after the loading screen (manual: first screen of Group 1, p.49).
9. Hold (DEVICE): program hold (5 s or more) on a button to change a Boolean; record actual behavior and timing.
10. Menu element: add a Menu element on S1; open its line editor; record which screens are offered (manual: every screen except the current one, p.207) and the maximum number of lines accepted.
11. Cycle time (DEVICE): note the cycle time in Device information (ALP UM §8.2 p.214) with S1 only; add 20 editable INT/REAL elements bound to `v_a`/`v_b`; upload; note cycle time again (at most 2 uploads).

## Anticipated Results (UNVERIFIED hypotheses)

- A1: Visualization RAM at R2 and R3 equals R1 (the indicator follows the most heavily loaded screen, VZ-01/VZ-03); R4 rises to S4's cost; R5 equals R4.
- A2: Visualization ROM indicators do not move with screen count (text-only screens).
- A3: the jump runs, and `j12` returns to 0 afterwards (VZ-13).
- A4: with both `j12` and `j13` set, the first listed jump wins.
- A5: step 7 adds about 120 B.
- A6: the boot screen is the first screen in Group 1 order (S2 after step 8).
- A7: cycle time rises with many editable elements (VZ-10); magnitude unknown.

## Actual Observations

| Item | Observation |
| --- | --- |
| R1 / R2 / R3 / R4 / R5 Visualization RAM (absolute) | |
| Screen shown after `j12` jump | |
| `j12` value after jump | |
| Result when `j12` and `j13` set together | |
| Button short / long behavior in SIM | |
| Physical-button RAM delta | |
| Boot screen after reorder | |
| Hold behavior and timing | |
| Menu element: offered screens, max lines accepted | |
| Cycle time before / after 20 editable elements | |
| ALP error or warning text, verbatim | |

Resource indicators:

| Step | FB | Var | Stack | Sys EEPROM | EEPROM | ROM | Sys RAM | RAM | System Visualization ROM | User Visualization ROM | Visualization RAM (%) | Absolute tooltip values |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |

## Evidence Checklist

- [ ] Status bar after each of R1 to R5
- [ ] Display simulation window for each jump
- [ ] Device photos for boot screen and hold test
- [ ] Device information screenshot with cycle time before and after
- [ ] Project files unchanged

## Stop Conditions

Stop on indicator overflow (upload disabled, ALP UM p.20) and record the step. Do not remove limits by editing the device.

## Conclusion (fill only after the tables are complete)

