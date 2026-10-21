(* EXPECT: ST-17,ST-18 *)
FUNCTION_BLOCK fbBad
    VAR
        tonDelay : TON;
        rtEdge : R_TRIG;
        rOut : REAL;
    END_VAR
    rOut := LN(2.0);
END_FUNCTION_BLOCK
