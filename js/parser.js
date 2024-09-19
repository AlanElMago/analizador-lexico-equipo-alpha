import { ArbolSintactico } from "./arbol_sintactico.js";
import { Lexema } from "./lexema.js";
import { MensajeErrorSintaxis } from "./mensajes_error.js";
import { Token } from "./token.js";

export class Parser {
  constructor(scanner) {
    this.scanner = scanner;
    this.errores = [];
    this.tokenActual = new Token();
  };

  // Retorna el arbol sintactico
  parsear = () => {
    this.consumirToken();

    if (this.scanner.haySiguienteToken() && this.scanner.obtenerToken(0).valor === "=") {
      return parsearAsignacion(this);
    }

    return parsearExpresion(this);
  };

  consumirToken = () => {
    if (this.tokenActual.tipo === Lexema.Tipo.FinDeArchivo) {
      return;
    }

    this.tokenActual = this.scanner.siguienteToken();
  };

  hayErrores = () => this.errores.length > 0;
};

/*
 * Gramática:
 * <Asignación> -> <Id> "=" <Expresion>
 */
const parsearAsignacion = (parser) => {
  if (parser.tokenActual.tipo !== Lexema.Tipo.Id) {
    parser.errores.push(MensajeErrorSintaxis.asignacionNoVariable(parser.tokenActual));
    return new ArbolSintactico(parser.tokenActual);
  }

  const arbol = new ArbolSintactico();
  arbol.hijos[0] = new ArbolSintactico(parser.tokenActual);

  parser.consumirToken(); // <Id>

  // Ya se comprobó que este token es el símbolo de asignación "="
  arbol.token = parser.tokenActual;

  parser.consumirToken(); // "="

  arbol.hijos[1] = parsearExpresion(parser); // <Expresion>

  return arbol;
}

/*
 * Gramática:
 * <Expresion> -> <Termino> ("+" | "-") <Expresion> | <Termino>
 */
const parsearExpresion = (parser) => {
  const termino = parsearTermino(parser); // <Termino>

  if (parser.tokenActual.valor !== "+" && parser.tokenActual.valor !== "-") {
    return termino;
  }

  const arbolA = new ArbolSintactico(parser.tokenActual);
  arbolA.hijos[0] = termino;

  parser.consumirToken(); // "+" | "-"

  const arbolB = parsearExpresion(parser); // <Expresion>

  // Checamos si el arbolB tiene o no la misma precedencia que el arbol A
  if (arbolB.token.valor !== "+" && arbolB.token.valor !== "-") {
    arbolA.hijos[1] = arbolB;

    return arbolA;
  }

  // El arbolB tiene la misma precedencia que el arbol A. Por lo tanto, el arbolA se coloca más abajo que el arbolB.
  let arbolTemp = arbolB;

  while (arbolTemp.hijos[0] != null
      && ( arbolTemp.hijos[0].token.valor === "+"
        || arbolTemp.hijos[0].token.valor === "/" )) {
    arbolTemp = arbolTemp.hijos[0];
  }

  arbolA.hijos[1] = arbolTemp.hijos[0];
  arbolTemp.hijos[0] = arbolA;

  return arbolB;
}

/*
 * Gramática:
 * <Termino> -> <Factor> ("*" | "/" | "%") <Expresion> | <Factor>
 */
const parsearTermino = (parser) => {
  const factor = parsearFactor(parser); // <Factor>

  if (parser.tokenActual.valor !== "*" && parser.tokenActual.valor !== "/" && parser.tokenActual.valor !== "%") {
    return factor;
  }

  const arbolA = new ArbolSintactico(parser.tokenActual);
  arbolA.hijos[0] = factor;

  parser.consumirToken(); // "*" | "/" | "%"

  const arbolB = parsearExpresion(parser); // <Expresion>

  // Checamos si el arbolB tiene o no la misma precedencia que el arbol A
  if (arbolB.token.valor !== "*" && arbolB.token.valor !== "/" && arbolB.token.valor !== "%") {
    arbolA.hijos[1] = arbolB;

    return arbolA;
  }

  // El arbolB tiene la misma precedencia que el arbol A. Por lo tanto, el ayyrbolA se coloca más abajo que el arbolB.
  let arbolTemp = arbolB;

  while (arbolTemp.hijos[0] != null
      && ( arbolTemp.hijos[0].token.valor === "*"
        || arbolTemp.hijos[0].token.valor === "/"
        || arbolTemp.hijos[0].token.valor === "%" )) {
    arbolTemp = arbolTemp.hijos[0];
  }

  arbolA.hijos[1] = arbolTemp.hijos[0];
  arbolTemp.hijos[0] = arbolA;

  return arbolB;
}

/*
 * <Factor> -> <Id> | <Literal> | "(" <Expresion> ")"
 * <Literal> -> <LiteralEntero> | <LiteralFlotante>
 */
const parsearFactor = (parser) => {
  if (parser.tokenActual.tipo === Lexema.Tipo.Id
      || parser.tokenActual.tipo === Lexema.Tipo.Entero
      || parser.tokenActual.tipo === Lexema.Tipo.Flotante) {
    const arbol = new ArbolSintactico(parser.tokenActual); 
    
    parser.consumirToken(); // <Id> | <Literal>

    return arbol;
  }

  if (parser.tokenActual.tipo === Lexema.Tipo.ParentesisApertura) {
    parser.consumirToken(); // "("

    const arbol = parsearExpresion(parser); // <Expresion>

    if (parser.tokenActual.tipo !== Lexema.Tipo.ParentesisCierre) {
      parser.errores.push(MensajeErrorSintaxis.seEsperabaParentesisCierre(parser.tokenActual));
      return new ArbolSintactico(parser.tokenActual);
    }

    parser.consumirToken(); // ")"

    return arbol;
  }

  parser.errores.push(MensajeErrorSintaxis.errorDesconocido(parser.tokenActual));
  return new ArbolSintactico(parser.tokenActual);
}
