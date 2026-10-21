# akYtec ALP Modbus and Network Reference

Load this file only for Modbus, network-variable, polling or group-request questions on ALP devices.
Labels and citation shorthand: see `akytec-overview.md`. Primary target: second-generation devices, especially PR205.
Never carry first-generation numbers over to a second-generation device, or the reverse; both are shown where the manual shows both.

## Group Request Size: What Is Actually Limited

Question: does "up to 16 registers" apply to master requests, to slave registers, or both, and does it limit FC16 writes?

- **MB-01** [DOC] Second-generation master (PR205, PR225, PR103): group queries combine up to **16 registers per request**; the per-device setting "number of registers in request" accepts 2 to 16. Group queries need ALP 2.10 or later and PR205 firmware 1.9.0 or later. (ALP UM §5.3.2 table p.97; §5.3.2.1 pp.103, 108)
- **MB-02** [DOC] First-generation master (PR100, PR102, PR200, SMI200): up to **48 registers per request**, setting range 2 to 48. (ALP UM §5.3.2 table p.97; pp.103-104)
- **MB-03** [DOC] The 16 / 48 figures describe requests that the **ALP master builds and sends**. They are not a statement about how many registers a slave holds. (ALP UM §5.3.2.1 p.103)
- **MB-04** [DOC] Slave side of a second-generation device: group queries from an external master are listed as supported "without artificial limitations", and the slave exposes 1020 registers (2040 bytes) of memory. (ALP UM §5.3.2 table p.98; PR205 UG §3.1 Table 3.2 p.9) The manual gives no separate per-request size cap for the second-generation slave. [UNVERIFIED] The exact maximum accepted request length is not stated.
- **MB-05** [DOC] First-generation slave: 64 registers of memory and group polling of up to 64 registers. (ALP UM §5.3.2 table p.98; §5.3.2.2 p.109) The same table also says "without artificial limitations", so the two statements are not fully consistent for first-generation slaves [UNVERIFIED].
- **MB-06** [DOC] A group request is formed only from variables that are strictly consecutive in the register map with no gaps, use the same function code, the same trigger type (periodic, on command, on change) and compatible sizes. Function codes 0x05 and 0x06 are never grouped. (ALP UM §5.3.2.1 p.103)
- **MB-07** [INFERRED] The grouping rule names "read/write function codes", so write functions (0x0F, 0x10) are grouped under the same rules and the same 16-register cap on a second-generation master. Basis: p.103 rule 2 and the master function list on p.97. The manual has no separate statement for write group size. A write block longer than 16 registers must be split into several requests. The cap counts registers, not parameters: a parameter that is 32 bits wide (UINT32 or REAL) occupies two registers (ALP UM §5.3.2.1 p.109), and two registers are well inside the cap.
- **MB-08** [DOC] A slave's own accepted request length is defined by that slave's manual and is independent of the ALP master cap. Example from a different manual: the MU210 user guide gives 1 to 123 registers for Write Multiple Registers (function 16) and lists function 16 as supported. Slave-specific parameter facts belong in a separate, slave-cited note; see `akytec-mu210-modbus-note.md`. (MU210 user guide `UG_MU210-402_3-EN-47647-2.2`, Appendix D Table D.3 p.31 and Table D.5 p.32.) That is a separate device; do not transfer its limit to other slaves.
- **MB-09** [INFERRED] The effective maximum write length from a second-generation ALP master is the smaller of the ALP master cap (16 registers) and the slave's own limit. Always count the **registers** a parameter occupies, not the number of parameters; do not describe a 32-bit parameter as a single register.
- **MB-10** [DOC] Network device templates moved from first to second generation clamp the group size to 16 (a stored value above 16 becomes 16). (ALP UM §5.3.2.3 pp.113-114)

## Master (Polling) Rules

