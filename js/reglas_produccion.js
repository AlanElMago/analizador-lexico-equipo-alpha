import { Lexema } from "./lexema.js";
import { MensajesErrorSintaxis } from "./mensajes_error.js";

/*
 * Gramática
 * <Sentencia> -> <Asignacion> | <Expresion>
 * <Sentencia> -> <SentenciaSi> | <SentenciaOsi> | <SentenciaSino> | <SentenciaPara> | <SentenciaMientras>
 */
export const validarSentencia = (parser) => {
  if (parser.haySiguienteToken() && parser.obtenerToken(1).valor === "=") {
    validarAsignacion(parser); // <Asignacion>
  } else if (parser.obtenerTokenActual().valor === "si") {
    validarSentenciaSi(parser); // <SentenciaSi>
  } else if (parser.obtenerTokenActual().valor === "osi") {
    validarSentenciaOsi(parser); // <SentenciaOsi>
  } else if (parser.obtenerTokenActual().valor === "sino") {
    validarSentenciaSino(parser); // <SentenciaSino>
  } else if (parser.obtenerTokenActual().valor === "para") {
    validarSentenciaPara(parser); // <SentenciaPara>
  } else if (parser.obtenerTokenActual().valor === "mientras") {
    validarSentenciaMientras(parser); // <SentenciaMientras>
  } else {
    validarExpresion(parser); // <Expresion>
  }

  // la sintaxis es válida si le llega al final del archivo sin errores
  if (parser.obtenerTokenActual().tipo === Lexema.Tipo.FinDeArchivo) {
    parser.reiniciar();

    return;
  }

  if (parser.obtenerTokenActual().valor === "'" || parser.obtenerTokenActual().valor === '"') {
    parser.registrarError(MensajesErrorSintaxis.literalNoTerminado);

    return;
  }
  
  if (parser.obtenerTokenActual().tipo === Lexema.Tipo.Ilegal) {
    parser.registrarError(MensajesErrorSintaxis.caracterNoValido);

    return;
  }
  
  if (!parser.hayErrores()) {
    parser.registrarError(MensajesErrorSintaxis.simboloInesperado);
  }
}

/*
 * Gramática:
 * <Asignacion> -> <Id> "=" <Expresion>
 */
const validarAsignacion = (parser) => {
  if (parser.obtenerTokenActual().tipo !== Lexema.Tipo.Id) {
    parser.registrarError(MensajesErrorSintaxis.asignacionNoVariable);

    return;
  }

  parser.registrarToken(); // <Id>
  parser.registrarToken(); // "="

  validarExpresion(parser); // <Expresion>
}

/*
 * Gramática:
 * <Expresion> -> <ExpresionUnaria> | <ExpresionBinaria> | <Operando>
 * <ExpresionUnaria> -> <OperadorUnario> <Expresion>
 * <ExpresionBinara> -> <Operando> <OperadorBinario> <Expresion>
 */
const validarExpresion = (parser) => {
  if (parser.obtenerTokenActual().esOperador() && parser.obtenerTokenActual().esUnario()) {
    parser.registrarToken(); // <OperadorUnario>

    validarExpresion(parser); // <Expresion>

    return;
  }

  validarOperando(parser); // <Operando>

  if (parser.obtenerTokenActual().esOperador() && parser.obtenerTokenActual().esBinario()) {
    parser.registrarToken() // <OperandoBinario>

    validarExpresion(parser); // <Expresion>
  }
}

/*
 * Gramática:
 * <Operando> -> <Id> | <Literal> | <Funcion> | "(" <Expresion> ")"
 * <Literal> -> <LiteralBooleano> | <LiteralEntero> | <LiteralFlotante> | <LiteralCadena>
 */
