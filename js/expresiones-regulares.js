export const Regexs = {
  Id: /^[a-zA-Z_][a-zA-Z0-9_]*/,
  Numero: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
  Literal: /^(['"])(.*?)(\1)|("""(.*?)""")|('''(.*?)''')/,
  Comparacion: /^(==|!=|>=|<=)/
}

export const esId = (token) => Regexs.Id.test(token);
export const esNumero = (token) => Regexs.Numero.test(token);
export const esLiteral = (token) => Regexs.Literal.test(token);
export const esComparacion = (token) => Regexs.Comparacion.test(token);

export const tipoSimbolo = (token) => {
  if (esId(token)) {
    return "id";
  }
  
  if (esNumero(token)) {
    return "numero";
  }
  
  if (esLiteral(token)) {
    return "literal";
  }
  
  if (esComparacion(token)) {
    return "operacion de comparacion";
  }

  return "desconocido";
}
