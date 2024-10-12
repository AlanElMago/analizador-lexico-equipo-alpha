import { Lexema } from './lexema.js';
import { Token } from './token.js';

/**
 * Separa un código fuente en tokens.
 * @param {string} texto - El código fuente.
 * @returns {Array<Token>} Un arreglo de tokens.
 */
export const tokenizar = (texto) => {
  /**
   * Extrae un token de una cadena dada utilizando una lista de expresiones regulares.
   * @param {string} texto - El código fuente donde se extraerá el token.
   * @param {Lexema.Regex} regexs - Un objeto que contiene las expresiones regulares a utilizar para la extracción.
   * @param {number} columna - La columna de donde se extraerá el token dentro del código fuente.
   * @returns {Token} El token extraído del código fuente. Si no se encuentra un token válido, retorna un token ilegal.
   */
  const extraerToken = (texto, regexs, columna) => { 
    const subcadena = texto.substring(columna);

    for (const regex in regexs) {
      let match = subcadena.match(regexs[regex]);

      if (match) {
        let valor = match[0];
        let token = new Token(Lexema.obtenerTipo(valor), valor, columna);

        return token;
      }
    }

    return new Token(Lexema.Tipo.Ilegal, subcadena[0], columna);
  }

  let tokens = [];
  let columna = 0;

  while (columna < texto.length) {
    // ignorar los espacios en blanco
    if (/\s/.test(texto[columna])) {
      columna++;

      continue;
    }

    let token = extraerToken(texto, Lexema.Regex, columna);

    if (token.tipo === Lexema.Tipo.Comentario) {
      break;
    }

    const tokenAnterior = tokens[tokens.length - 1] ?? new Token(Lexema.Tipo.Nada, "Nada", -1);

    // si el token es el símbolo de menos, determinar si se trata de un menos unario
    if (token.valor === "-"
        && (tokenAnterior.tipo !== Lexema.Tipo.Id
          && tokenAnterior.tipo !== Lexema.Tipo.Entero
          && tokenAnterior.tipo !== Lexema.Tipo.Flotante
          && tokenAnterior.tipo !== Lexema.Tipo.ParentesisCierre
          && tokenAnterior.tipo !== Lexema.Tipo.CorcheteCierre
          && tokenAnterior.tipo !== Lexema.Tipo.LlaveCierre
          || tokenAnterior.tipo === Lexema.Tipo.Nada)) {
      token = new Token(Lexema.Tipo.MenosUnario, "-", columna);
    }

    tokens.push(token);

    if (token.tipo === Lexema.Tipo.Ilegal) {
      break;
    }

    columna += token.longitud;
  }

  // insertar un token de fin de archivo al final del arreglo de tokens
  tokens.push(new Token(Lexema.Tipo.FinDeArchivo, "EOF", texto.length));

  return tokens;
}
