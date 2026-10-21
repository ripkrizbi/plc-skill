# EXP-05: Status Indication Elements and Modbus Status

**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**
Environment: **SIM** for element behavior (steps 1 to 6); **DEVICE (standalone PR205, bench only, isolated network)** for step 7.
Rules under test: `VZ-14`, `VZ-19` to `VZ-23`, `MB-14`, `MB-15`.

## Objective

Observe how Indicator, Visibility, range highlighting, Dynamic box and Progress bar react to bound variables, including an
unbound Indicator, and how a Modbus master status variable looks on the display when the polled slave does not answer.

## Prerequisites

- ALP 3.1, PR205 target. For step 7: bench PR205 and a PC on an isolated Ethernet link (no router, no plant network). `bench/README.md` read.
- Start the common observation header from `bench/README.md` (ALP version, firmware, device, project hash) before step 1.

## Construction Steps

1. New project, PR205. Variables: BOOL `b_ok`, BOOL `b_vis`, REAL `r_val`, INT `i_state`. Save as `exp05_base`.
2. Form 1, place elements: Indicator **I-A** bound to `b_ok`; Indicator **I-B** with **no** variable; Text **T-A** with Visibility bound to `b_vis`; INT/REAL I/O **IO-A** bound to `r_val` (REAL), Minimum 0, Maximum 100, Disable editing = No; Progress bar **P-A** bound to `r_val`, Minimum 0, Maximum 100, Value visibility Yes; Dynamic box **D-A** bound to `i_state` (INT), rows 0 "Stop", 1 "Start", 2 "Pause".
3. Enter the simulator and open the display simulation window (ALP UM §4.5.1 p.55). Cycle time 100 ms.
4. Boolean checks: set `b_ok` 0 then 1; set `b_vis` 0 then 1. Record I-A color, I-B color, T-A visibility.
5. Range checks: set `r_val` to 50, 100, 100.5, -1, 1000. Record IO-A frame color and displayed text; P-A fill and text. Then change IO-A decimal places to 6 and observe the Minimum/Maximum error (limit 2147483647 / 10^6, ALP UM §7.7.5 pp.189-190).
6. Dynamic box: set `i_state` to 0, 1, 2, 3 (no row), 128. Record the displayed text. Also try creating a 129th row and a Boolean-typed box with a third row; record the ALP response (manual: 128 rows INT, two rows BOOL, p.186).
7. **DEVICE, isolated network only.** Device > Device configuration > Modbus Master (second-generation tree): right-click > Add Device (ALP UM §5.3.2.1 p.102). Configure Modbus TCP, IP address = an unused address on the isolated link (no device answers), Port 502, Unit ID 1, Response time-out 500 ms, Retries 1, Status variable `b_ok`, Start query variable `b_poll` (BOOL). Add one read variable. Bind `b_ok` to I-A. Upload. Record: the value of `b_ok` and I-A color before any poll, after `b_poll` = 1, and the time until I-A changes to its "False" color (video with timestamp). Then connect a PC Modbus TCP server (software only) on that address and record the recovery behavior.

## Anticipated Results (UNVERIFIED hypotheses)

- A1: I-A follows `b_ok`; I-B always shows its "True" color (VZ-21).
- A2: IO-A shows a red frame outside 0 to 100; P-A saturates at its ends; values still display (VZ-23).
- A3: D-A shows the text for known IDs; behavior for unmapped IDs is unknown.
- A4: ALP refuses a 129th INT row and a third BOOL row (VZ-19).
- A5: step 7: the status goes (or stays) 0 after about time-out x (retries + 1) plus scheduling; the initial value before the first poll is unknown.
- A6: after the PC server appears, the status returns to 1 without a restart.

## Actual Observations

| Item | Observation |
| --- | --- |
| I-A colors for 0 / 1 | |
| I-B color for 0 / 1 | |
| T-A visible for 0 / 1 | |
| IO-A at 50 / 100 / 100.5 / -1 / 1000 (text, frame) | |
| P-A at the same values | |
| 6-decimal limit message | |
| D-A for ids 0 / 1 / 2 / 3 / 128 | |
| 129th row / third BOOL row response | |
| `b_ok` before first poll | |
| Time from upload to status 0 | |
| Recovery after server appears | |
| Menu path used for simulator and transfer | |
| ALP error or warning text, verbatim | |

Resource indicators:

| Step | FB | Var | Stack | Sys EEPROM | EEPROM | ROM | Sys RAM | RAM | System Visualization ROM | User Visualization ROM | Visualization RAM (%) | Absolute tooltip values |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |

## Evidence Checklist

- [ ] Display simulation screenshots for each value set
- [ ] ALP messages (limit errors)
- [ ] Timed video of the status indicator on the device
- [ ] Network capture or PC-server log (isolated link only)
- [ ] Project file unchanged

## Stop Conditions

Stop step 7 if any frame leaves the isolated link or an address answers. Unplug the Ethernet cable first, then investigate.

## Conclusion (fill only after the tables are complete)

