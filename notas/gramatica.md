# Gramática
El analizador sintáctico reconocerá la siguiente gramática:

instruccion  -> funcion | eval_condicional

funcion -> id (( arg, (arg, )* ))
arg     -> id | numero | literal

eval_condicional -> evaluacion_si | ciclo_mientras | ciclo_para

evaluacion_si    -> si condicion: | osi condicion: | sino:
ciclo_mientras   -> mientras condicion:
condicion        -> ((condicion)) | condicion (op_comparacion condicion)*
condicion        -> (id | numero) op_comparacion (id | numero) (op_comparacion (id | numero))*
op_comparacion   -> == | != | < | > | <= | >=

ciclo_para       -> para id en (id | literal):
