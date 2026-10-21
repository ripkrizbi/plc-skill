(* UNCOMPILED - positive lint sample *)
FUNCTION rScaleFixture : REAL;
    VAR_INPUT
        rIn : REAL;
        rGain : REAL;
    END_VAR
    VAR
        rTmp : REAL;
    END_VAR

    rTmp := SYS.FMAX(rIn, 0.0);
    rScaleFixture := rTmp * rGain;
END_FUNCTION
