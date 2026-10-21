# EXP-01: Variable Binding and Write at the End of Cycle

**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**
Environment: **SIM** for steps 1 to 8 (cycle-by-cycle values); **DEVICE (standalone PR205, bench only)** for step 9.
Rules under test: `VZ-18`, `VZ-20`, `VZ-25`, `VZ-26`, `VZ-27`, `VZ-33`, `PS-06`.

## Objective

Observe (a) when a variable bound to a visualization element is "in use", (b) what an input block sees in the **first** cycle for
each combination of Persistence (off/on) and Write at the end of cycle (No/Yes), and (c) whether the simulator treats
non-persistent variables differently (ALP UM §4.5 p.53 wording).

## Prerequisites

- ALP 3.1, target device PR205 selected. Device only for step 9 (bench, unwired).
- `bench/README.md` ground rules read; common observation header started.

## Construction Steps

1. File > New project; target PR205. Save as `exp01_base`.
2. Device > Variable table > Standard tab. Create (type Integer unless noted):
   - `v_mode`, default value 5, Persistence **off**
   - `v_seen`, default 0, Persistence off
   - `v_first`, default 0, Persistence off
3. Display Manager: in Form 1 place an **INT/REAL input/output** element. Double-click it and bind `v_mode`. Data type integer. Disable editing = **Yes** for now.
4. Circuit (main program tab):
   a. Place an **input variable block** for `v_mode` and an **output variable block** for `v_seen`; connect them.
   b. Place a **constant block**, type INT, value 7; place an **output variable block** for `v_mode`; connect the constant to it.
   c. Service toolbar > execution sequence > Outputs (ALP UM §4.3.9 p.38). Record the order numbers of the two output blocks. Run A: `v_seen` before `v_mode`. Run B: `v_mode` before `v_seen` (double-click an output to change its number).
5. Select the output block of `v_mode`. In Property Box record the current value of **Write at the end of cycle** (expected to follow Persistence, ALP UM §4.3.2 pp.31-32).
6. Enter simulation (Tools > Simulator Mode, or Service > Simulation mode; record which). Set Cycle time to 100 ms. Open the Watch Window and add `v_mode`, `v_seen`.
7. Run the four configurations. For each: set Persistence on `v_mode` (Variable table), set Write at the end of cycle on its output block explicitly (Yes/No), stop and restart simulation, press **Single cycle** three times. Record `v_mode` and `v_seen` after cycle 1, 2, 3, for Run A and Run B.

| Config | Persistence | Write at the end of cycle |
| --- | --- | --- |
| C1 | off | Yes |
| C2 | off | No |
| C3 | on | Yes |
| C4 | on | No |

8. Extra simulator checks:
   - 8a. Operator edit: set Disable editing = No on the element; in the display simulation window edit `v_mode` to 42 between cycle 2 and 3 (single-step). Record what the circuit does in cycle 3, for C1 and C2.
   - 8b. In-use: delete the `v_mode` input block and output block but keep the display binding; record whether `v_mode` still shows as used (Variable table "Used in project", Watch Window grey/black). Then delete the display binding too and record again (ALP UM §6 p.120).
   - 8c. Persistence off, start the simulator: does `v_mode` appear in the Watch Window and change normally? Record the exact behavior (ALP UM §4.5 p.53 says simulation "will not work for volatile variables").
9. **DEVICE.** Add this ST function block (UNCOMPILED; compile in ALP first, and fix whatever ALP reports):

```st
(* UNCOMPILED - bench helper, capture of the first observed value *)
FUNCTION_BLOCK fbCaptureFirst
    VAR_INPUT
        udiIn : UDINT;
    END_VAR
    VAR_OUTPUT
        udiFirst : UDINT;
    END_VAR
    VAR
        xDone : BOOL := FALSE;
    END_VAR

    IF NOT xDone THEN
        udiFirst := udiIn;
        xDone := TRUE;
    END_IF
END_FUNCTION_BLOCK
```

   Place it in the circuit with `v_mode` (via a conversion block if ALP requires) as input and `v_first` as output. Upload (File > Transfer application to device). After the device is running, power-cycle it with its supply, start online debugging (ALP UM §4.8 pp.62-65), and read `v_first`. Repeat for C1 to C4. At most 8 uploads in total.

## Anticipated Results (UNVERIFIED hypotheses)

The manual's figure reading (ALP UM §4.3.2 p.33; figure-derived, VZ-27) is:

| Config | Anticipated first-cycle value read by the input block |
| --- | --- |
| C1 | the default (5) |
| C2 | the value present on the display canvas, (its content is not defined in the text) |
| C3 | 0 |
| C4 | the value present on the display canvas |

- A1: with Write at the end of cycle = Yes, the write of 7 appears only after all reads, so `v_seen` shows the old value in cycle 1 and 7 in cycle 2 regardless of block order (Run A and Run B equal).
- A2: with = No, the order of the two output blocks matters (Run A and Run B differ).
- A3: in 8a, an edit made between cycles is overwritten by the constant on the next cycle in both modes; any difference between Yes and No is a finding.
- A4: in 8b the variable remains in use while the display binding exists.
- A5: in 8c the non-persistent variable works in the simulator (the manual's "volatile" is probably a typo), but this is unknown.

## Actual Observations

Common header: attach.

| Config / Run | v_mode c1 | v_seen c1 | v_mode c2 | v_seen c2 | v_mode c3 | v_seen c3 | Write-at-end default shown |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 / A | | | | | | | |
| C1 / B | | | | | | | |
| C2 / A | | | | | | | |
| C2 / B | | | | | | | |
| C3 / A | | | | | | | |
| C3 / B | | | | | | | |
| C4 / A | | | | | | | |
| C4 / B | | | | | | | |

| Check | Observation |
| --- | --- |
| 8a edit survives cycle 3 (C1) | |
| 8a edit survives cycle 3 (C2) | |
| 8b in-use after deleting circuit blocks | |
| 8b in-use after deleting display binding | |
| 8c non-persistent variable in simulator | |
| 9 device first value C1 / C2 / C3 / C4 | |
| Menu path used for simulator and transfer | |
| ALP error or warning text, verbatim | |

Resource indicators (before and after the project changes):

| Step | FB | Var | Stack | Sys EEPROM | EEPROM | ROM | Sys RAM | RAM | System Visualization ROM | User Visualization ROM | Visualization RAM (%) | Absolute tooltip values |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |

## Evidence Checklist

- [ ] Variable table screenshot per configuration
- [ ] Watch Window screenshot after each of cycles 1 to 3
- [ ] Property Box screenshot showing Write at the end of cycle
- [ ] Execution-order screenshot for Run A and Run B
- [ ] Online-debugging screenshot for step 9
- [ ] Project file unchanged copy

## Stop Conditions

Stop if ALP refuses to compile the helper ST block; record the error and skip step 9. Do not edit the plant controller.

## Conclusion (fill only after the tables are complete)

