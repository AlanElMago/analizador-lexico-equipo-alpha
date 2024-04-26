import { Regexs } from './expresiones-regulares.js';

export const tokenizar = (texto) => {
  const extraerSubcadenaConUnRegex = (cadena, regex) => { 
    let match = cadena.match(regex);
    return match ? match[0] : null;
  }

  let tokens = [];
  let i = 0;

  while (i < texto.length) {
    if (/\s/.test(texto[i])) {
      i++;
      continue;
    }

    let token = null;

    for (const llave in Regexs) {
      token = extraerSubcadenaConUnRegex(texto.substring(i), Regexs[llave]);

      if (token) {
        tokens.push(token);
        i += token.length;

        break;
      }
    }

    if (token) {
      continue;
    }

    tokens.push(texto[i]);
    i++;
  }

  return tokens;
}
