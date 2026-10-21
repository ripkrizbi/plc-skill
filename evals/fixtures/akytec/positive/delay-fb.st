(* UNCOMPILED - positive lint sample *)
FUNCTION_BLOCK fbDelayFixture
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
