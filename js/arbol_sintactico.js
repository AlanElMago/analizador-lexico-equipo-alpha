import { Token } from "./token.js";

/**
 * Representa el árbol sintactico de un código fuente.
 */
export class ArbolSintactico {
  /**
   * Crear un árbol sintáctico.
   * @param {Token} token 
   */
  constructor(token = new Token()) {
    /**
     * El token del nodo padre.
     * @type {Token}
     */
    this.token = token;

    /**
     * Los nodos hijos.
     * @type {Array<ArbolSintactico>}
     */
    this.hijos = [];
  }
}

/**
 * Contruye un árbol sintáctico a través de un arreglo de tokens en orden postfija (notación polaca inversa).
 * @param {Array<Token>} arregloNpi - Arreglo de tokens en orden postfija (notación polaca inversa).
 * @returns {ArbolSintactico} El árbol sintáctico.
 */
export const construirArbolSintactico = (arregloNpi = []) => {
  if (arregloNpi.length <= 0) {
    return new ArbolSintactico();
  }

  if (arregloNpi.length <= 1) {
    return new ArbolSintactico(arregloNpi.pop());
  }

  // crear el nodo padre
  const arbol = new ArbolSintactico(arregloNpi.pop());

  // crear una cantidad de nodos hijos igual al número de argumentos del operador.
  for (let numArgumento = 0; numArgumento < arbol.token.numArgumentos; numArgumento++) {
    const tokenActual = arregloNpi[arregloNpi.length - 1]; 

    if (tokenActual.esOperador()) {
      arbol.hijos.unshift(construirArbolSintactico(arregloNpi));
    } else {
      arbol.hijos.unshift(new ArbolSintactico(arregloNpi.pop()));
    }
  }

  return arbol;
}

/**
 * Generar una representación en cadena de un árbol sintáctico en orden prefija (notación polaca).
 * @param {ArbolSintactico} arbol - El árbol sintáctico.
 * @param {string} cadena - Una cadena que se concatenará al inicio. **Dejar vacío este parámetro de preferencia.**
 * @returns La representación en cadena del árbol sintáctico en orden prefija.
 */
export const generarNotacionPolaca = (arbol, cadena = "") => {
  if (arbol == null) {
    return cadena;
  }

  // padre
  cadena += arbol.token.valor + " ";

  // izquierda a derecha
  arbol.hijos.forEach(hijo => cadena = generarNotacionPolaca(hijo, cadena));

  return cadena;
}

/**
 * Generar una representación en cadena de un árbol sintáctico en orden postfija (notación polaca inversa).
 * @param {ArbolSintactico} arbol - El árbol sintáctico.
 * @param {string} cadena - Una cadena que se concatenará al inicio. **Dejar vacío este parámetro de preferencia.**
 * @returns La representación en cadena del árbol sintáctico en orden postfija.
 */
export const generarNotacionPolacaInversa = (arbol, cadena = "") => {
  if (arbol == null) {
    return cadena;
  }

  // izquierda a derecha
  arbol.hijos.forEach(hijo => cadena = generarNotacionPolacaInversa(hijo, cadena));

  // padre
  cadena += arbol.token.valor + " ";

  return cadena;
}
