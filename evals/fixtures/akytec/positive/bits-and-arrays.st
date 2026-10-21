(* UNCOMPILED - positive lint sample *)
FUNCTION_BLOCK fbBitsFixture
    VAR_INPUT
        udiWord : UDINT;
    END_VAR
    VAR_OUTPUT
        xBit3 : BOOL;
    END_VAR
    VAR
        audiTable : ARRAY[0..3] OF UDINT := [1, 2, 3, 4];
        udiMasked : UDINT;
    END_VAR

    udiMasked := SHL(udiWord, 1);
    udiMasked.5 := TRUE;
    xBit3 := UDINT_TO_BOOL(audiTable[3]);
END_FUNCTION_BLOCK
