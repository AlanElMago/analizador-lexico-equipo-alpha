import { Token } from "./token.js";
import { tokenizar } from "./tokenizador.js"

/**
 * Representa el scanner de un compilador. El scanner se encarga del análisis léxico de un código fuente.
 */
export class Scanner {
  /**
   * Crear un scanner.
   * @param {string} texto - El código fuente para analizar.
   */
  constructor(texto) {
    /**
     * El indice del token actual del scanner.
     * @type {number}
     */
    this.indice = 0;

    /**
     * El arreglo de tokens del scanner.
     * @type {Array<Token>}
     */
    this.tokens = tokenizar(texto);
  };

  /**
   * Obtiene el token de un índice dado.
   * @param {number} i - El índice dado.
   * @returns {Token} El token del índice dado.
   */
  obtenerToken = (i) => this.tokens[i];

  /**
   * Obtiene el token actual del scanner.
   * @returns {Token} El token actual del scanner.
   */
  obtenerTokenActual = () => this.tokens[this.indice];

  /**
   * Cambia el token actual del scanner al siguiente token siempre y cuando exista.
   * @returns {void}
   */
  siguienteToken = () => {
    if (this.haySiguienteToken()) {
      this.indice++;
    }
  };

  /**
   * Checa si hay un siguiente token después del token actual del scanner.
   * @returns {boolean} `true` si hay un siguiente token, de lo contrario, `false`.
   */
  haySiguienteToken = () => this.indice + 1 < this.tokens.length;

  /**
   * Cambia el token actual del scanner al primer token.
   * @returns {void}
   */
  reiniciar = () => this.indice = 0;

  /**
   * Obtiene el número total de líneas que contiene el código fuente.
   * @returns {number} El número total de líneas que contiene el código fuente.
   */
  obtenerNumLineas = () => this.tokens[this.tokens.length - 1].linea;
};
