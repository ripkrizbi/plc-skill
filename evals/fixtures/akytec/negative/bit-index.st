(* EXPECT: ST-07 *)
FUNCTION_BLOCK fbBad
    VAR
        udiWord : UDINT;
    END_VAR
    udiWord.32 := TRUE;
END_FUNCTION_BLOCK
