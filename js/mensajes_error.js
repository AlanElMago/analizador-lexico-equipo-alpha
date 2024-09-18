export const MensajeErrorSintaxis = {
  asignacionNoVariable: (token) =>
      `ErrorSintaxis: Solo se permiten asignaciones de variables (columna ${token.columna})`,

  caracterNoValido: (token) =>
      `ErrorSintaxis: Caracter no válido '${token.valor}' (columna ${token.columna})`,

  errorDesconocido: (token) =>
      `ErrorSintaxis: Error desconocido '${token.valor}' (columna ${token.columna})`,

  literalNoTerminado: (token) =>
      `ErrorSintaxis: literal no terminado (columna ${token.columna})`,

  maxArgumentos: (token) =>
      `ErrorSintaxis: Se superó la cantidad máxima de argumentos de la función (columna ${token.columna})`,

  minArgumentos: (token, minArgumentos) =>
      `ErrorSintaxis: Se esperaba al menos ${minArgumentos} argumento(s) (columna ${token.columna})`,

  seEsperabaDosPuntos: (token) =>
      "ErrorSintaxis: Se esperaba ':'. "
    + `Se encontró '${token.valor}' (columna ${token.columna})`,

  seEsperabaEn: (token) =>
      "ErrorSintaxis: Se esperaba 'en'. "
    + `Se encontró '${token.valor}' (columna ${token.columna})`,

  seEsperabaParentesisCierre: (token) =>
      "ErrorSintaxis: Se esperaba un paréntesis de cierre. "
    + `Se encontró '${token.valor}' (columna ${token.columna})`,

  seEsperabaParentesisCierreComa: (token) =>
      "ErrorSintaxis: Se esperaba un paréntesis de cierre o una coma. "
    + `Se encontró '${token.valor}' (columna ${token.columna})`,

  simboloInesperado: (token) =>
      `ErrorSintaxis: Símbolo inesperado '${token.valor}' (tipo ${token.tipo}) (columna ${token.columna})`,
}
