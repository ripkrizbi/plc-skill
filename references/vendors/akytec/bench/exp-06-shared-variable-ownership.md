# EXP-06: Shared Variable Ownership (Operator, Circuit, Parameter, Network)

**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**
Environment: **SIM** for 6A to 6C; **DEVICE (standalone, unwired PR205 on the bench)** for 6D; 6E also needs an isolated link and a PC software Modbus client.
Rules under test: `VZ-25` to `VZ-29`, `PS-06`, `PS-07`.

## Objective

Determine which writer wins when several sources target one variable, how Write at the end of cycle changes that, and
validate a one-writer request/actual pattern. Every variant has exactly the participants listed in its table, so results can be compared.

## Prerequisites

- Start the common observation header from `bench/README.md` (ALP version, firmware, device, project hash) before step 1.
- `bench/README.md` read. Device work only on a standalone, unwired PR205 on the bench; 6E only on an isolated link with a software Modbus client; no plant devices.

## Variant Rules (apply to every variant)

- **One project per variant.** For each variant create a new project (File > New project, target PR205) and save it under the name in the table. Do not extend one project into the next and do not reuse elements across variants. This removes any leftover binding.
- **One binding per element.** Within a variant, every display element is bound to exactly one variable, and every variable named in that variant is bound to exactly one display element (or none, where stated).
- **Persistence off** for every variable in this experiment (default value 0 unless stated).
- **Participants** are only those marked "yes" in the variant's table. Anything not listed does not exist in that project.
- Timings use a stopwatch or the simulator single-step count, and are recorded in the observation table.

## Construction Steps

### 6A: operator versus circuit (SIM) , project `exp06_6a`

| Participant | Present |
| --- | --- |
| Variable `s_a` (Integer) | yes |
| Operator edit through element **E1a** (INT/REAL I/O on Form 1, Disable editing = No, bound to `s_a`) | yes |
| Circuit writer: constant INT 7 connected to an output variable block for `s_a` | yes |
| Network writer / parameter binding / second element | no |

Trigger timings: simulate at 100 ms; single-step to cycle 2; in the display simulation window enter 42 on E1a; single-step cycles 3, 4, 5; record `s_a` after each. Run twice: the `s_a` output block with Write at the end of cycle = Yes, then = No.

### 6B: cyclic copy (SIM), project `exp06_6b`

| Participant | Present |
| --- | --- |
| Variables `s_var1`, `s_var2` (Integer) | yes |
| Element **E2** on Form 2 bound to `s_var1` (editable); element **E3** on Form 2 bound to `s_var2` (editable) | yes |
| Circuit: input block `s_var1` connected to output block `s_var2` | yes |
| Any other writer | no |

Trigger timings (pattern of ALP UM §4.3.2 pp.32-33): single-step to cycle 2; enter 5 on E2; single-step cycles 3 and 4 and record both variables; enter 9 on E3; single-step cycles 5 and 6 and record both. Run twice: Write at the end of cycle on the `s_var2` output block = No, then = Yes.

### 6C: request/actual (SIM), project `exp06_6c`

| Participant | Present |
| --- | --- |
| Variables `s_req`, `s_act` (Integer) | yes |
| Element **E4** bound to `s_req` (editable); element **E5** bound to `s_act` (Disable editing = Yes) | yes |
| Circuit: input `s_req` > ST function `uClamp` > output `s_act` | yes |
| Any other writer | no |

```st
(* UNCOMPILED - bench helper, clamp request to 0..100 *)
FUNCTION uClamp : UDINT;
    VAR_INPUT
        udiIn : UDINT;
    END_VAR

    IF udiIn > 100 THEN
        uClamp := 100;
    ELSE
        uClamp := udiIn;
    END_IF
END_FUNCTION
```

Trigger timings: single-step to cycle 2; enter 50 on E4, single-step 2 cycles; enter 150, single-step 2 cycles; enter 0, single-step 2 cycles. Record `s_act` after each step.

### 6D: parameter binding with bounded restoration (DEVICE), project `exp06_6d`

**Allowed parameter: display Brightness only** (ALP UM §5.1 p.89: 0 to 100 %). Never bind anything else for this experiment: not Contrast, not any interface, address, Modbus, I/O, output, clock, password, calibration or network parameter. Binding is not available for every parameter (ALP UM §6.4 p.131); if Brightness cannot be bound, **stop and record it; do not choose another parameter**.

| Participant | Present |
| --- | --- |
| Variable `s_par` (Integer) bound to Brightness (Variable column in Device configuration, ALP UM §6.4 p.131) | yes |
| Variable `s_cmd` (Integer), default value = **V0** (the Brightness value read from the device in step D1) | yes |
| Circuit: input block `s_cmd` connected to output block `s_par` | yes |
| Operator edit on the display / network writer | no |

Bounded procedure (limits: at most 3 distinct Brightness values, V0, V1, V0; at most 4 parameter changes; at most 3 uploads):

