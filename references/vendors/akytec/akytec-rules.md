# akYtec ALP Rules

Platform rules for **ALP 3.1** (primary target: second-generation devices, especially PR205).
Labels and citation shorthand are defined in `akytec-overview.md`. Every rule line carries one label.
Rule IDs are stable; evals and checks refer to them.

Common engineering rules (output ownership, interlocks, scan-cycle reasoning) still apply from `references/common/`.

## Scope Matrix: ST-only Versus Whole-ALP Restrictions

Do not apply an ST-only restriction to the FBD circuit, or an environment limit to ST code, without checking this table.

| Topic | ST function / ST function block only | Applies to the whole ALP project | Rule IDs |
| --- | --- | --- | --- |
| Scalar types | BOOL, UDINT, REAL, TIME, DT | Variable table: BOOL, INT (unsigned 32-bit), REAL | `ST-03`, `ENV-02` |
| Arrays | up to 32768 elements; element types BOOL, UDINT, REAL, TIME, DT | up to 256 elements; BOOL, INT, REAL | `ST-16`, `ENV-03` |
| Declaration blocks | `VAR_INPUT`, `VAR_OUTPUT`, `VAR` | Variables live in the Variable table | `ST-05`, `ENV-04` |
| FB instance inside a function | forbidden | not applicable | `ST-12` |
| FB nesting depth | at most 8 inside an ST function block | no equivalent limit stated for macros | `ST-13`, `ENV-12` |
| RETAIN | not supported in ST function blocks | Persistence is a Variable-table property | `ST-14`, `ENV-06` |
| ROM reservation | each ST function / FB reserves ROM once in the library | project-wide resource indicators | `ST-15`, `ENV-14` |
| Modbus group request size | not an ST topic | master request limit differs by generation | see `akytec-modbus-and-network.md` |

## Whole-Environment Rules

- **ENV-01** [DOC] The device runs a cyclic program: latch physical inputs into the input image, execute the program from first to last command, write the output image to the outputs, repeat. (ALP UM §4.1, p.23)
- **ENV-02** [DOC] Variable-table scalar types are Boolean, Integer and Real. Integer is an unsigned 32-bit value (0 to 4,294,967,295); Real is single precision. Connections and assignments need matching types; conversion blocks bridge types. (ALP UM §6.1 pp.127-128; §4.3.7 pp.37-38)
- **ENV-03** [DOC] Array variables in the circuit are one-dimensional, hold BOOL/INT/REAL elements, and are limited to 256 elements; arrays need ALP 3.0 or later. (ALP UM §6 p.122; §6.1 p.128)
- **ENV-04** [DOC] A variable must be created in the Variable table before a block can use it. Variables with no block, binding or persistent output block are "unused": they take no device memory and do not run in simulation. (ALP UM §4.3.2 p.31; §6 pp.120-121)
- **ENV-05** [DOC] The user cannot set the cycle time. The default is 1 ms and grows with program complexity, number of network variables and display data controls. Modbus requests are served in the time left after the program finishes. (ALP UM §8.2 p.214; §5.3.2 p.102)
- **ENV-06** [DOC] Persistence is a Variable-table property. See `akytec-persistence.md`. (ALP UM §6 p.123)
- **ENV-07** [DOC] A delay line passes a value to a block input one cycle late; the execution order of outputs and delay lines is visible and editable. (ALP UM §4.3.4 pp.34-35; §4.3.9 p.38)
- **ENV-08** [DOC] The simulator cycle time is arbitrary and is not the real device cycle time. (ALP UM §4.5 p.52)
- **ENV-09** [INFERRED] Treat a PLC output variable as the command written to the output image, not as proof of the physical contact state. Basis: the manual describes writing results to the output image and then applying them (ALP UM §4.1 p.23) and does not define any readback of the physical output. Whether PR205 local outputs expose independent feedback is [UNVERIFIED]; check the device guide and bench it.
- **ENV-10** [DOC] Online debugging needs the program and firmware in the device to match the project, and the project cannot be edited while debugging. (ALP UM §4.8 p.62)
- **ENV-11** [DOC] Transferring a project replaces the stored program and, when finished, the device enters run mode and the program starts automatically. (ALP UM §4.7 pp.61-62) Never advise an upload as a casual step; the user decides, with a known-good backup.
- **ENV-12** [UNVERIFIED] Macros can be nested (ALP UM §4.11 p.76), but no depth limit is stated. Do not assume the ST function-block nesting limit applies to macros, or that it does not.
- **ENV-13** [DOC] ST functions and function blocks can be created for PR100(M02), PR102, PR200, PR103, PR205, PR225 and SMI200. (ALP UM §7.4 p.163; §7.5 p.166) Support listed here does not imply identical dialect behavior across generations; see `ST-27`.
- **ENV-14** [DOC] PR205 resource figures: retain memory 1024 bytes, ROM 64 kB, RAM 320 kB, user program footprint 128 kB, network-variable memory 2040 bytes (slave) and 384 bytes (master). (PR205 UG §3.1 Table 3.2 p.9) How these map to ALP's EEPROM / Sys EEPROM / ROM / RAM indicators (ALP UM §3.7 p.19) is [UNVERIFIED].

