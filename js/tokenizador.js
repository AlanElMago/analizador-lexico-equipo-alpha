import { Lexema } from './lexema.js';
import { Token } from './token.js';

export const tokenizar = (texto) => {
  const extraerToken = (cadena, regexs, columna) => { 
    for (const regex in regexs) {
      let match = cadena.match(regexs[regex]);

      if (match) {
        let valor = match[0];
        let token = new Token(Lexema.obtenerTipo(valor), valor, columna);

        return token;
      }
    }

    return new Token(Lexema.Tipo.Ilegal, cadena[0], columna);
  }

  let tokens = [];
  let columna = 0;

  while (columna < texto.length) {
    if (/\s/.test(texto[columna])) {
      columna++;

      continue;
    }

    let token = extraerToken(texto.substring(columna), Lexema.Regex, columna);

    if (token.tipo === Lexema.Tipo.Comentario) {
      break;
    }

    const tokenAnterior = tokens[tokens.length - 1] ?? new Token("Nada", Lexema.Tipo.Nada, -1);

    if (token.valor === "-"
        && tokenAnterior.tipo !== Lexema.Tipo.Id
        && tokenAnterior.tipo !== Lexema.Tipo.Entero
        && tokenAnterior.tipo !== Lexema.Tipo.Flotante
        && tokenAnterior.tipo !== Lexema.Tipo.ParentesisCierre
        && tokenAnterior.tipo !== Lexema.Tipo.CorcheteCierre
        && tokenAnterior.tipo !== Lexema.Tipo.LlaveCierre
        || tokenAnterior.tipo === Lexema.Tipo.Nada) {
      token.tipo = Lexema.Tipo.MenosUnario;
    }

    tokens.push(token);

    if (token.tipo === Lexema.Tipo.Ilegal) {      
      break;
    }

    columna += token.longitud;
  }

  tokens.push(new Token(Lexema.Tipo.FinDeArchivo, "EOF", texto.length, 1));

  return tokens;
}
