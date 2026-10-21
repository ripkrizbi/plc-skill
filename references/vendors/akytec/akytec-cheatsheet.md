# akYtec ALP Cheatsheet

Dense lookup for ALP 3.1 ST (functions and function blocks). Labels and citations: see `akytec-overview.md`; rule detail: `akytec-rules.md`.
Every code block here is **UNCOMPILED** and was not checked in ALP.

## Available ST Types `[DOC]` (ALP UM §12.3 p.246)

| Type | Size | Notes |
| --- | --- | --- |
| BOOL | 4 bytes | FALSE / TRUE |
| UDINT | 4 bytes | 0 to 4294967295; the only integer type; the only type with bit access |
| REAL | 4 bytes | single precision |
| TIME | 4 bytes | `T#1000ms`, `T#5s`, up to 49d17h02m47s295ms |
| DT | 4 bytes | `DT#2023-09-28-7:20:55`; seconds since 2000-01-01 |
| ARRAY | n/a | one-dimensional, see `ST-16` |

Reserved but **not** available (`[INFERRED]`, ALP UM §12.3.1 pp.247-248): INT, DINT, SINT, USINT, UINT, ULINT, LINT, LREAL, WORD, DWORD, LWORD, STRING, WSTRING.

## Declaration Skeletons `[DOC]` (ALP UM §12.1 pp.242-244; §4.12-4.13 pp.80, 85)

```st
(* UNCOMPILED - illustrative skeleton, not verified in ALP *)
FUNCTION rScaleSketch : REAL;
    VAR_INPUT
        rIn  : REAL;
        rGain : REAL;
    END_VAR

    rScaleSketch := rIn * rGain;
END_FUNCTION
```

```st
(* UNCOMPILED - illustrative skeleton, not verified in ALP *)
FUNCTION_BLOCK fbDelaySketch
    VAR_INPUT
        xIn : BOOL;
        udiDelayMs : UDINT;
    END_VAR
    VAR_OUTPUT
        xOut : BOOL;
    END_VAR
    VAR
        tonDelay : SYS.TON;
        tDelay : TIME;
    END_VAR

    tDelay := UDINT_TO_TIME(udiDelayMs);
    tonDelay(I := xIn, T := tDelay, Q => xOut);
END_FUNCTION_BLOCK
```

## Calling an Instance `[DOC]` (ALP UM §12.1.3 pp.243-244)

| Form | Syntax |
| --- | --- |
| Formal call | `inst(In := x, Out => y);` (outputs use `=>`) |
| Field access | `inst.In := x; inst(); y := inst.Out;` |
| Function call | `rResult := rFun1(rA, rB);` (positional) |

## Name Resolution `[DOC]` (ALP UM §12.3.1 pp.247-248; §12.5 pp.258-265)

| Bare | `SYS.` prefix | `CONST.` |
| --- | --- | --- |
| `ABS`, `POW`, `SHL`, `SHR`, `DC32`, `CD32`, `GET_TIME`, `GET_DATE_TIME`, `*_TO_*` converters | `MIN`, `MAX`, `FMIN`, `FMAX`, `SQRT`, `EXP`, `FACT`, `LOG`, `LG`, `LN`, `SIN`, `COS`, `TAN`, `ASIN`, `ACOS`, `ATAN`, `IS_LEAP_YEAR`, `COMPARE_DATE_TIME` | `PI`, `E`, `POS_INF`, `NEG_INF` |

System blocks, all `SYS.`-prefixed (ALP UM §12.6 pp.265-279): `RS`, `SR`, `RTRIG`, `FTRIG`, `DTRIG`, `TP`, `TON`, `TOF`, `CLOCK`, `CLOCKWEEK`, `BLINK`, `CT`, `CTN`, `CTU`.

## Converters `[DOC]` (ALP UM §12.4.1.3 pp.251-252)

`UDINT_TO_REAL`, `UDINT_TO_BOOL`, `UDINT_TO_TIME`, `UDINT_TO_DT`, `REAL_TO_UDINT`, `REAL_TO_BOOL`, `BOOL_TO_REAL`, `BOOL_TO_UDINT`, `TIME_TO_UDINT`, `DT_TO_UDINT`.
Any other `X_TO_Y` name is not documented. No implicit conversion exists.

## Operators `[DOC]` (ALP UM §12.4.1 pp.251-253)

| Group | Operators | Operand types |
| --- | --- | --- |
| Arithmetic | `+ - * /` `MOD` | UDINT / REAL |
| REAL only | `ABS(x)` `POW(x, n)` | REAL |
| Shift | `SHL(x, n)` `SHR(x, n)`, n = 1..32 | UDINT |
| Decode / encode | `DC32(x)` `CD32(x)` | UDINT |
| Logic | `NOT` `AND` `&` `OR` `XOR` | BOOL |
| Relational | `> >= = <= < <>` | UDINT / REAL, result BOOL |

Bit access: `udiWord.5 := TRUE;` with a literal 0..31 only (`ST-07`).

## Statements `[DOC]` (ALP UM §12.4.2-12.4.8 pp.253-258)

`:=`, `IF / ELSIF / ELSE / END_IF`, `CASE ... OF ... END_CASE` (`1..3`, `4, 6`, `ELSE`), `RETURN`, `FOR i := a TO b BY s DO ... END_FOR`, `WHILE ... DO ... END_WHILE`, `REPEAT ... UNTIL ... END_REPEAT`, `EXIT`, `CONTINUE`.

## Limits at a Glance

| Limit | Value | Applies to | Source |
| --- | --- | --- | --- |
| ST FB nesting | 8 | ST function blocks | ALP UM §12.1.3 p.244 |
| ST array size | 32768 | ST | ALP UM §12.3.2 p.249 |
| Circuit array size | 256 | Variable table | ALP UM §6 p.122 |
| Master group request (2nd gen) | 16 registers | Modbus master | ALP UM §5.3.2 p.97 |
| Master group request (1st gen) | 48 registers | Modbus master | ALP UM §5.3.2 p.97 |
| Master slaves (2nd gen) | 32 | Modbus master | ALP UM §5.3.2 p.97 |
| Master variables (2nd gen) | 192 (64 on older versions) | Modbus master | ALP UM §5.3.2 p.97 |
| Slave TCP clients (2nd gen) | 4 | Modbus slave | ALP UM §5.3.2 p.98-99 |
| Slave user register range | 16384 to 20479 | Modbus slave | ALP UM §5.3.2.2 p.112 |
| PR205 retain memory | 1024 bytes | device | PR205 UG Table 3.2 p.9 |

## Timer Pattern From UDINT Milliseconds `[DOC]` (ALP UM §12.6.2 pp.270-273)

Convert with `UDINT_TO_TIME` into a `TIME` local, then pass the local to the `T` input (see the function-block skeleton above).
