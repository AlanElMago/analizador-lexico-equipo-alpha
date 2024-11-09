import { Lexema } from "./lexema.js";
import { MensajesErrorSintaxis } from "./mensajes_error.js";
import { Parser } from "./parser.js";
import { Scanner } from "./scanner.js";
import { Token } from "./token.js";

/**
 * Un diccionario que almacena las reglas de producción que conforma el códgio fuente
 * @typedef {Object.<string, Set>} ReglasProduccion
 */

/**
 * Representa el analizador semántico de un compilador. El analizador semánico se encarga de validar las reglas de
 * producción de un código fuente.
 */
export class Validador {
  constructor() {
    /**
     * El diccionario que almacena las reglas de producción que conforma el códgio fuente.
     * @type {ReglasProduccion}
     */
    this.reglasProduccion = {}
  }

  validar = (parser, scanner) => {
    for(let numLinea = 1; numLinea <= scanner.obtenerNumLineas(); numLinea++) {
      validarSentencia(this, parser, scanner, numLinea);
    }
  }

  /**
   * Registra una regla de producción en el diccionario de reglas de producción.
   * @param {string} regla 
   * @param {string} valor 
   */
  registrarReglaProduccion = (regla, valor) => {
    if (this.reglasProduccion[regla] == null) {
      this.reglasProduccion[regla] = new Set();
    }

    this.reglasProduccion[regla].add(valor);
  }
}

/**
 * Gramática:
 * ```
 * <Sentencia> -> <Asignación> | <Expresión>
 * <Sentencia> -> <SentenciaSi> | <SentenciaOsi> | <SentenciaSino> | <SentenciaPara> | <SentenciaMientras>
 * ```
 * @param {Validador} validador
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @param {number} numLinea
 * @returns {void}
 */
const validarSentencia = (validador, parser, scanner, numLinea) => {
  // checar si la línea está vacía
  if (scanner.obtenerTokenActual().linea > numLinea) {
    return;
  }

  // ignorar indentaciones (solo nos interesa la gramática de la línea, no si está correctamente indentada)
  while (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Indentacion) {
    scanner.siguienteToken();
  }

  if (scanner.haySiguienteToken() && scanner.tokens[scanner.indice + 1].valor === "=") {
    validador.registrarReglaProduccion("Sentencia", "<Asignacion>");

    validarAsignacion(validador, parser, scanner); // <Asignación>
  } else if (scanner.obtenerTokenActual().valor === "si") {
    validador.registrarReglaProduccion("Sentencia", "<SentenciaSi>");

    validarSentenciaSi(validador, parser, scanner); // <SentenciaSi>
  } else if (scanner.obtenerTokenActual().valor === "osi") {
    validador.registrarReglaProduccion("Sentencia", "<SentenciaOsi>");

    validarSentenciaOsi(validador, parser, scanner); // <SentenciaOsi>
  } else if (scanner.obtenerTokenActual().valor === "sino") {
    validador.registrarReglaProduccion("Sentencia", "<SentenciaSino>");

    validarSentenciaSino(validador, parser, scanner); // <SentenciaSino>
  } else if (scanner.obtenerTokenActual().valor === "para") {
    validador.registrarReglaProduccion("Sentencia", "<SentenciaPara>");

    validarSentenciaPara(validador, parser, scanner); // <SentenciaPara>
  } else if (scanner.obtenerTokenActual().valor === "mientras") {
    validador.registrarReglaProduccion("Sentencia", "<SentenciaMientras>");

    validarSentenciaMientras(validador, parser, scanner); // <SentenciaMientras>
  } else {
    validador.registrarReglaProduccion("Sentencia", "<Expresion>");

    validarExpresion(validador, parser, scanner); // <Expresión>
  }

  // la sintaxis es válida si se llega al final de la línea o al final del archivo
  if (scanner.obtenerTokenActual().linea > numLinea
      || scanner.obtenerTokenActual().tipo === Lexema.Tipo.FinDeArchivo) {

    return;
  }

  if (scanner.obtenerTokenActual().valor === "'" || scanner.obtenerTokenActual().valor === '"') {
    parser.registrarError(MensajesErrorSintaxis.literalNoTerminado);
  } else if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Ilegal) {
    parser.registrarError(MensajesErrorSintaxis.caracterNoValido);
  } else if (!parser.hayErrores()) {
    parser.registrarError(MensajesErrorSintaxis.errorDesconocido);
  }

  // ir a la siguiente línea o final del archivo
  while (scanner.obtenerTokenActual().linea < numLinea && scanner.obtenerTokenActual() !== Lexema.Tipo.FinDeArchivo) {
    scanner.siguienteToken();
  }
}

