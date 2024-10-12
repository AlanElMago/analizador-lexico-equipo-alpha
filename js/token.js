import { Lexema } from "./lexema.js"
import { tablaPrecedencia } from "./tabla_precedencia.js";

/**
 * Representa un token — un conjunto de caracteres que conforma la unidad significativa más pequeña de un código fuente
 * que pueda reconocer el compilador.
 */
export class Token {
  /**
   * Crear un token.
   * @param {string} tipo - El tipo de lexema del token.
   * @param {string} valor - El valor del token.
   * @param {number} columna - La columna donde se encontró el token dentro de un código fuente.
   */
  constructor(tipo = Lexema.Tipo.Nada, valor = "", columna = 0) {
    /**
     * El tipo de lexema del token.
     * @type {string}
     */
    this.tipo = tipo;

    /**
     * El valor del token.
     * @type {string}
     */
    this.valor = valor;

    /**
     * El número de columna donde se encontró el token dentro de un código fuente.
     * @type {number}
     */
    this.columna = columna;

    /**
     * La longitud del token (i.e. el número de caracteres que lo conforma).
     * @type {number}
     */
    this.longitud = valor.length;

    /**
     * El nivel de precedencia del token como un operador.
     * @type {number}
     */
    this.nivelPrecedencia = obtenerNivelPrecedencia(tipo, valor);

    /**
     * El número de argumentos que recibe el token como un operador.
     * @type {number}
     */
    this.numArgumentos = obtenerNumeroArgumentos(tipo, valor);
  }

  /**
   * Checar si el token es un operador.
   * @returns {boolean} `true` si el token es un operador, de lo contrario, `false`.
   */
  esOperador = () =>
         this.tipo === Lexema.Tipo.MenosUnario
      || this.tipo === Lexema.Tipo.Logico
      || this.tipo === Lexema.Tipo.Aritmetico
      || this.tipo === Lexema.Tipo.Comparacion
      || this.tipo === Lexema.Tipo.Asignacion;

  /**
   * Checar si el token es un operador unario.
   * @returns {boolean} `true` si el token es un operador unario, de lo contrario, `false`.
   */
  esUnario = () => this.numArgumentos === 1;

  /**
   * Checar si el token es un operador binario.
   * @returns {boolean} `true` si el token es un operador binario, de lo contrario, `false`.
   */
  esBinario = () => this.numArgumentos === 2;

  /**
   * Checar si el token es un operador asociativo por la izquierda.
   * @returns {boolean} `true` si el token es un operador asociativo por la izquierda, de lo contrario, `false`.
   */
  esAsociativoIzquierda = () =>
         this.tipo !== Lexema.Tipo.MenosUnario
      && this.tipo !== Lexema.Tipo.Asignacion
      && this.valor !== "**"
      && this.valor !== "NO";
}

/**
 * Obtiene el número de argumentos que recibe un token como un operador.
 * @param {string} tipo - El tipo de lexema del token.
 * @param {string} valor - El valor del token.
 * @returns {number} El número de argumentos que recibe un token como un operador.
 */
const obtenerNumeroArgumentos = (tipo, valor) => {
  if (tipo === Lexema.Tipo.MenosUnario || valor === "NO") {
    return 1; // es un operador unario
  }

  if (tipo === Lexema.Tipo.Aritmetico
      || tipo === Lexema.Tipo.Comparacion
      || tipo === Lexema.Tipo.Asignacion
      || tipo === Lexema.Tipo.Logico && valor !== "NO") {
    return 2; // es un operador binario
  }

  return 0;
}

/**
 * Obtiene el nivel de precedencia de un token como un operador.
 * @param {string} tipo - El tipo de lexema del token.
 * @param {string} valor - El valor del token.
 * @returns {number} El nivel de precedencia de un token como un operador.
 */
const obtenerNivelPrecedencia = (tipo, valor) => {
  for (const operador of tablaPrecedencia) {
    if (tipo === operador.tipo && valor === operador.valor) {
      return operador.nivelPrecedencia;
    }
  }

  return -1;
}
