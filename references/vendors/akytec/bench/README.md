# akYtec ALP Bench Experiments (Visualization, Persistence, Ownership)

Six minimal, precisely specified ALP experiments. They exist to convert `[UNVERIFIED]` items in
`akytec-visualization.md`, `akytec-persistence.md` and `akytec-rules.md` into evidence.

**Status of this whole directory: NOT EXECUTED. Every anticipated result is `[UNVERIFIED]` until the user runs the
experiment and records actual observations with evidence.** Nothing here may be quoted as a verified fact.

## Ground Rules

1. **No live equipment.** Use ALP offline (simulator) and, where marked DEVICE, a **standalone PR205 on a bench** with no
   field wiring and no connection to any plant controller or plant network. Uploading replaces the stored program and starts it
   (ALP UM §4.7 pp.61-62). Never run these projects on a controller that runs equipment.
2. **No wear testing.** Write endurance of persistent storage is undocumented. Do not loop writes to persistent variables.
   Experiments cap persistent changes (stated in each protocol). Do not stress-test.
3. **Isolated network only.** Optional network steps use an isolated bench network (a PC and the bench device, no gateway).
   Never point a bench Modbus master at an address that exists on a plant network.
4. **Record, do not interpret.** Fill the observation fields with what ALP and the device show. Interpretation goes in the
   "Conclusion" field only after the fields are complete.
5. **Compare against the anticipated column** but treat it as a hypothesis. A mismatch is a finding, not a failure.
6. **One variable at a time.** Change one property between measurements and record the indicator after each change.

## Simulator Versus Standalone Device

| Capability | ALP simulator (offline) | Standalone PR205 |
| --- | --- | --- |
| Variable table, in-use behavior, binding dialogs | yes | yes |
| Cycle-by-cycle values of variables (watch window, single step) | yes (arbitrary cycle time, ALP UM §4.5 p.52) | yes via online debugging (circuit only, ALP UM §4.8 pp.62-65) |
| Display form rendering, editable elements, jumps, button keys Q W E A S D Z X C | yes (ALP UM §4.5.1 pp.55-56) | yes |
| Button **hold** timing (5 s) | no in step mode (ALP UM §4.5.1 p.56) | yes |
| Chart | not supported in simulation (ALP UM §4.5.1 p.55) | yes |
| Persistence across a power cycle | no | yes |
| Boot screen, loading image | no | yes |
| Resource indicators (capacity, absolute amounts) | **unknown offline** (ALP UM §3.7 p.19 lists them for a connected device); EXP-03 records this | yes |
| Real cycle time | no | yes (device information, ALP UM §8.2 p.214) |
| Modbus status and timing | no | yes, isolated network only |

## Experiments

| ID | File | Focus | Needs device |
| --- | --- | --- | --- |
| EXP-01 | `exp-01-variable-binding.md` | binding, in-use, Write at the end of cycle, first-cycle values | partly |
| EXP-02 | `exp-02-persistence.md` | Persistence on/off, Sys EEPROM versus EEPROM, power cycle, re-upload | yes |
| EXP-03 | `exp-03-single-element-memory.md` | one element at a time: Visualization RAM, User and System Visualization ROM | yes (capacity); offline presence tested |
| EXP-04 | `exp-04-multiple-screens.md` | RAM across several screens, jumps, buttons, boot screen | partly |
| EXP-05 | `exp-05-status-indication.md` | Indicator, visibility, ranges, dynamic box, Modbus status indication | partly |
| EXP-06 | `exp-06-shared-variable-ownership.md` | operator, circuit, parameter and network writers on one variable | partly |

Suggested order: EXP-03, EXP-01, EXP-04, EXP-05, EXP-06, EXP-02 (persistence last, because it changes device storage).

## Common Observation Header (copy into every record)

| Field | Value |
| --- | --- |
| Experiment ID | |
| Date / operator | |
| ALP version and build (Help / About) | |
| Operating system | |
| Target device selected in project | |
| Connected device model, serial, hardware revision | |
| Firmware version (Device information) | |
| Project file name and SHA-256 | |
| Simulator or device run | |
| Status bar indicators enabled (View > Status indicators) | |
| Evidence folder | |

## Evidence Rules

- Screenshots: full ALP window including the status bar, 100 % zoom, file name `EXP-0N_step-NN_<what>.png`.
- When an indicator shows a percentage, hover for the absolute amount and screenshot the tooltip as well.
- Keep the project file used for each experiment unchanged after the run (copy it to the evidence folder).
- Record failures and ALP error text verbatim in the observation field.
- Keep device photos free of plant labels and addresses.

## Promotion of Results

A rule may move from `[UNVERIFIED]` to `[BENCH-OBSERVED, <ALP version>, <device>, <firmware>]` only when:
the protocol was followed, the observation fields are complete, screenshots exist, and a second run (or a second reader of the
screenshots) agrees. Such a result applies to that combination only; do not generalize to other firmware or devices.
Nothing in this directory has been promoted.

## Known Manual Inconsistencies Relevant to the Protocols

- The simulator is opened via "Tools > Simulator Mode" in §4.5 (p.52) and "Service > Simulation mode" in the menu table (p.11); use whichever exists in the installed ALP and record which.
- The transfer command is "File > Transfer application to device" (p.62) and "Device > Transfer application to device" (p.11); record which exists.
