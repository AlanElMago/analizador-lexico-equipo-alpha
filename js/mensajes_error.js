/**
 * Conjunto de mensajes de error de sintaxis.
 */
export const MensajesErrorSintaxis = {
  asignacionNoVariable: (token) =>
      `ErrorSintaxis: Solo se permiten asignaciones a variables (línea ${token.linea}, columna ${token.columna})`,

  caracterNoValido: (token) =>
      `ErrorSintaxis: Caracter no válido '${token.valor}' (línea ${token.linea}, columna ${token.columna})`,

  errorDesconocido: (token) =>
      `ErrorSintaxis: Error desconocido '${token.valor}' (línea ${token.linea}, línea ${token.linea}, columna ${token.columna})`,

  literalNoTerminado: (token) =>
      `ErrorSintaxis: Literal no terminado (línea ${token.linea}, columna ${token.columna})`,

  seEsperabaDosPuntos: (token) =>
      `ErrorSintaxis: Se esperaba ':'. Se encontró '${token.valor}' (línea ${token.linea}, columna ${token.columna})`,

  seEsperabaEn: (token) =>
      `ErrorSintaxis: Se esperaba 'en'. Se encontró '${token.valor}' (línea ${token.linea}, columna ${token.columna})`,

  seEsperabaParentesisCierre: (token) =>
      `ErrorSintaxis: Se esperaba un paréntesis de cierre. Se encontró '${token.valor}' (línea ${token.linea}, columna ${token.columna})`,

  seEsperabaParentesisCierreComa: (token) =>
      `ErrorSintaxis: Se esperaba un paréntesis de cierre o una coma. Se encontró '${token.valor}' (línea ${token.linea}, columna ${token.columna})`,

  simboloInesperado: (token) =>
      `ErrorSintaxis: Símbolo inesperado '${token.valor}' (tipo ${token.tipo}) (línea ${token.linea}, columna ${token.columna})`,
}
