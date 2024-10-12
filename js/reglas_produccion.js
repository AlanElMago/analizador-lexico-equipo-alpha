import { Lexema } from "./lexema.js";
import { MensajesErrorSintaxis } from "./mensajes_error.js";
import { Parser } from "./parser.js";
import { Scanner } from "./scanner.js";
import { Token } from "./token.js";

/**
 * Gramática:
 * ```
 * <Sentencia> -> <Asignación> | <Expresión>
 * <Sentencia> -> <SentenciaSi> | <SentenciaOsi> | <SentenciaSino> | <SentenciaPara> | <SentenciaMientras>
 * ```
 * @param {Parser} parser
 * @param {Scanner} scanner
 * @returns {void}
 */
export const validarSentencia = (parser, scanner) => {
  scanner.reiniciar();

  if (scanner.haySiguienteToken() && scanner.obtenerToken(1).valor === "=") {
    validarAsignacion(parser, scanner); // <Asignación>
  } else if (scanner.obtenerTokenActual().valor === "si") {
    validarSentenciaSi(parser, scanner); // <SentenciaSi>
  } else if (scanner.obtenerTokenActual().valor === "osi") {
    validarSentenciaOsi(parser, scanner); // <SentenciaOsi>
  } else if (scanner.obtenerTokenActual().valor === "sino") {
    validarSentenciaSino(parser, scanner); // <SentenciaSino>
  } else if (scanner.obtenerTokenActual().valor === "para") {
    validarSentenciaPara(parser, scanner); // <SentenciaPara>
  } else if (scanner.obtenerTokenActual().valor === "mientras") {
    validarSentenciaMientras(parser, scanner); // <SentenciaMientras>
  } else {
    validarExpresion(parser, scanner); // <Expresión>
  }

  // la sintaxis es válida si se llega al final del archivo
  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.FinDeArchivo) {
    scanner.reiniciar();

    return;
  }

  if (scanner.obtenerTokenActual().valor === "'" || scanner.obtenerTokenActual().valor === '"') {
    parser.registrarError(MensajesErrorSintaxis.literalNoTerminado);

    return;
  }
  
  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Ilegal) {
    parser.registrarError(MensajesErrorSintaxis.caracterNoValido);

    return;
  }
  
  if (!parser.hayErrores()) {
    parser.registrarError(MensajesErrorSintaxis.simboloInesperado);
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
const validarAsignacion = (parser, scanner) => {
  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.Id) {
    parser.registrarError(MensajesErrorSintaxis.asignacionNoVariable);

    return;
  }

  parser.consumirToken(true); // <Id>
  parser.consumirToken(true); // "="

  validarExpresion(parser, scanner); // <Expesión>
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
const validarExpresion = (parser, scanner) => {
  if (scanner.obtenerTokenActual().esOperador() && scanner.obtenerTokenActual().esUnario()) {
    parser.consumirToken(true); // <OperadorUnario>

    validarExpresion(parser, scanner); // <Expresión>

    return;
  }

  validarOperando(parser, scanner); // <Operando>

  if (scanner.obtenerTokenActual().esOperador() && scanner.obtenerTokenActual().esBinario()) {
    parser.consumirToken(true) // <OperandoBinario>

    validarExpresion(parser, scanner); // <Expresión>
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
const validarOperando = (parser, scanner) => {
  if (   scanner.obtenerTokenActual().tipo === Lexema.Tipo.Id
      || scanner.obtenerTokenActual().tipo === Lexema.Tipo.Booleano
      || scanner.obtenerTokenActual().tipo === Lexema.Tipo.Entero
      || scanner.obtenerTokenActual().tipo === Lexema.Tipo.Flotante
      || scanner.obtenerTokenActual().tipo === Lexema.Tipo.Cadena ) {
    parser.consumirToken(true); // <Id> | <Literal>

    return;
  }

  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.Funcion) {
    validarFuncion(parser, scanner); // <Función>

    return;
  }

  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisApertura) {
    return;
  }

  parser.consumirToken(true); // "("

  validarExpresion(parser, scanner); // <Expresión>

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
const validarFuncion = (parser, scanner) => {
  const tokenFuncion = scanner.obtenerTokenActual();

  parser.consumirToken(true); // <IdFunción>

  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisApertura) {
    return;
  }

  parser.consumirToken(true); // "("

  if (scanner.obtenerTokenActual().tipo === Lexema.Tipo.ParentesisCierre) {
    registrarToken(); // ")"

    return;
  }

  validarArgumentos(parser, scanner, tokenFuncion); // <Argumentos>

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
const validarArgumentos = (parser, scanner, tokenFuncion) => {
  tokenFuncion.numArgumentos++;

  validarExpresion(parser, scanner); // <Expresión>

  if (scanner.obtenerTokenActual().valor === ",") {
    parser.consumirToken(true); // ","

    validarArgumentos(parser, scanner, tokenFuncion); // <Argumentos>
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
const validarSentenciaSi = (parser, scanner) => {
  parser.consumirToken(true); // "si"

  validarExpresion(parser, scanner); // <Expresión>

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
const validarSentenciaOsi = (parser, scanner) => {
  parser.consumirToken(true); // "osi"

  validarExpresion(parser, scanner); // <Expresión>

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
const validarSentenciaSino = (parser, scanner) => {
  parser.consumirToken(true); // "sino"

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
const validarSentenciaPara = (parser, scanner) => {
  parser.consumirToken(true); // "para"

  if (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.Id) {
    parser.registrarError(MensajesErrorSintaxis.asignacionNoVariable);

    return;
  }

  parser.consumirToken(true); // <Id>

  if (scanner.obtenerTokenActual().valor !== "en") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaEn);

    return;
  }

  parser.consumirToken(true); // "en"

  validarExpresion(parser, scanner); // <Expresión>

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
const validarSentenciaMientras = (parser, scanner) => {
  parser.consumirToken(true); // "mientras"

  validarExpresion(parser, scanner); // <Expresión>

  if (scanner.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.consumirToken(true); // ":"
}