- **D0 dry run, no writes.** Connect, open Device configuration > Display (ALP UM §5.1 p.89), press **Read**. If ALP cannot read the display settings, **stop 6D**.
- **D1 record V0.** Screenshot the Read values for Backlight, Brightness and Contrast. V0 = Brightness. Write V0, and the date, on paper next to the device. Choose **V1 = V0 - 10** if V0 is at least 40, otherwise **V0 + 10**. V1 must stay between 30 and 100.
- **D2 build.** Bind `s_par` to Brightness; set the default of `s_cmd` to **V0**; build the circuit; save as `exp06_6d`. With `s_cmd` = V0 the continuously written value equals the current parameter value, so the parameter should not change (ALP UM §6.4 p.131; the persistence of parameter-bound values is not documented here, `PS-02`).
- **D3 upload** (File > Transfer application to device, or Device > ...; record which). Confirm the display is unchanged.
- **D4 one change.** In online debugging (ALP UM §4.8 pp.62-65) set the value on the **output variable block** of `s_par` to **V1** (input variable blocks cannot be set, p.64) without "Fix the values": it lasts one cycle, then the circuit's V0 returns. Record the visible effect. Then repeat with "Fix the values" at V1 and record the visible effect and `s_par` for 10 s. Release the fix and confirm `s_par` returns to V0.
- **D5 restoration.** (1) Stop online debugging. (2) Re-open Device configuration > Display > Read: Brightness must equal V0; screenshot. (3) If it differs: write V0 in Device configuration > Display and save it to the device (that ALP writes this group is `[UNVERIFIED]`; record what ALP does), or upload `exp06_6d` again (its `s_cmd` default is V0), then Read again. (4) Remove the binding in a copy of the project and upload that copy, so no variable stays bound to the parameter after the experiment; Read once more and confirm V0.
- **Stop and escalate (do not improvise):** the display becomes unreadable, Read and the display disagree, or Brightness does not return to V0. ALP works over USB even if the display is unreadable. Do not use any factory-reset or firmware-repair function for this experiment. Record the state, and treat the bench device as unfit for other experiments until Brightness is back at V0.

### 6E: network writer, separate variants (DEVICE, isolated link, optional)

Common to all 6E variants: new project each, **no variable named `s_a`/`s_shared`**, one network slave variable `s_net` (Variable table > Network > Slave; Persistence off; register in 16384 to 20479, ALP UM §5.3.2.2 p.112), one element **E6** (INT/REAL I/O on Form 1) bound to `s_net` (E6 exists only in these projects). The PC runs a software Modbus client against the bench device on an isolated link only. `t0` is the moment the client reports a successful write.

| Variant (project) | Operator edit on E6 | Network write | Circuit writer (constant 7 > output block `s_net`) |
| --- | --- | --- | --- |
| 6E-1 `exp06_6e1` | no (Disable editing = Yes) | yes | no |
| 6E-2 `exp06_6e2` | yes | no | no |
| 6E-3 `exp06_6e3` | yes | yes | no |
| 6E-4 `exp06_6e4` | no (Disable editing = Yes) | yes | yes |

Trigger timings:

- 6E-1: write 100 at t0; read `s_net` at t0 + 5 s and t0 + 30 s.
- 6E-2: enter 200 on the device at t0 (a stopwatch started when the project runs); read at +5 s and +30 s.
- 6E-3: write 100 at t0; enter 200 on E6 at t0 + 10 s; read at +15 s and +40 s. Then repeat in the reverse order: enter 200 first, write 300 from the client at +10 s; read at +15 s and +40 s.
- 6E-4: write 100 at t0; read at +1 s, +5 s and +30 s.

## Anticipated Results (UNVERIFIED hypotheses)

- A1 (6A): the circuit constant rewrites `s_a` every cycle, so the operator edit is overwritten by the next cycle; whether Yes or No changes what is visible in the edit cycle is unknown.
- A2 (6B): one of the two edits gets overwritten by the copy; Yes versus No changes which variable the screen can modify (ALP UM §4.3.2 pp.32-33).
- A3 (6C): `s_act` shows the clamped value (50, 100, 0); the operator edits `s_req` only; E5 stays view-only.
- A4 (6D): with `s_cmd` = V0 the display does not change; with V1 the written value lasts one cycle unless fixed, then the parameter value returns (`PS-07`).
- A5 (6E): no anticipation is made for any variant.

## Actual Observations

| Item | Observation |
| --- | --- |
| 6A: `s_a` cycles 2 to 5 (Write at end = Yes) | |
| 6A: `s_a` cycles 2 to 5 (Write at end = No) | |
| 6B: which edits hold (Write at end = No) | |
| 6B: which edits hold (Write at end = Yes) | |
| 6C: `s_act` for 50 / 150 / 0 | |
| 6D: V0 / V1 and ALP Read screenshot names | |
| 6D: visible effect and `s_par` during the fixed value | |
| 6D: Brightness after each restoration step | |
| 6D: how ALP behaved when writing the display group | |
| 6E-1 readings | |
| 6E-2 readings | |
| 6E-3 readings (both orders) | |
| 6E-4 readings | |
| Menu path used | |
| ALP error or warning text, verbatim | |

Resource indicators:

| Step | FB | Var | Stack | Sys EEPROM | EEPROM | ROM | Sys RAM | RAM | System Visualization ROM | User Visualization ROM | Visualization RAM (%) | Absolute tooltip values |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |

## Evidence Checklist

- [ ] Watch Window screenshots per cycle for 6A and 6B
- [ ] Display simulation screenshots for edits
- [ ] Device Read screenshots before and after 6D, including the final restoration check
- [ ] Online-debugging screenshots for 6D
- [ ] Modbus client log with timestamps for 6E (isolated link)
- [ ] Project files unchanged, one per variant

## Stop Conditions

Stop 6D on any condition under "Stop and escalate" above. Stop 6E if any traffic leaves the isolated link (unplug the cable first, then investigate).

## Conclusion (fill only after the tables are complete)