/**
 * Gramática:
 * ```
 * <Asignación> -> <Id> "=" <Expresión>
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarAsignacion = (validador, parser, scanner) => {
  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.Id) {
    parser.registrarError(MensajesErrorSintaxis.asignacionNoVariable);

    return;
  }

  validador.registrarReglaProduccion("Asignacion", "<Id> = <Expresion>");
  validador.registrarReglaProduccion("Id", scanner.obtenerTokenActual().valor);

  parser.consumirToken(true); // <Id>
  parser.consumirToken(true); // "="

  validarExpresion(validador, parser, scanner); // <Expesión>
}

/**
 * Gramática:
 * ```
 * <Expresión> -> <ExpresiónUnaria> | <ExpresiónBinaria> | <Operando>
 * <ExpresiónUnaria> -> <OperadorUnario> <Expresión>
 * <ExpresiónBinara> -> <Operando> <OperadorBinario> <Expresión>
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarExpresion = (validador, parser, scanner) => {
  if (scanner.obtenerTokenActual().esOperador() && scanner.obtenerTokenActual().esUnario()) {
    validador.registrarReglaProduccion("Expresion", "<ExpresionUnaria>");
    validador.registrarReglaProduccion("ExpresionUnaria", "<OperadorUnario> <Expresion>");
    validador.registrarReglaProduccion("OperadorUnario", scanner.obtenerTokenActual().valor);

    parser.consumirToken(true); // <OperadorUnario>

    validarExpresion(validador, parser, scanner); // <Expresión>

    return;
  }

  validador.registrarReglaProduccion("Expresion", "<Operando>");

  validarOperando(validador, parser, scanner); // <Operando>

  if (scanner.obtenerTokenActual().esOperador() && scanner.obtenerTokenActual().esBinario()) {
    validador.registrarReglaProduccion("Expresion", "<ExpresionBinaria>");
    validador.registrarReglaProduccion("ExpresionBinaria", "<Operando> <OperadorBinario> <Expresion>");
    validador.registrarReglaProduccion("OperadorBinario", scanner.obtenerTokenActual().valor);

    parser.consumirToken(true) // <OperandoBinario>

    validarExpresion(validador, parser, scanner); // <Expresión>
  }
}

/**
 * Gramática:
 * ```
 * <Operando> -> <Id> | <Literal> | <Función> | "(" <Expresión> ")"
 * <Literal> -> <LiteralBooleano> | <LiteralEntero> | <LiteralFlotante> | <LiteralCadena>
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarOperando = (validador, parser, scanner) => {
  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Id) {
    validador.registrarReglaProduccion("Operando", "<Id>");
    validador.registrarReglaProduccion("Id", scanner.obtenerTokenActual().valor);

    parser.consumirToken(true); // <Id>

    return;
  }

  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Booleano) {
    validador.registrarReglaProduccion("Operando", "<Literal>");
    validador.registrarReglaProduccion("Literal", "<LiteralBooleano>");
    validador.registrarReglaProduccion("LiteralBooleano", scanner.obtenerTokenActual().valor);

    parser.consumirToken(true) // <LiteralBooleano>

    return;
  }


  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Entero) {
    validador.registrarReglaProduccion("Operando", "<Literal>");
    validador.registrarReglaProduccion("Literal", "<LiteralEntero>");
    validador.registrarReglaProduccion("LiteralEntero", scanner.obtenerTokenActual().valor);

    parser.consumirToken(true) // <LiteralEntero>

    return;
  }

  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Flotante) {
    validador.registrarReglaProduccion("Operando", "<Literal>");
    validador.registrarReglaProduccion("Literal", "<LiteralFlotante>");
    validador.registrarReglaProduccion("LiteralFlotante", scanner.obtenerTokenActual().valor);

    parser.consumirToken(true) // <LiteralFlotante>

    return;
  }

  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Cadena) {
    validador.registrarReglaProduccion("Operando", "<Literal>");
    validador.registrarReglaProduccion("Literal", "<LiteralCadena>");
    validador.registrarReglaProduccion("LiteralCadena", scanner.obtenerTokenActual().valor);

    parser.consumirToken(true) // <LiteralCadena>

    return;
  }

  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Funcion) {
    validador.registrarReglaProduccion("Operando", "<Funcion>");

    validarFuncion(validador, parser, scanner); // <Función>

    return;
  }

  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisApertura) {
    parser.registrarError(MensajesErrorSintaxis.simboloInesperado);

    return;
  }

  parser.consumirToken(true); // "("

  validador.registrarReglaProduccion("Operando", "( <Expresion> )");

  validarExpresion(validador, parser, scanner); // <Expresión>

  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisCierre) {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaParentesisCierre);

    return;
  }

  parser.consumirToken(true); // ")"
}

/**
 * Gramática:
 * ```
 * <Función> -> <IdFunción> "(" <Argumentos> ")" | <IdFunción> "(" ")"
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarFuncion = (validador, parser, scanner) => {
  const tokenFuncion = scanner.obtenerTokenActual();

  validador.registrarReglaProduccion("IdFuncion", scanner.obtenerTokenActual().valor);

  parser.consumirToken(true); // <IdFunción>

  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisApertura) {
    return;
  }

  parser.consumirToken(true); // "("

  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.ParentesisCierre) {
    validador.registrarReglaProduccion("Funcion", "<IdFuncion> ( )");

    parser.consumirToken(true); // ")"

    return;
  }

  validador.registrarReglaProduccion("Funcion", "<IdFuncion> ( <Argumentos> )");

  validarArgumentos(validador, parser, scanner, tokenFuncion); // <Argumentos>

  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisCierre) {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaParentesisCierreComa);

    return;
  }

  parser.consumirToken(true); // ")"
}

/**
 * Gramática:
 * ```
 * <Argumentos> -> <Expresión> "," <Argumentos> | <Expresión> 
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @param {Token} tokenFuncion
 * @returns {void}
 */
