import { ArbolSintactico, construirArbolSintactico } from "./arbol_sintactico.js";
import { construirArregloNpi } from "./contruir_arreglo_npi.js";
import { Lexema } from "./lexema.js";
import { Scanner } from "./scanner.js";
import { Token } from "./token.js";
import { validarSentencia } from "./reglas_produccion.js";

/**
 * Representa el parser de un compilador. El parser se encarga del análisis sintáctico de un código fuente.
 */
export class Parser {
  /**
   * Craer un parser.
   * @param {Scanner} scanner - El scanner que le pasará los tokens al parser.
   */
  constructor(scanner) {
    /**
     * El scanner que le pasa los tokens al parser.
     * @type {Scanner}
     */
    this.scanner = scanner;

    /**
     * Un arreglo de cadenas con información sobre cada token registrado.
     * @type {Array<string>}
     */
    this.infoTokens = [];

    /**
     * Un arreglo de cadenas con información de cada error encontrado durante la fase de validación de gramática.
     * @type {Array<string>}
     */
    this.errores = [];
  };

  /**
   * Valida la gramática y genera una representación del árbol sintáctico del código fuente.
   * @returns {ArbolSintactico} El árbol sintáctico del código fuente. Si se encuentra un error durante la fase de
   * validación, retorna un árbol sintáctico con un token de valor `Error de Sintaxis`. Si se encuentra una operación
   * que aún no se soporta, retorna un arbol sintáctico con un token de valor `Operación no Soportada`.
   */
  parsear = () => {
    // validar la gramática del código fuente
    validarSentencia(this, this.scanner);

    if (this.hayErrores()) {
      const tokenError = new Token(Lexema.Tipo.Error, "Error de Sintaxis");

      return new ArbolSintactico(tokenError);
    }

    if (this.scanner.obtenerTokenActual().tipo === Lexema.Tipo.Reservada) {
      const tokenError = new Token(Lexema.Tipo.Error, "Operación no Soportada");

      return new ArbolSintactico(tokenError);
    }

    // construir un arreglo de tokens en orden postfija (notación polaca inversa)
    const arregloNpi = construirArregloNpi(this.scanner);

    return construirArbolSintactico(arregloNpi);
  };

  /**
   * Consume el token actual del scanner y cambia al siguiente token.
   * @param {boolean} registrarToken - Registrar o no la información del token actual del scanner.
   * @returns {void}
   */
  consumirToken = (registrarToken = false) => {
    const tokenActual = this.scanner.obtenerTokenActual();

    if (registrarToken) {
      this.infoTokens.push(`${tokenActual.valor} - Tipo: ${tokenActual.tipo}, Columna: ${tokenActual.columna}`);
    }

    this.scanner.siguienteToken();
  }

  /**
   * Registra en el parser la información de un error encontrado en base al token actual del scanner.
   * @param {(token: Token) => string} funcionMensajeError - La función que genera el mensaje de error.
   * @returns {void}
   */
  registrarError = (funcionMensajeError) => this.errores.push(funcionMensajeError(this.scanner.obtenerTokenActual()));

  /**
   * Checa si hay errores registrados en el parser.
   * @returns {boolean} `true` si hay al menos un error registrado en el parser, de lo contrario, `false`.
   */
  hayErrores = () => this.errores.length > 0;
};