## ST Language Rules (functions and function blocks only)

- **ST-01** [DOC] ST is used to author user functions and user function blocks; the main program is a circuit. (ALP UM §1 p.5; §12 p.242) [INFERRED] There is no ST `PROGRAM`: the word is reserved but not marked available in the keyword table (ALP UM §12.3.1 p.247).
- **ST-02** [DOC] Keywords are case-insensitive, as are names. Names start with a letter, contain no spaces or special characters except `_`, must not contain consecutive underscores, must not equal a reserved word, and have no length limit. The text says Latin letters only; the manual's own samples also use digits in names (for example `rIn1_0`), so digit use is [UNVERIFIED]. (ALP UM §12.1 p.242; §12.1.2 p.243)
- **ST-03** [DOC] Types available in ST: BOOL, UDINT, REAL, TIME, DT (4 bytes each) and ARRAY. (ALP UM §12.3 p.246) The reserved-word table states that available words are shown in bold; font inspection of the PDF confirmed BOOL, UDINT, REAL, TIME, DT, ARRAY are bold. (ALP UM §12.3.1 p.247)
- **ST-04** [INFERRED] INT, DINT, SINT, USINT, UINT, ULINT, LINT, LREAL, WORD, DWORD, LWORD, STRING and WSTRING are reserved but not available as ST types. Basis: they appear in the keyword table without the bold "available" marking (ALP UM §12.3.1 pp.247-248) and are absent from the type table (p.246).
- **ST-05** [DOC] Declaration blocks shown as available: `VAR_INPUT`, `VAR_OUTPUT`, `VAR`, closed by `END_VAR`. (ALP UM §12.3.1 p.247; §12.1.3 p.243; §4.12-4.13 pp.80, 85) [INFERRED] `VAR_IN_OUT`, `VAR_GLOBAL`, `VAR_EXTERNAL`, `VAR_TEMP`, `VAR_CONFIG`, `VAR_ACCESS`, `RETAIN`, `NON_RETAIN`, `AT`, `STRUCT`, `TYPE` and `PROGRAM` are reserved but not available. [UNVERIFIED] One manual sample places `VAR_OUTPUT` inside a `FUNCTION` (ALP UM §12.2 p.245) while the function-creation steps mention only input and local blocks (§4.12 p.80); do not rely on outputs inside functions without a compile check.
- **ST-06** [DOC] There is no automatic type conversion; assignment needs identical types; the right side may be an expression, the left side only a variable. Documented converters: UDINT_TO_REAL, UDINT_TO_BOOL, UDINT_TO_TIME, UDINT_TO_DT, REAL_TO_UDINT, REAL_TO_BOOL, BOOL_TO_REAL, BOOL_TO_UDINT, TIME_TO_UDINT, DT_TO_UDINT. Narrowing may lose information. (ALP UM §12.3 p.246; §12.4.1.3 pp.251-252; §12.4.2 p.253)
- **ST-07** [DOC] Bit access exists only on UDINT, written `Variable.N` with N a literal 0 to 31; a variable as bit index is not allowed; array elements do not support bit access. (ALP UM §12.1.1 p.242; §12.3.2 p.250)
- **ST-08** [DOC] Arithmetic `+ - * /` and `MOD` work on UDINT/REAL; `ABS` and `POW` on REAL; `SHL`/`SHR` on UDINT with N from 1 to 32; `DC32`/`CD32` on UDINT; logic `NOT AND & OR XOR` on BOOL; relations on UDINT/REAL give BOOL. (ALP UM §12.4.1 pp.251-253)
- **ST-09** [DOC] Statements: `:=`, `IF/ELSIF/ELSE`, `CASE` (comma lists and `a..b` ranges, labels must not overlap), `RETURN`, `FOR ... BY`, `WHILE`, `REPEAT ... UNTIL`, `EXIT`, `CONTINUE`. FOR start, end and step are evaluated once before the loop. (ALP UM §12.4.2-12.4.8 pp.253-258)
- **ST-10** [DOC] A function can call another function using a positional argument list. (ALP UM §12.1.2 pp.242-243)
- **ST-11** [DOC] A function block instance is declared in `VAR` as `name : FBType;`. Call it with a formal call (`fb(In := x, Out => y);`, note `=>` for outputs) or by writing inputs, calling `fb();` and reading outputs. Inputs are writable from outside; outputs are read-only. (ALP UM §12.1.3 pp.243-244)
- **ST-12** [DOC] An FB instance cannot be declared in the body of a function. (ALP UM §12.1.3 p.244) This restriction is specific to ST **functions**; ST function blocks may instantiate other blocks (`ST-13`).
- **ST-13** [DOC] Inside an ST function block the maximum nesting of blocks is 8. (ALP UM §12.1.3 p.244) [UNVERIFIED] Whether system blocks (`SYS.*`) count toward the 8, and how depth is counted, is not stated.
- **ST-14** [DOC] ST function blocks do not support RETAIN variables. (ALP UM §12.1.3 p.244) [INFERRED] Functions hold no state by definition (ALP UM §1.2 p.5), so persistence is not applicable to them either. Persistence must be handled in the circuit; see `akytec-persistence.md`.
- **ST-15** [DOC] ST functions and ST function blocks reserve ROM once they are in the project library, whether or not they are used. (ALP UM §4.12 p.79; §12.1.3 p.244)
- **ST-16** [DOC] ST arrays: one-dimensional; index bounds non-negative integers; the first index must be below the last; at most 32768 elements; element types BOOL, UDINT, REAL, TIME, DT (the manual text writes "FLOAT" for REAL, which is [UNVERIFIED] wording); the initializer count must equal the element count; initializers are written in square brackets; repeat-count initializers and multi-index assignment are unsupported. (ALP UM §12.3.2 pp.248-250) A function may return an array. Arrays may be declared in `VAR`/`VAR_INPUT` of functions and `VAR`/`VAR_INPUT`/`VAR_OUTPUT` of function blocks.
- **ST-17** [DOC] Name resolution: bare `ABS`, `POW`, `SHL`, `SHR`, `DC32`, `CD32`, `GET_TIME`, `GET_DATE_TIME` and the converters above; `SYS.`-prefixed functions `SYS.MIN`, `SYS.MAX`, `SYS.FMIN`, `SYS.FMAX`, `SYS.SQRT`, `SYS.EXP`, `SYS.FACT`, `SYS.LOG`, `SYS.LG`, `SYS.LN`, `SYS.SIN`, `SYS.COS`, `SYS.TAN`, `SYS.ASIN`, `SYS.ACOS`, `SYS.ATAN`, `SYS.IS_LEAP_YEAR`, `SYS.COMPARE_DATE_TIME`; constants `CONST.PI`, `CONST.E`, `CONST.POS_INF`, `CONST.NEG_INF`. MIN/MAX take UDINT, FMIN/FMAX take REAL. (ALP UM §12.3.1 pp.247-248; §12.5 pp.258-265)
- **ST-18** [DOC] System function blocks are `SYS.RS`, `SYS.SR`, `SYS.RTRIG`, `SYS.FTRIG`, `SYS.DTRIG`, `SYS.TP`, `SYS.TON`, `SYS.TOF`, `SYS.CLOCK`, `SYS.CLOCKWEEK`, `SYS.BLINK`, `SYS.CT`, `SYS.CTN`, `SYS.CTU`. Instantiate in `VAR` and call like user blocks. Time inputs are TIME (`T#1000ms`); a UDINT in milliseconds is converted with `UDINT_TO_TIME`. (ALP UM §12.6 pp.265-279)
- **ST-19** [DOC] `GET_TIME()` returns a 4-byte TIME in milliseconds since the device was last switched on. `GET_DATE_TIME()` returns a 4-byte DT (seconds since 2000-01-01) with the device time zone applied. (ALP UM §12.5.1 p.258) [INFERRED] A 4-byte millisecond counter wraps after about 49 days (the TIME range tops out at 49d17h02m47s295ms, ALP UM §12.3 p.246); wrap-safe elapsed-time logic is the user's responsibility.
- **ST-20** [DOC] Comments: `//` and `(* ... *)`. Documentation tags use `///` above declarations. (ALP UM §12.1.4 p.244; §12.2 p.245)
- **ST-21** [DOC] ST functions and function blocks export to `*.fst` and `*.fbst`. The ST editor has its own simulator; it shows values and allows forcing. (ALP UM §4.12 p.83; §4.13 p.87; §4.5.2 pp.56-58) Simulation is not a compile result and not hardware proof.
- **ST-22** [DOC] `SYS.LN` and the other logarithms are listed only with the `SYS.` prefix. (ALP UM §12.3.1 p.247; §12.5.3 p.263) [LOCAL OBSERVATION / NOT INDEPENDENTLY VERIFIED] A project reported a compile failure with an unprefixed `LN`; the compiler message was not retained.
- **ST-23** [LOCAL OBSERVATION / NOT INDEPENDENTLY VERIFIED] A project reported that ST function blocks written locally could not be placed inside the Macro Editor. The macro chapter (ALP UM §4.11 pp.70-79) does not mention ST blocks either way, so this is [UNVERIFIED].
- **ST-24** [UNVERIFIED] The manual calls the FOR iterator "a signed integer type (UDINT)" (ALP UM §12.4.6 p.256), which is self-contradictory. Use UDINT iterators and avoid loops that count below zero.
- **ST-25** [UNVERIFIED] No iteration cap, watchdog or cycle-overrun behavior is documented for long `WHILE`/`REPEAT`/`FOR` loops. Keep loops bounded by construction.
- **ST-26** [DOC] `SYS.RS`: R has priority when both inputs are set. `SYS.SR`: S has priority. (ALP UM §12.6.1.1-12.6.1.2 pp.266-267) [UNVERIFIED] The surrounding descriptions are loosely worded, and the exact pulse definition of `SYS.FTRIG`, the boundary behavior of `SYS.TON`, and the counter input names (the `SYS.CTU` table lists `U` while its sample uses `C`, ALP UM p.279) should be confirmed in the ALP editor hint before relying on them.
- **ST-27** [UNVERIFIED] Whether the ST dialect and the system blocks behave identically on first-generation devices, PR103, PR225 and PR205 is not stated beyond ENV-13. Do not carry code between generations without a compile on the target device.

## Open Items (Do Not Answer as Facts)

- Non-volatile write endurance, commit timing and power-loss behavior of ALP persistent variables.
- Variable initial values on the first cycle after a program upload.
- Whether PR205 local outputs expose physical feedback.
- Exact `SYS.*` counting rule for the nesting limit of 8.
- Behavior of long loops against the automatic cycle adjustment.