const validarOperando = (parser) => {
  if (   parser.obtenerTokenActual().tipo === Lexema.Tipo.Id
      || parser.obtenerTokenActual().tipo === Lexema.Tipo.Booleano
      || parser.obtenerTokenActual().tipo === Lexema.Tipo.Entero
      || parser.obtenerTokenActual().tipo === Lexema.Tipo.Flotante
      || parser.obtenerTokenActual().tipo === Lexema.Tipo.Cadena ) {
    parser.registrarToken(); // <Id> | <Literal>

    return;
  }

  if (parser.obtenerTokenActual().tipo === Lexema.Tipo.Funcion) {
    validarFuncion(parser); // <Funcion>

    return;
  }

  if (parser.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisApertura) {
    return;
  }

  parser.registrarToken(); // "("

  validarExpresion(parser); // <Expresion>

  if (parser.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisCierre) {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaParentesisCierre);

    return;
  }

  parser.registrarToken(); // ")"
}

/*
 * Gramática:
 * <Funcion> -> <IdFuncion> "(" <Argumentos> ")" | <IdFuncion> "(" ")"
 */
const validarFuncion = (parser) => {
  const tokenFuncion = parser.obtenerTokenActual();

  parser.registrarToken(); // <IdFuncion>

  if (parser.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisApertura) {
    return;
  }

  parser.registrarToken(); // "("

  if (parser.obtenerTokenActual().tipo === Lexema.Tipo.ParentesisCierre) {
    registrarToken(); // ")"

    return;
  }

  validarArgumentos(parser, tokenFuncion); // <Argumentos>

  if (parser.obtenerTokenActual().tipo !== Lexema.Tipo.ParentesisCierre) {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaParentesisCierreComa);

    return;
  }

  parser.registrarToken(); // ")"
}

/*
 * Gramática:
 * <Argumentos> -> <Expresion> "," <Argumentos> | <Expresion> 
 */
const validarArgumentos = (parser, tokenFuncion) => {
  tokenFuncion.numArgumentos++;

  validarExpresion(parser); // <Expresion>

  if (parser.obtenerTokenActual().valor === ",") {
    parser.registrarToken(); // ","

    validarArgumentos(parser, tokenFuncion); // <Argumentos>
  }
}

/*
 * Gramática:
 * <SentenciaSi> -> "si" <Expresion> ":"
 */
const validarSentenciaSi = (parser) => {
  parser.registrarToken(); // "si"

  validarExpresion(parser); // <Expresion>

  if (parser.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.registrarToken(); // ":"
}

/*
 * Gramática:
 * <SentenciaOsi> -> "osi" <Expresion> ":"
 */
const validarSentenciaOsi = (parser) => {
  parser.registrarToken(); // "osi"

  validarExpresion(parser); // <Expresion>

  if (parser.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.registrarToken(); // ":"
}

/*
 * Gramática:
 * <SentenciaSino> -> "sino" ":"
 */
const validarSentenciaSino = (parser) => {
  parser.registrarToken(); // "sino"

  if (parser.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.registrarToken(); // ":"
}

/*
 * Gramática:
 * <SentenciaPara> -> "para" <Id> "en" <Expresion> ":"
 */
const validarSentenciaPara = (parser) => {
  parser.registrarToken(); // "para"

  if (parser.obtenerTokenActual().tipo !== Lexema.Tipo.Id) {
    parser.registrarError(MensajesErrorSintaxis.asignacionNoVariable);

    return;
  }

  parser.registrarToken(); // <Id>

  if (parser.obtenerTokenActual().valor !== "en") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaEn);

    return;
  }

  parser.registrarToken(); // "en"

  validarExpresion(parser); // <Expresion>

  if (parser.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.registrarToken(); // ":"
}

/*
 * Gramática:
 * <SentenciaMientras> -> "mientras" <Expresion> ":"
 */
const validarSentenciaMientras = (parser) => {
  parser.registrarToken(); // "mientras"

  validarExpresion(parser); // <Expresion>

  if (parser.obtenerTokenActual().valor !== ":") {
    parser.registrarError(MensajesErrorSintaxis.seEsperabaDosPuntos);

    return;
  }

  parser.registrarToken(); // ":"
}
