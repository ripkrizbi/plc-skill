# akYtec ALP Visualization Reference (Graphic Color LCD)

Load this file only for display/HMI questions on ALP devices with a **graphic color LCD** (primary target: PR205; the manual groups PR225 with it).
Labels and citation shorthand: see `akytec-overview.md`. Rule detail for the shared environment: `akytec-rules.md`.
The monochrome text LCD path (ALP UM §4.4.1, §7.6) is a different editor and is **not** covered here.

Bench protocols that turn the open items below into evidence are in `references/vendors/akytec/bench/README.md`.
**No bench protocol has been executed.** Every bench-derived expectation is `[UNVERIFIED]`.

## Resources: ROM Versus RAM

- **VZ-01** [DOC] On graphic-color-LCD devices the status bar has three separate visualization indicators: **System Visualization ROM** (available visualization ROM of the device, in percent), **User Visualization ROM** (available visualization ROM for bitmap images), and **Visualization RAM** (available visualization RAM, in percent, calculated for the **most heavily loaded screen**). Hovering shows absolute amounts. (ALP UM §3.7 pp.19-20)
- **VZ-02** [DOC] If any indicator overflows, writing the program to the device is disabled. ALP also warns when a resource reaches a critical value. (ALP UM §3.7 p.19-20)
- **VZ-03** [INFERRED] Visualization RAM is not summed over screens: the indicator tracks the heaviest screen. Basis: the "most heavily loaded screen" wording (p.20). Whether inactive screens consume any other resource is [UNVERIFIED].
- **VZ-04** [DOC] The manual publishes a per-element **Visualization RAM** cost table. Anchor values used by the bench protocols: empty screen 252 bytes; each physical-button entry is 80 bytes plus 20 per bound variable plus 10 per action plus a 10-byte reserve; a Text element 464 bytes; an INT/REAL input/output element 776 bytes; a variable binding adds 20 bytes; a visibility binding adds 20 bytes; enabling editing on an INT/REAL element adds 24 bytes; larger size and thicker frames increase the cost of several elements, with the frame effect capped at 2 px. (ALP UM §7.7 pp.176-181) Read the full table in the manual; it is not reproduced here.
- **VZ-05** [DOC] An Image element costs a small amount of RAM, and **user visualization flash** of width x height x 2 bytes (pixels of the original loaded image); reusing the same image in several elements adds no further flash. (ALP UM §7.7 pp.179-180) [INFERRED] This flash figure is what the **User Visualization ROM** indicator tracks, since that indicator is described as ROM for bitmap images (p.20). The mapping is not stated outright.
- **VZ-06** [DOC] Supported image files: JPG/JPEG/JPE and BMP; maximum size is limited by the device screen resolution; images may be scaled down in the editor. (ALP UM §7.7.14 p.205) The PR205 screen is 320 x 240 px. (PR205 UG Table 3.3 p.10)
- **VZ-07** [UNVERIFIED] What consumes **System Visualization ROM** (versus User Visualization ROM) and what its absolute size is on a PR205. The ALP manual defines the indicators but not the allocation; the PR205 guide lists total ROM 64 kB and RAM 320 kB (PR205 UG Table 3.2 p.9) without a visualization split.
- **VZ-08** [UNVERIFIED] Whether the visualization indicators appear when ALP is **offline** (no connected device). The manual lists the status-bar content "if the device is connected" (ALP UM §3.7 p.19). Bench gate `EXP-03`.
- **VZ-09** [UNVERIFIED] How exactly the published per-element costs match what the ALP indicator reports, and the percentage granularity of the indicator.
- **VZ-10** [DOC] A large number of data controls through the display increases the device cycle time. (ALP UM §8.2 p.214)

## Screens, Navigation and Structure

- **VZ-11** [DOC] The Display Manager holds screens in groups. Group 1 can be edited but not deleted; a fixed Loading screen sits in System screens and cannot be edited or deleted; Form 1 exists by default. (ALP UM §4.4 p.39)
- **VZ-12** [DOC] At boot the first screen of Group 1 is shown. A custom loading image (JPG/BMP) can be set; the default is a pre-installed image. Jumps to the Loading screen are not available. (ALP UM §4.4.2 pp.48-51)
- **VZ-13** [DOC] A screen-to-screen jump is triggered by a **change of a Boolean variable**; after the jump the bound variable is set back to 0. Jumps run in the order listed in the screen properties. (ALP UM §4.4.2 p.50)
- **VZ-14** [DOC] Physical buttons are programmed per screen: short press (under 3 s), long press (3 s or more), hold (5 s or more). Short and long presses may carry several handlers (jumps, Boolean changes); hold may only change Boolean variables. Handlers run in the order added. Without user actions, Up and Down move through screens in manager order. (ALP UM §4.4.2 pp.50-51)
- **VZ-15** [DOC] Editable elements are selected with the SEL button in the order of the "Screen components" list, bottom to top. (ALP UM §7.7 p.175)
- **VZ-16** [DOC] PR205 front-panel behavior: navigation, edit mode entry, applying a value and moving to the next parameter, exit with or without saving. Display elements may be editable or not depending on type and properties. (PR205 UG Table 7.1 p.60; §7.2-7.3 p.63)
- **VZ-17** [DOC] A Menu element lists project screens (maximum 128 lines); every screen except the current one can be a target; at most one element per screen may be "focused by default". (ALP UM §7.7.15 pp.207-208)