- **MB-11** [DOC] Second-generation master protocols: Modbus RTU, ASCII and TCP. At most 32 slaves across all interfaces. At most 192 variables (requests) with ALP 2.7.349 or later and firmware PR205 1.5.0 / PR103 1.7.0 or later; 64 with earlier versions. Each variable is **either** a read request **or** a write request. First generation: 16 slaves per interface, 255 variables, and one variable may carry both read and write. (ALP UM §5.3.2 table p.97)
- **MB-12** [DOC] Second-generation master functions: 0x01, 0x02, 0x03, 0x04, 0x06, 0x0F, 0x10 (no 0x05). First generation adds 0x05. Data types: BOOL, UINT16, UINT32, REAL. Broadcast is not supported. (ALP UM §5.3.2 table p.97)
- **MB-13** [DOC] Master over Modbus TCP: slaves are polled sequentially; only one client connection is active at a time; requests inside a connection are sent sequentially; Unit ID range 1 to 247. (ALP UM §5.3.2 table p.98)
- **MB-14** [DOC] Per-slave settings (second generation): response time-out 10 to 10,000 ms, retries 0 to 3, a Boolean status variable (1 = communication fine, 0 = lost) and a Boolean start-query variable (0 = polling disabled, 1 = enabled). First generation uses different ranges (time-out 0 to 65535 ms, retries 0 to 255). (ALP UM §5.3.2.1 pp.104, 107-108)
- **MB-15** [DOC] Second generation reports communication health at device level only. A per-request Modbus error code exists only on first-generation devices. (ALP UM §5.3.2 table p.98; p.106) Do not design logic that reads a per-request error code on PR205.
- **MB-16** [DOC] Request timing control (second generation): per request, by period, by a command edge, and optionally write-on-change. A command variable returns to 0 after the request completes. (ALP UM §5.3.2.1 pp.106-109)
- **MB-17** [DOC] A silent slave slows the whole poll in proportion to its time-out. The manual recommends disabling polling of unreachable slaves in the program or lowering their time-out; if the queue cannot finish within the query cycle, the cycle setting is ignored. (ALP UM §5.3.2.1 p.103; §5.3.2 p.101)
- **MB-18** [DOC] Requests are served in the part of the cycle left after the program runs; the manual states a minimum of about 50 master calls per second and gives an ideal-line example of roughly 83 two-register requests per second at 115200 bps. Real throughput falls as the program grows. (ALP UM §5.3.2 pp.101-102)
- **MB-19** [DOC] Bit addressing for BOOL master variables: register = bit number divided by 16 (integer part), bit = remainder. (ALP UM §5.3.2 p.102)
- **MB-20** [DOC] Only one master may be active on a communication line. (ALP UM §5.3.2 p.99)

## Slave (Server) Rules for PR205-Class Devices

- **MB-21** [DOC] Second-generation slave: RTU, ASCII (auto-detected, reply in the request format) and TCP; memory 1020 registers; functions 0x03, 0x04, 0x06, 0x0F, 0x10, 0x14, 0x15. Coil and discrete-input functions (0x01, 0x02, 0x05) are not in the second-generation slave list. (ALP UM §5.3.2 table p.98)
- **MB-22** [DOC] Slave over TCP: up to 4 simultaneous client connections; a fifth is independent and reserved for akYtec Cloud. The Unit ID in a request is **not validated**. Broadcast is not supported. (ALP UM §5.3.2 table pp.98-99)
- **MB-23** [DOC] User-defined slave network variables use register addresses 16384 to 20479, are 16-bit integer, 32-bit integer or REAL, and BOOL is not exposed (read bits through an integer variable and an extract block or macro). (ALP UM §5.3.2.2 p.112; §5.3.2 table p.100)
- **MB-24** [DOC] Slave word and byte order for user variables is fixed: most significant byte first, least significant register first. It is not configurable on second-generation slaves. (ALP UM §5.3.2 p.100-101; table p.98)
- **MB-25** [DOC] Input and holding registers overlay one common memory area. Standard Modbus exceptions 01, 02 and 03 are the documented error codes. (ALP UM §5.3.2 pp.98-99)
- **MB-26** [DOC] Changing the device IP address requires a reboot and the PC loses the connection. (ALP UM §5.3.1.2 p.93)
- **MB-27** [DOC] PR205 network-variable memory: 2040 bytes in slave mode, 384 bytes in master mode. (PR205 UG §3.1 Table 3.2 p.9)

## Design Guidance (all [INFERRED], UNCOMPILED patterns)

- Budget requests against the 192-variable limit and the per-slave time-outs before adding polled values.
- Keep one writer per output word. Prefer one consecutive register block per slave so a periodic write fits a single group request.
- Combine "write on change" with a periodic refresh only if the slave manual says an unchanged write is harmless.
- Use the per-slave status variable and a time-based supervisor in the circuit; do not rely on a per-request error code on second-generation devices.

## Open Questions

- [UNVERIFIED] Maximum request length accepted by the second-generation ALP slave.
- [UNVERIFIED] Behavior when a master write group is interrupted by a time-out part way through a multi-register request.
- [UNVERIFIED] Whether write-on-change fires once or repeats after a failed attempt.
- [UNVERIFIED] Whether a retry re-sends a stale value after the source variable changed.
- [UNVERIFIED] Latency between a network write and visibility to the program within the cycle.
