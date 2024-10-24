import { Lexema } from "./lexema.js";
import { Scanner } from "./scanner.js";
import { Token } from "./token.js";

/**
 * Representa una pila de operadores. Utilizado para el algoritmo Shunting Yard.
 */
class PilaOperadores {
  /**
   * Crear una pila de operadores.
   */
  constructor() {
    /**
     * La pila de operadores
     * @type {Array<Token>}
     */
    this.pila = [];
  }

  /**
   * Agregar un token al tope de la pila de operadores.
   * @param {Token} token - El token para agregar.
   * @returns {void}
   */
  push = (token) => this.pila.push(token);

  /**
   * Quita un token del tope de la pila de operadores.
   * @param {Token} token - El token para agregar.
   * @returns {Token} El token que se quitó
   */
  pop = () => this.pila.pop();

  /**
   * Mirar el token en el tope de la pila de operadores.
   * @returns {Token} El token en el tope de la pila de operadores.
   */
  peek = () => this.pila[this.pila.length - 1];

  /**
   * Checkar si la pila de operadores está vacía.
   * @returns {boolean} `true` si la pila de operadores está vacía, de lo contrario, `false`.
   */
  estaVacia = () => this.pila.length <= 0;
}

/**
 * Construye un arreglo de tokens en orden postfija (notación polaca inversa) a través de los tokens de un parser
 * uilizando el algoritmo Shunting Yard: https://en.wikipedia.org/wiki/Shunting_yard_algorithm
 * @param {Scanner} scanner - El parser que contiene los tokens.
 * @returns {Array<Token>} Un arreglo de tokens en orden postfija.
 */
export const construirArregloNpi = (scanner) => {
  scanner.reiniciar();

  const salida = [];
  const pilaOperadores = new PilaOperadores();

  while (scanner.obtenerTokenActual().tipo !== Lexema.Tipo.FinDeArchivo) {
    const tokenActual = scanner.obtenerTokenActual();
    scanner.siguienteToken();

    if (tokenActual.tipo === Lexema.Tipo.Entero
        || tokenActual.tipo === Lexema.Tipo.Flotante
        || tokenActual.tipo === Lexema.Tipo.Booleano
        || tokenActual.tipo === Lexema.Tipo.Cadena
        || tokenActual.tipo === Lexema.Tipo.Id) {
      salida.push(tokenActual);
    }

    else if (tokenActual.tipo === Lexema.Tipo.Funcion) {
      pilaOperadores.push(tokenActual);
    }

    else if (tokenActual.esOperador()) {
      while (!pilaOperadores.estaVacia() && pilaOperadores.peek().tipo !== Lexema.Tipo.ParentesisApertura
          && (pilaOperadores.peek().nivelPrecedencia < tokenActual.nivelPrecedencia
            || (pilaOperadores.peek().nivelPrecedencia === tokenActual.nivelPrecedencia
              && tokenActual.esAsociativoIzquierda()))) {
        salida.push(pilaOperadores.pop());
      }

      pilaOperadores.push(tokenActual);
    }

    else if (tokenActual.valor === ",") {
      while (pilaOperadores.peek().tipo !== Lexema.Tipo.ParentesisApertura) {
        salida.push(pilaOperadores.pop());
      }
    }

    else if (tokenActual.tipo === Lexema.Tipo.ParentesisApertura) {
      pilaOperadores.push(tokenActual);
    }

    else if (tokenActual.tipo === Lexema.Tipo.ParentesisCierre) {
      while (pilaOperadores.peek().tipo !== Lexema.Tipo.ParentesisApertura) {
        salida.push(pilaOperadores.pop());
      }

      pilaOperadores.pop();

      if (!pilaOperadores.estaVacia() && pilaOperadores.peek().tipo === Lexema.Tipo.Id) {
        salida.push(pilaOperadores.pop());
      }
    }
  }

  while (!pilaOperadores.estaVacia()) {
    salida.push(pilaOperadores.pop());
  }

  scanner.reiniciar();

  return salida;
}
