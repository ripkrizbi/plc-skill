# MU210 Output-Mask Write Note (Slave-Side Facts)

Focused note for agents asked to write the digital-output group mask of an akYtec **MU210-402** from an ALP master (for example PR205).
These are facts about the **slave**, cited to the MU210 manual (MU210 UG = `UG_MU210-402_3-EN-47647-2.2`, printed page numbers; PDF page = printed + 1). They are separate from ALP master behavior (`akytec-modbus-and-network.md`).
Labels: see `akytec-overview.md`. This note describes documentation only. It never authorizes a command to live hardware; every bench gate below is the user's to execute.

## Rules

- **MU-01** [DOC] The group parameter "New output bitmask" (write) is at hex 0x01D6 / decimal 470, access read-write, data type **UINT32**, value range 0 to 65535. (MU210 UG Appendix D Table D.1 p.30)
- **MU-02** [DOC] The group parameter "Output bitmask" (state) is at hex 0x01D4 / decimal 468, read-only, **UINT32**. (MU210 UG Appendix D Table D.1 p.30)
- **MU-03** [DOC] UINT32 occupies **two 16-bit Modbus registers** (4 bytes). (MU210 UG Appendix D Table D.2 p.31) Therefore the full mask is a **two-register** parameter, not a one-register parameter.
- **MU-04** [DOC] The least significant bit of the mask corresponds to output DO1; to change an output, set the matching bit in "New output bitmask". (MU210 UG §4.7 p.13) [INFERRED] The 0 to 65535 range means only the 16 low-order bits map to the 16 outputs; the other 16 bits of the UINT32 carry no output.
- **MU-05** [DOC] Function 16 (Write Multiple Registers) is supported for 1 to 123 registers; function 06 writes a single holding register. (MU210 UG Appendix D Table D.3 p.31) A function-16 request whose data size is smaller than the size of the first or last parameter in the request is answered with exception 03. (Table D.5 p.32)
- **MU-06** [INFERRED] A whole-mask write from a master is therefore **function 16 with quantity 2 starting at the New output bitmask address**. Agents must never propose function 06, or any one-register write, as the whole-mask write. Basis: MU-01, MU-03 and the size rule in MU-05. What function 06 does to a UINT32 parameter is [UNVERIFIED] and is not a supported suggestion.
- **MU-07** [INFERRED] On a second-generation ALP master, an integer variable can occupy 1 or 2 registers (ALP UM §5.3.2.1 p.109) and function 0x10 is a supported master function (ALP UM §5.3.2 table p.97). A two-register write is within the 16-register group cap (`MB-01`, `MB-07`). [UNVERIFIED] Which function code ALP actually puts on the wire for a two-register write variable (0x10 or 0x06) is not stated; confirm with a capture.
- **MU-08** [UNVERIFIED] The MU210 manual does not state the **word order** of a UINT32 (which register holds the high word), and ALP exposes byte and register order settings for master variables (ALP UM §5.3.2.1 pp.104, 108). Treat word order as a bench gate.
- **MU-09** [UNVERIFIED] **Address base convention.** Whether 0x01D6 / 470 is the on-the-wire zero-based offset or needs a +1 shift depends on how ALP's "Register" field is defined. The ALP manual shows no worked example for it; confirm against a capture.
- **MU-10** [UNVERIFIED] **Replace versus set.** The manual says to set the bit in "New output bitmask" to change an output. It does not say whether the written value replaces the whole output state (bits written 0 switch outputs off) or only sets bits, nor whether the update is atomic across all 16 outputs.
- **MU-11** [UNVERIFIED] The MU210 manual contradicts itself on safe state: the text says safe state has no effect in on-off mode (MU210 UG §4.7.1 p.13), while Table D.1 lists a per-output safe-state parameter with values off/on (p.30). Do not rely on the output state after communication loss without a bench check.

## Bench Gates (documentation only; the user executes them, on a bench device, never on live equipment)

1. Capture the wire frame for a PR205 two-register write: confirm function code 16, quantity 2, byte count 4.
2. Confirm address base: the frame's start address for 0x01D6 / 470.
3. Confirm word order with a value that has only a high-word bit and one that has only a low-word bit set (for example one bit in the 16-bit range, compared with the same value placed in the other word).
4. Confirm replace-versus-set semantics by writing a mask that clears a previously set bit.
5. Confirm read-back of "Output bitmask" (0x01D4) after a write, and its freshness; this is the slave's report, not independent electrical proof.
6. Confirm behavior on communication loss with the configured safe-state settings.

Until each gate is recorded with evidence, keep the corresponding behavior `[UNVERIFIED]`.