const validarArgumentos = (validador, parser, scanner, tokenFuncion) => {
  tokenFuncion.numArgumentos++;

  validador.registrarReglaProduccion("Argumentos", "<Expresion>");

  validarExpresion(validador, parser, scanner); // <Expresión>

  if (scanner.obtenerTokenActual().valor === ",") {
    validador.registrarReglaProduccion("Argumentos", "<Expresion> , <Argumentos>");

    parser.consumirToken(true); // ","

    validarArgumentos(validador, parser, scanner, tokenFuncion); // <Argumentos>
  }
}

/**
 * Gramática:
 * ```
 * <SentenciaSi> -> "si" <Expresión> ":"
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarSentenciaSi = (validador, parser, scanner) => {
  parser.consumirToken(true); // "si"

  validador.registrarReglaProduccion("SentenciaSi", "si <Expresion> :");

  validarExpresion(validador, parser, scanner); // <Expresión>

  if (scanner.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.consumirToken(true); // ":"
}

/**
 * Gramática:
 * ```
 * <SentenciaOsi> -> "osi" <Expresión> ":"
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarSentenciaOsi = (validador, parser, scanner) => {
  parser.consumirToken(true); // "osi"

  validador.registrarReglaProduccion("SentenciaOsi", "osi <Expresion> :");

  validarExpresion(validador, parser, scanner); // <Expresión>

  if (scanner.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.consumirToken(true); // ":"
}

/**
 * Gramática:
 * ```
 * <SentenciaSino> -> "sino" ":"
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarSentenciaSino = (validador, parser, scanner) => {
  parser.consumirToken(true); // "sino"

  validador.registrarReglaProduccion("SentenciaSino", "sino :");

  if (scanner.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.consumirToken(true); // ":"
}

/**
 * Gramática:
 * ```
 * <SentenciaPara> -> "para" <Id> "en" <Expresión> ":"
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarSentenciaPara = (validador, parser, scanner) => {
  parser.consumirToken(true); // "para"

  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.Id) {
    parser.registrarError(MensajesErrorSintaxis.asignacionNoVariable);

    return;
  }

  validador.registrarReglaProduccion("Id", scanner.obtenerTokenActual().valor);

  parser.consumirToken(true); // <Id>

  if (scanner.obtenerTokenActual().valor !== "en") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaEn);

    return;
  }

  parser.consumirToken(true); // "en"

  validador.registrarReglaProduccion("SentenciaPara", "para <Id> en <Expresion> :");

  validarExpresion(validador, parser, scanner); // <Expresión>

  if (scanner.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.consumirToken(true); // ":"
}

/**
 * Gramática:
 * ```
 * <SentenciaMientras> -> "mientras" <Expresión> ":"
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
const validarSentenciaMientras = (validador, parser, scanner) => {
  parser.consumirToken(true); // "mientras"

  validador.registrarReglaProduccion("SentenciaMientras", "mientras <Expresion> :");

  validarExpresion(validador, parser, scanner); // <Expresión>

  if (scanner.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.consumirToken(true); // ":"
}
