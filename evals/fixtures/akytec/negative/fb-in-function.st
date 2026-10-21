(* EXPECT: ST-12 *)
FUNCTION xBad : BOOL;
    VAR_INPUT
        xIn : BOOL;
    END_VAR
    VAR
        tonDelay : SYS.TON;
    END_VAR
    xBad := xIn;
END_FUNCTION
