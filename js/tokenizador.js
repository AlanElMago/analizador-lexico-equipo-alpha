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
   * 
   * 
   * 
   * @returns {Token} El token extraído del código fuente. Si no se encuentra un token válido, retorna un token ilegal.
   */
  const extraerToken = (texto, regexs, indiceTexto, linea, columna) => { 
    const subcadena = texto.substring(indiceTexto);

    for (const regex in regexs) {
      let match = subcadena.match(regexs[regex]);

      if (match) {
        let valor = match[0];
        let token = new Token(Lexema.obtenerTipo(valor), valor, linea, columna);

        return token;
      }
    }

    return new Token(Lexema.Tipo.Ilegal, subcadena[0], linea, columna);
  }

  let tokens = [];
  let linea = 1;
  let columna = 0;
  let indiceTexto = 0;

  while (indiceTexto < texto.length) {
    // salto de linea
    if (/\n/.test(texto[indiceTexto])) {
      linea++;
      columna = 0;
      indiceTexto++;

      continue;
    }

    // ignorar los espacios
    if (/ /.test(texto[indiceTexto])) {
      columna++;
      indiceTexto++;

      continue;
    }

    let token = extraerToken(texto, Lexema.Regex, indiceTexto, linea, columna);

    if (token.tipo === Lexema.Tipo.Comentario) {
      columna += token.longitud;
      indiceTexto += token.longitud;

      if (token.valor.endsWith('\n')) {
        linea++;
        columna = 0;
      }

      continue;
    }

    const tokenAnterior = tokens[tokens.length - 1] ?? new Token(Lexema.Tipo.Nada, "Nada", 0, -1);

    // si el token no es un tabulador para indentar, ignóralo
    if (token.tipo === Lexema.Tipo.Indentacion && columna !== 0 && tokenAnterior.tipo !== Lexema.Tipo.Indentacion) {
      columna++;
      indiceTexto++;

      continue;
    }

    // si el token es el símbolo de menos, determinar si se trata de un menos unario
    if (token.valor === "-"
        && (tokenAnterior.tipo !== Lexema.Tipo.Id
          && tokenAnterior.tipo !== Lexema.Tipo.Entero
          && tokenAnterior.tipo !== Lexema.Tipo.Flotante
          && tokenAnterior.tipo !== Lexema.Tipo.ParentesisCierre
          && tokenAnterior.tipo !== Lexema.Tipo.CorcheteCierre
          && tokenAnterior.tipo !== Lexema.Tipo.LlaveCierre
          || tokenAnterior.tipo === Lexema.Tipo.Nada)) {
      token = new Token(Lexema.Tipo.MenosUnario, "-", linea, columna);
    }

    tokens.push(token);

    if (token.tipo === Lexema.Tipo.Ilegal) {
      break;
    }

    columna += token.longitud;
    indiceTexto += token.longitud;
  }

  // insertar un token de fin de archivo al final del arreglo de tokens
  tokens.push(new Token(Lexema.Tipo.FinDeArchivo, "EOF", linea, columna));

  return tokens;
}
