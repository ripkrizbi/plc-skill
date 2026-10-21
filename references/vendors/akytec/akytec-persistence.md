# akYtec ALP Persistence Reference

Load this file only for retention, power-loss, non-volatile variable or "keep value after restart" questions on ALP devices.
Labels and citation shorthand: see `akytec-overview.md`. Primary target: PR205 and other second-generation devices.

## Core Model

ALP has **no ST `RETAIN` keyword that works**. Persistence is a property of a **variable in the Variable table** (the "Persistence" checkbox), managed in the circuit program. ST function blocks cannot hold retained state themselves.

## Rules

- **PS-01** [DOC] The Persistence checkbox saves the variable value in device ROM for a power failure; how long the value is kept depends on the device, see the device manual. (ALP UM §6 p.123)
- **PS-02** [DOC] For devices on the "new platform", a persistent variable is stored in the **system EEPROM** if it is a standard variable bound to a device parameter or a visualization element, or a network slave variable; it is stored in the **EEPROM** if it is a standard variable bound to neither. (ALP UM §6 p.123) [INFERRED] "New platform" corresponds to the second-generation devices, since ALP uses both terms and lists PR205 as second generation (ALP UM §1 p.5; §5.2 p.91); the manual does not state the equivalence outright.
- **PS-03** [DOC] Persistence settings are saved with the project. (ALP UM §6 p.123)
- **PS-04** [DOC] The status bar shows two separate non-volatile indicators: Sys EEPROM (full if the project uses network variables, parameter- or visualization-bound variables, or expansion modules) and EEPROM (full if the project uses standard non-volatile variables). (ALP UM §3.7 p.19)
- **PS-05** [DOC] An output block for a non-volatile variable makes that variable "in use" (it is then allocated). (ALP UM §6 p.120)
- **PS-06** [DOC] Output blocks of variables bound to a device parameter or visualization element have a "Write at the end of cycle" setting. Its default follows Persistence: "No" for non-persistent, "Yes" for persistent variables, and it is reset to that default whenever the binding or the Persistence flag changes. The manual's examples recommend "No" for one case and "Yes" for another, so choose per use. (ALP UM §4.3.2 pp.31-34) [UNVERIFIED] The first-cycle initial values shown in the manual's figures (p.33) are image-based; confirm on the target.
- **PS-07** [DOC] If a variable bound to a device parameter is written by a block and the parameter value did not change, the written value lives for one cycle and is re-read from the parameter in the next. (ALP UM §6.4 p.131)
- **PS-08** [DOC] Network variables: on first-generation devices all are always retained. On second-generation devices from ALP 2.9 retention is chosen per variable; with earlier ALP versions all are always retained. A slave network variable's default value is initialised at program start. (ALP UM §5.3.2 table p.99; §5.3.2.2 p.112)
- **PS-09** [DOC] The default value is what the variable keeps until a new value is written. (ALP UM §6 p.123)
- **PS-10** [DOC] The FBD counter blocks have a "State saving" property; with Yes the count is kept in non-volatile memory. (ALP UM §7.2.4 p.154) [INFERRED] The ST counters `SYS.CT`, `SYS.CTN`, `SYS.CTU` have no documented state saving (ALP UM §12.6.4 pp.277-279); do not assume it.
- **PS-11** [DOC] ST function blocks do not support RETAIN variables. (ALP UM §12.1.3 p.244) This is an ST restriction; the circuit-level Persistence property is unaffected.
- **PS-12** [DOC] Non-volatile variables cannot be pasted into a project for a device that does not support them. A variable created from macro selection inherits its non-volatility. (ALP UM §6.5 p.131; §4.11 p.75)
- **PS-13** [DOC] PR205 retain memory is 1024 bytes. It is powered from the supply and backed by a replaceable CR2032 battery (stated life 5 years, shorter near temperature limits). With a discharged battery, the RTC and the device settings changed over Modbus or by the user program are reset when supply is removed. (PR205 UG §3.1 Table 3.2 p.9; §7.12 p.69)
- **PS-14** [DOC] The 100,000 program/erase-cycle figure in the PR205 specification belongs to the flash used for **data logging**. (PR205 UG §3.1 Table 3.2 p.9) [INFERRED] Do not quote it as the write endurance of persistent variables; the manual does not give one.

## Unresolved (Do Not Present as Facts)

- [UNVERIFIED] Write endurance and wear behavior of the EEPROM / system EEPROM used for persistent variables.
- [UNVERIFIED] When a persistent value is committed: on every write, once per cycle, on change, or at power loss.
- [UNVERIFIED] Behavior on brown-out and on supply loss during a commit.
- [UNVERIFIED] Whether persistent values survive re-uploading the project, and whether a changed Default value takes effect.
- [UNVERIFIED] How the 1024-byte retain memory relates to ALP's EEPROM and Sys EEPROM indicators, and how many persistent variables fit.
- [UNVERIFIED] Initial value of a non-persistent `VAR` in an ST block on the first cycle.

## Design Guidance (all [INFERRED]; patterns are UNCOMPILED)

- Treat persistent writes as scarce: write on change, rate-limit, and never rewrite a persistent variable every cycle until endurance is known.
- Keep the persistent copy in the **circuit** (Persistence on). Pass it into an ST block as an input and take the new value back as an output.
- Define a safe, tested default for first start, battery failure and a cleared memory. Do not let a restored value alone re-energize hardware.
- Re-derive anything that has a fresh measurement instead of restoring stale state.
- Check the Write-at-end-of-cycle setting whenever a persistent variable is both read and written in one cycle.

```st
(* UNCOMPILED - illustrative sketch, not verified in ALP *)
FUNCTION_BLOCK fbKeepFlagSketch
    VAR_INPUT
        xSet      : BOOL;
        xReset    : BOOL;
        xStoredIn : BOOL;
    END_VAR
    VAR_OUTPUT
        xStoredOut : BOOL;
    END_VAR

    IF xReset THEN
        xStoredOut := FALSE;
    ELSIF xSet THEN
        xStoredOut := TRUE;
    ELSE
        xStoredOut := xStoredIn;
    END_IF
END_FUNCTION_BLOCK
```

In the circuit, wire a Persistence-enabled variable to `xStoredIn` and `xStoredOut`. The block itself holds no retained state.
