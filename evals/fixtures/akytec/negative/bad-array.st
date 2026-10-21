(* EXPECT: ST-16 *)
FUNCTION_BLOCK fbBad
    VAR
        a1 : ARRAY[0] OF UDINT;
        a2 : ARRAY[-1..3] OF UDINT;
        a3 : ARRAY[2..2] OF UDINT;
        a4 : ARRAY[0..1] OF UDINT := [7(2)];
    END_VAR
END_FUNCTION_BLOCK
