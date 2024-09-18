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
 * <Expresion> -> <Termino> ("+" | "-") <Expresion> | <Termino>
 */
const parsearExpresion = (parser) => {
  const termino = parsearTermino(parser); // <Termino>

  if (parser.tokenActual.valor === "+" || parser.tokenActual.valor === "-") {
    const arbolA = new ArbolSintactico(parser.tokenActual);
    arbolA.hijos[0] = termino;

    parser.consumirToken(); // "+" | "-"

    const arbolB = parsearExpresion(parser); // <Expresion>

    if (arbolB.token.valor === "+" || arbolB.token.valor === "-") {
      arbolA.hijos[1] = arbolB.hijos[0];
      arbolB.hijos[0] = arbolA;

      return arbolB;
    }

    arbolA.hijos[1] = arbolB;

    return arbolA;
  }

  return termino;
}

/*
 * Gramática:
 * <Termino> -> <Factor> ("*" | "/" | "%") <Expresion> | <Factor>
 */
const parsearTermino = (parser) => {
  const factor = parsearFactor(parser); // <Factor>

  if (parser.tokenActual.valor === "*" || parser.tokenActual.valor === "/" || parser.tokenActual.valor === "%") {
    const arbolA = new ArbolSintactico(parser.tokenActual);
    arbolA.hijos[0] = factor;

    parser.consumirToken(); // "*" | "/" | "%"

    const arbolB = parsearExpresion(parser); // <Expresion>

    if (arbolB.token.valor === "*" || arbolB.token.valor === "/" || arbolB.token.valor === "%") {
      arbolA.hijos[1] = arbolB.hijos[0];
      arbolB.hijos[0] = arbolA;

      return arbolB;
    }

    arbolA.hijos[1] = arbolB;

    return arbolA;
  }

  return factor;
}

/*
 * Gramática:
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
