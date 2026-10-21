# EXP-06: Shared Variable Ownership (Operator, Circuit, Parameter, Network)

**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**
Environment: **SIM** for 6A to 6C; **DEVICE (standalone PR205, bench only)** for 6D; 6E also needs an isolated network and a PC Modbus client.
Rules under test: `VZ-25` to `VZ-29`, `PS-06`, `PS-07`.

## Objective

Determine which writer wins when several sources target one variable, how Write at the end of cycle changes that, and
validate a one-writer request/actual pattern.

## Prerequisites

- `bench/README.md` read. Device runs only on the bench; 6E only on an isolated link with a software Modbus client; no plant devices.
- Start the common observation header from `bench/README.md` (ALP version, firmware, device, project hash) before step 1.

## Construction Steps

1. New project, PR205. Variables (Integer): `s_shared` (default 0), `s_var1`, `s_var2`, `s_req`, `s_act` (all default 0, Persistence off). Save as `exp06_base`.
2. Form 1: INT/REAL I/O **E1** bound to `s_shared`, Disable editing = No. Form 2: **E2** bound to `s_var1` (editable), **E3** bound to `s_var2` (editable), jump between Form 1 and Form 2 via a button. Form 3: **E4** bound to `s_req` (editable), **E5** bound to `s_act` (Disable editing = Yes).
3. **6A operator versus circuit writer.** Circuit: constant INT 7 connected to an output block of `s_shared`. Simulate (100 ms). In the display window edit `s_shared` to 42 between two single-steps. Record the value in the next three cycles. Repeat with Write at the end of cycle = Yes and = No on that output block.
4. **6B cyclic copy** (the pattern in ALP UM §4.3.2 pp.32-33). Circuit: input block `s_var1` connected to an output block `s_var2`. Edit `s_var1` on E2, then edit `s_var2` on E3. Record whether each edit holds. Repeat with Write at the end of cycle on the `s_var2` output block set to No and to Yes.
5. **6C request/actual.** Circuit: input `s_req` > an ST function `uClamp` that limits to 0..100 > output `s_act`:

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

   Edit `s_req` to 50, 150, 0 on E4; record `s_act` each time and confirm no conflict with E5 (view-only).
6. **6D parameter binding (DEVICE).** In Device configuration > Display settings, bind a variable `s_par` to the display **Brightness** parameter (binding is not available for all parameters, ALP UM §6.4 p.131; if unavailable pick any other harmless bindable display parameter and record it). In the circuit write a constant equal to the current parameter value to `s_par` through an output block, then a different value in a second run. Record whether the written value persists beyond one cycle (manual: it lives one cycle if the parameter value did not change, p.131). Change the parameter from the front panel and note `s_par` online.
7. **6E network writer (DEVICE, isolated link, optional).** Add `s_net` as a network slave variable (Variable table > Network > Slave; register in 16384 to 20479; ALP UM §5.3.2.2 p.112) bound to editable element E1 and also written by the circuit. From a PC software Modbus client write `s_net`, then edit it on the device; record the final value and which write seems to win.

## Anticipated Results (UNVERIFIED hypotheses)

- A1 (6A): with Write at the end of cycle = Yes the circuit constant is written after all reads each cycle and the operator edit is overwritten; with = No the same, but visible effect on order-dependent reads differs.
- A2 (6B): one of the two edits gets overwritten by the copy; Yes versus No changes which variable the screen can modify (the manual's example, ALP UM §4.3.2 pp.32-33).
- A3 (6C): `s_act` is the clamped value; the operator edits `s_req` only.
- A4 (6D): the written value lasts one cycle, then the parameter value returns.
- A5 (6E): unknown; no anticipation is made.

## Actual Observations

| Item | Observation |
| --- | --- |
| 6A: cycles 1 to 3 after edit (Yes) | |
| 6A: cycles 1 to 3 after edit (No) | |
| 6B: which edits hold (Yes) | |
| 6B: which edits hold (No) | |
| 6C: `s_act` for 50 / 150 / 0 | |
| 6D: parameter chosen and written value lifetime | |
| 6E: final value and apparent winner | |
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
- [ ] Online-debugging screenshots for 6D
- [ ] Modbus client log for 6E (isolated link)
- [ ] Project file unchanged

## Stop Conditions

Stop 6D if the display becomes unreadable (restore the parameter from the front panel menu). Stop 6E if any traffic leaves the isolated link.

## Conclusion (fill only after the tables are complete)

