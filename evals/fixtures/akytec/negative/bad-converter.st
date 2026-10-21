(* EXPECT: ST-06 *)
FUNCTION_BLOCK fbBad
    VAR
        rOut : REAL;
        udiIn : UDINT;
    END_VAR
    rOut := INT_TO_REAL(udiIn);
END_FUNCTION_BLOCK