## Variable Binding and Editing

- **VZ-18** [DOC] Double-clicking an element opens its variable binding window. A variable bound to a visualization element is "in use" and takes memory; unbound, unreferenced variables do not. (ALP UM §4.4.2 p.47; §6 p.120)
- **VZ-19** [DOC] Binding types: Indicator takes a Boolean; Progress bar takes INT or REAL; INT/REAL input/output takes INT or REAL; Time input/output takes an integer holding seconds since 2000-01-01; Dynamic box takes INT (up to 128 rows) or BOOL (two rows); Switch and Button take a Boolean; Switch group takes an integer (list up to 32 lines); Chart takes up to four INT or REAL variables. (ALP UM §7.7.2-7.7.16 pp.182-212)
- **VZ-20** [DOC] Where "Disable editing" is No, entering a value on the device overwrites the bound variable; where Yes, the element is view-only. (ALP UM §7.7.4-7.7.6 pp.186, 188, 193; §7.7.12 p.201)
- **VZ-21** [DOC] An Indicator with no variable bound always shows its "True" color. (ALP UM §7.7.2 p.183)
- **VZ-22** [DOC] Visibility of any element can be bound to a Boolean variable (adds RAM, see VZ-04). (ALP UM §7.7.1-7.7.16 pp.182-212)
- **VZ-23** [DOC] An INT/REAL element shows the current value with a red frame when the value is outside its Minimum/Maximum. Decimal places and the min/max range are linked by the limit 2147483647 / 10^n (and -2147483648 / 10^n). (ALP UM §7.7.5 pp.187-190)
- **VZ-24** [DOC] The Chart polling period is derived automatically (not below 1 s), the X-axis maximum is up to 23:59:59, the "Run in background" option affects data kept when switching screens, and the Chart is not supported in simulation. (ALP UM §7.7.16 pp.208-212; §4.5.1 p.55)

## Write at the End of Cycle and Ownership

- **VZ-25** [DOC] For an **output** variable block bound to a device parameter or a visualization element, "Write at the end of cycle" writes the value after all read operations of the cycle. Default: No for non-persistent, Yes for persistent variables, re-defaulted whenever the binding or the Persistence flag changes. (ALP UM §4.3.2 pp.31-32) (Same rule as `PS-06`.)
- **VZ-26** [DOC] The manual's examples recommend "No" where the variable must be seen with its canvas-initialized value in the first cycle, and "Yes" where two screen-bound variables are synchronized by a circuit and a cyclic dependency would otherwise stop the screen from changing one of them. (ALP UM §4.3.2 pp.32-34)
- **VZ-27** [UNVERIFIED] The first-cycle initial values for the four combinations of Persistence on/off and Write at the end of cycle yes/no are given in the manual as **figures**; the text readings are `[INFERRED]` only. Bench gate `EXP-01`.
- **VZ-28** [UNVERIFIED] Which writer wins when an operator edit, a circuit output block, a parameter binding and a network write target the same variable in one cycle. The manual describes the parameter-binding case (value lives one cycle, `PS-07`) but gives no general arbitration rule. Bench gate `EXP-06`.
- **VZ-29** [INFERRED] Design rule until VZ-28 is resolved: give every variable exactly one program writer, and let the operator write a separate *request* variable that the circuit arbitrates. Basis: undocumented arbitration (VZ-28) and the manual's own cyclic-dependency example (VZ-26).
- **VZ-30** [DOC] A persistent variable bound to a visualization element or a device parameter is stored in the **system EEPROM**; an unbound persistent standard variable is stored in the **EEPROM**; the status bar shows both. (ALP UM §6 p.123; §3.7 p.19) See `akytec-persistence.md`.

## Simulation and Debugging

- **VZ-31** [DOC] In simulator mode, devices with a graphic color LCD get a display window and button simulation (keys Q W E A S D Z X C). Editable in simulation: Dynamic text, INT/FLOAT I/O, Time I/O, IP I/O. Button hold is not available in step-by-step simulation. The Chart is not supported. (ALP UM §4.5.1 pp.55-56)
- **VZ-32** [DOC] The simulator cycle time is arbitrary and differs from the real device. (ALP UM §4.5 p.52)
- **VZ-33** [UNVERIFIED] The manual says "Simulation will not work for volatile variables or variables that are linked incorrectly" (ALP UM §4.5 p.53). "Volatile" may be a typo for "non-volatile" or may be literal; bench gate `EXP-01`.
- **VZ-34** [DOC] Online debugging applies to the circuit program only (not to display forms or ST code), needs identical program and firmware in device and project, and a value set without "Fix the values" lasts one cycle. (ALP UM §4.8 pp.62-65)
- **VZ-35** [DOC] Uploading replaces the stored program and the device then starts it automatically. (ALP UM §4.7 pp.61-62) Bench work uses a standalone device with no field wiring; never the plant controller.

## Open Items (Do Not Answer as Facts)

- Absolute visualization RAM / System Visualization ROM / User Visualization ROM capacity of a PR205, and the indicator granularity.
- Whether visualization indicators exist offline.
- Whether inactive screens cost RAM or ROM beyond the heaviest screen.
- Exact first-cycle values per Persistence x Write-at-end combination.
- Variable arbitration between operator, circuit, parameter binding and network.
- Whether a Boolean bound to a jump or Indicator behaves identically in simulator and on the device.
- Whether the same costs apply on PR225 (not assumed).
