/*
const TipoSimbolos = {
  PalabraClave: 0,
  Especial: 1,
  EspacioBlanco: 999,
}

var tablaSimbolos = {
  "equipo": TipoSimbolos.PalabraClave,
  "(":      TipoSimbolos.Especial,
  ")":      TipoSimbolos.Especial,
  " ":      TipoSimbolos.EspacioBlanco,
  "\t":     TipoSimbolos.EspacioBlanco,
  "\n":     TipoSimbolos.EspacioBlanco
}
*/

const tokenizar = (texto) => {
  const extraerSubcadenaConUnRegex = (cadena, regex) => {
    let match = cadena.match(regex);
    return match ? match[0] : null;
  }

  const Regexs = {
    Id: /^[a-zA-Z_][a-zA-Z0-9_]*/,
    Numero: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
    Literal: /^(['"])(.*?)(\1)|("""(.*?)""")|('''(.*?)''')/,
    Comparacion: /^(==|!=|>=|<=)/
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
