# akYtec ALP Pitfalls and Pro Tips

Non-obvious traps when writing or reviewing ALP ST. Labels and citations: see `akytec-overview.md`; rule detail: `akytec-rules.md`.
The "wrong" snippets below are fenced as `text` on purpose: they are examples of what **not** to emit for ALP. They are not ALP code.

## Cross-Vendor Contamination: Translate, Do Not Paste

When a request carries CODESYS, Siemens, Rockwell, Mitsubishi or generic IEC habits, warn and translate. Each row is a regression target for `evals/akytec-cases.md`.

| Habit from elsewhere | Why it fails or is unsafe for ALP | ALP-side approach | Rules |
| --- | --- | --- | --- |
| `VAR_GLOBAL RETAIN` or `RETAIN` on a local | `VAR_GLOBAL` and `RETAIN` are not available in ALP ST; ST FBs have no RETAIN | Variable table Persistence in the circuit | `ST-05`, `ST-14`, `PS-11` |
| `INT`, `DINT`, `UINT`, `WORD`, `STRING` | Not available ST types | UDINT / REAL / BOOL; explicit converters | `ST-03`, `ST-04` |
| `TON`, `TOF`, `TP`, `CTU` instantiated bare | System blocks are `SYS.`-prefixed | `SYS.TON`, `SYS.TOF`, `SYS.TP`, `SYS.CTU` | `ST-18` |
| `LN(x)`, `SQRT(x)`, `SIN(x)`, `MAX(a, b)` | These live under `SYS.` | `SYS.LN`, `SYS.SQRT`, `SYS.SIN`, `SYS.MAX` | `ST-17`, `ST-22` |
| `R_TRIG` / `F_TRIG` | Edge blocks are `SYS.RTRIG` / `SYS.FTRIG` | use the `SYS.` names | `ST-18` |
| `PROGRAM`, `METHOD`, `PROPERTY`, `INTERFACE`, `EXTENDS` | No ST programs or OOP | circuit program plus ST functions / FBs | `ST-01` |
| `STRUCT` / `TYPE`, `POINTER TO`, `REFERENCE TO` | Not available | flat variables, arrays | `ST-05` |
| `VAR_IN_OUT` (pass by reference) | Not available | `VAR_INPUT` plus `VAR_OUTPUT` copy-in / copy-out | `ST-05` |
| Siemens `#local`, `"DB".tag`, `%I0.0`, `%Q0.0` | Direct addressing does not exist in ALP ST | circuit variables and network variables | `ENV-04` |
| Mitsubishi `X0`, `Y0`, `D100`, `M0` | No device memory addressing | Variable table | `ENV-04` |
| Rockwell `TON.DN`, `.PRE`, `.ACC`, `ONS()` | Different instruction model | `SYS.TON` output `Q`, `SYS.RTRIG` | `ST-18` |
| FB instance inside a FUNCTION | Forbidden | move the logic to a function block | `ST-12` |
| Assigning a REAL to a UDINT (or BOOL) variable directly | No implicit conversion | `REAL_TO_UDINT(...)` | `ST-06` |
| Variable bit index `w.i` | Bit index must be a literal | shift / mask with `SHL`, `SHR` and compare | `ST-07` |
| `ARRAY[-1..3]`, `ARRAY[1..1]`, repeat initializer `[7(2)]` | Unsupported array forms | non-negative bounds, first below last, full initializer | `ST-16` |
| Assuming the integer type is signed | The integer type is unsigned, so a subtraction below zero cannot go negative | guard before subtracting | `ENV-02` |

Examples of habits that must be rewritten (not ALP):

```text
VAR_GLOBAL RETAIN
    iCounter : INT;
END_VAR
tonDelay : TON;
rLog := LN(rValue);
```

## Generation Traps

1. **Calling code "compiled".** Nothing in this module is compiler-verified. Say so, and ask the user to compile in ALP before any upload.
2. **Writing a persistent latch inside an ST function block.** It will not retain. Use a Persistence-enabled circuit variable passed through the block (`akytec-persistence.md`).
3. **Assuming the 8-level nesting limit is the only structural limit.** Memory (ROM) and the cycle time also grow with each reusable block (`ST-15`, `ENV-05`).
4. **Assuming a PR205 output variable is feedback.** It is the command image (`ENV-09`).
5. **Importing a number from another generation.** The master group size is 16 on second generation and 48 on first (`MB-01`, `MB-02`).
6. **Reading a per-request Modbus error code on PR205.** Second-generation devices report device-level status only (`MB-15`).
7. **Trusting the UDINT millisecond clock forever.** `GET_TIME()` wraps after about 49 days (`ST-19`).
8. **Using unbounded loops.** No loop cap is documented (`ST-25`).

## Review Checklist for ALP ST

- Only BOOL, UDINT, REAL, TIME, DT and ARRAY used?
- Only `VAR_INPUT`, `VAR_OUTPUT`, `VAR` declared?
- No FB instance inside any `FUNCTION`?
- `SYS.` prefixes present on system blocks and non-bare functions?
- Every type mix goes through a documented converter?
- Bit indexes are literals 0..31 on UDINT only?
- No `RETAIN` anywhere; persistence handled in the circuit?
- Output to hardware has one writer; hardware effect is not read back from the command image?
- Example labelled UNCOMPILED unless the user supplied a compile result?

## Pro Tips

- `[INFERRED]` Put sequencing logic into one ST function block with a state `UDINT` and a `CASE`; keep I/O, persistence and Modbus bindings in the circuit.
- `[INFERRED]` Convert once: keep time arithmetic in UDINT milliseconds and convert to TIME at the block boundary.
- `[DOC]` Use the ST simulator to exercise a block, then compile and bench it; simulation is not target proof (ALP UM §4.5 p.52).
- `[DOC]` Keep a known-good project backup before every upload; an upload replaces the stored program and starts it (ALP UM §4.7 pp.61-62).
